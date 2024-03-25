import React, { useEffect, useState } from 'react'
import { Col, Form, Modal, Row } from 'react-bootstrap'
import '../../../assets/css/modal.css'
import { Autocomplete, Button, Card, CardMedia, TextField } from '@mui/material'
import  Status from '../../../data/refStatus.json'
import axiosClient from '../../../configs/axiosClient'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import NoImage from '../../../assets/images/Image_not_available.png'
import { useStateContext } from '../../../contexts/ContextProvider'
import { LocalizationProvider, TimePicker, renderTimeViewClock } from '@mui/x-date-pickers'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Minutes from '../../../data/refEstimatedTime.json'

  function TableRows({ rows, data, tableRowRemove, onValUpdate }) {
    return rows.map((rowsData, index) => {
      const { name, quantity, unit, price } = rowsData;
      // const allIngredientsNames = data.map((item) => item.ingredientsName);
      const allIngredientsNames = Array.isArray(data) ? data.map((item) => item.ingredientsName) : [];

      const handleAutocompleteChange = (event, selectedOption) => {
        onValUpdate(index, event)
      };

      return (
        <tr key={index}>
          <td>
            <Autocomplete
              id="customerName"
              disableClearable
              onChange={(event, selectedOption) => handleAutocompleteChange(event, selectedOption)}
              options={allIngredientsNames || []}
              value={name}
              name='name'
              sx={{ width: 200 }}
              getOptionLabel={(option) => option.toString()}
              isOptionEqualToValue={(option, value) =>
                option === value.ingredientsName
              }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      type: 'search',
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
                value={quantity}
                onChange={(event) => onValUpdate(index, event)}
                name="quantity"
               />
          </td>
          <td>
             <TextField 
                disabled
                value={unit}
                onChange={(event) => onValUpdate(index, event)}
                name="unit"
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
          <td>
            <button
              className="btn btn-danger"
              onClick={() => tableRowRemove(index)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  }
  

export default function Menu(props) {
  const navigate = useNavigate()
  const { user_ID } = useStateContext();
  const fixedOptions = [];
  const [rows, initRow] = useState([]);
  const id = props.Data?.id ?? null
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState(null)
  const [cost, setCost] = useState("")
  const [ingredients, setIngredients] = useState([])
  const [ingredientsFilter, setIngredientsFilter] = useState([])
  const [category, setCategory] = useState([])
  const [menuTab, setMenuTab] = useState([])
  const [value, setValue] = useState([...fixedOptions]);
  const [menu, setMenu] = useState({
    id: "",
    restaurant_id: "",
    name: "",
    price: "",
    preparation_time: "",
    status: "",
    menutab_id: "",
    menutab: "",
    category: "",
    // category_name: "",
    image: null,
    created_by: user_ID,
    ingredients: []
  })

  const addRowTable = () => {
    const data = {
      name: "",
      quantity: "",
      unit: "",
      price: ""
    };
    initRow([...rows, data]);
  };

  const tableRowRemove = (index) => {
    const dataRow = [...rows];
    dataRow.splice(index, 1);
    initRow(dataRow);
    setMenu({
      ...menu,
      ingredients: dataRow
    })
  };
  
  const onValUpdate = (i, event) => {
    let name, value;
    const liElement = event.target;
    const values = liElement.getAttribute('value');
    const filteredIngredients = ingredientsFilter.filter(ingredient => ingredient.name === values);
    
    if (event.target.getAttribute('name') === 'name')  {
      name = ['name', 'unit'];
      value = [event.target.getAttribute('value'), filteredIngredients[0].unit];
      setCost(filteredIngredients[0].cost)
    } else if (event.target.name === 'quantity') {
      name = [event.target.name, 'price'];
      value = [event.target.value, event.target.value * cost];
    } 
    
    const data = [...rows];
    for (let j = 0; j < name.length; j++) {
      data[i][name[j]] = value[j];
    }
    initRow(data);
 
    setMenu({
      ...menu,
      ingredients: data
    })
  };

  const onImageChoose = (ev) => {
    const file = ev.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      setMenu({
        ...menu,
        image: reader.result,
      })
    }
    reader.readAsDataURL(file)
  }
 
  const handleChangePrep= (event, newValue) => {
    setMenu({
        ...menu,
        preparation_time: newValue?.time
    })
  }

  const handleChangeStatus = (event, newValue) => {
    setMenu({
        ...menu,
        status: newValue?.status
    })
  }

  const handleChangeMenuTab = (event, newValue) => {
    setMenu({
        ...menu,
        menutab_id: newValue?.id,
        menutab: newValue?.name
    })
  }

  const handleChangeCategory = (event, newValue) => {
    const extractedValues = newValue.map(option => ({
      id: option.id,
      name: option.name
    }));

    setValue([
      ...fixedOptions,
      ...newValue.filter((option) => fixedOptions.indexOf(option) === -1)
    ])
    setMenu({
      ...menu,
      category: [
        ...fixedOptions,
        ...extractedValues.filter((option) =>
          fixedOptions.findIndex((fixedOption) => fixedOption.id === option.id) === -1
        )
      ]
    })
  }

  const getIngredients = async () => {
    try {
      const response = await axiosClient.get(`/web/ingredients/${user_ID}`);
      const { data } = response.data;
      setIngredientsFilter(data);
      const ingredientsName = data.map(item => ({ ingredientsName: item.name }));
      setIngredients(ingredientsName);
      // initRow({...rows, IngredientsName: ingredientsName});
      
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  }

  const getCategory = async () => {
    try {
      const response = await axiosClient.get(`/web/category/${user_ID}`);
      const { data } = response.data;
      setCategory(data);
      
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  }

  const getMenuTab = async () => {
    try {
      const response = await axiosClient.get(`/web/menutab/${user_ID}`);
      const { data } = response.data;
      setMenuTab(data);
      
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  }
 
  const onSubmit = async (ev) => {
    ev.preventDefault()
    setIsSubmitting(true);
    setErrors(null)
    const payload = {...menu}

    try {
        const response = id
        ? await axiosClient.put(`/web/menu/${id}`, payload)
        : await axiosClient.post('/web/menu', payload);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text:  'Your data has been successfully saved!',
        }).then(() => {
            setIsSubmitting(false);
            navigate('/Menu', { state: 'success' });
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
      setMenu({
          ...props.Data,
          ingredients: props.Data.ingredients_array,
          created_by: user_ID,
      });
      initRow(props.Data.ingredients_array);
      setValue(props.Data.category);
    } else if (!props.show) {
      setMenu({
          ...menu,
          id: "",
          restaurant_id: "",
          name: "",
          price: "",
          preparation_time: "",
          status: "",
          menutab_id: "",
          menutab: "",
          category: "",
          // category_name: "",
          image: null,
          created_by: user_ID,
          ingredients: []
      });
      setValue([
        ...fixedOptions
      ])
      initRow([])
      setErrors(null);
    } else if (props.show){
      getIngredients()
      getCategory()
      getMenuTab()
    }
  }, [id, props.show]);

  return (
    <div id="MenuModal">
        <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Menu</Modal.Title>
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
                                required
                                type="text" 
                                value={menu.name} 
                                onChange={ev => setMenu({...menu, name: ev.target.value})} 
                                label="Name" 
                                variant="outlined" 
                                fullWidth
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <TextField 
                                required
                                type="number" 
                                value={menu.price} 
                                onChange={ev => setMenu({...menu, price: ev.target.value})} 
                                label="Price" 
                                variant="outlined" 
                                fullWidth
                            />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Row>
                        <Col xs={12} md={6}>
                            <Autocomplete
                                required
                                disableClearable
                                value={ menu.preparation_time}
                                options={Minutes.RECORDS}
                                onChange={handleChangePrep}
                                getOptionLabel={(options) => options.time ? options.time.toString() : menu.preparation_time}
                                isOptionEqualToValue={(option, value) => option.time ?? "" === menu.preparation_time}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    required
                                    label="Preparation Time"
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                    }}
                                    />
                                )}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <Autocomplete
                                disableClearable
                                value={ menu.status}
                                options={Status.RECORDS}
                                onChange={handleChangeStatus}
                                getOptionLabel={(options) => options.status ? options.status.toString() : menu.status}
                                isOptionEqualToValue={(option, value) => option.status ?? "" === menu.status}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    required
                                    label="Status"
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
                        <Col xs={12} md={6}>
                            <Autocomplete
                                disableClearable
                                value={ menu.menutab }
                                options={ menuTab }
                                onChange={handleChangeMenuTab}
                                getOptionLabel={(options) => options.name ? options.name.toString() : menu.menutab}
                                isOptionEqualToValue={(option, value) => option.name ?? "" === menu.menutab}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    required
                                    label="Menu Tab"
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                    }}
                                    />
                                )}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <Autocomplete
                              required
                              multiple
                              value={value}
                              onChange={handleChangeCategory } 
                              options={category}
                              getOptionLabel={(option) => option.name}
                              isOptionEqualToValue={(option, value) => option.name === value.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  required={value.length === 0}
                                  label="Category"
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
                          <Card raised >
                              <CardMedia 
                                  image={menu.image != null ? menu.image : NoImage}
                                  component="img"
                                  height="200"
                                  alt={"alt"}
                                  title={"notification"}
                                  sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}/>
                          </Card>
                      </Col>
                      <Col xs={12} md={12} className="mt-2">
                        <input 
                          accept=".jpg, .jpeg, .png" 
                          className="fileUpload" 
                          name="arquivo" 
                          id="arquivo" 
                          type="file" 
                          onChange={onImageChoose} 
                        />
                      </Col>
                  </Row>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Row>
                        <Col xs={12} md={12}>
                          <Modal.Title>Ingredients</Modal.Title>
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Unit</th> 
                                <th>price</th> 
                                <th>
                                
                                </th> 
                              </tr>
                            </thead>
                            <tbody>
                              <TableRows
                                rows={rows}
                                data={ingredients}
                                tableRowRemove={tableRowRemove}
                                onValUpdate={onValUpdate}
                              />
                            </tbody>
                          </table>
                          <button 
                            className="btn btn-primary" 
                            onClick={(event) => {
                              event.preventDefault();
                              addRowTable();
                            }}
                          >
                            Insert Row
                          </button>
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Row >
                    <Col xs={12} md={6}>
                      <Button 
                      variant="contained" 
                      disabled={isSubmitting} 
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