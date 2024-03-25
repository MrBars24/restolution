import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, Button, CardActionArea, CardActions, Divider, Grid, ListItemText, Paper } from '@mui/material';
import { Col, Form, Row } from 'react-bootstrap';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ModalCashier from '../pages/Modal/Cashier'
import { useState } from 'react';
import { io } from 'socket.io-client';
import axiosClient from '../../configs/axiosClient';
import { useEffect } from 'react';

export default function Cashier() {
    const [showModal, setShowModal] = useState(false);
 
    // function handleClick(event) {
    //     event.preventDefault();
    //     console.info('You clicked a breadcrumb.');
    //   }
 

      const handleClick = () => {
        setShowModal(true)
      }

      const handleModalClose = () => {
        setShowModal(false)
        // setRestaurantInfo([])
      }

      const socket = () => {
        const { data } =  axiosClient.get(`/web/order/1`)
        console.log(data)
      }

      useEffect(  () => {
        socket()
      }, []);


//       const [data, setData] = useState([]);

//   useEffect(() => {
//     // Connect to the WebSocket server
//     const socket = io('http://localhost:8001/api/web/cashier/1');
// console.log(socket)
//     // Listen for the event when new data is added
//     socket.on('newDataAdded', (newData) => {
//       // Update your React state with the new data
//       setData((prevData) => [...prevData, newData]);
//     });

//     return () => {
//       // Disconnect the WebSocket when the component unmounts
//       socket.disconnect();
//     };
//   }, []);


    //   React.useEffect(() => {
    //     const socket = io('http://localhost:8001/api/web/order/1');
        
    //     console.log(socket)
              
    //     return () => {
    //       socket.disconnect();
    //     };
    //   }, []);

   


  return (
    <>
        <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
                MUI
            </Link>
            <Link
                underline="hover"
                color="inherit"
                href="/material-ui/getting-started/installation/"
            >
                Core
            </Link>
            <Link
                underline="hover"
                color="text.primary"
                href="/material-ui/react-breadcrumbs/"
                aria-current="page"
            >
                Breadcrumbs
            </Link>
            </Breadcrumbs>
        </div>
        <Divider  style={{ background: 'black', borderBottomWidth: 1 }} className='mb-4' />
        <Row className='magic'>
            <Col xs={12} md={4}>
                <Card className='gg'>
                    <CardActionArea onClick={handleClick}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h5">Table #1</Typography>
                                <Typography variant="h5">Dine In</Typography>
                            </Box>
                        </CardContent>
                            <Divider  style={{ background: 'black', borderBottomWidth: 1 }} className='mb-2' />
                        <CardContent className='mekus'>
                                <Grid container spacing={2} className='mb-4'>
                                    <Grid item xs={12} md={3}>
                                        <Paper elevation={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography variant="h2">A1</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={7}> 
                                            <Typography variant="h6">Tinapa</Typography>
                                            <Typography variant="body1">
                                            Notes: paki alis yung tinik kasdfjsds s asdasd a asdas sa asd assadasd sd
                                            </Typography> 
                                    </Grid>
                                    <Grid item xs={12} md={2}> 
                                            <Typography variant="h6">x2</Typography>
                                            <Typography variant="body1">
                                            ₱ 400
                                            </Typography> 
                                    </Grid>
                                </Grid>
                                
                                <Grid container spacing={1} className='mb-4'>
                                    <Grid item xs={12} md={3}>
                                        <Paper elevation={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography variant="h2">A1</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={7}> 
                                            <Typography variant="h6">Tinapa</Typography>
                                            <Typography variant="body1">
                                            Notes: paki alis yung tinik
                                            </Typography> 
                                    </Grid>
                                    <Grid item xs={12} md={2}> 
                                            <Typography variant="h6">x2</Typography>
                                            <Typography variant="body1">
                                            ₱ 200
                                            </Typography> 
                                    </Grid>
                                </Grid> 
                                <Grid container spacing={1} className='mb-4'>
                                    <Grid item xs={12} md={3}>
                                        <Paper elevation={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography variant="h2">A1</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={7}> 
                                            <Typography variant="h6">Tinapa</Typography>
                                            <Typography variant="body1">
                                            Notes: paki alis yung tinik
                                            </Typography> 
                                    </Grid>
                                    <Grid item xs={12} md={2}> 
                                            <Typography variant="h6">x2</Typography>
                                            <Typography variant="body1">
                                            ₱ 200
                                            </Typography> 
                                    </Grid>
                                </Grid> 
                                <Grid container spacing={1} className='mb-4'>
                                    <Grid item xs={12} md={3}>
                                        <Paper elevation={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography variant="h2">A1</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={7}> 
                                            <Typography variant="h6">Tinapa</Typography>
                                            <Typography variant="body1">
                                            Notes: paki alis yung tinik
                                            </Typography> 
                                    </Grid>
                                    <Grid item xs={12} md={2}> 
                                            <Typography variant="h6">x2</Typography>
                                            <Typography variant="body1">
                                            ₱ 200
                                            </Typography> 
                                    </Grid>
                                </Grid> 
                                <Typography gutterBottom variant="h5" component="div" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                   Total: ₱600
                                </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Col>
            <Col xs={12} md={4}>
                <Card className='gg'>
                    <CardActionArea>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h5">Table #1</Typography>
                                <Typography variant="h5">Dine In</Typography>
                            </Box>
                        </CardContent>
                        <Divider  style={{ background: 'black', borderBottomWidth: 1 }} className='mb-2' />
                        <CardContent className='mekus'>
                                <Grid container spacing={2} className='mb-4'>
                                    <Grid item xs={12} md={3}>
                                        <Paper elevation={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography variant="h2">A1</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={7}> 
                                            <Typography variant="h6">Tinapa</Typography>
                                            <Typography variant="body1">
                                            Notes: paki alis yung tinik
                                            </Typography> 
                                    </Grid>
                                    <Grid item xs={12} md={2}> 
                                            <Typography variant="h6">x2</Typography>
                                            <Typography variant="body1">
                                            ₱ 400
                                            </Typography> 
                                    </Grid>
                                </Grid>
                                
                                <Grid container spacing={1} className='mb-4'>
                                    <Grid item xs={12} md={3}>
                                        <Paper elevation={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography variant="h2">A1</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={7}> 
                                            <Typography variant="h6">Tinapa</Typography>
                                            <Typography variant="body1">
                                            Notes: paki alis yung tinik
                                            </Typography> 
                                    </Grid>
                                    <Grid item xs={12} md={2}> 
                                            <Typography variant="h6">x2</Typography>
                                            <Typography variant="body1">
                                            ₱ 200
                                            </Typography> 
                                    </Grid>
                                </Grid> 
                                <Typography gutterBottom variant="h5" component="div" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                   Total: ₱600
                                </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Col>
            {/* <Col xs={12} md={4}>
                <Card >
                    <CardActionArea>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h5">Table #1</Typography>
                                <Typography variant="h5">Dine In</Typography>
                            </Box>
                        </CardContent>
                            <Divider  style={{ background: 'black', borderBottomWidth: 1 }} className='mb-2' />
                            <CardContent className='mekus'>
                                <Grid container spacing={2} className='mb-4'>
                                    <Grid item xs={12} md={3}>
                                        <Paper elevation={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography variant="h2">A1</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={7}> 
                                            <Typography variant="h6">Tinapa</Typography>
                                            <Typography variant="body1">
                                            Notes: paki alis yung tinik
                                            </Typography> 
                                    </Grid>
                                    <Grid item xs={12} md={2}> 
                                            <Typography variant="h6">x2</Typography>
                                            <Typography variant="body1">
                                            ₱ 400
                                            </Typography> 
                                    </Grid>
                                </Grid>
                                
                                <Grid container spacing={1} className='mb-4'>
                                    <Grid item xs={12} md={3}>
                                        <Paper elevation={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography variant="h2">A1</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={7}> 
                                            <Typography variant="h6">Tinapa</Typography>
                                            <Typography variant="body1">
                                            Notes: paki alis yung tinik
                                            </Typography> 
                                    </Grid>
                                    <Grid item xs={12} md={2}> 
                                            <Typography variant="h6">x2</Typography>
                                            <Typography variant="body1">
                                            ₱ 200
                                            </Typography> 
                                    </Grid>
                                </Grid> 
                                <Typography gutterBottom variant="h5" component="div" style={{ display: 'flex', justifyContent: 'right' }}>
                                   Total: ₱600
                                </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Col> */}
        </Row> 
        <ModalCashier show={showModal} close={handleModalClose} />
    </>
    
  )
}


{/* <Row className='magic'>
    <Col xs={12} md={4}>
        <Card ></Card>
    </Col>
    <Col xs={12} md={4}>
        <Card ></Card>
    </Col>
    <Col xs={12} md={4}>
        <Card ></Card>
    </Col>
</Row> 


<Card >
    <CardActionArea>
        <CardContent >
        <Grid container spacing={1} className='mb-4'>
            <Grid item xs={12} md={3}>
                <Paper elevation={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h2">A1</Typography>
                </Paper>
            </Grid>
        </Grid> 
        <Typography gutterBottom variant="h5" component="div" style={{ display: 'flex', justifyContent: 'right' }}>
            Total: ₱600
        </Typography>
        </CardContent>
    </CardActionArea>
</Card>

*/}