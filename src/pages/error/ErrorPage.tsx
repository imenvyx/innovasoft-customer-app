import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';
import { Home as HomeIcon, Error as ErrorIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/layout/MainLayout';

const ErrorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/home');
  };

  return (
    <MainLayout>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
          }}
        >
          <ErrorIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            {t('error.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {t('error.message')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            onClick={handleBackHome}
            size="large"
          >
            {t('error.back')}
          </Button>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default ErrorPage;
