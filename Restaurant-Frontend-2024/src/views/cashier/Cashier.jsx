import MaterialTable from '@material-table/core'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import ModalCashier from '../pages/Modal/Cashier'
import axiosClient from '../../configs/axiosClient';
import { useLocation } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import PreviewIcon from '@mui/icons-material/Preview';
import { Box, Button, Typography } from '@mui/material';

export default function Cashier() {
  const { user_ID } = useStateContext();
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([])
  const [orderinfo, setOrderInfo] = useState([
    {
      id: null,
      restaurant_id: "",
      menu: "",
      dine_in_out: "",
      payment_method: "",
      status: "",
      total_amount: "",
      discount_amount: "",
      special_discount_amount: "",
      vatable: "",
      vat: "",
      customer_name: "",
      waiter: "",
      cooked_by: "",
      voucher_code: "",
      special_code: "",
      time_created: "",
      time_process: "",
      time_served: "",
      time_completed: "",
    }
  ])

  const getUsers = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get(`/web/cashier/${user_ID}`)
      setOrders(response.data)
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }

  const handleEditUser = (event,rowData) => {
    setOrderInfo({
      id: rowData.order_id,
      restaurant_id: rowData.restaurant_id,
      menu: rowData.menu,
      dine_in_out: rowData.dine_in_out,
      payment_method: rowData.payment_method,
      status: rowData.status,
      total_amount: rowData.total_amount,
      discount_amount: rowData.discount_amount,
      special_discount_amount: rowData.special_discount_amount,
      vatable: rowData.vatable,
      vat: rowData.vat,
      customer_name: rowData.customer_name,
      waiter: rowData.waiter,
      cooked_by: rowData.cooked_by,
      voucher_code: rowData.voucher_code,
      special_code: rowData.special_code,
      time_created: rowData.time_created,
      time_process: rowData.time_process,
      time_served: rowData.time_served,
      time_completed: rowData.time_completed,
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
      tooltip: 'View',
      onClick: handleEditUser,
    },
  ];

  const columns = [
    { title: 'Table #', field: 'table_number' },
    { title: 'Menu', field: 'menu_string' },
    { title: 'Dine In/Out', field: 'dine_in_out' },
    { title: 'Waiter', field: 'waiter_String' },
    { title: 'Total Amount', field: 'amount' },
    // { title: 'Created by', field: 'created_by' },
    // { title: 'Updated By', field: 'updated_by' },
    { title: 'Time Created', field: 'time_created' },
    // { title: 'Updated At', field: 'updated_at' },
  ]

  const options = {
    paging: true,
    pageSize: 10,
    emptyRowsWhenPaging: false,
    pageSizeOptions: [10,20],
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
    setOrderInfo([])
  }

  useEffect(() => {
    getUsers()
    if (location.state == 'success'){
      // setShowModal(false)
      setOrderInfo([])
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
      <ModalCashier show={showModal} Data={orderinfo} close={handleModalClose} />
    </>
  )
}
