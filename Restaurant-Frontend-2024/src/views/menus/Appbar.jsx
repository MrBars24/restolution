import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Sidebar from './Sidebar';
import { Avatar, Container, Menu, MenuItem, Tooltip } from '@mui/material';
import UserImage from '../../assets/images/user.png'
import Logo from '../../assets/images/Logo.jpg'
import Swal from 'sweetalert2'
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from '../../configs/axiosClient';
import { useEffect } from 'react';
import { useState } from 'react';

const drawerWidth = 240;
const settings = ['Profile', 'Logout'];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);  

export default function Appbar() {
  const {user_ID, setToken, setRole, setUser_ID} = useStateContext()
  const theme = useTheme();
  const [userInfo, setUserInfo] = useState([])
  const [open, setOpen] = useState(true);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
 
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const getUser = async () => {
    try {
      const response = await axiosClient.get(`/web/profile/${user_ID}`);
      const { data } = response;
      setUserInfo(data);
    } catch (error) {
      // Handle error
    }
  }

  const handleCloseUserMenu = (selectedSetting) => {

    setAnchorElUser(null);
    const setting = `${selectedSetting}`;
 
    if (setting === 'Logout') {
        Swal.fire({
            title: 'Are you sure you want to Logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#32be8f',
            confirmButtonText: 'Yes, Logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                'Logout Successfully!',
                'you will now be redirected to the Login page',
                'success'
                ).then(() => {  
                    axiosClient.post('/logout')
                    .then(() => {
                      setToken(null)
                      setRole(null)
                      setUser_ID(null)
                    })
                })
            }
        })
    } else if (setting === 'Profile') {
      navigate('/profile', { state: 'success' });
    }
  };

  useEffect(()=> {
    getUser()
  }, [])

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'block' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Container maxWidth="100%" className='test'>
            <Toolbar disableGutters> 
              <Box sx={{ flexGrow: 1 }}/>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    {userInfo.first_name ? 
                      (
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} className='gap-2'>
                          <Avatar src={userInfo.image ?? UserImage} />
                          <Typography className='white'>{userInfo.first_name + ' ' + userInfo.last_name}</Typography>
                        </IconButton>
                      ) : (
                        <span>Loading....</span>
                      )
                    }
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
            </Toolbar>
          </Container>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader> 
            <img src={Logo} alt="Logo" style={{ maxWidth: '60%', maxHeight: '100%' }} />
        </DrawerHeader>
        <Divider />
        <Sidebar />
      </Drawer>
    </Box>
  )
}
