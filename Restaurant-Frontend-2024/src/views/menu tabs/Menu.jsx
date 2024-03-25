import MaterialTable from '@material-table/core'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import MenuModal from '../pages/Modal/Menu'
import { useLocation } from 'react-router-dom';
import axiosClient from '../../configs/axiosClient';
import { useStateContext } from '../../contexts/ContextProvider';

export default function Menu() {
  const { user_ID, permission } = useStateContext();
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [createAccess, setCreateAccess] = useState(false);
  const [editAccess, setEditAccess] = useState(false);
  const [menu, setMenu] = useState([])
  const [menuInfo, setMenuInfo] = useState([
    {
      id: "",
      restaurant_id: 1,
      name: "",
      price: "",
      preparation_time: "",
      status: "",
      menutab_id: "",
      menutab: "",
      category: "",
      // category_name: "",
      ingredients: "",
      ingredients_array: ""
    }
  ])

  const getMenu = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get(`/web/menu/${user_ID}`)
      setMenu(response.data)
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }

  const handleEditUser = (event,rowData) => {
    setMenuInfo({
      id: rowData.id,
      restaurant_id: rowData.restaurant_id,
      name: rowData.name,
      ingredients: rowData.ingredients,
      ingredients_array: rowData.ingredients_array,
      price: rowData.price,
      preparation_time: rowData.preparation_time,
      status: rowData.status,
      menutab_id: rowData.menutab_id,
      menutab: rowData.menutab,
      category: rowData.category,
      // category_name: rowData.category_name,
      image: rowData.image,
    });
    setShowModal(true);
  };

  const columns = [
    { field: "image", title: "Image", width: 100, render: (rowData) => {
      const styles = { width: 80, borderRadius: "50%" };
      return <img src={rowData.image} style={styles} />;
    },
  },
    { title: 'Name', field: 'name' },
    { title: 'Ingredients', field: 'ingredients' },
    { title: 'Price', field: 'price' },
    { title: 'Preparation Time', field: 'preparation_time' },
    { title: 'Status', field: 'status' },
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
    setMenuInfo([])
  }

  useEffect(() => {
    getMenu()
    if (location.state == 'success'){
      setShowModal(false)
      setMenuInfo([])
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
          data={menu.data}  
          actions={actions}
          options={options}
          isLoading={loading}
        />
        <MenuModal show={showModal} Data={menuInfo} close={handleModalClose}  />
    </>
  )
}
