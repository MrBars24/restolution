import MaterialTable from '@material-table/core'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import ModalRestaurant from '../pages/Modal/Restaurant'
import axiosClient from '../../configs/axiosClient';
import { useLocation } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';

export default function Restaurant() {
  const location = useLocation()
  const { user_ID, permission } = useStateContext();
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [createAccess, setCreateAccess] = useState(false);
  const [editAccess, setEditAccess] = useState(false);
  const [restaurant, setRestaurant] = useState([])
  const [restaurantInfo, setRestaurantInfo] = useState([
    {
      id: null,
      reference_number: "",
      name: "",
      table_number: "",
      house_number: "",
      barangay: "",
      municipality: "",
      province: "",
      longitude: "",
      latitude: "",
      logo: "",
      corporate_account: "",
      corporate_name: "",
    }
  ])

  const getRestaurant = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get(`/web/restaurant/${user_ID}`)
      setRestaurant(response.data)
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }

  const handleEditUser = (event,rowData) => {
    setRestaurantInfo({
      id: rowData.id,
      reference_number: rowData.reference_number,
      name: rowData.name,
      table_number: rowData.table_number,
      house_number: rowData.house_number,
      barangay: rowData.barangay,
      municipality: rowData.municipality,
      province: rowData.province,
      longitude: rowData.longitude,
      latitude: rowData.latitude,
      logo: rowData.logo,
      corporate_account: rowData.corporate_account,
      corporate_name: rowData.corporate_name
    });
    setShowModal(true);
  };

  const columns = [
    { field: "image_url", title: "Image", width: 100, render: (rowData) => {
        const styles = { width: 70, borderRadius: "50%" };
        return <img src={rowData.logo} style={styles} />;
      },
    },
    { title: 'Name', field: 'name' },
    { title: 'Reference Number', field: 'reference_number' },
    { title: 'Barangay', field: 'barangay' },
    { title: 'Municipality', field: 'municipality' },
    { title: 'Province', field: 'province' },
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
    setRestaurantInfo([])
  }

  useEffect(() => {
    getRestaurant()
    if (location.state == 'success'){
      setShowModal(false)
      setRestaurantInfo([])
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
        data={restaurant.data}  
        actions={actions}
        options={options}
        isLoading={loading}
      />
      <ModalRestaurant show={showModal} Data={restaurantInfo} close={handleModalClose} />
    </>
  )
}
