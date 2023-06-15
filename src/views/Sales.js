import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row, Table } from 'reactstrap'
import ReactSelect from 'react-select'
import { FaRegEdit, FaTrash } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from 'components/Loading/Loading';
import EditSalePopup from 'components/editSalePopup/EditSalePopup';
import DeleteSalePopup from 'components/deleteSalePopup/DeleteSalePopup';

function Sales() {
    const [sales, setSales] = useState(null)
    const [page, setPage] = useState(1)
    const [totalData, setTotalData] = useState(0)

    const [filterSale, setFilterSale] = useState({fromDate: 0, toDate: 0, agentId: 0})
    const [defaultfilterSale, setDefaultFilterSale] = useState({fromDate: 0, toDate: 0, agentId: {value: 0, label: 'Select'}})

    const [editSalePopup, setEditSalePopup] = useState(false)
    const [saleToBeEdited, setSaleToBeEdited] = useState(null)

    const [deleteSalePopup, setDeleteSalePopup] = useState(false)
    const [saleToBeDeleted, setSaleToBeDeleted] = useState(null)

    const [saleAgents, setSaleAgents] = useState(null)

    const [totalBonus, setTotalBonus] = useState(0)

    const [refresh, setRefresh] = useState(false)

    const { innerWidth: width } = window;

    const onMobile = width < 762 ? true : false;

   const filterSales = () => {
       if((filterSale.fromDate === 0 && filterSale.toDate !== 0) || (filterSale.fromDate !== 0 && filterSale.toDate === 0)){
            toast.error('Please select correct date filter')
            return;
        }
        setPage(1)
        setSales(null)
        fetchSales()
   }

   const culateBonus = () => {
       let _totalBonus = 0;

       if(sales){
            for (let i = 0; i < sales.length; i++) {
                if(sales[i].updated_multiplier)
                    _totalBonus += sales[i].updated_multiplier * 1000
                else
                    _totalBonus += (sales[i].multiplier * 1000) + sales[i].extrabonus
            }
            setTotalBonus(_totalBonus)
    }
   }
   
    const fetchSalesAgnets = async() => {
        const response = await fetch(`/user`,{
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json();
        if(response.status === 200){
            let options = [{value:0, label: 'All Agents'}]
            for(let i = 0; i < res.length; i++){
                const option = {
                    value: res[i]._id,
                    label: res[i].name
                }
                options.push(option)
            }
            setSaleAgents(options)
        }
        else
            toast.error(res.message)
    }

    const onChange = ( e ) => {
        if(e.target.value !== '')
            setFilterSale({...filterSale, [e.target.name]: e.target.value})
        if(e.target.name === 'fromDate' && e.target.value === ''){
            filterSale.fromDate = 0
        }
        if(e.target.name === 'toDate' && e.target.value === '')
            filterSale.toDate = 0
    } 

    const fetchSales = async() => {
        const response = await fetch(`/sale/${filterSale.fromDate}/${filterSale.toDate}/${filterSale.agentId}/${page}`,{
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setSales(res.sales)
            setTotalData(res.totaldata)
        }
        else
            toast.error(res.message)
    }

    useEffect(()=>{
        culateBonus();
    },[sales])
    useEffect(()=>{
        setRefresh(false)
        setSales(null)
        fetchSales();
        fetchSalesAgnets()
    }, [refresh, page])
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

                        {<div style={{display:"flex", alignItems:"flex-end", gap:10, width:`${onMobile? '100%' : '50%'}`}}>
                            <Form>
                                <Row style={{display:'flex', justifyContent: 'space-between', alignItems:'flex-end', width:`${onMobile? '108%' : '150%'}`}}>
                                    <Col md="4" style={{marginBottom: 10}}>
                                        <label>Sale Agent</label>
                                        <ReactSelect options={saleAgents} defaultValue={defaultfilterSale.agentId} onChange={(option) => {filterSale.agentId = option.value; defaultfilterSale.agentId = option}}/>
                                    </Col>
                                    <Col md="3" style={{paddingLeft:`${onMobile? '' : 0}`, paddingRight:`${onMobile? '' : 15}`}}>    
                                        <FormGroup>
                                            <label>From</label>
                                            <Input type='date' defaultValue={filterSale.fromDate} name="fromDate" onChange={onChange}/>
                                        </FormGroup>
                                    </Col>
                                    <Col md="3" style={{paddingLeft: `${onMobile? '' : 0}`}}>    
                                        <FormGroup>
                                            <label>To</label>
                                            <Input type='date' defaultValue={filterSale.toDate} name="toDate" onChange={onChange}/>
                                        </FormGroup>
                                    </Col>
                                    <Col md="2" style={{paddingLeft: `${onMobile? '' : 0}`}}>
                                        <Button onClick={filterSales}>Filter</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>}
                    </CardHeader>
                    <CardBody>
                        {!sales && <Loading />}
                        {sales && sales.length === 0 && <p>No sales</p>}
                       {sales && sales.length !== 0 && <>
                       <Table responsive={onMobile ? true : false }>
                            <thead>
                                <tr>
                                    <th style={{width: '2%'}}>#</th>
                                    <th style={{width: '10%'}}>Client Name</th>
                                    <th style={{width: '10%'}}>Client Phone</th>
                                    <th style={{width: '10%'}}>Client Address</th>
                                    <th style={{width: '10%'}}>Created On</th>
                                    <th style={{width: '10%'}}>Sale Agent</th>
                                    <th style={{width: '8%'}}>Sale Bonus</th>
                                    <th style={{width: '10%'}}>Extra Bonus</th>
                                    <th style={{width: '5%'}} className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map((sale, index)=>{
                                    return <tr key={index}> 
                                        <td>{index+1}</td>
                                        <td>{sale.client_name}</td>
                                        <td>{sale.client_phone}</td>
                                        <td>{sale.client_address}</td>
                                        <td>{sale.create_at}</td>
                                        <td>{sale.name}</td>
                                        {/* <td>{sale.updated_multiplier? sale.updated_multiplier * 1000 : sale.multiplier * 1000}Rs</td> */}
                                        <td>{sale.multiplier * 1000}Rs</td>
                                        <td>{sale.extrabonus}Rs</td>
                                        <div className='actions'>
                                            <FaRegEdit onClick={()=> {setSaleToBeEdited(sale); setEditSalePopup(true)}}/>
                                            <FaTrash onClick={()=>{setDeleteSalePopup(true); setSaleToBeDeleted(sale)}}/>
                                        </div>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                         <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                            <div className='dahboard-table'>
                                <Button className='next-prev' disabled={page === 1 ? true : false} onClick={()=>{if(page !== 1) setPage(page-1)}}>Prev</Button>
                                <Button className='next-prev' disabled={page >= Math.ceil(totalData / 30)} onClick={()=>{setPage(page+1)}}>Next</Button>
                            </div>
                            <div>
                                <p  className='text-muted' style={{fontSize:12}}>Page: {page} / Total Data: {totalData}</p>
                            </div>
                        </div>
                        </>}
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
                        <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'center', marginBottom:-10}}>
                            <p>Total bonus: </p>
                            <p>{totalBonus} Rs</p>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        {editSalePopup && <EditSalePopup saleToBeEdited={saleToBeEdited} setSaleToBeEdited={setSaleToBeEdited} setEditSalePopup={setEditSalePopup} setRefresh={setRefresh}/>}
        {deleteSalePopup && <DeleteSalePopup saleToBeDeleted={saleToBeDeleted} setSaleToBeDeleted={setSaleToBeDeleted} setDeleteSalePopup={setDeleteSalePopup} setRefresh={setRefresh}/>}
    </div>
  )
}

export default Sales