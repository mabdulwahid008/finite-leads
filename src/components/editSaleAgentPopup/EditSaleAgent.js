import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'
import { RxCross1 } from 'react-icons/rx'
import { toast } from 'react-toastify'

function EditSaleAgent({setEditAgent, agentToBeEdited, saleAgents, setSaleAgents }) {
    console.log(agentToBeEdited);
    const [agentData, setAgentData] = useState({id: agentToBeEdited.id, name: agentToBeEdited.name, phone: agentToBeEdited.phone, email: agentToBeEdited.email, address: agentToBeEdited.address})
    
    const onChange = (e) => {
        setAgentData({...agentData, [e.target.name]: e.target.value})
    }

    const editAgent = ( e ) => {
        e.preventDefault();
        if(agentData.phone.length !== 11){
            toast.error("Agents phone number is incorrect")
            return;
        }

        let findAgentToBeUpdated = saleAgents.filter((agent)=> agent.id === agentToBeEdited.id)

        findAgentToBeUpdated = agentData
        console.log(findAgentToBeUpdated);

        setEditAgent(false)
        
    }
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup'>
            <CardHeader>
                <CardTitle tag="h5">Edit Agent's Data</CardTitle>
                <RxCross1 onClick={()=>{setEditAgent(false)}}/>
            </CardHeader>
            <CardBody>
                <Form onSubmit={editAgent}>
                    <FormGroup>
                        <label>Agent Name</label>
                        <Input type='text' name='name' defaultValue={agentData.name} required onChange={onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Phone</label>
                        <Input type='number' name='phone' defaultValue={agentData.phone} required onChange={onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Email</label>
                        <Input type='email' name='email' defaultValue={agentData.email} required onChange={onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Address</label>
                        <Input type='text' name='address' defaultValue={agentData.address} required onChange={onChange}/>
                    </FormGroup>
                    <Button color='primary'>Update</Button>
                </Form>
            </CardBody>
        </Card>
    </div>
  )
}

export default EditSaleAgent