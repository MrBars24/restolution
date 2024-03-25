import React from 'react' 
import { Box } from '@mui/material'
import Body from './Body'
import Appbar from '../views/menus/Appbar'
import { useStateContext } from '../contexts/ContextProvider'
import { Navigate } from 'react-router-dom'

export default function DefaultLayout() {
  const {user, token, role} = useStateContext()

  if(!token) {
    return <Navigate to="/Login" />
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Appbar />
      <Body />
    </Box>
  )
}
