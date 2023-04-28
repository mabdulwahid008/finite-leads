import React, { useState, useEffect }  from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table, FormGroup } from 'reactstrap'
import { FaRegEdit, FaTrash } from "react-icons/fa";
import DeletePopup from 'components/deleteUserPopup/DeletePopup';
import { toast } from 'react-toastify';
import AddUser from 'components/addUser/AddUser';
import EditUser from 'components/editUserPopup/EditUser';
import Loading from '../components/Loading/Loading'
import ReactSelect from 'react-select'
import { Link } from 'react-router-dom';

function Users() {
    const [saleAgents, setSaleAgents] = useState(null)
    let userRole = 99

    const [deletePopup, setDeletePopup] = useState(false)
    const [agentToBeDeleted, setAgentToBeDeleted] = useState(null)

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
    const onSubmitDeleteAgent = async() => {
        const response = await fetch(`/user/${agentToBeDeleted._id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            setDeletePopup(false)
            setRefresh(true)
        }
        else{
            toast.error(res.message)
        }
    }

    const fetchUsers = async() => {
        const response = await fetch(`/user/${userRole}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setSaleAgents(res)
        }
        else{
            toast.error(res.message)
        }
        
    }


    useEffect(() => {   
        setRefresh(false)

        setSaleAgents(null)
        fetchUsers()
    }, [refresh])
    
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
                            <ReactSelect options={userRoles} defaultValue={defaultUserRole} placeholder="Filter by role" onChange={(role)=>{filterUsers(role); setDefaultUserRole(role)}}/>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {!saleAgents && <Loading />}
                        {saleAgents && saleAgents.length === 0 && <p>No users are found with this role</p>}
                        {saleAgents && saleAgents.length !== 0  && <Table responsive={onMobile? true : false}>
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
                                    return <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{agent.name}</td>
                                        <td>{agent.phone}</td>
                                        <td>{agent.email}</td>
                                        <td>{agent.address}</td>
                                        <div className='actions'>
                                            {/* <FaRegEdit onClick={()=> {setEditAgent(true); setAgentToBeEdited(agent)}}/> */}
                                            <Link to={`edit-user/${agent._id}`}><FaRegEdit /></Link>
                                            <FaTrash onClick={()=> {setDeletePopup(true); setAgentToBeDeleted(agent)}}/>
                                        </div>
                                    </tr>
                                })}
                            </tbody>
                        </Table>}
                    </CardBody>
                </Card>
            </Col>
        </Row>
        {addNewAgent && <AddUser setAddNewAgent={setAddNewAgent} saleAgents={saleAgents} setSaleAgents={setSaleAgents} setRefresh={setRefresh}/>}
        {editAgent && <EditUser setEditAgent={setEditAgent} agentToBeEdited={agentToBeEdited} fetchUsers={fetchUsers} setRefresh={setRefresh}/> }
        {deletePopup && <DeletePopup setDeletePopup={setDeletePopup} agentToBeDeleted={agentToBeDeleted} setAgentToBeDeleted={setAgentToBeDeleted} onSubmitDeleteAgent={onSubmitDeleteAgent}/>}
    </div>
  )
}

export default Users