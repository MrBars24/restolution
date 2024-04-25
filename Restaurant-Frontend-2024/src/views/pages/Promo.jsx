import MaterialTable from '@material-table/core'
import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../contexts/ContextProvider';
import { useLocation } from 'react-router-dom';
import axiosClient from '../../configs/axiosClient';
import ModalPromo from '../pages/Modal/Promo'
import EditIcon from '@mui/icons-material/Edit';

import dayjs from 'dayjs';
import { format } from 'date-fns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';

export default function Promo({ fromReport = false }) {
  const tableRef = React.createRef();
  const fixedOptions = [];
  let defaultStartDate = dayjs().hour(6).minute(0);
  let defaultEndDate = dayjs().hour(18).minute(0);

  const [restaurantValue, setRestaurantValue] = useState(null);
  const [dateStartValue, setDateStartValue] = useState(defaultStartDate);
  const [dateEndValue, setDateEndValue] = useState(defaultEndDate);
  const [restaurantOptions, setRestaurantOptions] = useState([...fixedOptions]);

  const [ currentQuery, setCurrentQuery ] = useState({});
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

  const getPromo = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get(`/web/promo/${user_ID}`);
      setPromo(response.data.data);
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
      hidden: createAccess ? (fromReport ? true : false) : true
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
    // setOrdersInfo([])
  }

  const onPrint = async () => {
    getTableData(null, true);
  }

  const getTableData = (query = null, isPrint = false) => {
    return new Promise((resolve, reject) => {

      let filters = [];

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

      let qry = null;
      if (query != null) {
        qry = {
          filters: filters,
          order_by: query.orderBy?.field,
          order_direction: query.orderBy?.tableData?.groupSort,
          page: query.page,
          per_page: query.pageSize
        };

        setCurrentQuery(qry);
      } else {
        qry = currentQuery;
      }

      axiosClient.get(`/web/promo/${user_ID}`, {
        params: {
          ...qry,
          ...(isPrint && { print: true })
        },
        ...(isPrint && {responseType: "blob"})
      }).then(response => {

        if (isPrint) {
          // let blob = new Blob([response.data]);
          var file = new Blob([response.data], {type: 'application/pdf'});
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          resolve();
        }

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
    })
  }

  const getRestaurant = async () => {
    try {
      const { data } = await axiosClient.get(`/web/restaurant/${user_ID}`)
      setRestaurantOptions(data.data)
    } catch (error) {

    }
  }

  useEffect(() => {
    // getPromo()
    getRestaurant();
    if (!fromReport) {
      getPromo();
    }
    if (location.state == 'success'){
      setShowModal(false)
      // setOrdersInfo([])
      // getPromo()
      location.state = null
    }

    if (permission) {
      let permissionsArray = Array.isArray(permission) ? permission : permission.split(',');

      const hasInputAccess = permissionsArray.includes('Discount (Create)');
      const hasSummaryAccess = permissionsArray.includes('Discount (Edit)');

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
          tableRef={tableRef}
          style={tableStyle}
          title=""
          columns={columns}
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
                <Grid item xs={1}>
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
                <Grid item xs={1}>
                <Button
                  fullWidth
                  variant="contained"
                  // disabled={isSubmitting}
                  size="large"
                  color="primary"
                  type="button"
                  onClick={onPrint}
                >
                      Print
                </Button>
              </Grid>
              </Grid>

            )
          }}
          // data={promo}
          data={fromReport ? query => getTableData(query) : promo}
          actions={fromReport ? [] : actions}
          options={options}
          isLoading={loading}
        />
        <ModalPromo show={showModal} Data={promoInfo} close={handleModalClose} />
      </div>
    </>
  )
}
