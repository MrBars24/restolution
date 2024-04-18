import MaterialTable from '@material-table/core'
import React, { useState } from 'react'
import { useStateContext } from '../../contexts/ContextProvider';
import { useEffect } from 'react';
import axiosClient from '../../configs/axiosClient';

export default function Report() {
  const { user_ID, permission } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const columns = [
    { title: 'Table #', field: 'table_number', filtering: false },
    { title: 'Restaurant', field: 'restaurant.name' },
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
    filtering: true,
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
  }, [])

  return (
    // <div>Report Table here</div>
    <>
      <MaterialTable
        title=""
        columns={columns}
        // data={data}
        // actions={actions}
        data={query =>
          new Promise((resolve, reject) => {

            console.log(query);
            let filters = query.filters.map((row) => {
              return {
                column: row.column.field,
                operator: row.operator,
                value: row.value
              }
            })

            axiosClient.get(`/web/order/${user_ID}`, {
              params: {
                filters: filters,
                order_by: query.orderBy,
                order_direction: query.orderDirection,
                page: query.page,
                per_page: query.pageSize
              }
            }).then(response => {
              if ("data" in response && Array.isArray(response.data.data)) {
                // console.log(response.data);
                // setData(response.data.data);
                console.log(response.data.meta);

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
    </>
  )
}
