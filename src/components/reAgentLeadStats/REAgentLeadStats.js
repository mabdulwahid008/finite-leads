import { reactStyles } from 'assets/additional/reactStyles'
import Loading from 'components/Loading/Loading'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Row, Table } from 'reactstrap'
import ReactSelect from 'react-select'
import { RxExternalLink } from 'react-icons/rx'

function REAgentLeadStats() {

    // for filtering   
    const [from, setFrom] = useState(null)    
    const [to, setTo] = useState(null)    
    const [agnet_id, setAgent_Id] = useState(null)
    const [lead_count, setLead_count] = useState(null)
    const [page, setPage] = useState(1)


    // for api's response
    const [data, setData] = useState(null)
    const [totalRecord, setTotalRecord] = useState(null)
    const [reAgents, setREAgents] = useState([])

    const fetchREAgents = async() => {
        const response = await fetch('/user/2',{
            method: 'GET',
            headers:{
                'Content-Type' : 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            let options = [{value: null, label: 'CLEAR'}]
            for (let i = 0; i < res.length; i++) {
                let obj = {
                    value: res[i]._id,
                    label: res[i].name
                }
                options.push(obj)
            }
            setREAgents(options)
        }
        else
            toast.error(res.message)
    }

    const handleTimePeriod = ( e ) => {
        if(lead_count){
            setLead_count(null)
            setData([])
            document.getElementById('range').value = -1
        }
        if(e.target.name == 'from'){
            if(e.target.value == '')
                setFrom(null)
            else
                setFrom(e.target.value)
        }
        if(e.target.name == 'to'){
            if(e.target.value == '')
                setTo(null)
            else
                setTo(e.target.value)
        }
    }
    
    const handleLeadConunt = (e)=> {
        setPage(1)
        if(e.target.value == -1) 
            setLead_count(null); 
        else 
            setLead_count(e.target.value)
    }

    const fetchAgentStats = async() => {
        // restricting API to be called if from or to is null
        if((!from && to )|| (from && !to))
            return;
        // restricting API to be called if agent is selected and timeperiod is not specified
        if(agnet_id && !from && !to)
            return

        setData(null)

        const response = await fetch(`/lead/listing/agent-stats?page=${page}&from=${from}&to=${to}&agent_id=${agnet_id}&lead_count=${lead_count}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setData(res.data)
            setTotalRecord(res.totalAgents)
        }
        else
            toast.error(res.message)
    }

    useEffect(()=>{
        fetchREAgents()
    }, [])

    useEffect(()=>{
        fetchAgentStats()
    }, [lead_count, page, from, to, agnet_id])
  return (
    <Row>
        <Col md='12 mt-3'>
            <Card>
                <CardHeader style={{display:'flex', flexDirection:'column'}}>
                    <CardTitle tag="h4">RE Agent Stats</CardTitle>

                    <Row style={{width:'100%', alignItems:'flex-end'}}>
                        <Col md='10'>
                            <Row>
                                <Col className='pr-1' md='3'>
                                    <FormGroup>
                                        <label>From</label>
                                        <Input type='date' name='from' onChange={handleTimePeriod}/>
                                    </FormGroup>
                                </Col>
                                <Col className='px-1' md='3'>
                                    <FormGroup>
                                        <label>To</label>
                                        <Input type='date' name="to" onChange={handleTimePeriod}/>
                                    </FormGroup>
                                </Col>
                                <Col className='pl-1' md='3'>
                                    <FormGroup>
                                        <label>RE Agent</label>
                                        <ReactSelect styles={reactStyles} options={reAgents} onChange={(option)=>setAgent_Id(option.value)}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                        <Col md='2'>
                            <Row>
                                <Col className='pl-1' md='12'>
                                    <FormGroup>
                                        <label>Filter By Lead Count: {lead_count ? lead_count : ''}</label>
                                        <Input id='range' type='range' defaultValue={-1} min={-1} max={10} onChange={handleLeadConunt}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </CardHeader>
                <CardBody>
                    {!data && <Loading />}
                    {data?.length === 0 && <p>No data found</p>}
                    {data?.length > 0 && <>
                    <Table>
                        <thead>
                            <tr>
                                <th style={{width:'2%'}}>#</th>
                                <th style={{width:'25%'}}>Agent</th>
                                <th style={{width:'25%'}}>Address</th>
                                <th style={{width:'15%'}}>State</th>
                                <th style={{width:'10%'}}>Total Leads</th>
                                <th style={{width:'10%'}}>Accepted</th>
                                <th style={{width:'10%'}}>Rejected</th>
                                <th className='text-right'>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((d,index) => {
                                return <tr>
                                            <td>{index+1}</td>
                                            <td>{d.name}</td>
                                            <td>{d.address}</td>
                                            <td>{d.state}</td>
                                            <td>{d.totalLeads}</td>
                                            <td>{d.acceptedLeads}</td>
                                            <td>{d.rejectedLeads}</td>
                                            <div className='actions'>
                                                <RxExternalLink/>
                                            </div>
                                       </tr>
                            })}
                        </tbody>
                    </Table>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                            <div className='dahboard-table'>
                                <Button className='next-prev' disabled={page === 1 ? true : false} onClick={()=>{if(page !== 1) setPage(page-1)}}>Prev</Button>
                                <Button className='next-prev' disabled={totalRecord > 0 && page < Math.ceil(totalRecord / 1) ? false : true} onClick={()=>{if(totalRecord > 0 && page < Math.ceil(totalRecord / 1)) setPage(page+1)}}>Next</Button>
                            </div>
                            <div>
                                <p  className='text-muted' style={{fontSize:12}}>Page: {page} / Total RE Agents: {totalRecord}</p>
                            </div>
                    </div>
                    </>}
                </CardBody>
            </Card>
        </Col>
    </Row>
  )
}

export default REAgentLeadStats
