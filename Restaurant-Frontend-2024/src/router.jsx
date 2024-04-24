import {Navigate, createBrowserRouter} from "react-router-dom"
import NotFound from "./views/NotFound"
import DefaultLayout from "./components/DefaultLayout"
import FormLogin from "./views/pages/Authentication/forms/Login"
import Login from "./views/pages/Login"
import Dashboard from "./views/pages/Dashboard"
import Menu from "./views/pages/Menu"
import Order from "./views/pages/Order"
import System from "./views/pages/Inventory/System"
import Actual from "./views/pages/Inventory/Actual"
import Promo from "./views/pages/Promo"
import User from "./views/pages/User"
import GuestLayout from "./components/GuestLayout"
import Restaurant from "./views/pages/Restaurant"
import IngredientsTab from "./ui-component/Tab/IngredientsTab"
import GoogleMaps from "./views/pages/Maps/GoogleMaps"
import Cashier from "./views/cashier/Cashier"
import Report from "./views/reports/Report"
import Reservation from "./views/pages/Reservation"
import Remaining from "./views/pages/Inventory/Remaining"
import ReportIngredients from "./views/reports/ReportIngredients"
import ReportMenu from "./views/reports/ReportMenu"
import ReportPromo from "./views/reports/ReportPromo"
import ReportReservation from "./views/reports/ReportReservation"
import ReportInventory from "./views/reports/ReportInventory"
import ReportUser from "./views/reports/ReportUser"

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/Dashboard" />,
            },
            {
                path: '/dashboard',
                element: <Dashboard />,
            },
            {
                path: '/Cashier',
                element: <Cashier />,
            },
            {
                path: '/Ingredients',
                element: <IngredientsTab />,
            },
            {
                path: '/Menu',
                element: <Menu />,
            },
            {
                path: '/Order',
                element: <Order />,
            },
            {
                path: '/System',
                element: <System />,
            },
            {
                path: '/Actual',
                element: <Actual />,
            },
            {
                path: '/Remaining',
                element: <Remaining />,
            },
            {
                path: '/Discount',
                element: <Promo />,
            },
            {
                path: '/Restaurant',
                element: <Restaurant />,
            },
            {
                path: '/Reservation',
                element: <Reservation />,
            },
            {
                path: '/User',
                element: <User />,
            },
            {
                path: '/sales-report',
                element: <Report />,
            },
            {
                path: '/ingredients-report',
                element: <ReportIngredients />,
            },
            {
                path: '/menu-report',
                element: <ReportMenu />,
            },
            {
                path: '/promo-report',
                element: <ReportPromo />,
            },
            {
                path: '/reservation-report',
                element: <ReportReservation />,
            },
            {
                path: '/inventory-report',
                element: <ReportInventory />,
            },
            {
                path: '/user-report',
                element: <ReportUser />,
            }

        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/Login',
                element: <FormLogin />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }


])

export default router
