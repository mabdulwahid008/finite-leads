import React from 'react'
import AdminLayout from "layouts/Admin.js";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import Login from 'views/Login';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const history = useHistory()
    history.push('/dashboard')

    const token = localStorage.getItem('token')
    if(!token)
        return (
            <>
                <Switch>
                    <Route path="/dashboard" render={ (props) =>  <Login />} />
                </Switch>
                <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} transition={Slide} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss theme="light" />
            </>
        )
        return (
            <>
                <Switch>
                    <Route path="/" render={ (props) =>  <AdminLayout {...props} /> } />
                </Switch>
                <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} transition={Slide} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss theme="light" />
            </>
        )
}

export default App

