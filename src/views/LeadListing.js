import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Row, Table } from 'reactstrap'
import Loading from 'components/Loading/Loading'
import { Link } from 'react-router-dom'
import REAgentLeadStats from 'components/reAgentLeadStats/REAgentLeadStats'
import { RxExternalLink } from 'react-icons/rx'

function LeadListing() {
    const [leads, setLeads] = useState(null)
    const [yearMonth, setYearMonth] = useState([null, null])

    // pagination
    const [totalRecord, setTotalRecord] = useState(null)
    const [page, setPage] = useState(1)

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

    
    const fetchLeads = async() => {
        const response = await fetch(`/lead?year=${yearMonth[0]}&month=${yearMonth[1]}&page=${page}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setLeads(res.leads)
            setTotalRecord(res.totalRows)
        }
        else
            toast.error(res.message)
    }

    useEffect(() => {
        setLeads(null)
        fetchLeads()
    }, [page, yearMonth])
    
  return (
    <div className='content'>
        <Row>
            <Col md='12'>
                <Card>
                    <CardHeader>
                        <CardTitle tag='h4'>Leads</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <FormGroup style={{width: 200}}>
                            <label>Select Month</label>
                            <Input type="month" onChange={monthChange}/>
                        </FormGroup>
                        {!leads && <Loading />}
                        {leads && leads.length === 0 && <p>No Leads yet</p>}
                        {leads && leads.length !== 0 && <>
                        <Table>
                            <thead>
                                <tr>
                                    <th style={{width:'2%'}}>#</th>
                                    <th style={{width:'12%'}}>First Name</th>
                                    <th style={{width:'10%'}}>Lead Type</th>
                                    <th style={{width:'15%'}}>Working Outside</th>
                                    <th style={{width:'18%'}}>Address</th>
                                    <th style={{width:'10%'}}>State</th>
                                    <th style={{width:'15%'}}>Created_on</th>
                                    <th style={{width:'15%'}}>Agent</th>
                                    <th className='actions'>View</th>
                                </tr>
                            </thead>
                            <tbody> 
                                {leads.map((lead, index) => {
                                    return <tr key={index}>
                                        <td>{(page-1 === 0? '' : page-1)}{(index+1 === 10? 0 : index+1)}</td>
                                        <td>{lead.fname}</td>
                                        <td>{lead.lead_type == 0 ? 'Seller' : 'Buyer'}</td>
                                        <td>{lead.working_status == 0 ? 'No' : 'Yes'}</td>
                                        <td>{lead.address}</td>
                                        <td>{lead.state}</td>
                                        <td>{lead.created_on}</td>
                                        <td>{lead.agentname}</td>
                                        <div className='actions'>
                                            <Link to={`lead-details/${lead._id}`}><RxExternalLink/></Link>
                                        </div>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                            <div className='dahboard-table'>
                                <Button className='next-prev' disabled={page === 1 ? true : false} onClick={()=>{if(page !== 1) setPage(page-1)}}>Prev</Button>
                                <Button className='next-prev' disabled={totalRecord > 0 && page < Math.ceil(totalRecord / 10) ? false : true} onClick={()=>{if(totalRecord > 0 && page < Math.ceil(totalRecord / 1)) setPage(page+1)}}>Next</Button>
                            </div>
                            <div>
                                <p  className='text-muted' style={{fontSize:12}}>Page: {page} / Total Leads: {totalRecord}</p>
                            </div>
                        </div>
                        </>}
                    </CardBody>
                </Card>
            </Col>
        </Row>

        <REAgentLeadStats />
    </div>
  )
}

export default LeadListing