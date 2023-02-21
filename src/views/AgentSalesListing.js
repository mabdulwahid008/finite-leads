import Loading from 'components/Loading/Loading'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import moment from 'moment-timezone'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap'

function AgentSalesListing() {
    const [mySales, setMySales] = useState(null)
    const [dailyBonus, setDailyBonus] = useState(0)
    const [monthlyBonus, setMonthlyBonus] = useState(0)

    const calculateBonus = () => {
        if(mySales){
            let _dailyBonus = 0;
            let _monthlyBonus = 0;

            const date = moment.tz(Date.now(), "America/Los_Angeles");
            const dateToday =  `${date.year()}-${date.month()+1}-${date.date()}`
            
            const todaySales = mySales.filter((sale)=> sale.create_at.includes(dateToday))

            for (let i = 0; i < todaySales.length; i++) {
                _dailyBonus += todaySales[i].multiplier * 1000
            }
            setDailyBonus(_dailyBonus)

            for (let i = 0; i < mySales.length; i++) {
                _monthlyBonus += mySales[i].multiplier * 1000
            }
            setMonthlyBonus(_monthlyBonus)
            

        }
    }

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
        calculateBonus()
    }, [mySales])
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
                        {mySales && mySales.length === 0 && <p>No sales yet</p>}
                       {mySales && mySales.length !== 0 && <Table>
                            <thead>
                                <tr>
                                    <th style={{width:'5%'}}>#</th>
                                    <th style={{width:'20%'}}>Client Name</th>
                                    <th style={{width:'20%'}}>Client Phone</th>
                                    <th style={{width:'25%'}}>Clinet Address</th>
                                    <th style={{width:'15%'}}>Created On</th>
                                    <th style={{width:'15%'}} className="text-right">Bonus</th>
                                </tr>
                             </thead>
                            <tbody>
                                {mySales.map((sale, index)=>{
                                    return <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{sale.client_name}</td>
                                        <td>{sale.client_phone}</td>
                                        <td>{sale.client_address}</td>
                                        <td>{sale.create_at}</td>
                                        <td className="text-right">{sale.multiplier * 1000} Rs</td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>}
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col md="8">
            </Col>
            <Col md="4">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h5">Bonus</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'center', marginBottom:-20}}>
                            <p>Today's bonus: </p>
                            <p>{dailyBonus} Rs</p>
                        </div>
                        <hr />
                        <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'center'}}>
                            <p>Monthly bonus: </p>
                            <p>{monthlyBonus} Rs</p>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default AgentSalesListing