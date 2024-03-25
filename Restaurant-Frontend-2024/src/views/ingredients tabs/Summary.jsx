import MaterialTable from '@material-table/core';
import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useLocation } from 'react-router-dom';
import axiosClient from '../../configs/axiosClient';
import Ingredients from '../pages/Modal/Ingredients';
import { useStateContext } from '../../contexts/ContextProvider';
import { Box, Typography } from '@material-ui/core';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Col, Row } from 'react-bootstrap';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { IconButton, Tooltip } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import '../../assets/css/Btn.css'
import { format } from 'date-fns';

export default function Summary() {
  const { user_ID, permission } = useStateContext();
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [createAccess, setCreateAccess] = useState(false);
  const [editAccess, setEditAccess] = useState(false);
  const [filteredSales, setFilteredSales] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [ingredients, setingredients] = useState([])
  const [ingredientsInfo, setIngredientsInfo] = useState([
    {
      id: null,
      restaurant_id: "",
      name: "",
      unit: "",
      quantity: "",
      cost: "",
      startDate: "",
      endDate: "",
    }
  ])

  const getCategory = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get(`/web/summary/${user_ID}/${startDate}/${endDate}`)
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

  // Define columns to exclude
  const excludedColumns = ['id', 'created_by', 'restaurant_id', 'total_quantity', 'avg_unit_cost'];

 
  const columns = [
    { title: 'Name', field: 'name' },
    ...(ingredients.data ? 
      Object.keys(ingredients.data[0])
        .filter(key => key !== 'name' && !excludedColumns.includes(key))
        .map(key => ({ title: key, field: key }))
      : []
    ),
  ];

  // { title: 'Unit', field: 'unit' },
    // { title: 'Quantity', field: 'quantity' },
    // { title: 'Cost', field: 'cost' },
    // { title: 'Created On', field: 'created_at' },

//   const staticColumns = [
//     { title: 'Name', field: 'name' },
//     { title: 'Unit', field: 'unit' },
//     { title: 'Quantity', field: 'quantity' },
//     { title: 'Cost', field: 'cost' },
//     { title: 'Created On', field: 'created_at' },
//   ];
  
//   // Extract dynamic columns from the first element in ingredientsData
//   const dynamicColumns = Object.keys(ingredients.data)
//   .filter(key => !staticColumns.find(staticColumn => staticColumn.field === key) && ingredients.data[0][key] !== null);

// // Combine static and dynamic columns
// const columns = staticColumns.concat(
//   dynamicColumns.map(column => ({ title: column, field: column }))
// );


  const actions = [
    // {
    //   icon: () => <div className="btn btn-primary">Add New</div>,
    //   isFreeAction: true,
    //   onClick: () => setShowModal(true),
    //   hidden: createAccess ? false : true
    // },
    // {
    //   icon: () => <div className="btn btn-success btn-sm"><EditIcon /></div>,
    //   tooltip: 'Edit',
    //   onClick: handleEditUser,
    //   hidden: editAccess ? false : true
    // },
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

  //   const customDetailPanel = (rowData) => {
  //   const keys = Object.keys(rowData.rowData);
  //   const dynamicPrefix = findDynamicPrefix(keys);
  //   const dynamicKeys = keys.filter(key => key.startsWith(dynamicPrefix) && rowData.rowData[key] !== null);

  //   return (
  //     <Box
  //       sx={{
  //         backgroundColor: '#707B8F',
  //         color: 'white',
  //         display: 'grid',
  //         margin: 'auto',
  //         gridTemplateColumns: '1fr 1fr',
  //         width: '100%',
  //       }}
  //     >
  //       {dynamicKeys.map(key => (
  //         <div key={key}>
  //           <Typography>{`${key}: ${rowData.rowData[key]}`}</Typography>
  //         </div>
  //       ))}
  //     </Box>
  //   );
  // }
  const handleReset = () => {
    // console.log("Button clicked: Resetting dates");
    // console.log(startDate)
    // Clear the filter states (start date, end date, and search query)
    setStartDate("");
    setEndDate("");
    setFilteredSales(sales)

  };

  const findDynamicPrefix = (keys) => {
    // Find the first key that starts with a month, assuming it is the dynamic prefix
    const monthKey = keys.find(key => key.match(/[A-Za-z]+_\d+/));
    
    if (monthKey) {
      // Extract the dynamic prefix from the key
      const dynamicPrefix = monthKey.replace(/_\d+/, '_');
      return dynamicPrefix;
    }
  
    return ''; // Return an empty string if no dynamic prefix is found
  }

  const handleDateFilter = async () => {
    setLoading(true)
    console.log(startDate)
    try {
      const response = await axiosClient.get(`/web/summary/${user_ID}/${startDate}/${endDate}`)
      setingredients(response.data)
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <Row className='mb-3'>
        <Col xs={12} md={3}> 
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DatePicker  
              className='datePicker'
              label="Date Start"
              format="DD/MM/YYYY"
              value={startDate}
              onChange={(date) => {
                const formattedDate = format(new Date(date), 'yyyy-MM-dd');
                console.log(formattedDate)
                setStartDate(formattedDate);
              }}
            />
          </LocalizationProvider>
        </Col>
        <Col xs={12} md={3}> 
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DatePicker 
              className='datePicker'
              label="Date End"
              format="DD/MM/YYYY"
              value={endDate}
              onChange={(date) => {
                const formattedDate = format(new Date(date), 'yyyy-MM-dd');
                setEndDate(formattedDate);
              }}
            />
          </LocalizationProvider>
        </Col>
        <Col xs={12} md={2}> 
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <button 
              id='btn-proceed'
              onClick={handleDateFilter}
            >
              Proceed
            </button>
          </LocalizationProvider>
        </Col>
        <Col xs={12} md={2}> 
          <Tooltip title="Reset">
            <IconButton
              onClick={handleReset}
              className='search-icon'  
              sx={{
                ml: 1,
                "&.MuiButtonBase-root:hover": {
                  bgcolor: "transparent"
                }
              }}>
                  <RestartAltIcon />
            </IconButton>
          </Tooltip>
        </Col>
      </Row> 
      <MaterialTable 
        title=""
        columns={columns}
        data={ingredients.data}  
        actions={actions}
        options={options}
        isLoading={loading}
        // detailPanel={(rowData) => customDetailPanel(rowData)}
      />
      {/* <Ingredients show={showModal} Data={ingredientsInfo} close={handleModalClose} /> */}
    </>
  )
}
