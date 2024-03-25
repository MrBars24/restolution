import React, { useEffect, useState } from 'react'
import { Button, TextField } from '@mui/material'
import { Col, Form, Modal, Row } from 'react-bootstrap'
import axiosClient from '../../../configs/axiosClient'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useStateContext } from '../../../contexts/ContextProvider'

export default function Tab(props) {
    const { user_ID } = useStateContext();
    const navigate = useNavigate()
    const id = props.Data?.id ?? null
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState(null)
    const [menuTab, setMenuTab] = useState({
        id: "",
        restaurant_id: "",
        name: "",
        created_by: user_ID,
    })

    const onSubmit = async (ev) => {
        ev.preventDefault()
        setIsSubmitting(true);
        const payload = {...menuTab}
        try {
            const response = id
            ? await axiosClient.put(`/web/menutab/${id}`, payload)
            : await axiosClient.post('/web/menutab', payload);

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
            setMenuTab({
                ...menuTab,
                id: props.Data.id,
                restaurant_id: props.Data.restaurant_id,
                name: props.Data.name
            });
        } else if (!props.show) {
          setMenuTab({
            ...menuTab,
            id: "",
            restaurant_id: "",
            name: "",
            created_by: user_ID,
          });
          setErrors(null);
        }
      }, [id, props.show]);

  return (
    <div id="TabModal">
        <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
            <Modal.Header closeButton>
            <Modal.Title>Tabs</Modal.Title>
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
                            <TextField
                                required
                                type="text" 
                                value={menuTab.name} 
                                onChange={ev => setMenuTab({...menuTab, name: ev.target.value})} 
                                label="Name" 
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
