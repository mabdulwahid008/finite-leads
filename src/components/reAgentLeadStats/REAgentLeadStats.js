import Loading from 'components/Loading/Loading'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Row, Table } from 'reactstrap'

function REAgentLeadStats() {

    // for filtering
    const [from, setFrom] = useState(null)
    const [to, setTo] = useState(null)
    const [agnet_id, setAgent_Id] = useState(null)
    const [lead_count, setLead_count] = useState(null)
    const [page, setPage] = useState(1)


    // for api's response
    const [data, setData] = useState(null)
    const [agents, setAgents] = useState(null)

    const fetchAgentStats = async() => {
        const response = await fetch(`/lead/listing/agent-stats?page=${page}&from=null&to=null&agent_id=null&lead_count=${lead_count}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setData(res.data)
            setAgents(res.totalAgents)
        }
        else
            toast.error(res.message)
    }

    useEffect(()=>{
        setData(null)
        fetchAgentStats()
    }, [lead_count])
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
                                        <Input type='date' />
                                    </FormGroup>
                                </Col>
                                <Col className='px-1' md='3'>
                                    <FormGroup>
                                        <label>To</label>
                                        <Input type='date' />
                                    </FormGroup>
                                </Col>
                                <Col className='pl-1' md='3'>
                                    <FormGroup>
                                        <label>Agent</label>
                                        <Input type='date' />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                        <Col md='2'>
                            <Row>
                                <Col className='pl-1' md='12'>
                                    <FormGroup>
                                        <label>Filter By Lead Count: {lead_count ? lead_count : ''}</label>
                                        <Input type='range' defaultValue={-1} min={-1} max={10} onChange={(e)=>{if(e.target.value == -1) setLead_count(null); else setLead_count(e.target.value)}}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </CardHeader>
                <CardBody>
                    {!data && <Loading />}
                    {data && <>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Agent</th>
                                <th>State</th>
                                <th>Assigned Leads</th>
                                <th>Rejected Leads</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((d,index) => {
                                return <tr>
                                            <td>{index+1}</td>
                                            <td>{d.name}</td>
                                            <td>{d.state}</td>
                                            <td>{d.totalLeads}</td>
                                            <td>{d.rejectedLeads}</td>
                                       </tr>
                            })}
                        </tbody>
                    </Table>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                            <div className='dahboard-table'>
                                <Button className='next-prev' disabled={page === 1 ? true : false} onClick={()=>{if(page !== 1) setPage(page-1)}}>Prev</Button>
                                <Button className='next-prev' disabled={agents > 0 && page < Math.ceil(agents / 10) ? false : true} onClick={()=>{if(agents > 0 && page < Math.ceil(agents / 1)) setPage(page+1)}}>Next</Button>
                            </div>
                            <div>
                                <p  className='text-muted' style={{fontSize:12}}>Page: {page} / Total RE Agents: {agents}</p>
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
