import Loading from 'components/Loading/Loading'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap'

function AgentSalesListing() {
    const [mySales, setMySales] = useState(null)

    const fectchMySales = async() => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/sale/mysales`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setMySales(res)
        }
        else{
            toast.error(res.message)
        }
    }

    useEffect(()=>{
        fectchMySales()
    }, [])
  return (
    <div className='content'>
        <Row>
            <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4">My Sales</CardTitle>
                        <Link to='add-sale'><Button>Add New</Button></Link>
                    </CardHeader>
                    <CardBody>
                        {!mySales && <Loading />}
                       {mySales && <Table>
                            <thead>
                                <th style={{width:'5%'}}>#</th>
                                <th style={{width:'25%'}}>Client Name</th>
                                <th style={{width:'25%'}}>Client Phone</th>
                                <th style={{width:'30%'}}>Clinet Address</th>
                                <th style={{width:'15%'}} className="text-right">Bonus</th>
                            </thead>
                            <tbody>
                                {mySales.map((sale, index)=>{
                                    return <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{sale.client_name}</td>
                                        <td>{sale.client_phone}</td>
                                        <td>{sale.client_address}</td>
                                        <td className="text-right">{sale.multiplier * 1000} Rs</td>
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

export default AgentSalesListing