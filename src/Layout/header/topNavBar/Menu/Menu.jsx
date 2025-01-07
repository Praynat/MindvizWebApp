import MuiMenu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ROUTES from "../../../../Routes/routesModel";
import { useNavigate } from "react-router-dom";
import { useMyUser } from "../../../../Providers/Users/UserProvider";
import useUsers from "../../../../Hooks/Users/useUsers";
import MenuLink from "../../../../Components/Routes/MenuLink";

export default function Menu({ isOpen, anchorEl, onClose }) {
  const { user } = useMyUser();
  const { handleLogout } = useUsers();
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    onClose();
    navigate(ROUTES.HOME);
  };

  return (
    <MuiMenu
      open={isOpen}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Box>
        <MenuLink
          text="About"
          navigateTo={ROUTES.ABOUT}
          onClick={onClose}
          styles={{ display: { xs: "block", md: "none" } }}
        />

        {!user && (
          <>
            <MenuLink
              text="Home"
              navigateTo={ROUTES.HOME}
              onClick={onClose}
              styles={{ display: { xs: "block", md: "none" } }}
            />
            <Divider />
            <MenuLink
              text="Login"
              navigateTo={ROUTES.LOGIN}
              onClick={onClose}
              styles={{ display: { xs: "block", md: "none" } }}
            />
            <MenuLink
              text="Signup"
              navigateTo={ROUTES.SIGNUP}
              onClick={onClose}
              styles={{ display: { xs: "block", md: "none" } }}
            />
          </>
        )}

        {user && (
          <>
            <MenuLink
              text="Home"
              navigateTo={ROUTES.HOME}
              onClick={onClose}
              styles={{ display: { xs: "block", md: "none" } }}
            />
            <MenuLink
              text="Mindmapping"
              navigateTo={ROUTES.MINDMAPPING_VIEW}
              onClick={onClose}
              styles={{ display: { xs: "block", md: "none" } }}
            />
            <MenuLink
              text="Calendar"
              navigateTo={ROUTES.CALENDAR_VIEW}
              onClick={onClose}
              styles={{ display: { xs: "block", md: "none" } }}
            />
            <MenuLink
              text="List"
              navigateTo={ROUTES.LIST_VIEW}
              onClick={onClose}
              styles={{ display: { xs: "block", md: "none" } }}
            />
            <MenuLink
              text="Dashboard"
              navigateTo={ROUTES.DASHBOARD_VIEW}
              onClick={onClose}
              styles={{ display: { xs: "block", md: "none" } }}
            />
            <Divider />
            <MenuLink
              text="Profile"
              navigateTo={ROUTES.USER_PROFILE}
              onClick={onClose}
            />
            <MenuLink
              text="Edit Account"
              navigateTo={ROUTES.EDIT_USER}
              onClick={onClose}
            />
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </>
        )}
      </Box>
    </MuiMenu>
  );
}
