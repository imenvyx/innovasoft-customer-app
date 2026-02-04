import { Box, Typography, Container } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import MainLayout from "../../components/layout/MainLayout";

const Home = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <MainLayout>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            {t("home.welcome")}, {user?.username}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("app.subtitle")}
          </Typography>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default Home;
