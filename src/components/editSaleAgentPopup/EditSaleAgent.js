import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'
import { RxCross1 } from 'react-icons/rx'
import { toast } from 'react-toastify'

function EditSaleAgent({setEditAgent, agentToBeEdited, saleAgents, setSaleAgents }) {
    const [agentData, setAgentData] = useState(agentToBeEdited)
    
    const onChange = (e) => {
        setAgentData({...agentData, [e.target.name]: e.target.value})
    }

    const editAgent = (e) => {
        e.preventDefault();
        if (agentData.phone.length !== 11) {
          toast.error("Agents phone number is incorrect");
          return;
        }
      
        const agentIndex = saleAgents.findIndex((agent) => agent.id === agentToBeEdited.id);
        if (agentIndex === -1) {
          toast.error("Agent not found");
          return;
        }
      
        const updatedAgent = {
          ...saleAgents[agentIndex],
          name: agentData.name,
          email: agentData.email,
          address: agentData.address,
          phone: agentData.phone,
        };
      
        const updatedAgents = [...saleAgents.slice(0, agentIndex), updatedAgent, ...saleAgents.slice(agentIndex + 1)];
      
        setSaleAgents(updatedAgents);
        setEditAgent(false);
      };
      
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