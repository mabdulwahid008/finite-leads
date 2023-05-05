import React, { useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Row, Table } from 'reactstrap'
import { Link } from 'react-router-dom'
import { BsEye } from 'react-icons/bs'
import Loading from 'components/Loading/Loading'
import ReactSelect from 'react-select'
import { reactStyles } from 'assets/additional/reactStyles'

const leadStatus =[
    { value: 99, label: 'All' },
    { value: 1, label: 'Rejected', color: '#ff7f7f' },
    { value: 10, label: 'Accepted', color: '#7fff7f' },
    { value: 4, label: 'Follow Up', color: '#ffff7f' },
    { value: 5, label: 'On Contract', color: '#7fbfff' },
    { value: 2, label: 'Listed', color: '#bf7fff' },
    { value: 3, label: 'Sold', color: '#ffbf7f' }
]



function LeadsAssignedToREA() {
    const date = new Date()
    const thisMonth = `${date.getFullYear()}-${date.getMonth()+1 <= 9 ? `0${date.getMonth()+1}` : date.getMonth()+1}`

    // for getting leads
    const [leads, setLeads] = useState(null)
    // pagination
    const [totalRecord, setTotalRecord] = useState(null)
    const [page, setPage] = useState(1)

    // for filtering leads
    const [status, seStatus] = useState(leadStatus[0].value)
    const [yearMonth, setYearMonth] = useState([null, null])

   
    const monthChange = (e) => {
        if(e.target.value == ''){
            setLeads(null)
            setYearMonth([null, null])
        }
        else{
            let date = e.target.value.split('-')
            setYearMonth([date[0], date[1]])
            setLeads(null)
        }
    }

    const fetchMyLeads = async(year = null, month = null) => {
        // its because useState was not setting 0 value 
        let lead_status = status 
        if(lead_status == 10)
            lead_status = 0

        const response = await fetch(`/lead/agent/leads/${yearMonth[0]}/${yearMonth[1]}/${lead_status}/${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            res.data.forEach(lead => {
               const status = leadStatus.filter((status) => status.value == (lead.current_status == 0 ? 10 : lead.current_status))
               if(lead.current_status != 99)
                    lead.current_status = status[0].label
                    lead.color = status[0].color
            });
            setLeads(res.data)
            setTotalRecord(res.totalRows)
        }
        else
            toast.error(res.message)
    }


    useEffect(()=>{
        if(status)
            fetchMyLeads()
    }, [status, page, yearMonth])
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
                            <Input type="month" onChange={monthChange}/>
                        </FormGroup>
                        <FormGroup style={{width: 200}}>
                            <label>Filter Category</label>
                            <ReactSelect options={leadStatus} styles={reactStyles} onChange={(option) => {seStatus(option.value); setPage(1)}}/>
                        </FormGroup>
                    </div>
                    {!leads && <Loading/>}
                    {leads && leads.length === 0 && <p>No leads found</p>}
                    {leads && leads.length !== 0 && <>
                    <Table>
                        <thead>
                            <tr>
                                <th style={{width:'2%'}}>#</th>
                                <th style={{width:'12%'}}>First Name</th>
                                <th style={{width:'10%'}}>Lead Type</th>
                                <th style={{width:'15%'}}>Wroking Outside</th>
                                <th style={{width:'18%'}}>Address</th>
                                <th style={{width:'10%'}}>State</th>
                                <th style={{width:'15%'}}>Assigned on</th>
                                <th style={{width:'0%'}}>Status</th>
                                <th className='actions'>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead, index)=> {
                                return <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{lead.fname}</td>
                                    <td>{lead.lead_type == 0 ? 'Seller' : 'Buyer'}</td>
                                    <td>{lead.working_status == 0 ? 'No' : 'Yes'}</td>
                                    <td>{lead.address}</td>
                                    <td>{lead.state}</td>
                                    <td>{lead.assigned_on}</td>
                                    <td>
                                        <span style={{padding:'2px 5px 4px', borderRadius:'10px', color:'black' ,backgroundColor:`${lead.current_status == 99 ? '' :lead.color }`}}>
                                            {lead.current_status == 99 ? '---' : lead.current_status}
                                        </span>
                                    </td>
                                    <div className='actions'>
                                        <Link to={`lead-details/${lead._id}`}><BsEye/></Link>
                                    </div>
                                </tr>
                            })}
                        </tbody>
                    </Table>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <div>
                            <Button className='next-prev' disabled={page === 1 ? true : false} onClick={()=>{if(page !== 1) setPage(page-1)}}>Prev</Button>
                            <Button className='next-prev' disabled={totalRecord > 0 && page < Math.ceil(totalRecord / 1) ? false : true} onClick={()=>{if(totalRecord > 0 && page < Math.ceil(totalRecord / 1)) setPage(page+1)}}>Next</Button>
                        </div>
                        <div>
                            <p>Page: {page} / Total Leads: {totalRecord}</p>
                        </div>
                    </div>
                    </>}
                </CardBody>
            </Card>
        </Col>
      </Row>
    </div>
  )
}

export default LeadsAssignedToREA
