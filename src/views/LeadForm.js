import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row } from 'reactstrap'
import '../assets/additional/LeadForm.css'

function LeadForm() {
    const [priceText, setPriceText] = useState("Demand")
    const [lead, setLead] = useState({lead_type: '', working_status: '', fname: '', lname: '', address: '', state: '', zip_code: '', phone: '', recording_link: null, beds: '', baths: '', price:'', additional_info: null, agentName: ''})

    const onChange = (e) => {
        setLead({...lead, [e.target.name]: e.target.value})
    }

    const onSubmit = async(e) => {
        e.preventDefault()
        const response = await fetch('/lead',{
            method:'POST',
            headers:{
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify(lead)
        })
        const res = await response.json()
        if(response.status === 200)
            toast.success(res.message)
        else
            toast.error(res.message)
    }
    
    const handleRadioChange = (e) => {
        setLead({...lead, [e.target.name]: e.target.value})
        const value = e.target.value;
        if (value === "1") {
          setPriceText("Budget");
        } else {
          setPriceText("Demand");
        }
      };

   useEffect(() => {
   }, [priceText])
   
    
  return (
    <div className='content'>
        <Row style={{display:'flex', margin:0, justifyContent: 'center', alignItems:'center', overflow: 'hiden', padding:'50px 0px', width: '100%', background: '#f4f3ef'}}>
            <Col md='8'>
                <Card>
                    <CardHeader>
                        <CardTitle tag="h3">Add Lead</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Form>
                            <Row>
                                <Col md='6'>
                                    <FormGroup>
                                        <label>Lead Type *</label><br />
                                        <div style={{padding:'0px 20px',display:'flex', gap: '40px' }}>
                                            <div>
                                                <Input type="radio" name="lead_type" value="0" onChange={handleRadioChange}/> <p>Seller</p>
                                            </div>
                                            <div>
                                                <Input type="radio" name="lead_type" value="1" onChange={handleRadioChange}/> <p>Buyer</p>
                                            </div>
                                        </div>
                                    </FormGroup>
                                </Col>
                                <Col md='6'>
                                    <FormGroup>
                                        <label>Currently working with an agent? *</label><br />
                                        <div style={{padding:'0px 20px',display:'flex', gap: '40px' }}>
                                            <div>
                                                <Input type="radio" name="working_status" value="0" onChange={onChange}/> <p>No</p>
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
                                        <label>First Name *</label>
                                        <Input type='text' name='fname' required onChange={onChange}/>
                                    </FormGroup>
                                </Col>
                                <Col md='6'>
                                    <FormGroup>
                                        <label>Last Name *</label>
                                        <Input type='text' name='lname' required onChange={onChange}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <label>Address *</label>
                                        <Input type="text" name='address' required onChange={onChange} />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <label>State *</label>
                                        <Input type="text" name='state' required onChange={onChange} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <label>Zip Code *</label>
                                        <Input type="number" name='zip_code' required onChange={onChange} />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <Row>
                                        <Col md="6">
                                            <FormGroup>
                                                <label>Beds *</label>
                                                <Input type="number" name='beds' required onChange={onChange} />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <label>Baths *</label>
                                                <Input type="number" name='baths' required onChange={onChange} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <label>Phone *</label>
                                        <Input type="number" name='phone' required onChange={onChange} />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <label>{priceText} *</label>
                                        <Input type="number" name='price' required onChange={onChange} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <FormGroup style={{display:'flex', flexDirection: 'column', gap:'5px'}}>
                                <label>Aditional</label>
                                <textarea name="additional_info" onChange={onChange}></textarea>
                            </FormGroup>
                            <Row>
                                <Col md='6'>
                                    <FormGroup>
                                        <label>Agent Name *</label>
                                        <Input type="text" name='agentName' required onChange={onChange} />
                                    </FormGroup>
                                </Col>
                                <Col md='6'>
                                    <FormGroup>
                                        <label>Recording Link </label>
                                        <Input type="text" name='recording_link' required onChange={onChange} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Button style={{width:'100%'}}>Submit</Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default LeadForm