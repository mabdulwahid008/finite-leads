import Loading from 'components/Loading/Loading'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Row } from 'reactstrap'
import { RxExternalLink } from 'react-icons/rx'
import { BsChevronDown } from 'react-icons/bs'
import LeadMap from 'components/leadMap/LeadMap'

function LeadDetail() {
  const { _id } = useParams()

  const [lead, setLead] = useState(null)

  const fetchlead = async () => {
    const response = await fetch(`/lead/${_id}`,{
      method: 'GET',
      headers:{
        'Content-Type' : 'Application/json',
        token: localStorage.getItem('token')
      }
    })
    const res = await response.json()
    if(response.status === 200)
      setLead(res)
    else
      toast.error(res.message)
  }

  useEffect(()=>{
    fetchlead()
  },[])
  return (
    <div className='content'>
        <Row>
            <Col md='12'>
                <Card>
                  {!lead && <Loading />}
                  {lead && <>
                     <CardHeader>
                       <CardTitle tag='h4'>
                          {lead.lead_type == 0 ? 'Seller' : 'Buyer'} Lead
                          <p className='text-muted'>By: {lead.agentname}</p>
                        </CardTitle>
                        {lead.recording_link.length > 3 ? <a href={lead.recording_link} target="BLANK"><RxExternalLink/></a> : ""}
                      </CardHeader>
                      <CardBody>
                        <Row style={{alignItems: 'flex-end'}}>
                            <Col md='6'>
                                <p className='name'>{lead.fname} {lead.lname}</p>
                                <p className='address'>{lead.address}</p>
                                <p className='address'>{lead.zip_code} - {lead.state}</p>
                            </Col>
                            <Col md='6'>
                                <p className='text-muted working-status'>Working with other Agents?</p>
                                <p className='working-status'>{lead.working_status == 0 ? 'No' : 'Yes'}</p>
                            </Col>
                        </Row>

                        <div className='lead-content'>
                            <Row>
                                <Col md='6'>
                                    <FormGroup>
                                        <label>Beds</label>
                                        <Input readOnly value={lead.beds} />
                                    </FormGroup>
                                </Col>
                                <Col md='6'>
                                    <FormGroup>
                                        <label>Baths</label>
                                        <Input readOnly value={lead.baths} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md='6'>
                                    <FormGroup>
                                        <label>Phone</label>
                                        <Input readOnly value={lead.phone} />
                                    </FormGroup>
                                </Col>
                                <Col md='6'>
                                    <FormGroup>
                                        <label>{lead.lead_type == 0 ? 'Budget' : 'Demand'}</label>
                                        <Input readOnly value={`${lead.price}$`} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md='12'>
                                    <FormGroup style={{display:'flex', flexDirection:'column', gap:5}}>
                                        <label>Additional</label>
                                        <textarea readOnly value={lead.additional_info} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>

                        {/* Assigning Lead Section */}
                        <div className='assign-lead'>
                          <Input type='checkbox' id='assignlead'/>
                          <label style={{textAlign:'right'}} htmlFor='assignlead'>Assign Lead <BsChevronDown/></label>
                          <div className='map'>
                            <LeadMap />
                          </div>
                          <hr  style={{margin:0}}/>
                        </div>

                      {/* Commments Section*/}
                        <div className='lead-comments'>
                          <Input type='checkbox' id='leadcomments'/>
                          <label style={{textAlign:'right'}} htmlFor='leadcomments'>Comments By Real Estate Agents <BsChevronDown/></label>
                          <div className='comment-box'>
                              <div className='comment'>
                                <div>
                                  <p>Agent Name</p>
                                  <p>Status</p>
                                </div>
                                <textarea readOnly></textarea>
                              </div>
                              <div className='comment'>
                                <div>
                                  <p>Agent Name</p>
                                  <p>Status</p>
                                </div>
                                <textarea readOnly></textarea>
                              </div>
                              <div className='comment'>
                                <div>
                                  <p>Agent Name</p>
                                  <p>Status</p>
                                </div>
                                <textarea readOnly></textarea>
                              </div>
                          </div>
                          <hr  style={{margin:0}}/>
                        </div>

                        

                      </CardBody>
                  </>}
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default LeadDetail