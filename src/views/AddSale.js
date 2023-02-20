import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row, Button } from 'reactstrap'

function AddSale() {
    const [sale, setSale] = useState({client_name: '',client_phone: '',client_address: '' })
    const [loading, setLoading] = useState(false)

    const onChange = (e) => {
        setSale({...sale, [e.target.name]: e.target.value})
    }
    const onSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        if(sale.client_phone.length !== 9){
            toast.error('Client\'s phone number is incorrect')
            setLoading(false)
            return;
        }
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/sale`,{
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(sale)
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
        }
        else{
            toast.error(res.message)
        }
        setLoading(false)
    }
  return (
    <div className='content'>
        <Row>
            <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4">Add New Sale</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Form onSubmit={onSubmit}>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <label>Client Name *</label>
                                        <Input type="text" name='client_name' required onChange={onChange}/>
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <label>Client Phone *</label>
                                        <Input type="number" name='client_phone' required onChange={onChange}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <FormGroup>
                                <label>Client Address </label>
                                <Input type="text" name='client_address' onChange={onChange}/>
                            </FormGroup>
                            <Button disabled={loading? true : false}>{`${loading? 'Please Wait' : 'Add Sale'}`}</Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default AddSale