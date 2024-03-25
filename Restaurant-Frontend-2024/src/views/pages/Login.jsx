import React, { useState } from 'react'
import '../../assets/css/login.css'
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ButtonElec from '../../ui-component/Button/ButtonElec';
import ButtonLight from '../../ui-component/Button/ButtonLight';
import Swal from 'sweetalert2'
import axiosClient from '../../configs/axiosClient';
import { useStateContext } from '../../contexts/ContextProvider';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { setToken, setRole, setUser_ID, setPermission } = useStateContext();
  const [user, setUser] = useState({
    email: "",
    password: "",
})

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    // setSpinner(true);
    // setErrors(null);
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
            // setIsSubmitting(false);
            // navigate('/User', { state: 'success' });
        });
    } catch (err) {
        // const response = err.response;
        // if (response.status === 422) {
        //     setIsSubmitting(false);
        //     setErrors(response.data.errors);
        // }
    }
  
}

  return (
    <div id='login' className="center-container">
      <form className="form" onSubmit={onSubmit} >
        <div className="flex-column">
          <label>Email </label>
        </div>
        <div className="inputForm">
          <EmailIcon />
          <input 
            type="email" 
            className="input" 
            placeholder="Enter your Email"
            onChange={ev => setUser({...user, email: ev.target.value})} 
          />
        </div>
        <div className="flex-column">
          <label>Password </label>
        </div>
        <div className="inputForm">
          <LockIcon />
          <input 
            type={showPassword ? 'text' : 'password'}
            className="input" 
            placeholder="Enter your Password"
            onChange={ev => setUser({...user, password: ev.target.value})} 
          />
          {showPassword ? (
              <VisibilityOffIcon className='visibilityIcon' onClick={togglePasswordVisibility} />
            ) : (
              <VisibilityIcon className='visibilityIcon' onClick={togglePasswordVisibility} />
            )}
        </div>

        <div className="flex-row">
          <span className="span">Forgot password?</span>
        </div>
        <ButtonLight />
      </form>
    </div>
  
  )
}
