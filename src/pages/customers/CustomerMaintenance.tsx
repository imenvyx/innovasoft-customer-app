import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { ArrowBack, Save, Edit } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import {
  getCustomerById,
  createCustomer,
  updateCustomer,
  getInterests,
} from "../../services/api/customerService";
import {
  customerSchema,
  CustomerFormData,
} from "../../validations/customerValidation";
import { Customer, Interest } from "../../interfaces/customer";
import MainLayout from "../../components/layout/MainLayout";
import { fileToBase64 } from "../../services/utils/fileUtils";
import SnackbarMessage from "../../components/common/SnackbarMessage";
import { useSnackbar } from "../../hooks/useSnackbar";

const CustomerMaintenance = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditMode = !!id;
  const [imagePreview, setImagePreview] = useState<string>("");
  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();
  const [avatarHover, setAvatarHover] = useState(false);

  const { data: interests } = useQuery<Interest[]>({
    queryKey: ["interests"],
    queryFn: getInterests,
    staleTime: Infinity, // Static data, no refetch needed
  });

  const { data: existingCustomer, isLoading: customerLoading } =
    useQuery<Customer>({
      queryKey: ["customer", id],
      queryFn: () => getCustomerById(id!),
      enabled: isEditMode,
    });

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      showSnackbar(t("customers.createSuccess"), "success");
      setTimeout(() => {
        navigate("/customers");
      }, 2000);
    },
    onError: () => {
      showSnackbar(t("customers.error"), "error");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", id] });
      showSnackbar(t("customers.updateSuccess"), "success");
      setTimeout(() => {
        navigate("/customers");
      }, 2000);
    },
    onError: () => {
      showSnackbar(t("customers.error"), "error");
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      nombre: "",
      apellidos: "",
      identificacion: "",
      telefonoCelular: "",
      otroTelefono: "",
      direccion: "",
      fNacimiento: "",
      fAfiliacion: new Date().toISOString().split("T")[0],
      sexo: "M",
      resenaPersonal: "",
      imagen: "",
      interesesId: "",
    },
  });

  useEffect(() => {
    if (existingCustomer) {
      reset({
        nombre: existingCustomer.nombre,
        apellidos: existingCustomer.apellidos,
        identificacion: existingCustomer.identificacion,
        telefonoCelular: existingCustomer.telefonoCelular,
        otroTelefono: existingCustomer.otroTelefono || "",
        direccion: existingCustomer.direccion,
        fNacimiento: existingCustomer.fNacimiento.split("T")[0],
        fAfiliacion: existingCustomer.fAfiliacion.split("T")[0],
        sexo: existingCustomer.sexo,
        resenaPersonal: existingCustomer.resenaPersonal || "",
        imagen: existingCustomer.imagen || "",
        interesesId: existingCustomer.interesesId,
      });
    }
  }, [existingCustomer, reset]);

  // Sync imagePreview when existingCustomer changes
  useEffect(() => {
    if (existingCustomer?.imagen) {
      setImagePreview(existingCustomer.imagen);
    }
  }, [existingCustomer?.imagen]);

  const handleImageUpload = useCallback(async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setValue("imagen", base64);
        setImagePreview(base64);
      } catch {
        showSnackbar(t("customers.error"), "error");
      }
    }
  }, [setValue, showSnackbar, t]);

  const onSubmit = (data: CustomerFormData) => {
    if (isEditMode) {
      // Update uses: celular, resennaPersonal, interesFK (as per Swagger)
      updateMutation.mutate({
        id: id!,
        nombre: data.nombre,
        apellidos: data.apellidos,
        identificacion: data.identificacion,
        celular: data.telefonoCelular,
        otroTelefono: data.otroTelefono || "",
        direccion: data.direccion,
        fNacimiento: data.fNacimiento,
        fAfiliacion: data.fAfiliacion,
        sexo: data.sexo,
        resennaPersonal: data.resenaPersonal || "",
        imagen: data.imagen || "",
        interesFK: data.interesesId,
        usuarioId: user?.id || "",
      });
    } else {
      // Create uses: celular, resennaPersonal, interesFK (as per Swagger)
      const payload = {
        nombre: data.nombre,
        apellidos: data.apellidos,
        identificacion: data.identificacion,
        celular: data.telefonoCelular,
        otroTelefono: data.otroTelefono || "",
        direccion: data.direccion,
        fNacimiento: data.fNacimiento,
        fAfiliacion: data.fAfiliacion,
        sexo: data.sexo,
        resennaPersonal: data.resenaPersonal || "",
        imagen: data.imagen || "",
        interesFK: data.interesesId,
        usuarioId: user?.id || "",
      };
      createMutation.mutate(payload);
    }
  };

  const handleBack = useCallback(() => {
    navigate("/customers");
  }, [navigate]);

  const handleAvatarMouseEnter = useCallback(() => {
    setAvatarHover(true);
  }, []);

  const handleAvatarMouseLeave = useCallback(() => {
    setAvatarHover(false);
  }, []);

  if (isEditMode && customerLoading) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            {t("customers.loading")}
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Paper elevation={3} sx={{ p: 3 , maxWidth: 900,}}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          {/* Image Upload - Clickable Avatar */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                component="label"
                sx={{
                  cursor: "pointer",
                  position: "relative",
                  display: "inline-block",
                }}
                onMouseEnter={handleAvatarMouseEnter}
                onMouseLeave={handleAvatarMouseLeave}
              >
                <Avatar
                  {...(imagePreview ? { src: imagePreview } : {})}
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "primary.main",
                    transition: "opacity 0.2s",
                    opacity: avatarHover ? 0.7 : 1,
                  }}
                >
                  <PersonIcon sx={{ color: "white", fontSize: 60 }} />
                </Avatar>
                {avatarHover && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(0,0,0,0.4)",
                      borderRadius: "50%",
                    }}
                  >
                    <Edit sx={{ color: "white", fontSize: 40 }} />
                  </Box>
                )}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Box>
              <Typography variant="h4" color="primary" fontWeight={700}>
                {isEditMode
                  ? t("customers.maintenance.titleEdit")
                  : t("customers.maintenance.titleCreate")}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBack}
              >
                {t("customers.back")}
              </Button>
            </Box>
          </Box>

          {/* Form Fields - using flexbox for responsive layout */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {/* Nombre */}
            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("customers.name")}
                    error={!!errors.nombre}
                    helperText={errors.nombre?.message}
                    required
                  />
                )}
              />
            </Box>

            {/* Apellidos */}
            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="apellidos"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("customers.lastName")}
                    error={!!errors.apellidos}
                    helperText={errors.apellidos?.message}
                    required
                  />
                )}
              />
            </Box>

            {/* Identificación */}
            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="identificacion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("customers.identification")}
                    error={!!errors.identificacion}
                    helperText={errors.identificacion?.message}
                    required
                  />
                )}
              />
            </Box>

            {/* Teléfono Celular */}
            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="telefonoCelular"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("customers.phone")}
                    error={!!errors.telefonoCelular}
                    helperText={errors.telefonoCelular?.message}
                    required
                  />
                )}
              />
            </Box>

            {/* Otro Teléfono */}
            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="otroTelefono"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("customers.fields.otherPhone")}
                    error={!!errors.otroTelefono}
                    helperText={errors.otroTelefono?.message}
                    required
                  />
                )}
              />
            </Box>

            {/* Dirección */}
            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="direccion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("customers.address")}
                    error={!!errors.direccion}
                    helperText={errors.direccion?.message}
                    required
                  />
                )}
              />
            </Box>

            {/* Fecha de Nacimiento */}
            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="fNacimiento"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("customers.birthDate")}
                    type="date"
                    error={!!errors.fNacimiento}
                    helperText={errors.fNacimiento?.message}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Box>

            {/* Fecha de Afiliación */}
            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="fAfiliacion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("customers.affiliationDate")}
                    type="date"
                    error={!!errors.fAfiliacion}
                    helperText={errors.fAfiliacion?.message}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Box>

            {/* Sexo */}
            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="sexo"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.sexo} required>
                    <InputLabel>{t("customers.gender")}</InputLabel>
                    <Select {...field} label={t("customers.gender")}>
                      <MenuItem value="M">{t("customers.male")}</MenuItem>
                      <MenuItem value="F">{t("customers.female")}</MenuItem>
                    </Select>
                    {errors.sexo && (
                      <FormHelperText>{errors.sexo.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Intereses */}
            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="interesesId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.interesesId} required>
                    <InputLabel>{t("customers.interests")}</InputLabel>
                    <Select {...field} label={t("customers.interests")}>
                      {interests?.map((interest) => (
                        <MenuItem key={interest.id} value={interest.id}>
                          {interest.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.interesesId && (
                      <FormHelperText>
                        {errors.interesesId.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Reseña Personal */}
            <Box sx={{ width: "100%" }}>
              <Controller
                name="resenaPersonal"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("customers.personalReview")}
                    multiline
                    rows={3}
                    error={!!errors.resenaPersonal}
                    helperText={errors.resenaPersonal?.message}
                    required
                  />
                )}
              />
            </Box>
          </Box>

          {/* Buttons */}
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button variant="outlined" onClick={handleBack}>
              {t("customers.cancel")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {t("customers.save")}
            </Button>
          </Box>
        </Box>
      </Paper>

      <SnackbarMessage
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={hideSnackbar}
      />
    </MainLayout>
  );
};

export default CustomerMaintenance;
