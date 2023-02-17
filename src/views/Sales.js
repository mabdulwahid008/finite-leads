import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, Table } from 'reactstrap'
import { SALES } from '../variables/Sales'
import { FaRegEdit, FaTrash } from "react-icons/fa";

function Sales() {
    const [sales, setsSles] = useState(SALES)
  return (
    <div className='content'>    
        <Row>
            <Col md="12">
                <Card>
                    <CardHeader style={{flexDirection:'column', alignItems:'flex-start'}}>
                        <div style={{display:"flex", justifyContent:'space-between', width:'100%'}}>
                            <CardTitle tag="h4">Sales</CardTitle>
                            <Button>Add New</Button>
                        </div>
                        <div style={{display:"flex", alignItems:"flex-end", gap:10, width:'20%'}}>
                            <Input type='date' name="from"/>
                            <Input type='date' name="to"/>
                            <Button className='btn-primary'>Filter</Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Table>
                            <thead>
                                <th style={{width: '5%'}}>#</th>
                                <th style={{width: '20%'}}>Client Name</th>
                                <th style={{width: '15%'}}>Client Phone</th>
                                <th style={{width: '20%'}}>Client Address</th>
                                <th style={{width: '15%'}}>Added On</th>
                                <th style={{width: '20%'}}>Sale Agent</th>
                                <th style={{width: '10%'}} className="text-right">Actions</th>
                            </thead>
                            <tbody>
                                {sales.map((sale, index)=>{
                                    return <tr key={index}> 
                                        <td>{index+1}</td>
                                        <td>{sale.client_name}</td>
                                        <td>{sale.client_phone}</td>
                                        <td>{sale.client_address}</td>
                                        <td>{sale.date}</td>
                                        <td>{sale.sale_agent_name}</td>
                                        <div className='actions'>
                                            <FaRegEdit />
                                            <FaTrash />
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

export default Sales