import MaterialTable from '@material-table/core';
import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useLocation } from 'react-router-dom';
import axiosClient from '../../configs/axiosClient';
import Ingredients from '../pages/Modal/Ingredients';
import { useStateContext } from '../../contexts/ContextProvider';
import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { format } from 'date-fns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function Input({ fromReport = false }) {
  const tableRef = React.createRef();
  const fixedOptions = [];
  let defaultStartDate = dayjs().hour(6).minute(0);
  let defaultEndDate = dayjs().hour(18).minute(0);

  const [restaurantValue, setRestaurantValue] = useState(null);
  const [dateStartValue, setDateStartValue] = useState(defaultStartDate);
  const [dateEndValue, setDateEndValue] = useState(defaultEndDate);
  const [restaurantOptions, setRestaurantOptions] = useState([...fixedOptions]);

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
      hidden: createAccess ? (fromReport ? true : false) : true
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
    ...(fromReport && {search : false}),
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

  const getRestaurant = async () => {
    try {
      const { data } = await axiosClient.get(`/web/restaurant/${user_ID}`)
      setRestaurantOptions(data.data)
    } catch (error) {

    }
  }

  useEffect(() => {
    // getCategory()
    getRestaurant();

    if (!fromReport) {
      getCategory();
    }

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

  const tableStyle = {
    overflow: 'auto' // scroll
  };

  return (
    <>
    <div style={{ display: 'grid' }}>
      <MaterialTable
        title=""
        style={tableStyle}
        columns={columns}
        tableRef={tableRef}
        // data={ingredients.data}
        components={fromReport && {
          Toolbar: props => (

            <Grid container spacing={2} padding={2}>
              <Grid item xs={3}>
                <Autocomplete
                  required
                  value={restaurantValue}
                  onChange={(e, value) => {
                    setRestaurantValue(value);
                  }}
                  options={restaurantOptions}
                  getOptionLabel={(option) => option.name}
                  // inputValue={restaurantValue}

                  // isOptionEqualToValue={(option, value) => option.name === value.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Restaurant"
                      InputProps={{
                          ...params.InputProps,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <DateTimePicker
                    className='datePicker'
                    label="Date Start"
                    format="YYYY/MM/DD hh:mm a"

                    value={dateStartValue}
                    onChange={(date) => {
                      console.log(date);
                      // const formattedDate = format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
                      setDateStartValue(date);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <DateTimePicker
                    className='datePicker'
                    label="Date End"
                    format="YYYY/MM/DD hh:mm a"
                    value={dateEndValue}
                    onChange={(date) => {
                      // const formattedDate = format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
                      setDateEndValue(date);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={2}>
                <Button
                  fullWidth
                  variant="contained"
                  // disabled={isSubmitting}
                  size="large"
                  color="primary"
                  type="button"
                  onClick={() => {
                    tableRef.current && tableRef.current.onQueryChange()
                  }}
                >
                      Filter
                </Button>
              </Grid>
            </Grid>

          )
        }}
        data={fromReport ? query =>
          new Promise((resolve, reject) => {

          let filters = [];
          if (fromReport) {
            if (restaurantValue) {
              filters.push({
                column: "restaurant_id",
                operator: "=",
                value: restaurantValue.id
              })
            }

            if (dateStartValue && dateEndValue) {
              const formattedStartDate = format(new Date(dateStartValue), 'yyyy-MM-dd HH:mm:ss');
              const formattedEndDate = format(new Date(dateEndValue), 'yyyy-MM-dd HH:mm:ss');

              filters.push({
                column: "created_at",
                operator: "RANGE",
                value: formattedStartDate + "_" + formattedEndDate
              })
            }
          }

          axiosClient
            .get(`/web/ingredients/${user_ID}`, {
              params: {
                filters: filters,
                order_by: query.orderBy?.field,
                order_direction: query.orderBy?.tableData?.groupSort,
                page: query.page,
                per_page: query.pageSize
              }
            })
            .then(response => {
              if ("data" in response && Array.isArray(response.data.data)) {
                // console.log(response.data);
                // setData(response.data.data);
                resolve({
                      data: response.data.data,
                      page: response.data.meta.current_page - 1,
                      totalCount: response.data.meta.total

                })
              }
            });
        }) : ingredients.data}
        actions={fromReport ? [] : actions}
        options={options}
      />
      </div>
      {!fromReport && <Ingredients show={showModal} Data={ingredientsInfo} close={handleModalClose} />}
    </>
  )
}
