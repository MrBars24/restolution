import MaterialTable from '@material-table/core'
import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../contexts/ContextProvider';
import { useLocation } from 'react-router-dom';
import axiosClient from '../../configs/axiosClient';
import ModalOrder from '../pages/Modal/Order'
import PreviewIcon from '@mui/icons-material/Preview';

export default function Order() {
  const { user_ID } = useStateContext();
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([])
  const [ordersInfo, setOrdersInfo] = useState([
    {
      id: null,
      restaurant_id: "",
      table_number: "",
      menu: "",
      dine_in_out: "",
      payment_method: "",
      status: "",
      total_amount: "",
      discount_amount: "",
      vatable: "",
      vat: ""
    }
  ])

  const getUsers = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get(`/web/order/${user_ID}`)
      setOrders(response.data)
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }

  const handleEditUser = (event,rowData) => {
    setOrdersInfo({
      id: rowData.id,
      restaurant_id: rowData.restaurant_id,
      table_number: rowData.table_number,
      menu: rowData.menu,
      dine_in_out: rowData.dine_in_out,
      payment_method: rowData.payment_method,
      status: rowData.status,
      total_amount: rowData.total_amount,
      discount_amount: rowData.discount_amount,
      vatable: rowData.vatable,
      vat: rowData.vat
    });
    setShowModal(true);
  };

  const actions = [
    // {
    //   icon: () => <div className="btn btn-primary">Add New</div>,
    //   isFreeAction: true,
    //   onClick: () => setShowModal(true)
    // },
    {
      icon: () => <div className="btn btn-primary btn-sm"><PreviewIcon /></div>,
      tooltip: 'Edit',
      onClick: handleEditUser,
    },
  ];

  const columns = [
    { title: 'Table Number', field: 'table_number' },
    { title: 'Menu', field: 'menu_array' },
    { title: 'Dine In / Out', field: 'dine_in_out' },
    { title: 'Status', field: 'status' },
    { title: 'Payment Method', field: 'payment_method' },
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
    setOrdersInfo([])
  }

  useEffect(() => {
    getUsers()
    if (location.state == 'success'){
      setShowModal(false)
      setOrdersInfo([])
      getUsers()
      location.state = null
    }
  }, [location.state])

  return (
    <>
      <MaterialTable 
        title=""
        columns={columns}
        data={orders.data}  
        actions={actions}
        options={options}
        isLoading={loading}
      />
      <ModalOrder show={showModal} Data={ordersInfo} close={handleModalClose} />
    </>
  )
}
