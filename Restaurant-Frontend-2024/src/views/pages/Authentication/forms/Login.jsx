import React, { Component, useState } from "react";
import {Route, NavLink, Navigate } from "react-router-dom";
import "../../../../assets/css/LoginForm.css";
import { Grid, TextField, Typography } from "@mui/material";
import { Form } from "react-bootstrap";
import Button from '@mui/material/Button';
import axiosClient from "../../../../configs/axiosClient";
import { useStateContext } from "../../../../contexts/ContextProvider";
import Swal from 'sweetalert2'

export default function Login() {
  const { setToken, setRole, setUser_ID, setPermission } = useStateContext();
  const [errors, setErrors] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState({
      email: "",
      password: ""
  })

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setIsSubmitting(true);
    setErrors(null)

    const payload = {...user}

    try {
      const { data } = await axiosClient.post('/login', payload);

      Swal.fire({
          icon: 'success',
          title: 'Login Successfully',
      }).then(() => {
        setToken(data.token);
        setRole(data.role);
        setUser_ID(data.user_ID);
        setPermission(data.permission);
        setIsSubmitting(false);
        Navigate('/');
      });
    } catch (err) {
        const response = err.response;
        if (response.status === 422) {
            setIsSubmitting(false);
            setErrors(response.data.errors);
        }
    }
 
  }

  return ( 
        <div className="App">
          <div className="appAside" />
          <div className="appForm"> 
          
          <Form onSubmit={onSubmit}>
            <Grid>
              <Typography className="LoginTitle" variant="h4" fontWeight="bold" mb={5} align="center">
                Login to continue
              </Typography> 
              {errors && 
                <div className="sevices_logo_errors">
                {Object.keys(errors).map(key => (
                    <p key={key}>{errors[key][0]}</p>
                ))}
                </div>
              }
              <TextField
                required
                type="email" 
                onChange={ev => setUser({...user, email: ev.target.value})} 
                label="Email" 
                variant="outlined" 
                fullWidth
                className="mb-3"
              />
              <TextField
                required
                type="password"  
                onChange={ev => setUser({...user, password: ev.target.value})} 
                label="Password" 
                variant="outlined" 
                fullWidth
              />
              <a href="/forgot_password">Forgot Password?</a>
            </Grid>
            <Grid className="mt-4">
              <Button
              variant="contained" 
              disabled={isSubmitting} 
              size="large" 
              color="success" 
              type="submit" 
              fullWidth
              >
                  Submit
              </Button>
            </Grid>
          </Form>
          </div>
        </div>
       
  )
}
