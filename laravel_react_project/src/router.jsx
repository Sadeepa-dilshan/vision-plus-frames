import { createBrowserRouter } from "react-router-dom";
import Login from "./views/login.jsx";
import Register from "./views/register.jsx";
import DefaultLayout from "./Components/DefaultLayout.jsx";
import GuestLayout from "./Components/GuestLayout.jsx";
import Users from "./views/users.jsx";
import UserForm from "./views/UserForm.jsx";
import BrandCreate from "./views/BrandCreate.jsx";
import BrandIndex from "./views/BrandIndex.jsx";
import BrandEdit from "./views/BrandEdit.jsx";
import BrandShow from "./views/BrandShow.jsx";
import CodeCreate from "./views/CodeCreate.jsx";
import CodeIndex from "./views/CodeIndex.jsx";
import CodeEdit from "./views/CodeEdit.jsx";
import ColorCreate from "./views/ColorCreate.jsx";
import ColorIndex from "./views/ColorIndex.jsx";
import ColorEdit from "./views/ColorEdit.jsx";
import FrameCreate from "./views/FrameCreate.jsx";
import FrameIndex from "./views/FrameIndex.jsx";
import FrameEdit from "./views/FrameEdit.jsx";
import AnimatedPage from "./Components/PageLoadAnimation.jsx";
import Dashboard from "./views/Dashboard.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/users",
                element: (
                    <AnimatedPage>
                        <Users />
                    </AnimatedPage>
                ),
            },
            {
                path: "/users/new",
                element: (
                    <AnimatedPage>
                        <UserForm key="userCreate" />
                    </AnimatedPage>
                ),
            },
            {
                path: "/users/:id",
                element: (
                    <AnimatedPage>
                        <UserForm key="userUpdate" />
                    </AnimatedPage>
                ),
            },
            {
                path: "/brands",
                element: (
                    <AnimatedPage>
                        <BrandIndex />
                    </AnimatedPage>
                ),
            },
            {
                path: "/brands/new",
                element: (
                    <AnimatedPage>
                        <BrandCreate />
                    </AnimatedPage>
                ),
            },
            {
                path: "/brands/edit/:id",
                element: (
                    <AnimatedPage>
                        <BrandEdit />
                    </AnimatedPage>
                ),
            },
            {
                path: "/brands/show/:id",
                element: (
                    <AnimatedPage>
                        <BrandShow />
                    </AnimatedPage>
                ),
            },
            {
                path: "/codes",
                element: (
                    <AnimatedPage>
                        <CodeIndex />
                    </AnimatedPage>
                ),
            },
            {
                path: "/codes/new",
                element: (
                    <AnimatedPage>
                        <CodeCreate />
                    </AnimatedPage>
                ),
            },
            {
                path: "/codes/edit/:id",
                element: (
                    <AnimatedPage>
                        <CodeEdit />
                    </AnimatedPage>
                ),
            },
            {
                path: "/colors",
                element: (
                    <AnimatedPage>
                        <ColorIndex />
                    </AnimatedPage>
                ),
            },
            {
                path: "/colors/new",
                element: (
                    <AnimatedPage>
                        <ColorCreate />
                    </AnimatedPage>
                ),
            },
            {
                path: "/colors/edit/:id",
                element: (
                    <AnimatedPage>
                        <ColorEdit />
                    </AnimatedPage>
                ),
            },
            {
                path: "/frames",
                element: (
                    <AnimatedPage>
                        <FrameIndex />
                    </AnimatedPage>
                ),
            },
            {
                path: "/frames/new",
                element: (
                    <AnimatedPage>
                        <FrameCreate />
                    </AnimatedPage>
                ),
            },
            {
                path: "/frames/edit/:id",
                element: (
                    <AnimatedPage>
                        <FrameEdit />
                    </AnimatedPage>
                ),
            },
            {
                path: "/dashboard",
                element: (
                    <AnimatedPage>
                        <Dashboard />
                    </AnimatedPage>
                ),
            },
        ],
    },

    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: (
                    <AnimatedPage>
                        <Login />
                    </AnimatedPage>
                ),
            },
            {
                path: "/register",
                element: (
                    <AnimatedPage>
                        <Register />
                    </AnimatedPage>
                ),
            },
        ],
    },
]);

export default router;
