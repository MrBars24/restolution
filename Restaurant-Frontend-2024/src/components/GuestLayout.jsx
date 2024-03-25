import React from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

export default function GuestLayout() {
    const {token, permission} = useStateContext()
    const navigate = useNavigate()

    if (token) {
        const firstElement = permission[0];
        const permissionsArray = firstElement.split(',');
        const firstWords = permissionsArray.map(permission => {
          const trimmedPermission = permission.trim();
          return trimmedPermission.split(' ')[0];
        });
        navigate(firstWords[0]);
    }

  return (
    <div>
        <Outlet />
    </div>
  )
}
