import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row } from 'reactstrap'
import '../assets/additional/LeadForm.css'

function LeadForm() {
    const [priceText, setPriceText] = useState("Demand")
    const [loading, setLoading] = useState(false)
    const [lead, setLead] = useState({lead_type: '', working_status: '', fname: '', lname: '', address: '', state: '', zip_code: '', city:'', country: '', phone: '', recording_link: null, beds: '', baths: '', price:'', additional_info: null, agentName: ''})

    const onChange = (e) => {
        setLead({...lead, [e.target.name]: e.target.value})
    }

    const onSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        if(lead.phone.length !== 10){
            setLoading(false)
            return toast.error('Phone number is incorrect')
        }
        const response = await fetch('/lead',{
            method:'POST',
            headers:{
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify(lead)
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            document.querySelector('input[name="lead_type"]').checked = false
            document.querySelector('input[name="working_status"]').checked = false
            setLead({lead_type: '', working_status: '', fname: '', lname: '', address: '', state: '', zip_code: '', city:'', country: '', phone: '', recording_link: '', beds: '', baths: '', price:'', additional_info: '', agentName: ''})
        }
        else
            toast.error(res.message)

        setLoading(false)
    }
    
    const handleRadioChange = (e) => {
        setLead({...lead, [e.target.name]: e.target.value})
        const value = e.target.value;
        if (value === "1") 
          setPriceText("Budget");
        else 
          setPriceText("Demand");
        
      };

   useEffect(() => {
   }, [priceText, lead])
   
    
  return (
    <div className='content'>
        <Row>
            <Col md='12'>
                <Card>
                    <CardHeader>
                        <CardTitle tag="h3">Add Finite Lead</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Form onSubmit={onSubmit}>
                            <Row>
                                <Col md='6'>
                                    <FormGroup>
                                        <label className='label'>Lead Type *</label><br />
                                        <div style={{padding:'0px 20px',display:'flex', gap: '40px' }}>
                                            <div>
                                                <Input type="radio" name="lead_type" value="0" onChange={handleRadioChange} required/> <p>Seller</p>
                                            </div>
                                            <div>
                                                <Input type="radio" name="lead_type" value="1" onChange={handleRadioChange}/> <p>Buyer</p>
                                            </div>
                                        </div>
                                    </FormGroup>
                                </Col>
                                <Col md='6'>
                                    <FormGroup>
                                        <label className='label'>Currently working with an agent? *</label><br />
                                        <div style={{padding:'0px 20px',display:'flex', gap: '40px' }}>
                                            <div>
                                                <Input type="radio" name="working_status" value="0" onChange={onChange} required/> <p>No</p>
                                            </div>
                                            <div>
                                                <Input type="radio" name="working_status" value="1" onChange={onChange}/> <p>Yes</p>
                                            </div>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                            
                            
                            <Row>
                                <Col md='6'>
                                    <FormGroup>
                                        <label className='label'>First Name *</label>
                                        <Input type='text' name='fname' required value={lead.fname} onChange={onChange}/>
                                    </FormGroup>
                                </Col>
                                <Col md='6'>
                                    <FormGroup>
                                        <label className='label'>Last Name *</label>
                                        <Input type='text' name='lname' value={lead.lname} required onChange={onChange}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <label className='label'>Address *</label>
                                        <Input type="text" name='address' value={lead.address} required onChange={onChange} />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <Row>
                                        <Col md="6">
                                            <FormGroup>
                                                <label className='label'>City *</label>
                                                <Input type="text" name='city' value={lead.city} required onChange={onChange} />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">       
                                            <FormGroup>
                                                <label className='label'>Zip Code *</label>
                                                <Input type="number" name='zip_code' required value={lead.zip_code} onChange={onChange} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <Row>
                                        <Col md="6">
                                            <FormGroup>
                                                <label className='label'>State *</label>
                                                <Input type="text" name='state' value={lead.state} required onChange={onChange} />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <label className='label'>Country *</label>
                                                <Input type="text" name='country' value={lead.country} required onChange={onChange} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md="6">
                                    <Row>
                                        <Col md="6">
                                            <FormGroup>
                                                <label className='label'>Beds *</label>
                                                <Input type="number" name='beds' required value={lead.beds} onChange={onChange} />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <label className='label'>Baths *</label>
                                                <Input type="number" name='baths' value={lead.baths} required onChange={onChange} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <label className='label'>Phone *</label>
                                        <Input type="number" name='phone' value={lead.phone} required onChange={onChange} />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <label className='label'>{priceText} *</label>
                                        <Input type="text" name='price' value={lead.price} required onChange={onChange} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <FormGroup style={{display:'flex', flexDirection: 'column', gap:'5px'}}>
                                <label className='label'>Aditional</label>
                                <textarea name="additional_info" value={lead.additional_info} onChange={onChange}></textarea>
                            </FormGroup>
                            <Row>
                                <Col md='6'>
                                    <FormGroup>
                                        <label className='label'>Agent Name *</label>
                                        <Input type="text" name='agentName' value={lead.agentName} required onChange={onChange} />
                                    </FormGroup>
                                </Col>
                                <Col md='6'>
                                    <FormGroup>
                                        <label className='label'>Recording Link </label>
                                        <Input type="text" name='recording_link' value={lead.recording_link} onChange={onChange} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Button disabled={loading? true : false} >Submit</Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default LeadForm