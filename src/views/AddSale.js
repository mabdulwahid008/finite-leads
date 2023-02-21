import Loading from 'components/Loading/Loading'
import React, { useEffect, useState } from 'react'
import ReactSelect from 'react-select'
import { toast } from 'react-toastify'
import { Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row, Button } from 'reactstrap'

function AddSale() {
    const [sale, setSale] = useState({client_name: '',client_phone: '',client_address: '' })
    const [loading, setLoading] = useState(false)
    const [saleAgents, setSaleAgents] = useState(null)
    const [user_id, setUser_id] = useState(null)

    const userRole = localStorage.getItem('userRole')

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
        sale.user_id = user_id
        
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
            setSale({client_name: '',client_phone: '',client_address: '' })
        }
        else{
            toast.error(res.message)
        }
        setLoading(false)
    }

    const getAgents = async() => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/user`,{
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json();
        if(response.status === 200){
            console.log(res);
            let options = []
            for(let i = 0; i < res.length; i++){
                const option = {
                    value: res[i]._id,
                    label: res[i].name
                }
                options.push(option)
            }
            setSaleAgents(options)
        }
        else
            toast.error(res.message)
    }
    useEffect(()=>{
        getAgents()
    },[sale])
  return (
    <div className='content'>
        <Row>
            <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4">Add New Sale</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {!saleAgents && <Loading />}
                       {saleAgents && <Form onSubmit={onSubmit}>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <label>Client Name *</label>
                                        <Input type="text" value={sale.client_name} name='client_name' required onChange={onChange}/>
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <label>Client Phone *</label>
                                        <Input type="number" value={sale.client_phone} name='client_phone' required onChange={onChange}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <label>Client Address </label>
                                        <Input type="text" value={sale.client_address} name='client_address' onChange={onChange}/>
                                    </FormGroup>
                                </Col>
                                {(userRole == 3 || userRole == 5) && <Col md="6">
                                    <FormGroup>
                                        <label>Select Sale Agent *</label>
                                        <ReactSelect options={saleAgents} placeholder="Select Agent" required onChange={(option)=>{setUser_id(option.value)}}/>
                                    </FormGroup>
                                </Col>}
                            </Row>
                            
                            <Button disabled={loading? true : false}>{`${loading? 'Please Wait' : 'Add Sale'}`}</Button>
                        </Form>}
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default AddSale