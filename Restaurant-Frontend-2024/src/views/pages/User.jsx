import MaterialTable from '@material-table/core'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import ModalUser from '../pages/Modal/User'
import axiosClient from '../../configs/axiosClient';
import { useLocation } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';

export default function User() {
  const { user_ID, permission } = useStateContext();
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [createAccess, setCreateAccess] = useState(false);
  const [editAccess, setEditAccess] = useState(false);
  const [users, setUsers] = useState([])
  const [userInfo, setUserInfo] = useState([
    {
      id: null,
      first_name: "",
      last_name: "",
      email: "",
      status: "",
      role_id: "",
      role: "",
      permission: "",
      restaurant_name: "",
      restaurant_id: "",
      allowed_restaurant: "",
      allowed_bm: "",
    }
  ])

  const getUsers = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get(`/web/users/${user_ID}`)
      setUsers(response.data)
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }

  const handleEditUser = (event,rowData) => {
    setUserInfo({
      id: rowData.id,
      first_name: rowData.first_name,
      last_name: rowData.last_name,
      email: rowData.email,
      role_id: rowData.role_id,
      role: rowData.role,
      status: rowData.status,
      permission: rowData.permission,
      restaurant_name: rowData.restaurant_name,
      restaurant_id: rowData.restaurant_id,
      allowed_restaurant: rowData.allowed_restaurant,
      allowed_bm: rowData.allowed_bm,
    });
    setShowModal(true);
  };

  const actions = [
    {
      icon: () => <div className="btn btn-primary">Add New</div>,
      isFreeAction: true,
      onClick: () => setShowModal(true),
      hidden: createAccess ? false : true
    },
    {
      icon: () => <div className="btn btn-success btn-sm"><EditIcon /></div>,
      tooltip: 'Edit',
      onClick: handleEditUser,
      hidden: editAccess ? false : true
    },
  ];

  const columns = [
    { title: 'Full Name', field: 'fullname' },
    { title: 'Email', field: 'email' },
    { title: 'Role', field: 'role' },
    { title: 'Status', field: 'status' },
    // { title: 'Created by', field: 'created_by' },
    // { title: 'Updated By', field: 'updated_by' },
    { title: 'Created On', field: 'created_at' },
    // { title: 'Updated At', field: 'updated_at' },
  ]

  const options = {
    paging: true,
    pageSize: 5,
    emptyRowsWhenPaging: false,
    pageSizeOptions: [5, 10],
    paginationAlignment: "center",
    actionsColumnIndex: -1,
    searchFieldAlignment: "left",
    searchFieldStyle: {
      whiteSpace: 'nowrap',
      fontWeight: 450,
    },
    rowStyle: {
      fontSize: 14,
    },
    headerStyle: {
      whiteSpace: 'nowrap',
      flexDirection: 'row',
      overflow: 'hidden',
      backgroundColor: '#8d949e',
      color: '#F1F1F1',
      fontSize: 16,
    },
  };

  const handleModalClose = () => {
    setShowModal(false)
    setUserInfo([])
  }

  useEffect(() => {
    getUsers()
    if (location.state == 'success'){
      setShowModal(false)
      setUserInfo([])
      getUsers()
      location.state = null
    }

    if (permission) {
      let permissionsArray = Array.isArray(permission) ? permission : permission.split(',');

      const hasInputAccess = permissionsArray.includes('Menu (Create)');
      const hasSummaryAccess = permissionsArray.includes('Menu (Edit)');

      switch (true) {
        case (hasInputAccess && hasSummaryAccess):
            setCreateAccess(true);
            setEditAccess(true);
            break;
        case hasInputAccess:
            setCreateAccess(true);
            setEditAccess(false);
            break;
        case hasSummaryAccess:
            setCreateAccess(false);
            setEditAccess(true);
            break;
      }
    }
  }, [location.state, permission])

  return (
    <>
      <MaterialTable 
        title=""
        columns={columns}
        data={users.data}  
        actions={actions}
        options={options}
        isLoading={loading}
      />
      <ModalUser show={showModal} Data={userInfo} close={handleModalClose} />
    </>
    
  )
}
