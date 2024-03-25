import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { createElement, useEffect, useState } from 'react'

import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PercentIcon from '@mui/icons-material/Percent';
import PersonIcon from '@mui/icons-material/Person';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import SummarizeIcon from '@mui/icons-material/Summarize';

import {
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
  } from '@mui/icons-material'; // Import the arrow icon
import { useNavigate } from 'react-router-dom';
const icons = [DashboardIcon, PointOfSaleIcon, LibraryBooksIcon, MenuBookIcon, ShoppingCartIcon, InventoryIcon, PercentIcon, StorefrontIcon, PersonIcon, SummarizeIcon];


export default function Sidebar() {
    const navigate = useNavigate()
    const [selectedItem, setSelectedItem] = useState(null);
    const [isInventorySubMenuOpen, setInventorySubMenuOpen] = useState(false);
    const pathParts = window.location.pathname.split('/');
    const path = pathParts[pathParts.length - 1];
 
    const handleListItemClick = (text) => {
        setSelectedItem(text);
        navigate('/' + text);
    };
 
    const toggleInventorySubMenu = () => {
    setInventorySubMenuOpen(!isInventorySubMenuOpen);
    };
    
    const subMenuItems = [
        { text: 'System', icon: <FiberManualRecordIcon fontSize='small' /> }, // Replace YourIcon1 with the actual icon
        { text: 'Actual', icon: <FiberManualRecordIcon fontSize='small' /> }, // Replace YourIcon2 with the actual icon
      ]; 

    useEffect(() => {
        if (!selectedItem && path) {
            setSelectedItem(path);
        }
    }, [selectedItem, path]);

  return (
    <List>
        {['Dashboard', 'Cashier', 'Ingredients', 'Menu', 'Order','Inventory','Discount','Restaurant','User','Reports'].map((text, index) => (
            <div key={text}>
                <ListItem key={text} disablePadding sx={{ display: 'block', marginBottom: '4px' }}>
                    <ListItemButton
                    sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        borderRadius: '25px',
                        backgroundColor: selectedItem === text ? '#1976d2' : 'inherit',
                        color: selectedItem === text ? '#fff' : 'inherit',
                        '&:hover': {
                            backgroundColor: '#1976d2',
                            color: '#fff'
                          },
                    }}
                    onClick={() => {
                        if (text === 'Inventory') {
                            toggleInventorySubMenu();
                        } else {
                            handleListItemClick(text);
                        }
                    }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemIcon
                        sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: selectedItem === text ? '#fff' : 'inherit', // Change icon color when selected
                        '&:hover': {
                            color: '#fff', // Change icon color on hover
                            },
                        }}
                    >
                        {createElement(icons[index])}
                    </ListItemIcon>
                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                    </div>
                    {text === 'Inventory' && (
                    <IconButton
                        onClick={toggleInventorySubMenu}
                        sx={{ padding: 0, minWidth: 'auto', pl: 2}}
                    >
                        {isInventorySubMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    )}
                    </ListItemButton>
                </ListItem>

                {text === 'Inventory' && (
                    <Collapse in={isInventorySubMenuOpen}>
                        <List component="div" disablePadding>
                        {subMenuItems.map((subMenuItem, subItemIndex) => (
                            <ListItem
                            key={subMenuItem.text}
                            button
                            sx={{
                                pl: 5, // Adjust the padding left to indent sub-menu items
                                borderRadius: '25px',
                                backgroundColor: selectedItem === subMenuItem.text ? '#1976d2' : 'inherit',
                                color: selectedItem === subMenuItem.text ? '#fff' : 'inherit',
                                '&:hover': {
                                    backgroundColor: '#1976d2',
                                    color: '#fff'
                                  },
                            }}
                            onClick={() => {
                                handleListItemClick(subMenuItem.text);
                            }}
                            >
                            <ListItemIcon 
                                sx={{ 
                                    minWidth: 30,
                                    color: selectedItem === subMenuItem.text ? '#fff' : 'inherit', // Change icon color when selected
                                    '&:hover': {
                                        color: '#fff', // Change icon color on hover
                                    },
                                }}
                            >
                                {/* You can add icons for sub-menu items here */}
                                {subMenuItem.icon} {/* Icon for sub-menu item */}
                            </ListItemIcon>
                            <ListItemText primary={subMenuItem.text} />
                            </ListItem>
                        ))}
                        </List>
                    </Collapse>
                )}
            </div>
        ))}
    </List> 
        
  )
}
