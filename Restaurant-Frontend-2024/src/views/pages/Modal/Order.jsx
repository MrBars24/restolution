import React, { useEffect, useState } from 'react'
import { Col, Form, Modal, Row } from 'react-bootstrap'
import '../../../assets/css/modal.css'
import { Autocomplete, Button, TextField } from '@mui/material'
import  Role from '../../../data/refRole.json'
import  InOut from '../../../data/refInOut.json'
import  OrderStatus from '../../../data/refOrderStatus.json'
import  PaymentMethod from '../../../data/refPaymentMethod.json'
import Swal from 'sweetalert2'
import axiosClient from '../../../configs/axiosClient'
import { useNavigate } from 'react-router-dom'
import { useStateContext } from '../../../contexts/ContextProvider'

function TableRows({ rows, data, tableRowRemove, onValUpdate }) {
  return rows.map((rowsData, index) => {
    const { name, quantity, notes, price } = rowsData;
    const allIngredientsNames = data.map((item) => item.MenuName);
    // const allIngredientsNames = Array.isArray(data) ? data.map((item) => item.MenuName) : [];
    const rowNumber = index + 1;
 
    const handleAutocompleteChange = (event, selectedOption) => {
      // setDisabled(false)
      onValUpdate(index, event)
    };
    return (
      <tr key={index}>
         <td style={{ verticalAlign: 'middle' }}>
          {rowNumber}
        </td>
        <td>
          <Autocomplete
            // disabled
            id="customerName"
            disableClearable
            onChange={(event, selectedOption) => handleAutocompleteChange(event, selectedOption)}
            options={allIngredientsNames || []}
            value={name}
            name='name'
            sx={{ width: 200 }}
            getOptionLabel={(option) => option.toString()}
            isOptionEqualToValue={(option, value) =>
              option === value.MenuName
            }
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                    required: true
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} value={option} name="name" >
                  {option}
                </li>
              )}
          />
        </td>
        <td>
          <TextField 
              // disabled
              required
              type="number"
              value={quantity}
              onChange={(event) => onValUpdate(index, event)}
              name="quantity"
             />
        </td>
        <td>
           <TextField 
              disabled
              value={notes ?? ""} 
              onChange={(event) => onValUpdate(index, event)}
              name="notes"
             />
        </td>
        <td>
          <TextField 
              disabled
              value={price}
              onChange={(event) => onValUpdate(index, event)}
              name="price"
              variant="outlined" 
             />
        </td>
        {/* <td>
          <button
            className="btn btn-danger"
            onClick={() => tableRowRemove(index)}
          >
            Delete
          </button>
        </td> */}
      </tr>
    );
  });
}
export default function Order(props) {
  const { user_ID } = useStateContext();
  const navigate = useNavigate()
  const fixedOptions = [];
  const [value, setValue] = useState([...fixedOptions]);
  const [rows, initRow] = useState([]);
  const [menu, setMenu] = useState([])
  const [menuFilter, setMenuFilter] = useState([])
  const id = props.Data?.id ?? null
  const [price, setPrice] = useState("")
  const [waiter, setWaiter] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState(null)
  const [order, setOrder] = useState({
    id: "",
    restaurant_id: 1,
    table_number: "",
    status: "",
    dine_in_out: "",
    payment_method: "",
    discount_amount: "",
    total_amount: "",
    vatable: "",
    vat: "",
    menu: [],
    waiter: []
  })

  const addRowTable = () => {
    const data = {
      name: "",
      quantity: "",
      notes: "",
      price: ""
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

  // Define a function to calculate the total price
  const calculateTotalPrice = (data) => {
    let totalPrice = 0;

    // Iterate through each row in the data array
    data.forEach((row) => {
      // Check if the 'price' property exists and is a number
      if (typeof row.price === 'number') {
        totalPrice += row.price;
      }
    });

    return totalPrice;
  };

  const onValUpdate = (i, event) => {
    let name, value;
    const liElement = event.target;
    const values = liElement.getAttribute('value');
 
    const filteredMenus = menuFilter.filter(ingredient => ingredient.name === values);
    

    if (event.target.getAttribute('name') === 'name')  {
      name = ['name', 'quantity', 'price'];
      value = [event.target.getAttribute('value'), "", ""];
      setPrice(filteredMenus[0].price)
    } else if (event.target.name === 'quantity') {
      name = [event.target.name, 'price'];
      value = [event.target.value, event.target.value * price];
    } else if (event.target.name === 'notes') {
      name = [event.target.name];
      value = [event.target.value];
    }
    
    const data = [...rows];
    for (let j = 0; j < name.length; j++) {
      data[i][name[j]] = value[j];
    }
    initRow(data);
    const total = calculateTotalPrice(data); // Calculate total price
    const vatSales = (total / 112 * 100).toFixed(2);
    setOrder({
      ...order,
      menu: data,
      total_amount: total.toFixed(2),
      vat: (total - vatSales).toFixed(2),
      vatable: vatSales,
    })
  };

  const getMenu = async () => {
    try {
      const response = await axiosClient.get(`/web/menu/${user_ID}`);
      const { data } = response.data;
      setMenuFilter(data);
      const MenuName = data.map(item => ({ MenuName: item.name }));
      setMenu(MenuName);
      // initRow({...rows, IngredientsName: ingredientsName});
      
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  }

  const getWaiter = async () => {
    try {
      const response = await axiosClient.get(`/web/waiter/${user_ID}`);
      const { data } = response.data;
      setWaiter(data);
      
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  }

  const handleStatus = (event, newValue) => {
    setOrder({
        ...order,
        status: newValue?.status
    })
  }

  const handleDine = (event, newValue) => {
    setOrder({
        ...order,
        dine_in_out: newValue?.name
    })
  }

  const handlePayment = (event, newValue) => {
    setOrder({
        ...order,
        payment_method: newValue?.name
    })
  }

  const handleWaiter= (event, newValue) => {
    const extractedData = newValue.map((option) => ({
      id: option.id,
      fullname: option.fullname
    }));
 
    setValue([...fixedOptions, ...extractedData]);
    setOrder({
      ...order,
      waiter: [...fixedOptions, ...extractedData],
    }); 
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    // setIsSubmitting(true);
    const payload = {...order}
    
    try {
        const response = id
        ? await axiosClient.put(`/web/order/${id}`, payload)
        : await axiosClient.post('/web/order', payload);

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text:  'Your data has been successfully saved!',
        }).then(() => {
            setIsSubmitting(false);
            navigate('/Order', { state: 'success' });
        });
    } catch (err) {
        const response = err.response;
        if (response.status === 422) {
            setIsSubmitting(false);
            setErrors(response.data.errors);
        }
    }
  }
 
  useEffect(() => {
    if (id) {
      setOrder({
          ...props.Data
      });
      initRow(props.Data.menu);
      getMenu()
      getWaiter()
      // setValue(props.Data.category);
    } else if (!props.show) {
      setOrder({
        ...order,
        id: "",
        restaurant_id: 1,
        table_number: "",
        status: "",
        dine_in_out: "",
        payment_method: "",
        discount_amount: "",
        total_amount: "",
        vatable: "",
        vat: "",
        menu: []
      })
      initRow([])
      setErrors(null)
    //   setHide(false)
    //   setadminHide(false)
    } else if (props.show) {
      getMenu()
      getWaiter()
    }
  },[props.show])
    
  return (
    <div id="OrderModal">
        <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
            <Modal.Header closeButton>
            <Modal.Title>Order</Modal.Title>
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
                        <Col xs={12} md={6}>
                            <TextField
                                // disabled
                                required
                                type="text" 
                                value={order.table_number} 
                                onChange={ev => setOrder({...order, table_number: ev.target.value})} 
                                label="Table Number" 
                                variant="outlined" 
                                fullWidth
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <Autocomplete
                                // disabled
                                disableClearable
                                value={ order.status}
                                options={OrderStatus.RECORDS}
                                onChange={handleStatus}
                                getOptionLabel={(options) => options.status ? options.status.toString() : order.status}
                                isOptionEqualToValue={(option, value) => option.status ?? "" === order.status}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    label="Status"
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                        required: true
                                    }}
                                    />
                                )}
                            />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Row>
                          <Col xs={12} md={6}>
                            <Autocomplete
                                // disabled
                                disableClearable
                                value={ order.dine_in_out}
                                options={InOut.RECORDS}
                                onChange={handleDine}
                                getOptionLabel={(options) => options.name ? options.name.toString() : order.dine_in_out}
                                isOptionEqualToValue={(option, value) => option.name ?? "" === order.dine_in_out}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    label="Dine-in / Take-out"
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
                    </Row>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Row>
                        <Col xs={12} md={6}>
                            <Autocomplete
                            multiple
                            value={value}
                            onChange={ handleWaiter } 
                            options={waiter}
                            getOptionLabel={(option) =>  option.fullname}
                            isOptionEqualToValue={(option, value) => option.fullname === value.fullname}
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                label="Waiter"
                                InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                }}
                                />
                            )}
                            />
                        </Col>                    
                    </Row>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Row>
                        <Col xs={12} md={12}>
                          <Modal.Title>Menu</Modal.Title>
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>notes</th> 
                                <th>price</th>
                              </tr>
                            </thead>
                            <tbody>
                              <TableRows
                                rows={rows}
                                data={menu}
                                tableRowRemove={tableRowRemove}
                                onValUpdate={onValUpdate}
                              />
                            </tbody>
                          </table>
                          {/* <button 
                            className="btn btn-primary" 
                            onClick={(event) => {
                              event.preventDefault(); // Prevent form submission
                              addRowTable(); // Call your function to insert a row
                            }}
                          >
                            Insert Row
                          </button> */}
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Row>
                        <Col xs={12} md={6}>
                            <TextField 
                                disabled
                                type="number" 
                                value={(parseFloat(order.discount_amount) + parseFloat(order.total_amount)).toFixed(2) || ""} 
                                label="Sub Total" 
                                variant="outlined" 
                                fullWidth
                            />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Row>
                        <Col xs={12} md={6}>
                            <TextField 
                                disabled
                                type="number" 
                                value={order.discount_amount ?? ""} 
                                onChange={ev => setOrder({...order, discount_amount: ev.target.value})} 
                                label="Voucher Discount" 
                                variant="outlined" 
                                fullWidth
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <TextField 
                                disabled
                                value="Free100"
                                label="Voucher Code" 
                                variant="outlined" 
                                fullWidth
                            />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Row>
                        <Col xs={12} md={6}>
                            <TextField 
                                disabled
                                type="number" 
                                value="29.16"
                                onChange={ev => setOrder({...order, discount_amount: ev.target.value})} 
                                label="Special Discount Amount" 
                                variant="outlined" 
                                fullWidth
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <TextField 
                                disabled
                                value="12%"
                                label="Percentage" 
                                variant="outlined" 
                                fullWidth
                            />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Row>
                        <Col xs={12} md={6}>
                            <TextField 
                                disabled
                                type="number" 
                                value={order.vatable} 
                                onChange={ev => setOrder({...order, discount_amount: ev.target.value})} 
                                label="VATable" 
                                variant="outlined" 
                                fullWidth
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <TextField 
                                disabled
                                type="number" 
                                value={order.vat} 
                                label="VAT" 
                                variant="outlined" 
                                fullWidth
                            />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Row>
                        <Col xs={12} md={6}>
                            <TextField 
                                disabled
                                type="number" 
                                value={order.total_amount} 
                                label="Amount Due" 
                                variant="outlined" 
                                fullWidth
                            />
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
                                Save
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
