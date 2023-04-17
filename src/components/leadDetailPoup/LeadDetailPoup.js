import React from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Row } from 'reactstrap'
import { RxCross1 } from 'react-icons/rx'
import ReactSelect from 'react-select'

function LeadDetailPoup({ setDetailPopup, leadDetail }) {
  return (
    <div className='popup'>
        <div className="overlay"></div>
        <Card className='card-popup lead-popup'>
            <CardHeader>
                <CardTitle tag='h4'>{leadDetail.lead_type == 0 ? 'Seller' : 'Buyer'} Lead
                    <p className='text-muted'>By: {leadDetail.agentname}</p>
                </CardTitle>
                <RxCross1 onClick={()=> setDetailPopup(false)}/>
            </CardHeader>
            <CardBody>
                <Row style={{alignItems: 'flex-end'}}>
                    <Col md='6'>
                        <p className='name'>{leadDetail.fname} {leadDetail.lname}</p>
                        <p className='address'>{leadDetail.address}</p>
                        <p className='address'>{leadDetail.zip_code} - {leadDetail.state}</p>
                    </Col>
                    <Col md='6'>
                        <p className='text-muted working-status'>Working with other Agents?</p>
                        <p className='working-status'>{leadDetail.working_status == 0 ? 'No' : 'Yes'}</p>
                    </Col>
                </Row>
                <div className='lead-content'>
                    <Row>
                        <Col md='6'>
                            <FormGroup>
                                <label>Beds</label>
                                <Input readOnly value={leadDetail.beds} />
                            </FormGroup>
                        </Col>
                        <Col md='6'>
                            <FormGroup>
                                <label>Baths</label>
                                <Input readOnly value={leadDetail.baths} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='6'>
                            <FormGroup>
                                <label>Phone</label>
                                <Input readOnly value={leadDetail.phone} />
                            </FormGroup>
                        </Col>
                        <Col md='6'>
                            <FormGroup>
                                <label>{leadDetail.lead_type == 0 ? 'Budget' : 'Demand'}</label>
                                <Input readOnly value={`${leadDetail.price}$`} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='12'>
                            <FormGroup style={{display:'flex', flexDirection:'column', gap:5}}>
                                <label>Additional</label>
                                <textarea readOnly value={leadDetail.additional} />
                            </FormGroup>
                        </Col>
                    </Row>
                </div>

                <div className='assign-lead'>
                    <Row>
                        <Col md='9'>
                            <FormGroup>
                                <label>Assign this lead to Real Estate Agents</label>
                                <ReactSelect />
                            </FormGroup>
                        </Col>
                        <Col col='2'>
                            <Button>Assign</Button>
                        </Col>
                    </Row>
                </div>

                {/* <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', gap:50, marginBottom: 5}}>
                    <div>
                        <p className='text-muted'>Lead Type</p>
                    </div>
                    <div style={{width: '70%'}}>
                        <Input disabled value={leadDetail.lead_type == 0 ? 'Seller' : 'Buyer'}/>
                    </div>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', gap:50, marginBottom: 5}}>
                    <div>
                        <p className='text-muted'>Working Type</p>
                    </div>
                    <div style={{width: '70%'}}>
                        <Input disabled value={leadDetail.working_status == 0 ? 'No' : 'Yes'}/>
                    </div>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', gap:50, marginBottom: 5}}>
                    <div>
                        <p className='text-muted'>First Name</p>
                    </div>
                    <div style={{width: '70%'}}>
                        <Input disabled value={leadDetail.fname}/>
                    </div>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', gap:50, marginBottom: 5}}>
                    <div>
                        <p className='text-muted'>Last Name</p>
                    </div>
                    <div style={{width: '70%'}}>
                        <Input disabled value={leadDetail.lname}/>
                    </div>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', gap:50, marginBottom: 5}}>
                    <div>
                        <p className='text-muted'>Address</p>
                    </div>
                    <div style={{width: '70%'}}>
                        <Input disabled value={leadDetail.address}/>
                    </div>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', gap:50, marginBottom: 5}}>
                    <div>
                        <p className='text-muted'>State</p>
                    </div>
                    <div style={{width: '70%'}}>
                        <Input disabled value={leadDetail.state}/>
                    </div>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', gap:50, marginBottom: 5}}>
                    <div>
                        <p className='text-muted'>Zip Code</p>
                    </div>
                    <div style={{width: '70%'}}>
                        <Input disabled value={leadDetail.zip_code}/>
                    </div>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', gap:50, marginBottom: 5}}>
                    <div>
                        <p className='text-muted'>Beds</p>
                    </div>
                    <div style={{width: '70%'}}>
                        <Input disabled value={leadDetail.beds}/>
                    </div>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', gap:50, marginBottom: 5}}>
                    <div>
                        <p className='text-muted'>Baths</p>
                    </div>
                    <div style={{width: '70%'}}>
                        <Input disabled value={leadDetail.baths}/>
                    </div>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', gap:50, marginBottom: 5}}>
                    <div>
                        <p className='text-muted'>Phone</p>
                    </div>
                    <div style={{width: '70%'}}>
                        <Input disabled value={leadDetail.phone}/>
                    </div>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', gap:50, marginBottom: 5}}>
                    <div>
                        <p className='text-muted'>Additional</p>
                    </div>
                    <div style={{width: '70%'}}>
                        <textarea disabled value={leadDetail.additional}/>
                    </div>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', gap:50, marginBottom: 5}}>
                    <div>
                        <p className='text-muted'>Recording Link</p>
                    </div>
                    <div style={{width: '70%'}}>
                        <Input disabled value={leadDetail.recording_link}/>
                    </div>
                </div> */}
            </CardBody>
        </Card>
    </div>
  )
}

export default LeadDetailPoup