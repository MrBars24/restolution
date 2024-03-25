import { Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Form, Modal, Row } from 'react-bootstrap'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { useStateContext } from '../../../contexts/ContextProvider'
import dayjs from 'dayjs';
import axiosClient from '../../../configs/axiosClient'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

export default function Reservation(props) {
    const { user_ID } = useStateContext();
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const id = props.Data?.id ?? null
    const [reservation, setReservation] = useState({
        id: null,
        restaurant_id: "",
        table_number: "",
        date: "",
        time: "",
        number_of_guest: "",
        guest_name: "",
        notes: "",
        created_by: user_ID,
    });

    const handleChangeDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        const convertedDate = `${year}/${month}/${day}`;
    
        setReservation({
          ...reservation,
          date: convertedDate,
        })
    }

    const handleChangeTime = (time) => {
        const selectedTime = time.$d;
        const formattedTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setReservation({
          ...reservation,
          time: formattedTime,
        })
    }

    const onSubmit = async (ev) => {
        ev.preventDefault()
        setErrors(null)
        const payload = {...reservation}

        try {
            const response = id
            ? await axiosClient.put(`/web/reservation/${id}`, payload)
            : await axiosClient.post('/web/reservation', payload);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text:  'Your data has been successfully saved!',
            }).then(() => {
                setIsSubmitting(false);
                navigate('/Reservation', { state: 'success' });
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
            setReservation({
                ...props.Data,
                created_by: user_ID,
            });
        }

        if (!props.show) {
            setReservation({
                ...reservation,
                id: null,
                restaurant_id: "",
                table_number: "",
                date: "",
                time: "",
                number_of_guest: "",
                guest_name: "",
                notes: "",
                created_by: user_ID,
            });
          }
    }, [id, props.show]);

  return (
    <div id="ReservationModal">
        <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
            <Modal.Header closeButton>
            <Modal.Title>Reservation</Modal.Title>
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
                                type="number" 
                                value={reservation.table_number} 
                                onChange={ev => setReservation({...reservation, table_number: ev.target.value})} 
                                label="Table Number" 
                                variant="outlined" 
                                fullWidth
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DatePicker 
                                slotProps={{
                                    textField: {
                                        required: true,
                                    },
                                }}
                                required
                                disablePast
                                value={reservation.date ? dayjs(reservation.date) : null}
                                className='datePicker' 
                                label="Date"
                                onChange={handleChangeDate}
                                />
                            </LocalizationProvider>
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Row>
                    <Col xs={12} md={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['TimePicker']}>
                                <TimePicker
                                slotProps={{
                                    textField: {
                                        required: true,
                                    },
                                }}
                                className='TimePicker' 
                                label="Time"
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock,
                                }}
                                value={reservation.time ? dayjs(reservation.time, 'h:mm A') : null}
                                onChange={handleChangeTime}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Col>
                    <Col xs={12} md={6}> 
                        <TextField
                            required
                            type="number" 
                            value={reservation.number_of_guest} 
                            onChange={ev => setReservation({...reservation, number_of_guest: ev.target.value})} 
                            label="Number of Guest" 
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
                            required
                            type="text" 
                            value={reservation.guest_name} 
                            onChange={ev => setReservation({...reservation, guest_name: ev.target.value})} 
                            label="Guest Name" 
                            variant="outlined" 
                            fullWidth
                        />
                    </Col>
                    <Col xs={12} md={6}>
                        <TextField
                            type="text" 
                            value={reservation.notes} 
                            onChange={ev => setReservation({...reservation, notes: ev.target.value})} 
                            label="Notes" 
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
