import Loading from 'components/Loading/Loading'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Row } from 'reactstrap'
import { RxExternalLink } from 'react-icons/rx'
import LeadMap from 'components/leadMap/LeadMap'
import CommentOnLead from 'components/commentOnLead/CommentOnLead'
import Page404 from './Page404'

function LeadDetail() {
  const { _id } = useParams()

  // lead data after fetching API
  const [lead, setLead] = useState(null)
  const [notFound, setNotFound] = useState(false)

  // API Calling
  const fetchlead = async () => {
    let url;
    // for RE agent
    if(localStorage.getItem('userRole') == 2)
      url = `/lead/my-leads/${_id}`
    // for admin
    else
      url = `/lead/${_id}`

    const response = await fetch(url,{
      method: 'GET',
      headers:{
        'Content-Type' : 'Application/json',
        token: localStorage.getItem('token')
      }
    })
    const res = await response.json()

    if(response.status === 200){
        setLead(res[0])
    }
    else if (response.status === 404)
      setNotFound(true)
    else
      toast.error(res.message)
  }


  useEffect(()=>{
    setNotFound(false)
    setLead(null)
    fetchlead()
  },[_id])
  return (
    <div className='content'>
        <Row>
            <Col md='12'>
                <Card>
                  {!lead && !notFound && <Loading />}
                  {lead && !notFound && <>
                     <CardHeader>
                       <CardTitle tag='h4'>
                          {lead.lead_type == 0 ? 'Seller' : 'Buyer'} Lead
                          {localStorage.getItem('userRole') != 2 && <p className='text-muted'>By: {lead.agentname}</p>}
                        </CardTitle>
                        {lead.recording_link && lead.recording_link.length > 3 ? <a href={lead.recording_link} target="BLANK"><RxExternalLink/></a> : ""}
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
                                        <label>{lead.lead_type == 0 ? 'Demand' : 'Budget'}</label>
                                        <Input readOnly value={`${lead.price} $`} />
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
                      </CardBody>
                  </>}
                </Card>
                  {!lead && notFound && <Page404 error="Lead not found" status="404"/>}
            </Col>
        </Row>
          
        {/* Comments */}
        <Row>
          <Col md="12 mt-1">
             {lead && !notFound && <CommentOnLead lead_id={lead._id}/>}
          </Col>
        </Row>


        {/* Map */}
        {localStorage.getItem('userRole') != 2 && <Row>
          <Col md="12 mt-1">
                {lead && !notFound && <LeadMap lead_id={lead._id} street={lead.address} zipcode={lead.zip_code} state={lead.state} city={lead.city} country={lead.country}/>}
          </Col>
        </Row>}

        

    </div>
  )
}

export default LeadDetail