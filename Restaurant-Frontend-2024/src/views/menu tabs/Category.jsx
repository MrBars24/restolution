import MaterialTable from '@material-table/core';
import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useLocation } from 'react-router-dom';
import axiosClient from '../../configs/axiosClient';
import ModalCategory from '../pages/Modal/Category'
import { useStateContext } from '../../contexts/ContextProvider';
 
export default function Category() {
  const { user_ID, permission } = useStateContext();
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [createAccess, setCreateAccess] = useState(false);
  const [editAccess, setEditAccess] = useState(false);
  const [category, setCategory] = useState([])
  const [categoryInfo, setCategoryInfo] = useState([
    {
      id: null,
      restaurant_id: "",
      name: ""
    }
  ])

  const getCategory = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get(`/web/category/${user_ID}`)
      setCategory(response.data)
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }

  const handleEditUser = (event,rowData) => {
    setCategoryInfo({
      id: rowData.id,
      restaurant_id: rowData.restaurant_id,
      name: rowData.name,
    });
    setShowModal(true);
  };

  const columns = [
    { title: 'Name', field: 'name' },
    // { title: 'Created by', field: 'created_by' },
    // { title: 'Updated By', field: 'updated_by' },
    { title: 'Created On', field: 'created_at' },
    // { title: 'Updated At', field: 'updated_at' },
  ];

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
    setCategoryInfo([])
  }

  useEffect(() => {
    getCategory()
    if (location.state == 'success'){
      setShowModal(false)
      setCategoryInfo([])
      location.state = null
    }

    if (permission) {
      let permissionsArray = Array.isArray(permission) ? permission : permission.split(',');

      const hasInputAccess = permissionsArray.includes('Menu Category (Create)');
      const hasSummaryAccess = permissionsArray.includes('Menu Category (Edit)');

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
        data={category.data}  
        actions={actions}
        options={options}
        isLoading={loading}
      />
      <ModalCategory show={showModal} Data={categoryInfo} close={handleModalClose} />
    </>
  )
}
