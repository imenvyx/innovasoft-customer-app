import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  FormControlLabel,
  Checkbox,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { loginSchema, LoginFormData } from '../../validations/authValidation';
import SnackbarMessage from '../../components/common/SnackbarMessage';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated, error, clearError, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success' | 'info' | 'warning'>('error');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    // Load remembered username
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      setRememberMe(true);
      setValue('username', rememberedUsername);
    }
  }, [setValue]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Save rememberMe state and username if checked
      localStorage.setItem('rememberMe', rememberMe.toString());
      
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', data.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
      await login(data);
    } catch {
      // Error is handled by the context
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 450, width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          {t('auth.login')}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('auth.username')}
                error={!!errors.username}
                helperText={errors.username?.message}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('auth.password')}
                type={showPassword ? 'text' : 'password'}
                error={!!errors.password}
                helperText={errors.password?.message}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                color="primary"
              />
            }
            label={t('auth.rememberMe')}
          />
          
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {isLoading ? t('auth.login') : t('auth.loginButton')}
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box>
              <Typography variant="body2">
                {t('auth.noAccount')}{' '}
                <Link component={RouterLink} to="/register" variant="body2">
                  {t('auth.register')}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
      
      <SnackbarMessage
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default Login;
