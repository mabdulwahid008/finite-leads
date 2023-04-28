import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row } from 'reactstrap'
import { RxCross1 } from 'react-icons/rx'
import { toast } from 'react-toastify'
import ReactSelect from 'react-select'
import Loading from '../Loading/Loading'
import { useParams } from 'react-router-dom'

function EditUser({ agentToBeEdited }) {

    const { id } = useParams()

    const [agentData, setAgentData] = useState(null)
    const [agentRole, setAgentRole] = useState(null)

    const userRoles = [
        {value: 0, label: 'Sales Agent'},
        {value: 1, label: 'Markeing Agent'},
        {value: 2, label: 'Real Estate Agent'},
        {value: 3, label: 'Admin'},
    ]

    const findAgentRole = () => {
        if(agentData.role == 0)
            setAgentRole({value: 0, label: 'Sales Agent'})
        else if(agentData.role == 1)
            setAgentRole({value: 1, label: 'Markeing Agent'})
        else if(agentData.role == 2)
            setAgentRole({value: 2, label: 'Real Estate Agent'})
        else if(agentData.role == 3)
            setAgentRole({value: 3, label: 'Admin'})
        else{}
    } 
    
    const onChange = (e) => {
        setAgentData({...agentData, [e.target.name]: e.target.value})
    }

    const editAgent = async(e) => {
        e.preventDefault();
        if (agentData.phone.length !== 11) {
          toast.error("Agents phone number is incorrect");
          return;
        }

        const response = await fetch(`/user`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(agentData)
        })
        const res = await response.json();
        if(response.status === 200){
            toast.success(res.message)
        }
        else{
            toast.error(res.message)
        }
        
    };

    const fetchUser = async() => {
        const response = await fetch(`/user/get-single/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json();
        if(response.status === 200){
            setAgentData(res)
        }
        else{
            toast.error(res.message)
        }
    }

    useEffect(()=>{
        fetchUser()
        if(agentData)
            findAgentRole();
    }, [agentData])
      
  return (
   <div className='content'>
    <Row>
        <Col md='12'>
        <Card>
            <CardHeader>
                <CardTitle tag="h5">Edit User's Data</CardTitle>
            </CardHeader>
            <CardBody>
                {!agentRole && <Loading />}
               {agentRole  && <Form onSubmit={editAgent}>
                    <FormGroup>
                        <label>Name</label>
                        <Input type='text' name='name' defaultValue={agentData.name} required onChange={onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Email</label>
                        <Input type='email' name='email' defaultValue={agentData.email} required onChange={onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Phone</label>
                        <Input type='number' name='phone' defaultValue={agentData.phone} required onChange={onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <label>User Role</label>
                        <ReactSelect options={userRoles} defaultValue={agentRole} onChange={(option)=> agentData.role = option.value}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Address</label>
                        <Input type='text' name='address' defaultValue={agentData.address} required onChange={onChange}/>
                    </FormGroup>
                    <Button color='primary'>Update</Button>
                </Form>}
            </CardBody>
        </Card>
    </Col>
  </Row>
</div>
  )
}

export default EditUser