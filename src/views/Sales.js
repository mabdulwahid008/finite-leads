import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row, Table } from 'reactstrap'
import { SALES } from '../variables/Sales'
import ReactSelect from 'react-select'
import { FaRegEdit, FaTrash } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from 'components/Loading/Loading';
import EditSalePopup from 'components/editSalePopup/EditSalePopup';
import DeleteSalePopup from 'components/deleteSalePopup/DeleteSalePopup';

function Sales() {
    const [sales, setSales] = useState(null)
    const [filterSales, setFilterSales] = useState({fromDate: from, toDate: to, type:''})

    const [editSalePopup, setEditSalePopup] = useState(false)
    const [saleToBeEdited, setSaleToBeEdited] = useState(null)

    const [deleteSalePopup, setDeleteSalePopup] = useState(false)
    const [saleToBeDeleted, setSaleToBeDeleted] = useState(null)

    
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

    const fetchSales = async() => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/sale`,{
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setSales(res)
        }
        else
            toast.error(res.message)
    }

    const options =[{id: 1, label: "hello"},{id: 2, label: "hello"}]

    useEffect(()=>{
        fetchSales()
    }, [editSalePopup, deleteSalePopup])
  return (
    <div className='content'>    
        <Row>
            <Col md="12">
                <Card>
                    <CardHeader style={{flexDirection:'column', alignItems:'flex-start'}}>
                        <div style={{display:"flex", justifyContent:'space-between', width:'100%'}}>
                            <CardTitle tag="h4">Sales</CardTitle>
                            <Link to='add-sale'><Button>Add Sale</Button></Link>
                        </div>

                        {sales && <div style={{display:"flex", alignItems:"flex-end", gap:10, width:"50%",}}>
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
                        </div>}
                    </CardHeader>
                    <CardBody>
                        {!sales && <Loading />}
                        {sales && sales.length === 0 && <p>No sales yet</p>}
                       {sales && sales.length !== 0 && <Table>
                            <thead>
                                <th style={{width: '3%'}}>#</th>
                                <th style={{width: '10%'}}>Client Name</th>
                                <th style={{width: '10%'}}>Client Phone</th>
                                <th style={{width: '20%'}}>Client Address</th>
                                <th style={{width: '12%'}}>Created On</th>
                                <th style={{width: '10%'}}>Sale Agent</th>
                                <th style={{width: '5%'}}>Bonus</th>
                                <th style={{width: '8%'}} className="text-right">Actions</th>
                            </thead>
                            <tbody>
                                {sales.map((sale, index)=>{
                                    return <tr key={index}> 
                                        <td>{index+1}</td>
                                        <td>{sale.client_name}</td>
                                        <td>{sale.client_phone}</td>
                                        <td>{sale.client_address}</td>
                                        <td>{sale.create_at}</td>
                                        <td>{sale.user_id.name}</td>
                                        <td>{sale.multiplier * 1000}Rs</td>
                                        <div className='actions'>
                                            <FaRegEdit onClick={()=> {setSaleToBeEdited(sale); setEditSalePopup(true)}}/>
                                            <FaTrash onClick={()=>{setDeleteSalePopup(true); setSaleToBeDeleted(sale)}}/>
                                        </div>
                                    </tr>
                                })}
                            </tbody>
                        </Table>}
                    </CardBody>
                </Card>
            </Col>
        </Row>
        {editSalePopup && <EditSalePopup saleToBeEdited={saleToBeEdited} setSaleToBeEdited={setSaleToBeEdited} setEditSalePopup={setEditSalePopup}/>}
        {deleteSalePopup && <DeleteSalePopup saleToBeDeleted={saleToBeDeleted} setSaleToBeDeleted={setSaleToBeDeleted} setDeleteSalePopup={setDeleteSalePopup}/>}
    </div>
  )
}

export default Sales