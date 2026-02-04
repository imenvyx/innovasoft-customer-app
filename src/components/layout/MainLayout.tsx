import React, { useState, useEffect } from "react";
import { Box, useTheme, Drawer, useMediaQuery } from "@mui/material";
import AppBarComponent from "./AppBar";
import Sidebar from "./Sidebar";
import { MOBILE_BREAKPOINT } from "../../constants";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(`(max-width:${MOBILE_BREAKPOINT}px)`);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Reset sidebar state when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileDrawerOpen(false);
    }
  }, [isMobile]);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleCloseMobileDrawer = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* AppBar - Full Width */}
      <AppBarComponent onToggleSidebar={handleToggleSidebar} />

      {/* Content Area */}
      <Box
        sx={{ display: "flex", flexGrow: 1, overflow: { lg: "auto" } }}
      >
        {/* Desktop Sidebar - Permanent */}
        {!isMobile && (
          <Sidebar collapsed={sidebarCollapsed} isMobile={isMobile} />
        )}

        {/* Mobile Drawer - Full screen when open */}
        <Drawer
          variant="temporary"
          anchor="left"
          open={isMobile && mobileDrawerOpen}
          onClose={handleCloseMobileDrawer}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: "100%",
              height: "100%",
              maxWidth: "100%",
              border: "none",
              backgroundColor: "background.paper",
            },
          }}
        >
          <Sidebar collapsed={false} isMobile={true} onNavigate={handleCloseMobileDrawer} />
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 5,
            backgroundColor: theme.palette.grey[100],
            minHeight: "calc(100vh - 64px)",
            transition: theme.transitions.create("ml", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            display: "flex",
            justifyContent: "center",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
