import React, { useState }  from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap'
import { SALES_AGENTS } from '../variables/SalesAgents'

function SalesAgents() {
    const [saleAgents, setSaleAgents] = useState(SALES_AGENTS)
  return (
    <div className='content'>
        <Row>
            <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4">Sales Agents</CardTitle>
                        <Button color='primary'>Add New</Button>
                    </CardHeader>
                    <CardBody>
                        <Table>
                            <thead>
                                <th style={{width: '5%'}}>#</th>
                                <th style={{width: '15%'}}>Name</th>
                                <th style={{width: '20%'}}>Phone</th>
                                <th style={{width: '20%'}}>Email</th>
                                <th style={{width: '20%'}}>Address</th>
                                <th>Actions</th>
                            </thead>
                            <tbody>
                                {saleAgents.map((agent, index)=>{
                                    return <tr>
                                        <td>{index+1}</td>
                                        <td>{agent.name}</td>
                                        <td>{agent.phone}</td>
                                        <td>{agent.email}</td>
                                        <td>{agent.address}</td>
                                        <div>
                                            hell
                                        </div>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default SalesAgents