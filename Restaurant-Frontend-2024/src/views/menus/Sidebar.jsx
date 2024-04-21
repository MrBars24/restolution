import React, { createElement, useEffect, useState } from 'react';
import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PercentIcon from '@mui/icons-material/Percent';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import SummarizeIcon from '@mui/icons-material/Summarize';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FactCheckIcon from '@mui/icons-material/FactCheck';

const icons = [DashboardIcon, PointOfSaleIcon, LibraryBooksIcon, MenuBookIcon, ShoppingCartIcon, InventoryIcon, PercentIcon, StorefrontIcon, FactCheckIcon, PersonIcon, SummarizeIcon];

const iconMapping = {
    'Dashboard': DashboardIcon,
    'Cashier': PointOfSaleIcon,
    'Ingredients': LibraryBooksIcon,
    'Menu': MenuBookIcon,
    'Order': ShoppingCartIcon,
    'Inventory': InventoryIcon,
    'Discount': PercentIcon,
    'Restaurant': StorefrontIcon,
    'Reservation': FactCheckIcon,
    'User': PersonIcon,
    'Reports': SummarizeIcon,
  };

export default function Sidebar() {
    let filteredItems;
    const { permission } = useStateContext();
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(null);
    const [isInventorySubMenuOpen, setInventorySubMenuOpen] = useState(false);
    const [isReportsSubMenuOpen, setIsReportsSubMenuOpen] = useState(false);
    const pathParts = window.location.pathname.split('/');
    const path = pathParts[pathParts.length - 1];
    const [filteredSidebarItems, setFilteredSidebarItems] = useState([]);

    const handleListItemClick = (text) => {
        setSelectedItem(text);
        navigate('/' + text);
    };

    const handleListItemNavigate = (item) => {
        setSelectedItem(item.text);
        navigate(item.route);
    }

    const toggleInventorySubMenu = () => {
        setInventorySubMenuOpen(!isInventorySubMenuOpen);
    };

    const toggleReportsSubMenu = () => {
        setIsReportsSubMenuOpen(!isReportsSubMenuOpen);
    }

    const subMenuItems = [
        // { text: 'System', icon: <FiberManualRecordIcon fontSize='small' /> },
        // { text: 'Actual', icon: <FiberManualRecordIcon fontSize='small' /> },
        // { text: 'Remaining', icon: <FiberManualRecordIcon fontSize='small' /> },
    ];

    const reportSubMenuItems = [];

    if (permission.includes("Inventory System (Viewing)")) subMenuItems.push({ text: 'System', icon: <FiberManualRecordIcon fontSize='small' /> });
    if (permission.includes("Inventory Actual (Viewing)")) subMenuItems.push({ text: 'Actual', icon: <FiberManualRecordIcon fontSize='small' /> });
    if (permission.includes("Inventory Remaining (Viewing)")) subMenuItems.push({ text: 'Remaining', icon: <FiberManualRecordIcon fontSize='small' /> });

    if (permission.includes("Reports (Sales)")) reportSubMenuItems.push({ text: 'Sales', icon: <FiberManualRecordIcon fontSize='small' />, route: "/sales-report" });
    if (permission.includes("Reports (Ingredients)")) reportSubMenuItems.push({ text: 'Ingredients', icon: <FiberManualRecordIcon fontSize='small' />, route: "/ingredients-report" });

    useEffect(() => {
        if (!selectedItem && path) {
            setSelectedItem(path);
        }

        if (permission) {
            let joinedPermissions;
            if (Array.isArray(permission)) {
                const firstElement = permission;
                const firstWords = firstElement.map(permission => {
                  const trimmedPermission = permission.trim();
                  return trimmedPermission.split(' ')[0];
                });
                joinedPermissions = firstWords.join(', ');
            } else {
                const firstElement = permission;
                const permissionsArray = firstElement.split(',');
                const firstWords = permissionsArray.map(permission => {
                    const trimmedPermission = permission.trim();
                    return trimmedPermission.split(' ')[0];
                });

                joinedPermissions = firstWords.join(', ');
            }

            filteredItems = ['Dashboard', 'Cashier', 'Ingredients', 'Menu', 'Order', 'Inventory', 'Discount', 'Restaurant', 'Reservation', 'User', 'Reports']
                .filter(item => joinedPermissions.trim().includes(item));
            setFilteredSidebarItems(filteredItems)
        }
    }, [selectedItem, path, permission]);

    return (
        <List>
            {filteredSidebarItems.map((text, index) => (
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
                                    color: '#fff',
                                },
                            }}
                            onClick={() => {
                                if (text === 'Inventory') {
                                    toggleInventorySubMenu();
                                } else if (text === 'Reports') {
                                    toggleReportsSubMenu();
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
                                        color: selectedItem === text ? '#fff' : 'inherit',
                                        '&:hover': {
                                            color: '#fff',
                                        },
                                    }}
                                >
                                    {/* {createElement(icons[index])} */}
                                    {createElement(iconMapping[text])}
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                            </div>
                            {text === 'Inventory' && (
                                <IconButton
                                    onClick={toggleInventorySubMenu}
                                    sx={{ padding: 0, minWidth: 'auto', pl: 2 }}
                                >
                                    {isInventorySubMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            )}

                            {text === 'Reports' && (
                                <IconButton
                                    onClick={toggleReportsSubMenu}
                                    sx={{ padding: 0, minWidth: 'auto', pl: 2 }}
                                >
                                    {isReportsSubMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
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
                                            pl: 5,
                                            borderRadius: '25px',
                                            backgroundColor: selectedItem === subMenuItem.text ? '#1976d2' : 'inherit',
                                            color: selectedItem === subMenuItem.text ? '#fff' : 'inherit',
                                            '&:hover': {
                                                backgroundColor: '#1976d2',
                                                color: '#fff',
                                            },
                                        }}
                                        onClick={() => {
                                            handleListItemClick(subMenuItem.text);
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 30,
                                                color: selectedItem === subMenuItem.text ? '#fff' : 'inherit',
                                                '&:hover': {
                                                    color: '#fff',
                                                },
                                            }}
                                        >
                                            {subMenuItem.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={subMenuItem.text} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    )}

                    {text === 'Reports' && (
                        <Collapse in={isReportsSubMenuOpen}>
                            <List component="div" disablePadding>
                                {reportSubMenuItems.map((reportSubMenuItem, subItemIndex) => (
                                    <ListItem
                                        key={reportSubMenuItem.text}
                                        button
                                        sx={{
                                            pl: 5,
                                            borderRadius: '25px',
                                            backgroundColor: selectedItem === reportSubMenuItem.text ? '#1976d2' : 'inherit',
                                            color: selectedItem === reportSubMenuItem.text ? '#fff' : 'inherit',
                                            '&:hover': {
                                                backgroundColor: '#1976d2',
                                                color: '#fff',
                                            },
                                        }}
                                        onClick={() => {
                                            handleListItemNavigate(reportSubMenuItem);
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 30,
                                                color: selectedItem === reportSubMenuItem.text ? '#fff' : 'inherit',
                                                '&:hover': {
                                                    color: '#fff',
                                                },
                                            }}
                                        >
                                            {reportSubMenuItem.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={reportSubMenuItem.text} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    )}
                </div>
            ))}
        </List>
    );
}
