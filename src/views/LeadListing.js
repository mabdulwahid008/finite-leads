import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap'
import { BsEye } from 'react-icons/bs'
import Loading from 'components/Loading/Loading'

function LeadListing() {
    const [leads, setLeads] = useState(null)
    
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
                                    <th>Lead Type</th>
                                    <th>Wroking Outside</th>
                                    <th>State</th>
                                    <th>First Name</th>
                                    <th>Beds & Baths</th>
                                    <th>Agent</th>
                                    <th className='actions'>View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((lead, index) => {
                                    return <tr>
                                        <td>{index+1}</td>
                                        <td>{lead.lead_type == 0 ? 'Seller' : 'Buyer'}</td>
                                        <td>{lead.working_status == 0 ? 'No' : 'Yes'}</td>
                                        <td>{lead.state}</td>
                                        <td>{lead.fname}</td>
                                        <td>{lead.beds} - {lead.baths}</td>
                                        <td>{lead.agentname}</td>
                                        <div className='actions'>
                                            <BsEye  style={{fontSize: 28}}/>
                                        </div>
                                    </tr>
                                })}
                            </tbody>
                        </Table>}
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default LeadListing