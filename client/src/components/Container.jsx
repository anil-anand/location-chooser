import React, { useEffect, useState } from "react";

import classNames from "classnames";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { not } from "ramda";
import { useHistory } from "react-router-dom";

import {
  HEADER_TITLES,
  HEADER_WIDTH,
  SIDEBAR_ITEMS,
  SIDEBAR_WIDTH,
} from "../constants";

const Container = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const history = useHistory();

  const [activePath, setActivePath] = useState(history.location.pathname);

  const headerTitle = HEADER_TITLES[activePath] || "";

  const handleDrawerClose = () => {
    setIsClosing(true);
    setIsMobileSidebarOpen(false);
  };

  const handleDrawerTransitionEnd = () => setIsClosing(false);
  const handleDrawerToggle = () => !isClosing && setIsMobileSidebarOpen(not);

  useEffect(() => {
    setActivePath(history.location.pathname);
  }, [history.location.pathname]);

  const drawer = (
    <div className="border-blue-600 border-t-20">
      <Divider />
      <List>
        {SIDEBAR_ITEMS.map(({ label, path }, index) => (
          <ListItem
            disablePadding
            key={index}
            className={classNames("transition-all ease-in-out duration-300", {
              "bg-blue-600 text-white": activePath === path,
            })}
            onClick={() => {
              history.push(path);
              setActivePath(path);
              setIsMobileSidebarOpen(false);
            }}
          >
            <ListItemButton>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="nav"
        sx={{ width: { sm: SIDEBAR_WIDTH }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          container={document.body}
          open={isMobileSidebarOpen}
          ModalProps={{ keepMounted: true }}
          variant="temporary"
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: SIDEBAR_WIDTH,
            },
          }}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
        >
          {drawer}
        </Drawer>
        <Drawer
          open
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: SIDEBAR_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          height: `calc(100vh - ${HEADER_WIDTH}px)`,
        }}
      >
        <div className="flex flex-grow bg-blue-600 text-white h-20 p-6">
          <IconButton
            aria-label="open drawer"
            color="inherit"
            edge="start"
            sx={{ mr: 2, display: { sm: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography color="inherit" component="div" variant="h6">
            {headerTitle}
          </Typography>
        </div>
        <div className="container">{children}</div>
      </Box>
    </Box>
  );
};

export default Container;
