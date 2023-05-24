import React from 'react'
import { Button, Col, Form, FormGroup, Input, Row } from 'reactstrap'

function SaleAgentEditForm({ agentData, onChange, onSubmitEditAgentData, loading }) {
  return (
        <Form onSubmit={onSubmitEditAgentData}>
            <Row>
                <Col md='6'>
                    <FormGroup>
                        <label>Name</label>
                        <Input type='text' name='fname' defaultValue={agentData.name} required onChange={onChange}/>
                    </FormGroup>
                </Col>
                <Col md='6'>
                    <FormGroup>
                        <label>Email</label>
                        <Input type='email' name='email' defaultValue={agentData.email} required onChange={onChange}/>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col md='6'>
                    <FormGroup>
                        <label>Phone</label>
                        <Input type='number' name='phone' defaultValue={agentData.phone} required onChange={onChange}/>
                    </FormGroup>
                </Col>
                <Col md='6'>
                    <FormGroup>
                        <label>Address</label>
                        <Input type='text' name='address' defaultValue={agentData.address} onChange={onChange}/>
                    </FormGroup>
                </Col>
            </Row>
            {/* <FormGroup>
                <label>User Role</label>
                <ReactSelect options={userRoles} defaultValue={agentRole} onChange={(option)=> agentData.role = option.value}/>
            </FormGroup> */}
                    
            <Button disabled={loading? true: false}>{loading?'Please Wait' :'Update'}</Button>
    </Form>
  )
}

export default SaleAgentEditForm
