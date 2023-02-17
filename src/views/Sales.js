import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row, Table } from 'reactstrap'
import { SALES } from '../variables/Sales'
import ReactSelect from 'react-select'
import { FaRegEdit, FaTrash } from "react-icons/fa";

function Sales() {
    const [sales, setsSles] = useState(SALES)
    const [filterSales, setFilterSales] = useState({fromDate: from, toDate: to, type:''})

    
    const from = `${new Date().getFullYear()}-${new Date().getMonth()+1}-1`
    const to =`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`

    const onChange = ( e ) => {
        if(e.target.value !== '')
            setFilterSales({...filterSales, [e.target.name]: e.target.value})
        if(e.target.name === 'fromDate' && e.target.value === ''){
            filterSales.fromDate = from
        }
        if(e.target.name ==+ 'toDate' && e.target.value === '')
            filterSales.toDate = to
    } 

    const options =[{id: 1, label: "hello"},{id: 2, label: "hello"}]
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

                        <div style={{display:"flex", alignItems:"flex-end", gap:10, width:"50%",}}>
                            <Form>
                                <Row style={{display:'flex', justifyContent: 'space-between', alignItems:'flex-start', width:"120%"}}>
                                    <Col md="4">    
                                        <FormGroup>
                                            <label>From</label>
                                            <Input type='date' name="fromDate" onChange={onChange}/>
                                        </FormGroup>
                                    </Col>
                                    <Col md="4" style={{paddingLeft:0, paddingRight:15}}>    
                                        <FormGroup>
                                            <label>To</label>
                                            <Input type='date' name="toDate" onChange={onChange}/>
                                        </FormGroup>
                                    </Col>
                                    <Col md="4" style={{paddingLeft: 0}}>
                                        <label>User</label>
                                        <ReactSelect options={options}/>
                                    </Col>
                                </Row>
                            </Form>
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