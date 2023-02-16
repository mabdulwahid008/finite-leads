import React from 'react'
import AdminLayout from "layouts/Admin.js";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from 'views/Login';

function App() {
    const token = localStorage.getItem('token')
    if(!token)
        return (
            <Login />
        )
        return (
            <Switch>
            <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
            <Redirect to="/admin/dashboard" />
            </Switch>
        )
}

export default App