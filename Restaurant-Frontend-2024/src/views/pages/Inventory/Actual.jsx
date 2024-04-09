import MaterialTable from '@material-table/core'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import { useLocation } from 'react-router-dom';
import { useStateContext } from '../../../contexts/ContextProvider';
import axiosClient from '../../../configs/axiosClient';
import ActualSystem from '../Modal/Actual'
import VoidLogin from '../Authentication/VoidLogin';
import Swal from 'sweetalert2'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function Actual() {
  const { user_ID, permission } = useStateContext();
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [showVoid, setShowVoid] = useState(false);
  const [createAccess, setCreateAccess] = useState(false);
  const [editAccess, setEditAccess] = useState(false);
  const [updateAccess, setUpdateAccess] = useState(false);
  const [inventory, setInventory] = useState([])
  const [inventoryInfo, setInventoryInfo] = useState([
    {
      id: null,
      restaurant_id: "",
      name: "",
      quantity: "",
      unit: "",
      unit_cost: "",
      total_cost: "",
      created_by: ""
    }
  ])

  const getInventory = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get(`/web/actual_inventory/${user_ID}`)
      setInventory(response.data)
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }

  const handleEditUser = (event,rowData) => {
    setInventoryInfo({
      id: rowData.id,
      restaurant_id: rowData.restaurant_id,
      name: rowData.name,
      quantity: rowData.quantity,
      unit: rowData.unit,
      unit_cost: rowData.unit_cost,
      total_cost: rowData.total_cost,
    });
    setShowModal(true);
  };

  const handleUpdate = (event,rowData) => {
    setShowVoid(true)
  };

  const actions = [
    {
      icon: () => <div className="btn btn-warning">Update</div>,
      isFreeAction: true,
      onClick: handleUpdate,
      hidden: updateAccess ? false : true
    },
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
    { title: 'Name', field: 'name' },
    { title: 'Quantity', field: 'quantity' },
    { title: 'Unit', field: 'unit' },
    { title: 'Unit Cost', field: 'unit_cost' },
    { title: 'Total Cost', field: 'total_cost' },
    { title: 'Created by', field: 'created_by' },
    { title: 'Created On', field: 'created_at' },
    { title: 'Updated By', field: 'updated_by' },
    {
      field: "updated_at",
      title: "Date Updated",
      render: (rowData) => rowData.updated_by ? rowData.updated_at : null,
    },
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
    setInventoryInfo([])
  }

  const handleVoidClose = () => {
    setShowVoid(false)
  }

  const onVoid = async () => {
    try {
      const response = await axiosClient.get(`/web/system_inventory_update/${user_ID}`)

      if (response) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Inventory successfully updated.',
        }).then(() => {
        });
      }

      setShowVoid(false);
    } catch (e){
      setShowVoid(false);

    }
  }

  useEffect(() => {
    getInventory()
    if (location.state == 'success'){
      setShowModal(false)
      setInventoryInfo([])
      location.state = null
    }

    if (permission) {
      let permissionsArray = Array.isArray(permission) ? permission : permission.split(',');

      const hasCreateAccess = permissionsArray.includes('Inventory Actual (Create)');
      const hasEditAccess = permissionsArray.includes('Inventory Actual (Edit)');
      const hasUpdateAccess = permissionsArray.includes('Inventory System (Create)');

      if (hasCreateAccess) {
        setCreateAccess(true);
      }

      if (hasEditAccess) {
        setEditAccess(true);
      }

      if (hasUpdateAccess) {
        setUpdateAccess(true);
      }

      // switch (true) {
      //   case (hasInputAccess && hasSummaryAccess):
      //       setCreateAccess(true);
      //       setEditAccess(true);
      //       break;
      //   case hasInputAccess:
      //       setCreateAccess(true);
      //       setEditAccess(false);
      //       break;
      //   case hasSummaryAccess:
      //       setCreateAccess(false);
      //       setEditAccess(true);
      //       break;
      // }
    }
  }, [location.state, permission])

  return (
    <>
      <MaterialTable
        title=""
        columns={columns}
        data={inventory.data}
        actions={actions}
        options={options}
        isLoading={loading}
      />
      <ActualSystem show={showModal} Data={inventoryInfo} close={handleModalClose} />
      {/* <VoidLogin show={showVoid} onVoid={onVoid} close={handleVoidClose} /> */}
      <Dialog
        open={showVoid}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Update Inventory"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to update system inventory?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVoid(false)}>Close</Button>
          <Button onClick={onVoid} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
