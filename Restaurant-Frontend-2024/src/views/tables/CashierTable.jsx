import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Autocomplete, Button, TextField } from '@mui/material'
import VoidLogin from '../pages/Authentication/VoidLogin';
import axiosClient from '../../configs/axiosClient';
import Swal from 'sweetalert2'

export default function CashierTable({ rows, data, menus, tableRowRemove, onValUpdate, onHide }) {
  const rowNames = rows.map((row) => row.name);
  const filteredIngredientsNames = menus.map((item) => item.MenuName);
  const filteredMenus = menus.filter((menu) => rowNames.includes(menu.menuname));
  const allIngredientsNames = filteredIngredientsNames.filter((ingredient) => !rowNames.includes(ingredient));

  let subTotal = 0;
  const [voucher, setVoucher] = useState()
  const [special, setSpecial] = useState()
  const navigate = useNavigate()
  const [voucherAmount, setVoucherAmount] = useState()
  const [specialAmount, setSpecialAmount] = useState()
  const [total, setTotal] = useState()
  const [vat, setVat] = useState()
  const [vatable, setVatable] = useState()
  const [hide, setHide] = useState(false)
  const [hidden, setHidden] = useState(true)

  const handleVoid = (ev) => {
    ev.preventDefault()

    setShowModal(true)
    
  }

  const onVoid = (ev) => {
    if (ev === 'success') {
      setHide(true)
      setHidden(false)
      onHide(false)
    }
  }

  const handleUpdate = async (ev) => {
    ev.preventDefault()
   
    const payload = {...data}

    try {
      await axiosClient.put('/web/cashier_update', payload);

      Swal.fire({
          icon: 'success',
          title: 'Success',
          text:  'Your data has been successfully saved!',
      }).then(() => {
        setHide(false)
        setHidden(true)
        onHide(true)
      });
    } catch (err) {
        const response = err.response;
        if (response.status === 422) {
            console.log(response.data.errors);
        }
    }

  }

  const handleVoucher = async (ev) => {
    ev.preventDefault()
    try {
      const payload = {...data, voucher: voucher}

      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1b5e20',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, apply it!'
      }).then((result) => {
        if (result.isConfirmed) {
          axiosClient.put(`/web/cashier_voucher/${data.id}`, payload)
            .then((response) => {
              // Handle the Axios response here
              const item = response.data.data;
              
              setVoucherAmount(item.discount_amount.toFixed(2));
              setTotal((item.total_amount - item.discount_amount).toFixed(2));
              setVat(item.vat.toFixed(2));
              setVatable(item.vatable.toFixed(2));
      
              Swal.fire(
                'Save!',
                'Your voucher has been applied.',
                'success'
              );
              navigate('/Cashier', { state: 'success' });
            })
            .catch((error) => {
              console.error(error); // Handle any errors here
            });
        }
      });
    } catch (err) {
        const response = err.response;
        if (response.status === 422) {
            setIsSubmitting(false);
            setErrors(response.data.errors);
        }
    }
  }

  const handleSpecial = async (ev) => {
    ev.preventDefault()
    
    try {
      const payload = {...data, special: special}

      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1b5e20',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, apply it!'
      }).then((result) => {
        if (result.isConfirmed) {
          axiosClient.put(`/web/cashier_special`, payload)
            .then((response) => {
              // Handle the Axios response here
              const item = response.data.data;
              const discount = parseInt(item.discount_amount);
              const special = parseInt(item.special_discount_amount); 

              setSpecialAmount(item.special_discount_amount.toFixed(2));
              setTotal((item.total_amount - (discount + special)).toFixed(2));
              setVat(item.vat.toFixed(2));
              setVatable(item.vatable.toFixed(2));
      
              Swal.fire(
                'Save!',
                'Your voucher has been applied.',
                'success'
              );
              navigate('/Cashier', { state: 'success' });
            })
            .catch((error) => {
              console.error(error); // Handle any errors here
            });
        }
      });
    } catch (err) {
        const response = err.response;
        if (response.status === 422) {
            setIsSubmitting(false);
            setErrors(response.data.errors);
        }
    }
  }

  
  
  const rowElements = rows.map((rowsData, index) => {
    const  { name, quantity, total, price } = rowsData;

    const handleAutocompleteChange = (event, selectedOption) => {
      // setDisabled(false)
      onValUpdate(index, event)
    };
    
    const rowNumber = index + 1;
    subTotal += quantity * price;
    return (
      <tr key={index}>
         <td style={{ verticalAlign: 'middle' }}>
          {rowNumber}
        </td>
        <td>
          <Autocomplete
            disabled={hidden}
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
              disabled={hidden}
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
              value={price}
              onChange={(event) => onValUpdate(index, event)}
              name="price"
              variant="outlined" 
             />
        </td>
        <td>
           <TextField 
              disabled
              value={quantity * price} 
              onChange={(event) => onValUpdate(index, event)}
              name="Total"
             />
        </td>
         <td hidden={hidden}>
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

  const subTotalRow = (
    <tr key="subtotal">
      <td></td>
      <td style={{ verticalAlign: 'middle' }}><label htmlFor="">Sub Total:</label></td>
      <td></td>
      <td>
        
      </td>
      <td style={{ verticalAlign: 'middle' }}><label htmlFor="">₱{subTotal}</label></td>
    </tr>
  );

  const VoucherRow = (
    <tr key="voucher">
      <td></td>
      <td style={{ verticalAlign: 'middle' }}><label htmlFor="">Voucher Discount:</label></td>
      <td>
        <TextField 
            required
            type="name"
            value={voucher ?? data.voucher_code ?? ''} 
            onChange={(event) => setVoucher(event.target.value)}
            name="name"
        />
      </td>
      <td style={{ verticalAlign: 'middle' }}> 
         <Button 
          onClick={handleVoucher}
          variant="contained"
          size="large" 
          color="success" 
          type="submit" 
          >
            Apply
        </Button>
      </td>
      <td style={{ verticalAlign: 'middle' }}><label htmlFor="">-₱{voucherAmount ?? data.discount_amount}</label></td>
    </tr>
  );

  const SpecialRow = (
    <tr key="special">
      <td></td>
      <td style={{ verticalAlign: 'middle' }}><label htmlFor="">Special Discount:</label></td>
      <td>
        <TextField 
            required
            type="name"
            value={special ?? data.special_code ?? ''}
            onChange={(event) => setSpecial(event.target.value)}
            name="name"
        />
      </td>
      <td style={{ verticalAlign: 'middle' }}> 
        <Button 
          onClick={handleSpecial}
          variant="contained"
          size="large" 
          color="success" 
          type="submit" 
        >
            Apply
        </Button>
      </td>
      <td style={{ verticalAlign: 'middle' }}><label htmlFor="">-₱{specialAmount ?? data.special_discount_amount}</label></td>
    </tr>
  );

  const VatRow = (
    <>
        <tr key="vatable">
            <td></td>
            <td style={{ verticalAlign: 'middle' }}><label htmlFor="">VATable Sales:</label></td>
            <td></td>
            <td></td>
            <td style={{ verticalAlign: 'middle' }}><label htmlFor="">₱{vatable ?? data.vatable}</label></td>
        </tr>
        <tr key="vat">
            <td></td>
            <td style={{ verticalAlign: 'middle' }}><label htmlFor="">VAT</label></td>
            <td></td>
            <td></td>
            <td style={{ verticalAlign: 'middle' }}><label htmlFor="">₱{vat ?? data.vat}</label></td>
        </tr>
        <tr key="total">
            <td></td>
            <td style={{ verticalAlign: 'middle', fontWeight: 'bold' }}><label htmlFor="">Amount Due</label></td>
            <td></td>
            <td></td>
            <td style={{ verticalAlign: 'middle', fontWeight: 'bold' }}><label htmlFor="" style={{color: 'red'}}>₱{total ?? (data.total_amount - data.discount_amount) - data.special_discount_amount}</label></td>
        </tr>
    </>
  );

  const Void = (
    <tr key="void">
      <td></td>
      <td> 
        <Button 
        variant="contained" 
        hidden={hide} 
        onClick={handleVoid}
        size="medium" 
        color="error" 
        type="submit" 
        >
          Void
        </Button>
        <Button 
        variant="contained" 
        hidden={hidden} 
        onClick={handleUpdate}
        size="small" 
        color="success" 
        type="submit" 
        >
          Update
        </Button>
      </td>
      <td>
        
      </td>
      <td></td>
      <td>
       
      </td>
    </tr>
  );
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false)
  }

  return (
    <>
      {rowElements}
      {subTotalRow}
      {VoucherRow}
      {SpecialRow}
      {VatRow}
      {Void}
      {showModal && <VoidLogin show={showModal} onVoid={onVoid} close={handleModalClose} />}
    </>
  )
}
