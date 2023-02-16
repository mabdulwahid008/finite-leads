import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'
import { RxCross1 } from 'react-icons/rx'
import { toast } from 'react-toastify'

function AddSaleAgent({ setAddNewAgent, saleAgents, setSaleAgents }) {
    const [agentData, setAgentData] = useState({name: '', phone: '', email: '', address: ''})
    const onChange = (e) => {
        setAgentData({...agentData, [e.target.name]: e.target.value})
    }

    const addNewAgent = ( e ) => {
        e.preventDefault();
        if(agentData.phone.length !== 11){
            toast.error('Agents phone number is incorrect')
            return;
        }
        agentData.id = Math.floor(Math.random() * 9999);

        saleAgents.push(agentData)

        setSaleAgents(saleAgents)

        toast.success('New agent added')

        setAddNewAgent(false)
        
    }
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup'>
            <CardHeader>
                <CardTitle tag="h5">Add New Sale Agent</CardTitle>
                <RxCross1 onClick={()=> setAddNewAgent(false)}/>
            </CardHeader>
            <CardBody>
                <Form onSubmit={addNewAgent}>
                    <FormGroup>
                        <label>Agent Name</label>
                        <Input type='text' name='name' required onChange={onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Phone</label>
                        <Input type='number' name='phone' required onChange={onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Email</label>
                        <Input type='email' name='email' required onChange={onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Address</label>
                        <Input type='text' name='address' required onChange={onChange}/>
                    </FormGroup>
                    <Button color='primary'>Add Agent</Button>
                </Form>
            </CardBody>
        </Card>
    </div>
  )
}

export default AddSaleAgent