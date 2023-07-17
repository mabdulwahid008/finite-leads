import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Row, Table } from 'reactstrap'
import Loading from 'components/Loading/Loading'
import { Link } from 'react-router-dom'
import REAgentLeadStats from 'components/reAgentLeadStats/REAgentLeadStats'
import { RxExternalLink } from 'react-icons/rx'
import { FaTrash } from 'react-icons/fa'
import DeleteLead from 'components/deleteLead/DeleteLead'

function LeadListing() {
    const [leads, setLeads] = useState(null)
    const [yearMonth, setYearMonth] = useState([null, null])

    // pagination
    const [totalRecord, setTotalRecord] = useState(null)
    const [page, setPage] = useState(1)

    const [searching, setsearching] = useState('')
    const [searchingPage, setsearchingPage] = useState(1)
    
    const [deleteLeadPopup, setDeleteLeadPopup] = useState(false)
    const [leadToBeDelete, setLeadToBeDelete] = useState(null)
    const [refresh, setRefresh] = useState(null)

    const searchLead = async() => {
        if(searching === ''){
            setPage(1)
            fetchLeads()
            return;
        }
        

        const response = await fetch(`/lead/search/${searchingPage}/${searching}`, {
            method:'GET',
            headers: {
                'Content-Type':'Application/json',
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

    const deleteLead = async() => {
        const response = await fetch(`/lead/delete/${leadToBeDelete._id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            setDeleteLeadPopup(false)
            setRefresh(!refresh)
        }
        else
            toast.error(res.message)
    }


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

    useEffect(()=>{
        setLeads(null)
        searchLead()
    }, [searching, searchingPage])

    useEffect(()=>{

    }, [totalRecord])

    useEffect(() => {
        setLeads(null)
        fetchLeads()
    }, [page, yearMonth, refresh])
    
  return (
    <div className='content'>
        <Row>
            <Col md='12'>
                <Card>
                    <CardHeader>
                        <CardTitle tag='h4'>Leads</CardTitle>
                        <Link to="/add-lead"><Button>Add Lead</Button></Link>
                    </CardHeader>
                    <CardBody>
                        <Row style={{width:'50%'}}>
                            <Col md='5' className='pr-1'>
                                <FormGroup>
                                    <label>Select Month</label>
                                    <Input type="month" onChange={monthChange}/>
                                </FormGroup>
                            </Col>
                            <Col md='7' className='px-1'>
                                <FormGroup>
                                    <label>Search Lead</label>
                                    <Input type="text" placeholder='Search lead' onChange={(e)=>{setsearchingPage(1); setsearching(e.target.value)}}/>
                                </FormGroup>
                            </Col>
                        </Row>
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
                                    <th style={{width:'12%'}}>Agent</th>
                                    <th className='actions'>Actions</th>
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
                                        <div className='actions' style={{gap:5}}>
                                            <FaTrash onClick={() => {setLeadToBeDelete({_id:lead._id, name: lead.fname}); setDeleteLeadPopup(true)}} className='delete-lead'/>
                                            <Link to={`lead-details/${lead._id}`}><RxExternalLink/></Link>
                                        </div>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                        {searching === '' && <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                            <div className='dahboard-table'>
                                <Button className='next-prev' disabled={page === 1 ? true : false} onClick={()=>{if(page !== 1) setPage(page-1)}}>Prev</Button>
                                <Button className='next-prev' disabled={totalRecord > 0 && page < Math.ceil(totalRecord / 10) ? false : true} onClick={()=>{if(totalRecord > 0 && page < Math.ceil(totalRecord / 1)) setPage(page+1)}}>Next</Button>
                            </div>
                            <div>
                                <p  className='text-muted' style={{fontSize:12}}>Page: {page} / Total Leads: {totalRecord}</p>
                            </div>
                        </div>}
                         {/* these btns for searching api */}
                         {searching !== '' && <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                            <div className='dahboard-table'>
                                <Button className='next-prev' disabled={searchingPage === 1 ? true : false} onClick={()=>{if(searchingPage !== 1) setsearchingPage(searchingPage-1)}}>Prev</Button>
                                <Button className='next-prev' disabled={totalRecord > 0 && searchingPage < Math.ceil(totalRecord / 10) ? false : true} onClick={()=>{if(totalRecord > 0 && searchingPage < Math.ceil(totalRecord / 1)) setsearchingPage(searchingPage+1)}}>Next</Button>
                            </div>
                            <div>
                                <p  className='text-muted' style={{fontSize:12}}>Page: {searchingPage} / Total Leads: {totalRecord}</p>
                            </div>
                        </div>}
                        </>}
                    </CardBody>
                </Card>
            </Col>
        </Row>

        <REAgentLeadStats />
        {deleteLeadPopup && <DeleteLead leadToBeDelete={leadToBeDelete} setDeleteLeadPopup={setDeleteLeadPopup} deleteLead={deleteLead}/>}
    </div>
  )
}

export default LeadListing