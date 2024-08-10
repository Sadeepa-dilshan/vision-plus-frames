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
import CodeCreate from './views/CodeCreate.jsx';
import CodeIndex from './views/CodeIndex.jsx';
import CodeEdit from './views/CodeEdit.jsx';
import ColorCreate from './views/ColorCreate.jsx';
import ColorIndex from './views/ColorIndex.jsx';
import ColorEdit from './views/ColorEdit.jsx'; 
import FrameCreate from './views/FrameCreate.jsx';
import FrameIndex from './views/FrameIndex.jsx';
import FrameEdit from './views/FrameEdit.jsx';


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
            {
                path: '/codes',
                element: <CodeIndex />, // Route for displaying all codes
            },
            {
                path: '/codes/new', // Route for creating a new code
                element: <CodeCreate />,
            },
            {
                path: '/codes/edit/:id', // Route for editing a specific code
                element: <CodeEdit />,
            },
            {
                path: '/colors',
                element: <ColorIndex />, // Route for displaying all colors
            },
            {
                path: '/colors/new',
                element: <ColorCreate />,
            },
            {
                path: '/colors/edit/:id',
                element: <ColorEdit />,
            },
            {
                path: '/frames',
                element: <FrameIndex />, // Route for displaying all frames
            },
            {
                path: '/frames/new',
                element: <FrameCreate />, // Route for creating a new frame
            },
            {
                path: '/frames/edit/:id',
                element: <FrameEdit />, // Route for editing a frame
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