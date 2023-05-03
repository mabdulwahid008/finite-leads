import React, { useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Row, Table } from 'reactstrap'
import { Link } from 'react-router-dom'
import { BsEye } from 'react-icons/bs'
import Loading from 'components/Loading/Loading'
import ReactSelect from 'react-select'
import { reactStyles } from 'assets/additional/reactStyles'

const leadStatus = [
    { value : 99, label : 'All'},
    { value : 1, label : 'Rejected'},
    { value : 10, label : 'Accepted'},
    { value : 4, label : 'Follow Up'},
    { value : 5, label : 'On Contract'},
    { value : 2, label : 'Listed'},
    { value : 3, label : 'Sold'},
]



function LeadsAssignedToREA() {
    const date = new Date()
    const thisMonth = `${date.getFullYear()}-${date.getMonth()+1 <= 9 ? `0${date.getMonth()+1}` : date.getMonth()+1}`

    // for getting leads
    const [leads, setLeads] = useState(null)
    // for filtering leads
    const [yearMonth, setYearMonth] = useState(thisMonth.split('-'))
    const [status, seStatus] = useState(leadStatus[0].value)


   
    const monthChange = (e) => {
        let date = e.target.value.split('-')
        setYearMonth(date)
        setLeads(null)
        fetchMyLeads(date[0], date[1])
    }

    const fetchMyLeads = async(year = yearMonth[0], month = yearMonth[1]) => {
        // its because useState was not setting 0 value 
        let lead_status = status 
        if(lead_status == 10)
            lead_status = 0

        const response = await fetch(`/lead/agent/leads/${year}/${month}/${lead_status}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            console.log(res);
            setLeads(res)
        }
        else
            toast.error(res.message)
    }


    useEffect(()=>{
        if(status)
            fetchMyLeads()
    }, [status])
  return (
    <div className='content'>
      <Row>
        <Col md="12">
            <Card>
                <CardHeader>
                    <CardTitle tag="h4">My Leads</CardTitle>
                </CardHeader>
                <CardBody>
                    <div style={{display:'flex', gap:20}}>
                        <FormGroup style={{width: 200}}>
                            <label>Select Month</label>
                            <Input type="month" defaultValue={thisMonth} onChange={monthChange}/>
                        </FormGroup>
                        <FormGroup style={{width: 200}}>
                            <label>Filter Category</label>
                            <ReactSelect options={leadStatus} styles={reactStyles} onChange={(option) => seStatus(option.value)}/>
                        </FormGroup>
                    </div>
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
                                <th>Status</th>
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
                                    <td ><span style={{backgroundColor:'#7fff7f', padding:'3px 5px', color:'black', borderRadius:20}}>{lead.current_status} Accepted</span></td>
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
