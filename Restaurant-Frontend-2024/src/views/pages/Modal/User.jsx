import React, { useEffect, useState } from 'react'
import { Col, Form, Modal, Row } from 'react-bootstrap'
import '../../../assets/css/modal.css'
import { Autocomplete, Button, TextField, Grid, List, Card, CardHeader, ListItem, ListItemText, ListItemIcon, Checkbox, Divider} from '@mui/material'
import  Role from '../../../data/refRole.json'
import  Status from '../../../data/refUserStatus.json'
import  Permission from '../../../data/refPermission.json'
import Swal from 'sweetalert2'
import axiosClient from '../../../configs/axiosClient'
import { useNavigate } from 'react-router-dom'
import { useStateContext } from '../../../contexts/ContextProvider'

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }
  
  function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }
  
  function union(a, b) {
    return [...a, ...not(b, a)];
  }

export default function User(props) {
    const navigate = useNavigate()
    const {user_ID, role} = useStateContext()
    const id = props.Data?.id ?? null
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState(null)
    const [restaurant, setRestaurant] = useState([]); 
    const [user, setUser] = useState({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        status: "",
        role_id: "",
        role: "",
        restaurant_name: "",
        restaurant_id: "",
        corporate_manager_id: "",
        allowed_restaurant: "",
        allowed_bm: "",
        created_by: user_ID,
        updated_by: user_ID,
        user_role: parseInt(role),
        permission: []
    })

    const onSubmit = async (ev) => {
        ev.preventDefault()
        setIsSubmitting(true);
        const payload = {...user}
        
        try {
            const response = id
            ? await axiosClient.put(`/web/users/${id}`, payload)
            : await axiosClient.post('/web/users', payload);

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text:  'Your data has been successfully saved!',
            }).then(() => {
                setIsSubmitting(false);
                navigate('/User', { state: 'success' });
            });
        } catch (err) {
            const response = err.response;
            if (response.status === 422) {
                setIsSubmitting(false);
                setErrors(response.data.errors);
            }
        }
      }
    
    const handleStatus= (event, newValue) => {
        setUser({
            ...user,
            status: newValue?.status
        })
    }

    const handleChangeRestaurant = (event, newValue) => {
        setUser({
            ...user,
            restaurant_id: newValue.id,
            restaurant_name: newValue.name,
            corporate_manager_id: newValue.corporate_account,
        })
    }

    const handleRole= (event, newValue) => {
        // console.log(newValue)
        let updatedUser = { ...user }; 
        if (role == 1) {
            switch (newValue.role) {
                case "Super Admin":
                    updatedUser = {
                        ...updatedUser,
                        corporate_name: "",
                        corporate_account: "",
                        allowed_restaurant: "",
                        allowed_bm: "",
                    };
                    break;
                case "Corporate Account":
                    // setAdminHide(true);
                    break;
                default:
                    getRestaurant()
                    break;
            }
        } else (
          getRestaurant()
        )

        updatedUser = {
            ...updatedUser,
            role: newValue?.role,
            role_id: newValue?.role_id
        };

        setUser(updatedUser);
    }

    const getRestaurant = async () => {
        try {
          const { data } = await axiosClient.get(`/web/restaurant/${user_ID}`)
          setRestaurant(data.data)
        } catch (error) {
    
        }
    }
    
    const optionsRole = Role.RECORDS.filter((option) => {
        if (role == 1) {
            // Condition 1: Show all role_id for role 1
            return true;
        } else if (role == 2) {
            // Condition 2: Show all except role_id 1 and 2 for role 2
            return option.role_id !== "1" && option.role_id !== "2";
        } else {
            // Condition 3: Show role_id 4 and 5 for role 3
            return option.role_id === "4" || option.role_id === "5";
        } 
        }).map((filteredOption) => {
        // Transform the filtered options
        const firstLetter = filteredOption.role[0].toUpperCase();
        return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...filteredOption,
        };
    });

    const options = {
        addRowPosition: "first",
        paging: false, 
        emptyRowsWhenPaging: false, 
        actionsColumnIndex: -1,
        search: false,
        rowStyle: {
          fontSize: 14,
        },
        headerStyle: {
          whiteSpace: 'nowrap',
          flexDirection: 'row',
          overflow: 'hidden',
          backgroundColor: '#8d949e',
          color: '#F1F1F1',
          fontSize: 16,
        },
      };
 
    useEffect(() => {
        if (id) { 
            
          const { id, first_name, last_name, email, status, role_id, restaurant_id, restaurant_name, permission, allowed_restaurant, allowed_bm } = props.Data;
          let role = '';
      
          switch (role_id) {
              case 1:
              role = 'Super Admin';
              break;
              case 2:
              role = 'Kitchen';
              break;
              case 3:
              role = 'Cashier';
              break;
              case 4:
              role = 'Kitchen';
              break;
              case 5:
              role = 'Cashier';
              break;
              case 6:
              role = 'Waiter';
              break;
              default:
              role = 'Unknown';
          }
          setRight(right.concat(permission));
          setLeft(not(left, permission));
          setUser({
              ...user,
              id,
              first_name,
              last_name,
              email,
              status,
              role_id,
              role,
              permission,
              restaurant_id,
              restaurant_name,
              allowed_restaurant,
              allowed_bm,
          });
        } 
    }, [id, props.Data, props.show]);

      useEffect(() => {
        if (props.show == false) {
          setUser({
            ...user,
            first_name: "",
            last_name: "",
            email: "",
            status: "",
            role_id: "",
            role: "",
            permission: "",
          })
          setErrors(null)
          setLeft(Permission.RECORDS.map((item) => item.permission));
          setRight([]);
          setChecked([]); 
        //   setHide(false)
        //   setadminHide(false)
        } 
      },[props.show])

  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(Permission.RECORDS.map(item => item.permission));
  const [right, setRight] = React.useState([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));

    setUser({
        ...user,
        permission:  right.concat(leftChecked)
    })
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));

    setUser({
        ...user,
        permission: not(right, rightChecked)
    })
  
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 315,
          height: 300,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value}     />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <div id="MenuModal">
        <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
            <Modal.Header closeButton>
            <Modal.Title>User</Modal.Title>
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
                                value={user.first_name} 
                                onChange={ev => setUser({...user, first_name: ev.target.value})} 
                                label="First Name" 
                                variant="outlined" 
                                fullWidth
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <TextField 
                                required
                                type="text" 
                                value={user.last_name} 
                                onChange={ev => setUser({...user, last_name: ev.target.value})} 
                                label="Last Name" 
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
                                type="email" 
                                value={user.email} 
                                onChange={ev => setUser({...user, email: ev.target.value})} 
                                label="Email" 
                                variant="outlined" 
                                fullWidth
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <Autocomplete
                                disableClearable
                                value={ user.status}
                                options={Status.RECORDS}
                                onChange={handleStatus}
                                getOptionLabel={(options) => options.status ? options.status.toString() : user.status}
                                isOptionEqualToValue={(option, value) => option.status ?? "" === user.status}
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
                                value={ user.role}
                                options={optionsRole}
                                onChange={handleRole}
                                getOptionLabel={(options) => options.role ? options.role.toString() : user.role}
                                isOptionEqualToValue={(option, value) => option.role ?? "" === user.role}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    required
                                    label="Role"
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                    }}
                                    />
                                )}
                            />
                        </Col>
                        { user.role_id != "" && user.role_id != '1' && user.role_id != '2' &&
                            <Col xs={12} md={6}>
                                <Autocomplete
                                disableClearable
                                onChange={handleChangeRestaurant}
                                options={restaurant}
                                value={user.restaurant_name}
                                getOptionLabel={(options) => options.name ? options.name.toString() : user.restaurant_name}  
                                isOptionEqualToValue={(option, value) => option.name ?? ""  === user.restaurant_name  }
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
                        }
                    </Row>
                </Form.Group>
                { user.role_id == '2' &&
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Row>
                        <Col xs={12} md={6}>
                            <TextField
                            required
                            type="number"
                            value={user.allowed_restaurant}
                            onChange={ev => setUser({...user, allowed_restaurant: ev.target.value})}
                            label="Number of Restaurant"
                            variant="outlined"
                            fullWidth
                            />
                        </Col>
                        <Col xs={12} md={6}> 
                        <TextField
                            required
                            type="number"
                            value={user.allowed_bm}
                            onChange={ev => setUser({...user, allowed_bm: ev.target.value})}
                            label="Number of Branch Manager"
                            variant="outlined"
                            fullWidth
                        />
                        </Col>
                        </Row>
                    </Form.Group>
                }
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Row >
                        <Col xs={12} md={12}>
                            <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item>{customList('Restricted', left)}</Grid>
                            <Grid item>
                                <Grid container direction="column" alignItems="center">
                                <Button
                                    sx={{ my: 0.5 }}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleCheckedRight}
                                    disabled={leftChecked.length === 0}
                                    aria-label="move selected right"
                                >
                                    &gt;
                                </Button>
                                <Button
                                    sx={{ my: 0.5 }}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleCheckedLeft}
                                    disabled={rightChecked.length === 0}
                                    aria-label="move selected left"
                                >
                                    &lt;
                                </Button>
                                </Grid>
                            </Grid>
                            <Grid item>{customList('Access', right)}</Grid>
                            </Grid>
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
    </div>
  )
}
