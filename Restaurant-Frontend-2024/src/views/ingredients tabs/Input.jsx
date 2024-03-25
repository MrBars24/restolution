import MaterialTable from '@material-table/core';
import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useLocation } from 'react-router-dom';
import axiosClient from '../../configs/axiosClient';
import Ingredients from '../pages/Modal/Ingredients';
import { useStateContext } from '../../contexts/ContextProvider';

export default function Input() {
  const { user_ID, permission } = useStateContext();
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [createAccess, setCreateAccess] = useState(false);
  const [editAccess, setEditAccess] = useState(false);
  const [ingredients, setingredients] = useState([])
  const [ingredientsInfo, setIngredientsInfo] = useState([
    {
      id: null,
      restaurant_id: "",
      name: "",
      unit: "",
      quantity: "",
      cost: "",
    }
  ])

  const getCategory = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get(`/web/ingredients/${user_ID}`)
      setingredients(response.data)
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }

  const handleEditUser = (event,rowData) => {
    setIngredientsInfo({
      id: rowData.id,
      restaurant_id: rowData.restaurant_id,
      name: rowData.name,
      unit: rowData.unit,
      quantity: rowData.quantity,
      cost: rowData.cost,
    });
    setShowModal(true);
  };

  const columns = [
    { title: 'Name', field: 'name' },
    { title: 'Unit', field: 'unit' },
    { title: 'Quantity', field: 'quantity' },
    { title: 'Cost', field: 'cost' },
    { title: 'Created On', field: 'created_at' },
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
    setIngredientsInfo([])
  }

  useEffect(() => {
    getCategory()
    if (location.state == 'success'){
      setShowModal(false)
      setIngredientsInfo([])
      location.state = null
    }

    if (permission){
      let permissionsArray = Array.isArray(permission) ? permission : permission.split(',');

      const hasInputAccess = permissionsArray.includes('Ingredients Input (Create)');
      const hasSummaryAccess = permissionsArray.includes('Ingredients Input (Edit)');
  
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
        data={ingredients.data}  
        actions={actions}
        options={options}
        isLoading={loading}
      />
      <Ingredients show={showModal} Data={ingredientsInfo} close={handleModalClose} />
    </>
  )
}
