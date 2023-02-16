import React from 'react'
import AdminLayout from "layouts/Admin.js";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from 'views/Login';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const token = localStorage.getItem('token')
    if(!token)
        return (
            <Login />
        )
        return (
            <>
                <Switch>
                    <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
                    <Redirect to="/admin/dashboard" />
                </Switch>
                <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} transition={Slide} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss theme="light" />
            </>
        )
}

export default App