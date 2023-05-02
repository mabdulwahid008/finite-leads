import React, { useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Row, Table } from 'reactstrap'
import { Link } from 'react-router-dom'
import { BsEye } from 'react-icons/bs'
import Loading from 'components/Loading/Loading'

function LeadsAssignedToREA() {
    const [leads, setLeads] = useState(null)

    const date = new Date()
    const month = `${date.getFullYear()}-${date.getMonth()+1 <= 9 ? `0${date.getMonth()}` : date.getMonth()}`

    const fetchMyLeads = async() => {
        const response = await fetch('/lead/agent/leads', {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setLeads(res)
        }
        else
            toast.error(res.message)
    }

    useEffect(()=>{
        fetchMyLeads()
    }, [])
  return (
    <div className='content'>
      <Row>
        <Col md="12">
            <Card>
                <CardHeader>
                    <CardTitle tag="h4">My Leads</CardTitle>
                </CardHeader>
                <CardBody>
                    <FormGroup style={{width: 200}}>
                        <label>Select Month</label>
                        <Input type="month" defaultValue={month} />
                    </FormGroup>
                    {!leads && <Loading/>}
                    {leads && leads.length === 0 && <p>No leads found</p>}
                    {leads && leads.length !== 0 && <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>State</th>
                                <th>Beds & Baths</th>
                                <th>Lead Type</th>
                                <th>Wroking Outside</th>
                                <th>Assigned on</th>
                                <th className='actions'>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead, index)=> {
                                return <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{lead.fname}</td>
                                    <td>{lead.state}</td>
                                    <td>{lead.beds} * {lead.baths}</td>
                                    <td>{lead.lead_type == 0 ? 'Seller' : 'Buyer'}</td>
                                    <td>{lead.working_status == 0 ? 'No' : 'Yes'}</td>
                                    <td>{lead.assigned_on}</td>
                                    <div className='actions'>
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
    </div>
  )
}

export default LeadsAssignedToREA
