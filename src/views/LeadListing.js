import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap'
import { BsEye } from 'react-icons/bs'
import Loading from 'components/Loading/Loading'
import LeadDetailPoup from 'components/leadDetailPoup/LeadDetailPoup'
import { Link } from 'react-router-dom'

function LeadListing() {
    const [leads, setLeads] = useState(null)
    const [detailPopup, setDetailPopup] = useState(false)
    const [leadDetail, setLeadDetail] = useState(null)

    
    const fetchLeads = async() => {
        const response = await fetch('/lead',{
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200)
            setLeads(res)
        else
            toast.error(res.message)
    }

    useEffect(() => {
      fetchLeads()
    }, [])
    
  return (
    <div className='content'>
        <Row>
            <Col md='12'>
                <Card>
                    <CardHeader>
                        <CardTitle tag='h4'>Leads</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {!leads && <Loading />}
                        {leads && <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>First Name</th>
                                    <th>State</th>
                                    <th>Beds & Baths</th>
                                    <th>Lead Type</th>
                                    <th>Wroking Outside</th>
                                    <th>Agent</th>
                                    <th className='actions'>View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((lead, index) => {
                                    return <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{lead.lname}</td>
                                        <td>{lead.state}</td>
                                        <td>{lead.beds} - {lead.baths}</td>
                                        <td>{lead.lead_type == 0 ? 'Seller' : 'Buyer'}</td>
                                        <td>{lead.working_status == 0 ? 'No' : 'Yes'}</td>
                                        <td>{lead.agentname}</td>
                                        <div className='actions'>
                                            {/* <BsEye  style={{fontSize: 28}} onClick={()=> {setDetailPopup(true); setLeadDetail(lead)}}/> */}
                                            <Link to={`lead-details/${lead._id}`}><BsEye/></Link>
                                        </div>
                                    </tr>
                                })}
                            </tbody>
                        </Table>}
                    </CardBody>
                </Card>
            </Col>
        </Row>
        {detailPopup &&  <LeadDetailPoup setDetailPopup={setDetailPopup} leadDetail={leadDetail}/>}
    </div>
  )
}

export default LeadListing