import { MouseEvent, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import GlobeIcon from "@mui/icons-material/Public";

interface AppBarProps {
  onToggleSidebar: () => void;
}

const AppBarComponent = ({ onToggleSidebar }: AppBarProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguageAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "primary.main",
        boxShadow: 1,
      }}
    >
      <Toolbar>
        {/* Toggle Button */}
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          onClick={onToggleSidebar}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold", color: "white" }}
        >
          {t("app.title")}
        </Typography>

        {/* User Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Language Switch */}
          <IconButton color="inherit" onClick={handleLanguageMenuOpen}>
            <GlobeIcon />
          </IconButton>

          <Menu
            anchorEl={languageAnchorEl}
            open={Boolean(languageAnchorEl)}
            onClose={handleLanguageMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              onClick={() => handleLanguageChange("es")}
              selected={i18n.language === "es"}
            >
              Español
            </MenuItem>
            <MenuItem
              onClick={() => handleLanguageChange("en")}
              selected={i18n.language === "en"}
            >
              English
            </MenuItem>
          </Menu>

          {/* User Avatar Button */}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                width: 32,
                height: 32,
              }}
            >
              <PersonIcon fontSize="small" sx={{ color: "white" }} />
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem disabled>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {user?.username}
              </Typography>
            </MenuItem>

            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
              {t("home.logout")}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
