import {createBrowserRouter} from 'react-router-dom';
import Login from './views/login.jsx';
import Register from './views/register.jsx';
import DefaultLayout from './Components/DefaultLayout.jsx';
import GuestLayout from './Components/GuestLayout.jsx';
import Users from './views/users.jsx';
import UserForm from './views/UserForm.jsx';
import BrandCreate from './views/BrandCreate.jsx'; 
import BrandIndex from './views/BrandIndex.jsx';
import BrandEdit from './views/BrandEdit.jsx';
import BrandShow from './views/BrandShow.jsx'; 

const router = createBrowserRouter ([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/users',
                element: <Users />,
            },
            {
                path: '/users/new',
                element: <UserForm key="userCreate"/>
            },
            {
                path: '/users/:id',
                element: <UserForm key="userUpdate" />
            },
            {
                path: '/brands',
                element: <BrandIndex />, // Add route for showing all brands
            },
            {
                path: '/brands/new', // Add route for creating a new brand
                element: <BrandCreate />,
            },
            {
                path: '/brands/edit/:id', // Route for editing a brand
                element: <BrandEdit />,
            },
            {
                path: '/brands/show/:id', // Route for showing a specific brand
                element: <BrandShow />,
            },
        ]
    },

    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element:  <Register />,
            }
        ]
    },
]);

export default router;