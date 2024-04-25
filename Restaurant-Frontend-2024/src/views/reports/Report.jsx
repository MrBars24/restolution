import MaterialTable from '@material-table/core'
import React, { useState } from 'react'
import { useStateContext } from '../../contexts/ContextProvider';
import { useEffect } from 'react';
import axiosClient from '../../configs/axiosClient';
import { Autocomplete, Button, Container, Grid, Stack, TextField } from '@mui/material';
import { FormControl } from 'react-bootstrap';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { format } from 'date-fns';
import dayjs from 'dayjs';

export default function Report() {
  const tableRef = React.createRef();
  const fixedOptions = [];
  let defaultStartDate = dayjs().hour(6).minute(0);
  let defaultEndDate = dayjs().hour(18).minute(0);
  // let defaultStartDate = new Date();

  const { user_ID, permission } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [restaurantValue, setRestaurantValue] = useState(null);
  const [dateStartValue, setDateStartValue] = useState(defaultStartDate);
  const [dateEndValue, setDateEndValue] = useState(defaultEndDate);
  const [restaurantOptions, setRestaurantOptions] = useState([...fixedOptions]);

  const columns = [
    { title: 'Table #', field: 'table_number', filtering: false },
    { title: 'Restaurant', field: 'restaurant.name', sorting: false },
    { title: 'Customer', field: 'customer_name' },
    { title: 'Payment Method', field: 'payment_method' },
    { title: 'Total Amount', field: 'total_amount' },
    { title: 'Discount Amount', field: 'discount_amount' },
    { title: 'Special Discount', field: 'special_discount_amount' },
    { title: 'Status', field: 'status' },
    // { title: 'Created by', field: 'created_by' },
    // { title: 'Updated By', field: 'updated_by' },
    { title: 'Created On', field: 'created_at' },
    // { title: 'Updated At', field: 'updated_at' },
  ];

  const options = {
    paging: true,
    pageSize: 10,
    emptyRowsWhenPaging: false,
    pageSizeOptions: [5, 10],
    paginationAlignment: "center",
    actionsColumnIndex: -1,
    // searchFieldAlignment: "left",
    // searchFieldStyle: {
    //   whiteSpace: 'nowrap',
    //   fontWeight: 450,
    // },
    search: false,
    filtering: false,
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

  const getRestaurant = async () => {
    try {
      const { data } = await axiosClient.get(`/web/restaurant/${user_ID}`)
      setRestaurantOptions(data.data)
    } catch (error) {

    }
  }

  const getSalesReport = async () => {
    // console.log(field, term);
    setLoading(true)
    try {
      const response = await axiosClient.get(`/web/order/${user_ID}`);
      if ("data" in response && Array.isArray(response.data.data)) {
        // console.log(response.data);
        setData(response.data.data);
      }
    } catch (error) {
      // Handle error
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // getSalesReport();
    getRestaurant()
  }, [])

  const tableStyle = {
      overflow: 'auto' // scroll
  };


  return (
    // <div>Report Table here</div>
    <>
    <div style={{ display: 'grid' }}>
      <MaterialTable
        tableRef={tableRef}
        style={tableStyle}
        title=""
        components={{
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
        columns={columns}
        // data={data}
        // actions={actions}
        data={query =>
          new Promise((resolve, reject) => {

            let filters = [];
            // console.log(query);
            // let filters = query.filters.map((row) => {
            //   return {
            //     column: row.column.field,
            //     operator: row.operator,
            //     value: row.value
            //   }
            // });
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

            axiosClient.get(`/web/order/${user_ID}`, {
              params: {
                filters: filters,
                order_by: query.orderBy?.field,
                order_direction: query.orderBy?.tableData?.groupSort,
                page: query.page,
                per_page: query.pageSize
              }
            }).then(response => {
              if ("data" in response && Array.isArray(response.data.data)) {
                // console.log(response.data);
                // setData(response.data.data);
                // console.log(response.data.meta);
                setLoading(false);

                resolve({
                      data: response.data.data,
                      page: response.data.meta.current_page - 1,
                      totalCount: response.data.meta.total

                })
              }
            });
          })}
        options={options}
        isLoading={loading}
      />
      {/* <ModalUser show={showModal} Data={userInfo} close={handleModalClose} /> */}
      </div>
    </>
  )
}
