import { Autocomplete, Button, Card, CardMedia, IconButton, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Form, Modal, Row } from 'react-bootstrap'
import NoImage from '../../../assets/images/Image_not_available.png'
import axiosClient from '../../../configs/axiosClient'
import { useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useStateContext } from '../../../contexts/ContextProvider'
import Province from '../../../data/location/refProvince.json'
import City from '../../../data/location/refCityMun.json'
import Barangay from '../../../data/location/refBrgy.json'
import PublicIcon from '@mui/icons-material/Public';
import MapsModal from '../Maps/MapsModal'

export default function Restaurant(props) {
    const navigate = useNavigate()
    const location = useLocation()
    const [showModal, setShowModal] = useState(false)
    const {user_ID, role} = useStateContext()
    const id = props.Data?.id ?? null
    const [isSubmitting, setIsSubmitting] = useState(false);
    const longi = localStorage.longi ?? ''
    const lati = localStorage.lati ?? ''    
    const [errors, setErrors] = useState(null)
    const [corporate, setCorporate] = useState([]); 
    const [municipality, setMunicipality] = useState([])
    const [brgy, setBrgy] = useState([])
    const [valCityMun, setValCityMun] = useState(null);
    const [valBrgy, setValBrgy] = useState(null);
    const [restaurant, setRestaurant] = useState({
        id: "",
        name: "",
        table_number: "",
        province: "",
        municipality: "",
        municipality_code: "",
        barangay: "",
        house_number: "",
        longitude: null,
        latitude: null,
        logo: "",
        corporate_account: user_ID,
        corporate_name: "",
        created_by: user_ID
    })

    const handleChangeProvince = (event, newValue) => {
        const filterCity = City.RECORDS.filter((data) => data.provCode === newValue.provCode)
        setMunicipality(filterCity)
        setValCityMun(null);
        setValBrgy(null);
        setRestaurant({
          ...restaurant,
          province: newValue.provDesc,
          municipality: null,
          municipality_code: null,
          barangay: null,
        })
      }

      const handleChangeMunicipality = (event, newValue) => {
        setValCityMun(newValue);
        const filterBrgy = Barangay.RECORDS.filter((data) => data.citymunCode === newValue.citymunCode)
        setBrgy(filterBrgy) 
        setValBrgy(null);
        setRestaurant({
          ...restaurant,
          municipality: newValue.citymunDesc,
          municipality_code: newValue.citymunCode,
          barangay: null,
        })
      }

      const handleChangeBrgy = (event, newValue) => {
        setValBrgy(newValue)
        setRestaurant({
          ...restaurant,
          barangay: newValue.brgyDesc,
        })
      }

    const onSubmit = async (ev) => {
        ev.preventDefault()
        setErrors(null)
        setIsSubmitting(true);
        const payload = {...restaurant}
        console.log(payload)
        try {
            const response = id
            ? await axiosClient.put(`/web/restaurant/${id}`, payload)
            : await axiosClient.post('/web/restaurant', payload);

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text:  'Your data has been successfully saved!',
            }).then(() => {
                setIsSubmitting(false);
                navigate('/Restaurant', { state: 'success' });
            });
        } catch (err) {
            const response = err.response;
            if (response.status === 422) {
                if (response.data.errors['restriction']) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'You reached your limit, Please contact RamCap for support.',
                  })
                } else {
                  setIsSubmitting(false);
                  setErrors(response.data.errors);
                }
            }
        }
      }

      const optionsProvince = Province.RECORDS.map((option) => {
        const firstLetter = option.provDesc[0].toUpperCase();
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          ...option,
        };
      })

      const optionsCityMun = municipality.map((option) => {
        const firstLetter = option.citymunDesc[0].toUpperCase();
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          ...option,
        };
      })

      const optionsBarangay = brgy.map((option) => {
        const firstLetter = option.brgyDesc[0].toUpperCase();
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          ...option,
        };
      })

      const onImageChoose = (ev) => {
        const file = ev.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 200; // Set the desired width
                canvas.height = (img.height / img.width) * canvas.width; // Maintain aspect ratio
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    const compressedReader = new FileReader();
                    compressedReader.onload = () => {
                        setRestaurant({
                            ...restaurant,
                            logo: compressedReader.result,
                        });
                    };
                    compressedReader.readAsDataURL(blob);
                }, 'image/jpeg', 0.7); // Adjust the quality as needed
            };
        };
        reader.readAsDataURL(file);
      }

      const handleChangeCorporate = (event, newValue) => {
        setRestaurant({
          ...restaurant,
          corporate_name: newValue.first_name,
          corporate_account: newValue.id,
        })
      }

      const onclickMap = (ev) => {
        setShowModal(true)
      }

      const handleClose = () => {
        setShowModal(false)
        // setServicesInfo([])
      }

      const getCorporate = async () => {
        try {
          const { data } = await axiosClient.get(`/web/corporate_account/${user_ID}`)
          setCorporate(data.data)
        } catch (error) {
    
        }
      }

      useEffect(() => {
        if (id) {
          setRestaurant({
            ...props.Data,
            created_by: user_ID
          });
        } else if (!props.show) {
          setRestaurant({
            ...restaurant,
            id: "",
            name: "",
            table_number: "",
            province: "",
            municipality: "",
            municipality_code: "",
            barangay: "",
            house_number: "",
            longitude: "",
            latitude: "",
            logo: "",
            corporate_account: user_ID,
            corporate_name: "",
          });
          setErrors(null);
        } else if (role == 1) {
          getCorporate()
        } 
      }, [id, props.show, role]);

      useEffect(() => {
        if (location.state == 'coordinates'){
          setRestaurant({
            ...restaurant,
            longitude: longi,
            latitude: lati,
          })
          setShowModal(false)
          location.state = null
        }
      },[location.state])

  return (
    <div id="MenuModal">
        <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
            <Modal.Header closeButton>
            <Modal.Title>Restaurant</Modal.Title>
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
                                value={restaurant.name} 
                                onChange={ev => setRestaurant({...restaurant, name: ev.target.value})} 
                                label="Name" 
                                variant="outlined" 
                                fullWidth
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <TextField 
                                required
                                type="text" 
                                value={restaurant.table_number} 
                                onChange={ev => setRestaurant({...restaurant, table_number: ev.target.value})} 
                                label="Total number of table" 
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
                        value={restaurant.house_number} 
                        onChange={ev => setRestaurant({...restaurant, house_number: ev.target.value})} 
                        id="street" 
                        label="House Number / Street" 
                        variant="outlined" 
                        fullWidth
                      />
                    </Col>
                    <Col xs={12} md={6}> 
                      <Autocomplete
                        disableClearable
                        onChange={handleChangeProvince}
                        options={optionsProvince.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                        value={restaurant.province ?? ""}
                        getOptionLabel={(options) => options.provDesc ? options.provDesc.toString() : restaurant.province}  
                        isOptionEqualToValue={(option, value) => option.provDesc ?? ""  === restaurant.province  }
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            required
                            label="Province"
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
                        onChange={handleChangeMunicipality}
                        options={optionsCityMun.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                        value={restaurant.municipality ?? valCityMun  }
                        getOptionLabel={(options) =>  options.citymunDesc ? options.citymunDesc.toString() : restaurant.municipality}  
                        isOptionEqualToValue={(option, value) => option.citymunDesc ?? "" === restaurant.municipality}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            label="Municipality"
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
                        onChange={handleChangeBrgy}
                        options={optionsBarangay.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                        value={restaurant.barangay ?? valBrgy}
                        getOptionLabel={(options) => options.brgyDesc ? options.brgyDesc.toString() : restaurant.barangay}
                        isOptionEqualToValue={(option, value) => option.brgyDesc ?? "" === restaurant.barangay}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            label="Barangay"
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
                      <TextField 
                        // required
                        type="text" 
                        id="longitude" 
                        label="Longitude" 
                        value={restaurant.longitude} 
                        variant="outlined" 
                        fullWidth
                      />
                    </Col>
                    <Col xs={12} md={5}> 
                      <TextField 
                        // required
                        type="text" 
                        id="latitude" 
                        label="Latitude" 
                        value={restaurant.latitude}  
                        variant="outlined" 
                        fullWidth
                      />
                    </Col>
                    <Col xs={12} md={1} className="d-flex align-items-center"> 
                        <IconButton className="globe-icon" onClick={onclickMap}>
                          <PublicIcon />
                        </IconButton>
                    </Col>
                  </Row>
                </Form.Group>
                { role == 1 && 
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Row>
                      <Col xs={12} md={6}>
                      <Autocomplete
                          disableClearable
                          onChange={handleChangeCorporate}
                          options={corporate}
                          value={restaurant.corporate_name}
                          getOptionLabel={(options) => options.first_name ? options.first_name.toString() : restaurant.corporate_name}  
                          isOptionEqualToValue={(option, value) => option.first_name ?? ""  === restaurant.corporate_name  }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Corporate Account"
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
                }
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Row>
                        <Col xs={12} md={6}>
                        <input 
                            accept=".jpg, .jpeg, .png" 
                            className="fileUpload" 
                            name="arquivo" 
                            id="arquivo" 
                            type="file" 
                            onChange={onImageChoose} 
                        />
                        </Col>  
                        <Col xs={12} md={6}>
                            <Card raised >
                                <CardMedia 
                                    image={restaurant.logo != "" ? restaurant.logo : NoImage}
                                    component="img"
                                    height="200"
                                    alt={"alt"}
                                    title={"notification"}
                                    sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
                                />
                            </Card>
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

        <MapsModal show={showModal} close={handleClose} id={1} /> 
    </div>
  )
}
