import { createBrowserRouter } from "react-router-dom";
import Home from "./src/pages/Home";
import Login from "./src/pages/Login";
import EmailVerify from "./src/pages/EmailVerify";
import ResetPassword from "./src/pages/ResetPassword";

const routes = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/email-verify',
        element: <EmailVerify />
    },
    {
        path: '/reset-password',
        element: <ResetPassword />
    }
])

export default routes