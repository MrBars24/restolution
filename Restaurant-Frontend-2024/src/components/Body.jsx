import { styled, Box, Typography, useTheme } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom';
import FloatingTime from '../ui-component/Floating/Floating';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

export default function Body() {
    const theme = useTheme();

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {/* <FloatingTime /> */}
        <Outlet />
    </Box>
  )
}
