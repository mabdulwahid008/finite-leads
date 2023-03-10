import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row } from 'reactstrap'
import { RxCross1 } from 'react-icons/rx'
import { toast } from 'react-toastify'
import ReactSelect from 'react-select'

function AddUser({ setAddNewAgent, setRefresh }) {
    const [loading, setLoading] = useState(false)
    const [agentData, setAgentData] = useState({name: '', phone: '', email: '', address: '', password: '', role: null})

    const onChange = (e) => {
        setAgentData({...agentData, [e.target.name]: e.target.value})
    }

    const userRoles = [
        {value: 0, label: 'Sales Agent'},
        {value: 1, label: 'Markeing Agent'},
        {value: 2, label: 'Real Estate Agent'},
        {value: 3, label: 'Admin'},
    ]

    const addNewAgent = async( e ) => {
        e.preventDefault();
        setLoading(true)
        if(agentData.phone.length !== 11){
            toast.error('Agents phone number is incorrect')
            setLoading(false)
            return;
        }
        if(agentData.password.length < 4){
            toast.error('Password should be 4 character long')
            setLoading(false)
            return;
        }
        if(agentData.role === null){
            toast.error('Assign a role to the user')
            setLoading(false)
            return;
        }

        const response = await fetch(`/user`,{
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(agentData) 
        })

        const res = await response.json()

        if(response.status === 200){
            toast.success(res.message)

            setAddNewAgent(false)
            setRefresh(true)
        }
        else{
            toast.error(res.message)
        }
        setLoading(false)
    }
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup add-user-popup'>
            <CardHeader>
                <CardTitle tag="h5">Add New User</CardTitle>
                <RxCross1 onClick={()=> setAddNewAgent(false)}/>
            </CardHeader>
            <CardBody>
                <Form onSubmit={addNewAgent}>
                    <FormGroup>
                        <label>Name</label>
                        <Input type='text' name='name' required onChange={onChange}/>
                    </FormGroup>
                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <label>Email</label>
                                <Input type='email' name='email' required onChange={onChange}/>
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <label>Phone</label>
                                <Input type='number' name='phone' required onChange={onChange}/>
                            </FormGroup>
                        </Col>
                    </Row>
                   
                    
                    <FormGroup>
                        <label>Password</label>
                        <Input type='password' name='password' required onChange={onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Assign Role</label>
                        <ReactSelect options={userRoles} required onChange={(option)=>{agentData.role = option.value}}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Address (optional)</label>
                        <Input type='text' name='address' onChange={onChange}/>
                    </FormGroup>
                    <Button color='primary' disabled={loading? true : false}>{`${loading? "Please Wait":"Add New"}`}</Button>
                </Form>
            </CardBody>
        </Card>
    </div>
  )
}

export default AddUser