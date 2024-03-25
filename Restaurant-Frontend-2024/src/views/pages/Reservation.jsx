import MaterialTable from '@material-table/core'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import ModalReservation from '../pages/Modal/Reservation'
import axiosClient from '../../configs/axiosClient';
import { useLocation } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';

export default function Reservation() {
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
        restaurant_id: "",
        table_number: "",
        date: "",
        time: "",
        number_of_guest: "",
        guest_name: "",
        notes: "",
      }
    ])
  
    const getRestaurant = async () => {
      setLoading(true)
      try {
        const response = await axiosClient.get(`/web/reservation/${user_ID}`)
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
        restaurant_id: rowData.restaurant_id,
        table_number: rowData.table_number,
        date: rowData.date,
        time: rowData.time,
        number_of_guest: rowData.number_of_guest,
        guest_name: rowData.guest_name,
        notes: rowData.notes
      });
      setShowModal(true);
    };
  
    const columns = [
      { title: 'Guest Name', field: 'guest_name' },
      { title: 'Table #', field: 'table_number' },
      { title: '# of Guest Number', field: 'number_of_guest' },
      { title: 'Date', field: 'date' },
      { title: 'Time', field: 'time' },
      { title: 'Notes', field: 'notes' },
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
        // hidden: createAccess ? true : true
      },
      {
        icon: () => <div className="btn btn-success btn-sm"><EditIcon /></div>,
        tooltip: 'Edit',
        onClick: handleEditUser,
        // hidden: editAccess ? true : true
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
  
        const hasInputAccess = permissionsArray.includes('Reservation (Create)');
        const hasSummaryAccess = permissionsArray.includes('Reservation (Edit)');
  
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
        <ModalReservation show={showModal} Data={restaurantInfo} close={handleModalClose} />
      </>
    )
  }
  