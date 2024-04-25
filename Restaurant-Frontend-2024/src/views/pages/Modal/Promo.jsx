import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Autocomplete, Checkbox, FormControlLabel, Card, CardMedia, TextField, InputAdornment } from '@mui/material';
import PercentIcon from '@mui/icons-material/Percent';
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { DateRangePicker } from '@mui/x-date-pickers-pro'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo'
import { useStateContext } from '../../../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../../configs/axiosClient';

export default function Promo(props) {
    const {user_ID} = useStateContext()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkboxSingleChecked, setCheckboxSingleChecked] = useState(false);
    const [checkboxMultipleChecked, setCheckboxMultipleChecked] = useState(false);
    const [checkboxPercentChecked, setCheckboxPercentChecked] = useState(false);
    const [checkboxAmountChecked, setCheckboxAmountChecked] = useState(false);
    const [checkbox1Checked, setCheckbox1Checked] = useState(false);
    const [checkbox2Checked, setCheckbox2Checked] = useState(false);
    const navigate = useNavigate()
    const id = props.Data?.id ?? null
    const [errors, setErrors] = useState(null);
    const [refID, setRefID] = useState("");
    const fixedOptions = [];
    const [restaurant, setRestaurant] = useState([])
    const [menu, setMenu] = useState([])
    const [value, setValue] = useState([...fixedOptions]);
    const [promo, setPromo] = useState({
      id: null,
      restaurant_id: "",
      restaurant_name: "",
      category: "",
      menu: "",
      datefrom: "",
      dateto: "",
      voucher_name: "",
      voucher_code: "",
      discount_type: "",
      discount_amount: "",
      limit: "",
      refID: "",
      created_by: user_ID,
      updated_by: user_ID,
    })

    const handleCheckboxSingleChange = (event) => {
        const checked = event.target.checked;

        setCheckboxSingleChecked(checked);
        if (checked) {
          setCheckboxMultipleChecked(false);
          setPromo({
              ...promo,
              limit: event.target.value
          })
        }
      };

      const handleCheckboxMultipleChange = (event) => {
        const checked = event.target.checked;

        setCheckboxMultipleChecked(checked);
        if (checked) {
          setCheckboxSingleChecked(false);
          setPromo({
              ...promo,
              limit: event.target.value
          })
        }
      };

      const handleChangeRestaurant = (event, newValue) => {
        setPromo({
            ...promo,
            restaurant_id: newValue.id,
            restaurant_name: newValue.name,
            refID: newValue.refid,
        })
        getMenu(newValue.id)
    };

    const handleChangeMenu = (event, newValue) => {
        const extractedData = newValue.map((option) => ({
            id: option.id,
          name: option.name
        }));

        setValue([...fixedOptions, ...extractedData]);
        setPromo({
          ...promo,
          menu: [...fixedOptions, ...extractedData],
        });
      };

    const handleCheckbox1Change = (event) => {
        const checked = event.target.checked;
        setCheckbox1Checked(checked);
        if (checked) {
          setCheckbox2Checked(false);
          setPromo({
              ...promo,
              category: 'ALL',
              menu: ""
          })
          setValue([
            ...fixedOptions
          ])
        }
      };

      const handleCheckbox2Change = (event) => {
        const checked = event.target.checked;
        setCheckbox2Checked(checked);
        if (checked) {
          setCheckbox1Checked(false);
          setPromo({
            ...promo,
            category: 'SELECTED',
          })
        }
      };

      const handleCheckboxPercentChange = (event) => {
        const checked = event.target.checked;

        setCheckboxPercentChecked(checked);
        if (checked) {
          setCheckboxAmountChecked(false);
          setPromo({
              ...promo,
              discount_type: event.target.value
          })
        }  else {
            setPromo({
                ...promo,
                discount_type: ""
            })
        }
      };

      const handleCheckboxAmountChange = (event) => {
        const checked = event.target.checked;

        setCheckboxAmountChecked(checked);
        if (checked) {
          setCheckboxPercentChecked(false);
          setPromo({
              ...promo,
              discount_type: event.target.value
          })
        } else {
            setPromo({
                ...promo,
                discount_type: ""
            })
        }
      };

    const getMenu = async (id) => {
        try {
            const { data } = await axiosClient.get(`/web/restaurant/menu/${id}`)
            setMenu(data.data)
        } catch (error) {

        }
    }

      const getRestaurant= async () => {
        try {
          const { data } = await axiosClient.get(`/web/restaurant_refid/${user_ID}`);
          let tmp = Array.isArray(data.data) ? data.data : [data.data];
          setRestaurant(tmp);
        //   console.log(data.data.refid)
        } catch (error) {

        }
      }

      const handleChangeDateRangePicker = (date) => {
        if (date[1]) {
          const df = new Date(date[0]);
          const dt = new Date(date[1]);
          const dfyear = df.getFullYear();
          const dtyear = dt.getFullYear();
          const dfmonth = ('0' + (df.getMonth() + 1)).slice(-2);
          const dtmonth = ('0' + (dt.getMonth() + 1)).slice(-2);
          const dfday = ('0' + df.getDate()).slice(-2);
          const dtday = ('0' + dt.getDate()).slice(-2);
          const datefrom = `${dfyear}/${dfmonth}/${dfday}`;
          const dateto = `${dtyear}/${dtmonth}/${dtday}`;

          setPromo({
            ...promo,
              datefrom: datefrom,
              dateto: dateto,
          })
        }
      };

      const onSubmit = async (ev) => {
        ev.preventDefault()
        setIsSubmitting(true);
        setErrors(null)
        const payload = {...promo}

        // console.log(payload)

        try {
            const response = id
            ? await axiosClient.put(`/web/promo/${id}`, payload)
            : await axiosClient.post('/web/promo', payload);

            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: id
                ? 'Your data has been successfully updated!'
                : 'Your data has been successfully saved!',
            }).then(() => {
              setIsSubmitting(false);
              navigate('/Discount', { state: 'success' });
            });
          } catch (err) {
            const response = err.response;
            if (response && response.status === 422) {
              setIsSubmitting(false);
              setErrors(response.data.errors);
            }
          }
      }

    useEffect(() => {
        if (id) {
            setPromo({
              ...props.Data,
              updated_by: user_ID,
            });
            if (props.Data.menu == null) {
                setValue([
                  ...fixedOptions
                ])
              } else {
                getMenu(props.Data.restaurant_id)
                setValue(props.Data.menu)
              }

            if (props.Data.category == "ALL") {
            setCheckbox1Checked(true)
            setCheckbox2Checked(false)
            } else if (props.Data.category == "SELECTED") {
            setCheckbox2Checked(true)
            setCheckbox1Checked(false)
            }

            if (props.Data.limit == "SINGLE") {
            setCheckboxSingleChecked(true)
            setCheckboxMultipleChecked(false)
            } else if (props.Data.limit == "MULTIPLE") {
            setCheckboxMultipleChecked(true)
            setCheckboxSingleChecked(false)
            }

            if (props.Data.discount_type == "PERCENTAGE") {
            setCheckboxPercentChecked(true)
            setCheckboxAmountChecked(false)
            } else if (props.Data.discount_type == "AMOUNT") {
            setCheckboxAmountChecked(true)
            setCheckboxPercentChecked(false)
            }
          } else if (!props.show) {
            setPromo({
            ...promo,
              id: null,
              restaurant_name: "",
              service_center_id: "",
              service_center_name: "",
              category: "",
              services: "",
              datefrom: "",
              dateto: "",
              voucher_name: "",
              voucher_code: "",
              discount_type: "",
              discount_amount: "",
              limit: "",
              created_by: user_ID,
              updated_by: user_ID,
            })
            setValue([
            ...fixedOptions
            ])
            setErrors(null)
            setCheckbox2Checked(false)
            setCheckbox1Checked(false)
            setCheckboxSingleChecked(false)
            setCheckboxMultipleChecked(false)
            setCheckboxPercentChecked(false)
            setCheckboxAmountChecked(false)
        } else if (props.show) {
          getRestaurant()
        }
    }, [id, props.show])

  return (
    <div id="PromoModal">
        <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
        <Modal.Header closeButton>
            <Modal.Title>DIscount</Modal.Title>
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
                    <FormControlLabel
                        value="SINGLE"
                        control={
                        <Checkbox
                            checked={checkboxSingleChecked}
                            onChange={handleCheckboxSingleChange}
                        />
                        }
                        label="SINGLE USE"
                    />
                    </Col>
                    <Col xs={12} md={6}>
                    <FormControlLabel
                        value="MULTIPLE"
                        control={
                        <Checkbox
                            checked={checkboxMultipleChecked}
                            onChange={handleCheckboxMultipleChange}
                        />
                        }
                        label="MULTIPLE USE"
                    />
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Row>
                <Col xs={12} md={12}>
                        <Autocomplete
                            disableClearable
                            value={promo.restaurant_name}
                            options={restaurant}
                            onChange={handleChangeRestaurant}
                            getOptionLabel={(options) => options.name ? options.name.toString() : promo.restaurant_name}
                            isOptionEqualToValue={(option, value) => option.name ?? "" === promo.restaurant_name}
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                required
                                label="Restaurant"
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
                    <FormControlLabel
                        value="ALL_SERVICES"
                        control={
                        <Checkbox
                            checked={checkbox1Checked}
                            onChange={handleCheckbox1Change}
                        />
                        }
                        label="ALL MENU"
                    />
                    </Col>
                    <Col xs={12} md={6}>
                    <FormControlLabel
                        value="CHOOSE_SERVICES"
                        control={
                        <Checkbox
                            checked={checkbox2Checked}
                            onChange={handleCheckbox2Change}
                        />
                        }
                        label="CHOOSE MENU"
                    />
                    </Col>
                </Row>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Row>
                <Col xs={12} md={12}>
                        <Autocomplete
                        disabled={!checkbox2Checked}
                        multiple
                        value={value}
                        onChange={ handleChangeMenu }
                        options={menu}
                        getOptionLabel={(option) =>  option.name}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            required={value.length === 0}
                            label="Select Services"
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
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
                                        <DemoItem label="Date Range" component="DateRangePicker">
                                            <DateRangePicker
                                                slotProps={{
                                                    textField: {
                                                        required: true,
                                                    },
                                                }}
                                                disablePast
                                                value={ [dayjs(promo.datefrom), dayjs(promo.dateto) ] }
                                                onChange={handleChangeDateRangePicker}
                                            />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Col>
                        </Row>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Row>
                    <Col xs={12} md={6}>
                        <TextField
                            required
                            type="text"
                            value={promo.voucher_name}
                            onChange={ev => {
                              const upperCaseValue = ev.target.value.toUpperCase();
                              setPromo({...promo, voucher_name: upperCaseValue, voucher_code: promo.refID + upperCaseValue});
                            }}
                            label="Voucher Name"
                            variant="outlined"
                            fullWidth
                        />
                    </Col>
                    <Col xs={12} md={6}  >
                        <TextField
                            disabled
                            type="text"
                            value={promo.voucher_code}
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
                    <FormControlLabel
                        value="PERCENTAGE"
                        control={
                        <Checkbox
                            checked={checkboxPercentChecked}
                            onChange={handleCheckboxPercentChange}
                        />
                        }
                        label="Percentage ( % )"
                    />
                    </Col>
                    <Col xs={12} md={6}>
                    <FormControlLabel
                        value="AMOUNT"
                        control={
                        <Checkbox
                            checked={checkboxAmountChecked}
                            onChange={handleCheckboxAmountChange}
                        />
                        }
                        label="Fix Amount ( ₱ )"
                    />
                    </Col>
                </Row>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Row>
                <Col xs={12} md={12}>
                    <TextField
                        required
                        type= "number"
                        value={promo.discount_amount}
                        onChange={ev => setPromo({...promo, discount_amount: ev.target.value})}
                        label="Discount Percentage / Amount"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                                {promo.discount_type === 'PERCENTAGE' ? '%' : promo.discount_type === 'AMOUNT' ? '₱' : null}
                                            </InputAdornment>,
                        }}
                    />
                </Col>
            </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Row >
                <Col xs={12} md={12}>
                  <Button
                    variant="success"
                    type="submit"
                    disabled={isSubmitting}
                  >
                  {id ? 'Save Changes' : 'Save'}
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
