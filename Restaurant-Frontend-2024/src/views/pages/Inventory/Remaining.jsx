import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useStateContext } from '../../../contexts/ContextProvider';
import MaterialTable from '@material-table/core';
import axiosClient from '../../../configs/axiosClient';

export default function Remaining() {
    const { user_ID } = useStateContext();
    const location = useLocation()
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false);
    const [createAccess, setCreateAccess] = useState(false);
    const [editAccess, setEditAccess] = useState(false);
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
          const response = await axiosClient.get(`/web/remaining/${user_ID}`)
        //   console.log(response.data)
          setInventory(response.data)
        } catch (error) {
          // Handle error
        } finally {
          setLoading(false);
        }
    }

    const columns = [
        { title: 'Name', field: 'name' },
        { title: 'Unit', field: 'unit' },
        { title: 'Used Quantity', field: 'used_quantity' },
        { title: 'Remaining Quantity', field: 'remaining_quantity' },
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

    useEffect(() => {
        getInventory()
        if (location.state == 'success'){
          setShowModal(false)
          setInventoryInfo([])
          location.state = null
        }
    
      }, [location.state])

    return (
        <MaterialTable 
        title=""
        columns={columns}
        data={inventory.data}  
        // actions={actions}
        options={options}
        isLoading={loading}
      />
    )
}
