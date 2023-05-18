import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap';

function REAgentStatsListing() {
    const { id } = useParams()
    const [data, setData] = useState(null)

    const getData = async () => {
        const response = await fetch(`/lead/agent-stats/${id}`,{
            method:'Get',
            headers: {
                'Content-Type':'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setData(res)
        }
        else
            toast.error(res.message)
    }

    useEffect(()=>{
        getData()
    }, [])

  return (
    <div className='content'>
        <Row>
            <Col md="12">
                <Card>
                    {data && <>
                    <CardHeader>
                        <CardTitle tag="h4">{data.name}
                        <p>{data.address}, {data.state} </p>
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        {data.leads?.map((month)=>{
                                        return <div style={{marginBottom:20}}>
                                        <h6>{month.month}</h6>
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Name</th>
                                                    <th>Address</th>
                                                    <th>State</th>
                                                    <th>Assigned On</th>
                                                    <th>Current Status</th>
                                                </tr>
                                            </thead>
                                        {month.leads?.map((lead, index)=>{
                                            return <tr>
                                                <td>{index+1}</td>
                                                <td>{lead.fname} {lead.lname}</td>
                                                <td>{lead.address}</td>
                                                <td>{lead.state}</td>
                                                <td>{lead.assigned_on}</td>
                                                <td>{lead.current_status}</td>
                                            </tr>
                                        })}
                                        </Table>
                                        </div>
                                    })}
                        </CardBody>
                    </>}
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default REAgentStatsListing
