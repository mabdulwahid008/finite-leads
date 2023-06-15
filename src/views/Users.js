import React, { useState, useEffect }  from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table, FormGroup } from 'reactstrap'
import { FaRegEdit, FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import AddUser from 'components/addUser/AddUser';
import Loading from '../components/Loading/Loading'
import ReactSelect from 'react-select'
import { Link } from 'react-router-dom';
import { reactStyles } from 'assets/additional/reactStyles';
import { AiOutlinePoweroff } from 'react-icons/ai';
import DeactivatePopup from 'components/DeactivatePopup/DeactivatePopup';
import ActivateUserPopup from 'components/ActivateUserPopup/ActivateUserPopup';
import { RxExternalLink } from 'react-icons/rx';
import RfaStats from 'components/rfaStats/RfaStats';

function Users() {
    const [saleAgents, setSaleAgents] = useState(null)
    const [page, setPage] = useState(1)
    const [totalData, setTotalData] = useState(0)
    let userRole = 99

    const [deactivePopup, setDeactivePopup] = useState(false)
    const [activePopup, setActivePopup] = useState(false)
    const [agentToBeDeactiveOrActive, setAgentToBeDeactiveOrActive] = useState(null)

    const [addNewAgent, setAddNewAgent] = useState(false)

    const [editAgent, setEditAgent] = useState(false)
    const [agentToBeEdited, setAgentToBeEdited] = useState(null)

    const [refresh, setRefresh] = useState(false)

    const [defaultUserRole, setDefaultUserRole] = useState({value: 99, label: 'All Users'})

    const { innerWidth: width } = window;
    const onMobile = width < 762 ? true : false;

    const userRoles = [
        {value: 99, label: 'All Users'},
        {value: 0, label: 'Sales Agent'},
        {value: 1, label: 'Markeing Agent'},
        {value: 2, label: 'Real Estate Agent'},
        {value: 3, label: 'Admin'},
    ]



    const filterUsers = (role) => {
        if(role.value === 99){
            userRole = 99
            setSaleAgents(null)
            fetchUsers()
        }
        else{
            userRole = role.value
            setSaleAgents(null)
            fetchUsers()
        }
    }

    const onSubmitDeactiveAgent = async() => {
        const response = await fetch(`/user/deactivate/${agentToBeDeactiveOrActive._id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            setDeactivePopup(false)
            setRefresh(true)
        }
        else{
            toast.error(res.message)
        }
    }

    const onSubmitActiveAgent = async() => {
        const response = await fetch(`/user/activate/${agentToBeDeactiveOrActive._id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            setActivePopup(false)
            setRefresh(true)
        }
        else{
            toast.error(res.message)
        }
    }

    const fetchUsers = async() => {
        const response = await fetch(`/user/listing/${userRole}/${page}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setSaleAgents(res.users)
            setTotalData(res.totalData)
        }
        else{
            toast.error(res.message)
        }
        
    }

    useEffect(() => {  
        setRefresh(false)
        setSaleAgents(null)
        fetchUsers()
    }, [refresh, page])
    
  return (
    <div className='content'>
        <Row>
            <Col md="12">
                <Card>
                    <CardHeader style={{flexDirection:'column', alignItems:'flex-start'}}>
                        <div style={{display:"flex", justifyContent:'space-between', width:'100%'}}>
                            <CardTitle tag="h4">Users</CardTitle>
                            <Button onClick={()=> setAddNewAgent(true)}>Add New</Button>
                        </div>
                        <div style={{width:`${onMobile? '100%' : '20%'}` }}>
                            <ReactSelect styles={reactStyles} options={userRoles} defaultValue={defaultUserRole} placeholder="Filter by role" onChange={(role)=>{setPage(1); filterUsers(role); setDefaultUserRole(role)}}/>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {!saleAgents && <Loading />}
                        {saleAgents && saleAgents.length === 0 && <p>No users are found with this role</p>}
                        {saleAgents && saleAgents.length !== 0 && <>
                        <Table responsive={onMobile? true : false}>
                            <thead>
                                <th style={{width: '5%'}}>#</th>
                                <th style={{width: '20%'}}>Name</th>
                                <th style={{width: '15%'}}>Phone</th>
                                <th style={{width: '20%'}}>Email</th>
                                <th style={{width: '20%'}}>Address</th>
                                <th className='text-right' style={{width: '10%'}}>Actions</th>
                            </thead>
                            <tbody>
                                {saleAgents.map((agent, index)=>{
                                    return <tr key={index} style={{backgroundColor:`${agent.active == 0 ? '#f1926e' : ''}`}}>
                                        <td>{index+1}</td>
                                        <td>{agent.name}</td>
                                        <td>{agent.phone}</td>
                                        <td>{agent.email}</td>
                                        <td>{agent.address}</td>
                                        <div className='actions'>
                                            <Link to={`edit-user/${agent._id}`}><FaRegEdit /></Link>
                                           <AiOutlinePoweroff onClick={()=> {agent.active == 1 ?setDeactivePopup(true) : setActivePopup(true); setAgentToBeDeactiveOrActive(agent)}}/>
                                        </div>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                            <div className='dahboard-table'>
                                <Button className='next-prev' disabled={page === 1 ? true : false} onClick={()=>{if(page !== 1) setPage(page-1)}}>Prev</Button>
                                <Button className='next-prev' disabled={page >= Math.ceil(totalData / 10)} onClick={()=>{setPage(page+1)}}>Next</Button>
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
        {addNewAgent && <AddUser setAddNewAgent={setAddNewAgent} saleAgents={saleAgents} setSaleAgents={setSaleAgents} setRefresh={setRefresh}/>}
        {deactivePopup && <DeactivatePopup setDeactivePopup={setDeactivePopup} agentToBeDeactiveOrActive={agentToBeDeactiveOrActive} setAgentToBeDeactiveOrActive={setAgentToBeDeactiveOrActive} onSubmitDeactiveAgent={onSubmitDeactiveAgent}/>}
        {activePopup && <ActivateUserPopup setActivePopup={setActivePopup} agentToBeDeactiveOrActive={agentToBeDeactiveOrActive} setAgentToBeDeactiveOrActive={setAgentToBeDeactiveOrActive} onSubmitActiveAgent={onSubmitActiveAgent}/>}
        
        
        <RfaStats />
    </div>
  )
}

export default Users