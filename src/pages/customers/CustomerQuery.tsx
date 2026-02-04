import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { Add, Search, Edit, Delete, PersonSearch } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import {
  getCustomers,
  deleteCustomer,
} from "../../services/api/customerService";
import { CustomerListItem, CustomerFilters } from "../../interfaces/customer";
import MainLayout from "../../components/layout/MainLayout";
import SnackbarMessage from "../../components/common/SnackbarMessage";
import { useSnackbar } from "../../hooks/useSnackbar";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

const CustomerQuery = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [filters, setFilters] = useState<CustomerFilters>({
    identificacion: "",
    nombre: "",
    usuarioId: user?.id || "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] =
    useState<CustomerListItem | null>(null);
  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    data: customers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customers", filters],
    queryFn: () => getCustomers(filters),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      showSnackbar(t("customers.successDelete"), "success");
    },
    onError: () => {
      showSnackbar(t("customers.error"), "error");
    },
  });

  const handleSearch = () => {
    const searchFilters: CustomerFilters = {
      ...filters,
      usuarioId: user?.id || "",
    };
    setFilters(searchFilters);
    setPage(0); // Reset to first page on new search
  };

  const handleAddCustomer = () => {
    navigate("/customers/new");
  };

  const handleEditCustomer = (customer: CustomerListItem) => {
    navigate(`/customers/${customer.id}`);
  };

  const handleDeleteClick = (customer: CustomerListItem) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      deleteMutation.mutate(customerToDelete.id);
    }
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  const handleBack = () => {
    navigate("/home");
  };

  // Pagination handlers
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get paginated data
  const paginatedCustomers = customers?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <MainLayout>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 900, minWidth: 600 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" color="primary" fontWeight={700}>
            {t("customers.title")}
          </Typography>
          <Button variant="outlined" onClick={handleBack}>
            {t("customers.back")}
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <TextField
            label={t("customers.filters.identification")}
            value={filters.identificacion}
            onChange={(e) =>
              setFilters({ ...filters, identificacion: e.target.value })
            }
            size="small"
            sx={{ width: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonSearch color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label={t("customers.filters.name")}
            value={filters.nombre}
            onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
            size="small"
            sx={{ width: 250 }}
          />
          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={handleSearch}
          >
            {t("customers.search")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddCustomer}
          >
            {t("customers.add")}
          </Button>
        </Box>

        {/* Customer Table */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {t("customers.error")}
          </Typography>
        ) : customers && customers.length > 0 ? (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.main" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold", minWidth: 150 }}>
                      {t("customers.fields.identification")}
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold", minWidth: 250 }}>
                      {t("customers.fields.fullName")}
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontWeight: "bold" }}
                      align="center"
                      width={120}
                    >
                      {t("customers.actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCustomers?.map((customer) => (
                    <TableRow key={customer.id} hover>
                      <TableCell>{customer.identificacion}</TableCell>
                      <TableCell sx={{ letterSpacing: 0.5 }}>
                        {customer.nombre} {customer.apellidos}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t("customers.edit")}>
                          <IconButton
                            onClick={() => handleEditCustomer(customer)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t("customers.delete")}>
                          <IconButton
                            onClick={() => handleDeleteClick(customer)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={customers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              labelRowsPerPage={t("customers.rowsPerPage")}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} ${t("customers.of")} ${count}`
              }
            />
          </>
        ) : (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            {t("customers.noCustomers")}
          </Typography>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>{t("customers.deleteTitle")}</DialogTitle>
        <DialogContent>
          <Typography>{t("customers.deleteConfirm")}</Typography>
          {customerToDelete && (
            <Typography sx={{ mt: 2, fontWeight: "bold" }}>
              {customerToDelete.nombre} {customerToDelete.apellidos}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {t("customers.cancel")}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            {t("customers.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      <SnackbarMessage
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={hideSnackbar}
      />
    </MainLayout>
  );
};

export default CustomerQuery;
