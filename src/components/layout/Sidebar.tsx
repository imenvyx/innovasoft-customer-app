import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from "../../constants";

interface SidebarProps {
  collapsed: boolean;
  isMobile?: boolean;
  onNavigate?: () => void;
}

const Sidebar = ({ collapsed, isMobile = false, onNavigate }: SidebarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const menuItems = [
    {
      text: t("nav.home"),
      icon: <HomeIcon />,
      path: "/home",
    },
    {
      text: t("nav.customers"),
      icon: <PeopleIcon />,
      path: "/customers",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onNavigate) {
      onNavigate();
    }
  };

  const currentWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : currentWidth,
        flexShrink: 0,
        backgroundColor: "background.paper",
        color: "white",
        position: isMobile ? "relative" : "sticky",
        top:  64,
        display: "flex",
        flexDirection: "column",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Navigation Items */}
        <List sx={{ flexGrow: 1, px: 1, mt: 1 }}>
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/home" &&
                location.pathname.startsWith(item.path));

            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 1,
                    backgroundColor: isActive
                      ? "rgba(15, 13, 13, 0.15)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(18, 18, 18, 0.04)",
                    },
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: 2,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 0 : 40,
                      justifyContent: "center",
                      color: "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        noWrap: true,
                        sx: {
                          fontWeight: isActive ? "bold" : "normal",
                          color: "text.secondary",
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
