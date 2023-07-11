import React,{ useEffect } from 'react'
import AdminLayout from "layouts/Admin.js";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import Login from 'views/Login';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LeadForm from 'views/LeadForm';

function App() {
    const history = useHistory()
    const token = localStorage.getItem('token')
    const path = window.location.pathname

    const authenticate = async() => {
        const token = localStorage.getItem('token')
        if(token){
          const response = await fetch('/user/authenticate/user',{
            method: 'GET',
            headers: {
              'Content-Type':'Apllication/json',
              token: token,
            }
          })
          if(response.status === 200){}
          else{
            localStorage.clear()
            window.location.reload(true)
          }
        }
    }

    setInterval(() => {
        authenticate()
    }, 1000)

    useEffect(()=>{
        if(token){
            if(path.length > 1){
                history.push(path)
            }
            else
                history.push('/dashboard')
        }
        else if(!token){
            history.push('/')
        }
        else{}
    }, [])

    
  
            
    if(!token)
        return (
            <>
                <Switch>
                    <Route path="/" render={ (props) =>  <Login />} />
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

