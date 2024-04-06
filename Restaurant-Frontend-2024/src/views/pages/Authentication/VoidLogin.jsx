import React, { useEffect, useState } from 'react'
import { Button, TextField } from '@mui/material'
import { Col, Form, Modal, Row } from 'react-bootstrap'
import Swal from 'sweetalert2'
import '../../../assets/css/VoidLogin.css'
import axiosClient from '../../../configs/axiosClient'

export default function VoidLogin(props) {
    const [errors, setErrors] = useState(null)
    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const onSubmit = async (ev) => {
        ev.preventDefault()
        setErrors(null)
        const payload = {...user}

        try {
            let data = await axiosClient.post('/web/void', payload);

            if ("data" in data.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text:  'Your data has been successfully saved!',
                }).then(() => {
                    props.onVoid('success', data.data.data);
                    props.close(true)
                });
            }
        } catch (err) {
            const response = err.response;
            if (response.status === 422) {
                setErrors(response.data.errors);
            }
        }
    }

  return (
    <div id="VoidLogin">
            <Modal className='blur-background' centered show={props.show} onHide={props.close} backdrop="static" size="l" >
                <Modal.Header closeButton />
                <Modal.Body className="modal-main">
                    <Form onSubmit={onSubmit}>
                        <p className="form-title">Sign-in Manager account</p>
                        {errors &&
                            <div className="sevices_logo_errors">
                                <p>{errors}</p>
                            </div>
                        }
                            <TextField
                                type="email"
                                value={user.email}
                                onChange={ev => setUser({...user, email: ev.target.value})}
                                label="Email"
                                variant="outlined"
                                fullWidth
                                className='mb-2'
                            />
                         <TextField
                                type="password"
                                value={user.password}
                                onChange={ev => setUser({...user, password: ev.target.value})}
                                label="Password"
                                variant="outlined"
                                fullWidth
                                className='mb-2'
                            />
                            <Button
                            fullWidth
                            variant="contained"
                            // disabled={isSubmitting}
                            size="large"
                            color="primary"
                            type="submit"
                            >
                                Login
                            </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
  )
}
