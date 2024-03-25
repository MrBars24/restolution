import MaterialTable from '@material-table/core'
import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../contexts/ContextProvider';
import { useLocation } from 'react-router-dom';
import axiosClient from '../../configs/axiosClient';
import ModalPromo from '../pages/Modal/Promo'
import EditIcon from '@mui/icons-material/Edit';

export default function Promo() {
  const { user_ID, permission } = useStateContext();
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [createAccess, setCreateAccess] = useState(false);
  const [editAccess, setEditAccess] = useState(false);
  const [promo, setPromo] = useState([])
  const [promoInfo, setPromoInfo] = useState([
    {
      id: null,
      refID: "",
      category: "",
      restaurant_id: "",
      restaurant_name: "",
      menu: "",
      datefrom: "",
      dateto: "",
      voucher_name: "",
      voucher_code: "",
      discount_type: "",
      discount_amount: "",
      limit: "",
    }
  ])

  const getUsers = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get(`/web/promo/${user_ID}`)
      setPromo(response.data)
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }

  const handleEditUser = (event,rowData) => {
    console.log(rowData)
    setPromoInfo({
      ...promoInfo,
      id: rowData.id,
      refID: rowData.refID,
      category: rowData.category,
      restaurant_id: rowData.restaurant_id,
      restaurant_name: rowData.restaurant_name,
      menu: rowData.menu,
      datefrom: rowData.datefrom,
      dateto: rowData.dateto,
      voucher_name: rowData.voucher_name,
      voucher_code: rowData.voucher_code,
      discount_type: rowData.discount_type,
      discount_amount: rowData.discount_amount,
      limit: rowData.limit
  })
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
    { title: 'Voucher Code', field: 'voucher_code' },
    { title: 'Category', field: 'category' },
    { title: 'Date Range', field: 'date_range' },
    { title: 'Created by', field: 'created_by' },
    { title: 'Updated By', field: 'updated_by' },
    { title: 'Created On', field: 'created_at' },
    { title: 'Updated On', field: 'updated_at' },
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
    // setOrdersInfo([])
  }

  useEffect(() => {
    getUsers()
    if (location.state == 'success'){
      setShowModal(false)
      // setOrdersInfo([])
      // getUsers()
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
        data={promo.data}  
        actions={actions}
        options={options}
        isLoading={loading}
      />
      <ModalPromo show={showModal} Data={promoInfo} close={handleModalClose} />
    </>
  )
}
