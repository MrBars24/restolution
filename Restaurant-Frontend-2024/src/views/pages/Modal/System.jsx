import React, { useEffect, useState } from 'react'
import { Autocomplete, Button, TextField } from '@mui/material'
import { Col, Form, Modal, Row } from 'react-bootstrap'
import axiosClient from '../../../configs/axiosClient'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import Unit from '../../../data/refUnit.json'
import { useStateContext } from '../../../contexts/ContextProvider'

export default function System(props) {
    const { user_ID } = useStateContext();
    const navigate = useNavigate()
    const id = props.Data?.id ?? null
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState(null)
    const [inventory, setInventory] = useState({
        id: "",
        restaurant_id: "",
        name: "",
        quantity: "",
        unit: "",
        unit_cost: "",
        total_cost: "",
        created_by: user_ID
    })

    const handleUnit = (event, newValue) => {
        setInventory({
            ...inventory,
            unit: newValue?.unit
        })
    }

    const handleQuantity = (event) => {
        setInventory({
            ...inventory,
            quantity: event.target.value,
            total_cost: event.target.value * inventory.unit_cost
        })
    }

    const handleUnitCost = (event) => {
        setInventory({
            ...inventory,
            unit_cost: event.target.value,
            total_cost: event.target.value * inventory.quantity
        })
      }

    const onSubmit = async (ev) => {
        ev.preventDefault()
        setIsSubmitting(true);
        const payload = {...inventory}

        try {
            const response = id
            ? await axiosClient.put(`/web/system_inventory/${id}`, payload)
            : await axiosClient.post('/web/system_inventory', payload);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text:  'Your data has been successfully saved!',
            }).then(() => {
                setIsSubmitting(false);
                navigate('/System', { state: 'success' });
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
            setInventory({
                ...props.Data,
                created_by: user_ID
            });
        } else if (!props.show) {
            setInventory({
                ...inventory,
                id: "",
                restaurant_id: "",
                name: "",
                quantity: "",
                unit: "",
                unit_cost: "",
                total_cost: "",
                created_by: user_ID
            });
            setErrors(null);
        }
    }, [id, props.show]);

  return (
    <div id="SystemModal">
            <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
                <Modal.Header closeButton>
                <Modal.Title>System Inventory</Modal.Title>
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
                                        type="text" 
                                        value={inventory.name} 
                                        onChange={ev => setInventory({...inventory, name: ev.target.value})} 
                                        label="Name" 
                                        variant="outlined" 
                                        fullWidth
                                    />
                                </Col>
                                <Col xs={12} md={6}>
                                    <TextField
                                        type="number" 
                                        value={inventory.quantity} 
                                        onChange={handleQuantity} 
                                        label="Quantity" 
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
                                        disableClearable
                                        value={ inventory.unit}
                                        options={Unit.RECORDS}
                                        onChange={handleUnit}
                                        getOptionLabel={(options) => options.unit? options.unit.toString() : inventory.unit}
                                        isOptionEqualToValue={(option, value) => option.unit ?? "" === inventory.unit}
                                        renderInput={(params) => (
                                            <TextField
                                            {...params}
                                            label="Unit"
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
                                        type="number" 
                                        value={inventory.unit_cost} 
                                        onChange={handleUnitCost} 
                                        label="Unit Cost" 
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
                                        type="text" 
                                        value={inventory.total_cost} 
                                        onChange={ev => setInventory({...inventory, total_cost: ev.target.value})} 
                                        label="Total Cost" 
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
