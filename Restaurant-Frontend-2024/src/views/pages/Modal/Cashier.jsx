import React, { useEffect, useState } from 'react'
import { Autocomplete, Button, TextField, Typography } from '@mui/material'
import { Col, Form, Modal, Row } from 'react-bootstrap'
import axiosClient from '../../../configs/axiosClient'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import  PaymentMethod from '../../../data/refPaymentMethod.json'
import CashierTable from '../../tables/CashierTable'
import { useStateContext } from '../../../contexts/ContextProvider'

export default function Cashier(props) {
    const { user_ID } = useStateContext();
    const navigate = useNavigate()
    const id = props.Data?.id ?? null
    const [hidden, setHidden] = useState(true)
    const [rows, initRow] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState(null)
    const [menu, setMenu] = useState([])
    const [menuFilter, setMenuFilter] = useState([])
    const [price, setPrice] = useState("")
    const [order, setOrder] = useState({
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
    })

    const onSubmit = async (ev) => {
        ev.preventDefault()
        const payload = {...order}

        try {
          await axiosClient.put(`/web/order_complete/${id}`, payload);
  
          Swal.fire({
              icon: 'success',
              title: 'Success',
              text:  'Your data has been successfully saved!',
          }).then(() => {
              setIsSubmitting(false);
              navigate('/Cashier', { state: 'success' });
          });
      } catch (err) {
          const response = err.response;
          if (response.status === 422) {
              setIsSubmitting(false);
              setErrors(response.data.errors);
          }
      }
    }
    
    const onHide = (ev) => {
        setHidden(ev)
    }

    const handlePayment = (event, newValue) => {
      console.log(newValue)
      setOrder({
        ...order,
        payment_method: newValue?.name
      })
    }

    const calculateTotalPrice = (data) => {
      let totalPrice = 0;

      // Iterate through each row in the data array
      data.forEach((row) => {
        // Check if the 'price' property exists and is a number
        if (typeof row.price === 'number') {
          totalPrice += row.price * row.quantity;
        }
      });

      return totalPrice;
    };

    const addRowTable = () => {
        const data = {
          name: "",
          quantity: "",
          price: "",
        };
        initRow([...rows, data]);
      };

      const tableRowRemove = (index) => {
        const dataRow = [...rows];
        dataRow.splice(index, 1);
        initRow(dataRow);
        setOrder({
          ...order,
          menu: dataRow
        })
      };

    const onValUpdate = (i, event) => {      
        const liElement = event.target;
        const values = liElement.getAttribute('value');
        const names = event.target.getAttribute('name');
        const data = [...rows];

        if (names === 'name')  {
            const filteredIngredient = menuFilter.find(ingredient => ingredient.name === values);
            if (filteredIngredient) {
                data[i][names] = values;
                data[i]['price'] = filteredIngredient.price;
                initRow(data);
            }
        } else {
            const { name, value } = event.target;
            data[i][name] = value;
            initRow(data);
        }

        const subtotal = calculateTotalPrice(data);
        const discount_amount = parseInt(order.discount_amount ?? 0);
        const special_amount = parseInt(order.special_discount_amount ?? 0);
        const discount = (discount_amount + special_amount)
        const total = (subtotal - discount)
        const vatSales = (total / 112 * 100).toFixed(2);
        setOrder({
        ...order,
            menu: data,
            total_amount: subtotal.toFixed(2),
            vat: (total - vatSales).toFixed(2),
            vatable: vatSales,
        })
    }

    const getMenu = async () => {
        try {
          const response = await axiosClient.get(`/web/menu/${user_ID}`);
          const { data } = response.data;
          setMenuFilter(data);
          const MenuName = data.map(item => ({ MenuName: item.name }));
          setMenu(MenuName);
        //   initRow({...rows, IngredientsName: ingredientsName});
          
        } catch (error) {
          console.error("Error fetching client data:", error);
        }
      }
 
    useEffect(() => {
        if (id) {
            getMenu()
            initRow(props.Data.menu);
            setOrder({
              ...props.Data
            });
        } else if (!props.show) {
          setOrder({
            ...order,
            id: "",
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
          });
          setErrors(null);
          initRow([])
        }
    }, [id, props.show]);

  return (
    <div id="CategoryModal">
            <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
                <Modal.Header closeButton>
                <Modal.Title>Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-main">
                    {errors && 
                    <div className="sevices_logo_errors">
                        {Object.keys(errors).map(key => (
                        <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                    }
                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Row>
                                <Col xs={12} md={12}>
                                {/* <Modal.Title>Menu</Modal.Title> */}
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                        <th>price</th> 
                                        <th>Total</th>
                                        <th>
                                            <button 
                                            hidden={hidden}
                                            className="btn btn-primary" 
                                            onClick={(event) => {
                                            event.preventDefault(); // Prevent form submission
                                            addRowTable(); // Call your function to insert a row
                                            }}
                                            >
                                            Add
                                            </button>
                                        </th>
                                        
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <CashierTable
                                        rows={rows}
                                        data={order}
                                        menus={menu}
                                        tableRowRemove={tableRowRemove}
                                        onValUpdate={onValUpdate}
                                        onHide={onHide}
                                    />
                                    </tbody>
                                </table>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Row >
                                <Col xs={12} md={6}>
                                    <Autocomplete
                                        // disabled
                                        disableClearable
                                        value={ order.payment_method}
                                        options={PaymentMethod.RECORDS}
                                        onChange={handlePayment}
                                        getOptionLabel={(options) => options.name ? options.name.toString() : order.payment_method}
                                        isOptionEqualToValue={(option, value) => option.name ?? "" === order.payment_method}
                                        renderInput={(params) => (
                                            <TextField
                                            {...params}
                                            label="Payment Method"
                                            InputProps={{
                                                ...params.InputProps,
                                                type: 'search',
                                                required: true
                                            }}
                                            />
                                        )}
                                    />
                                </Col>         
                                <Col xs={12} md={6}>
                                  <TextField
                                    type="text" 
                                    value={order.customer_name} 
                                    onChange={ev => setOrder({...order, customer_name: ev.target.value})} 
                                    label="Customer Name" 
                                    variant="outlined" 
                                    fullWidth
                                  />
                                </Col>                   
                            </Row>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Row >
                                <Col xs={12} md={6}>
                                </Col>         
                                <Col xs={12} md={6}  style={{ textAlign: 'right' }}>
                                <Typography>Created Time : {order.time_created}</Typography>
                                <Typography>Process Time : {order.time_process ?? '-----'}</Typography>
                                <Typography>Served Time : {order.time_served ?? '-----'}</Typography>
                                <Typography>Completed Time : {order.time_completed ?? '-----'}</Typography>
                                </Col>                   
                            </Row>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Row >
                                <Col xs={12} md={6}>
                                    <Button 
                                    variant="contained" 
                                    // disabled={isSubmitting} 
                                    size="large" 
                                    color="success" 
                                    type="submit" 
                                    >
                                        Paid
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Group> 
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
  )
}
