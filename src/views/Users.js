import React, { useState, useEffect }  from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table, FormGroup } from 'reactstrap'
import { FaRegEdit, FaTrash } from "react-icons/fa";
import DeletePopup from 'components/deleteUserPopup/DeletePopup';
import { toast } from 'react-toastify';
import AddUser from 'components/addUser/AddUser';
import EditUser from 'components/editUserPopup/EditUser';
import Loading from '../components/Loading/Loading'
import ReactSelect from 'react-select'

function Users() {
    const [saleAgents, setSaleAgents] = useState(null)
    let userRole = 99

    const [deletePopup, setDeletePopup] = useState(false)
    const [agentToBeDeleted, setAgentToBeDeleted] = useState(null)

    const [addNewAgent, setAddNewAgent] = useState(false)

    const [editAgent, setEditAgent] = useState(false)
    const [agentToBeEdited, setAgentToBeEdited] = useState(null)

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
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/user/${agentToBeDeleted._id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            setSaleAgents(null)
            fetchUsers()
            setDeletePopup(false)
        }
        else{
            toast.error(res.message)
        }
    }

    const fetchUsers = async() => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/user/${userRole}`,{
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

    useEffect(()=>{
        
    }, [saleAgents])

    useEffect(() => {
        fetchUsers()
    }, [editAgent])
    
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
                        <div style={{width:'20%'}}>
                            <ReactSelect options={userRoles} placeholder="Filter by role" onChange={(role)=>{filterUsers(role)}}/>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {!saleAgents && <Loading />}
                        {saleAgents && saleAgents.length === 0 && <p>No users are found with this role</p>}
                        {saleAgents && saleAgents.length !== 0  && <Table>
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
                                            <FaRegEdit onClick={()=> {setEditAgent(true); setAgentToBeEdited(agent)}}/>
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
        {addNewAgent && <AddUser setAddNewAgent={setAddNewAgent} saleAgents={saleAgents} setSaleAgents={setSaleAgents}/>}
        {editAgent && <EditUser setEditAgent={setEditAgent} agentToBeEdited={agentToBeEdited} saleAgents={saleAgents} setSaleAgents={setSaleAgents} fetchUsers={fetchUsers}/> }
        {deletePopup && <DeletePopup setDeletePopup={setDeletePopup} agentToBeDeleted={agentToBeDeleted} setAgentToBeDeleted={setAgentToBeDeleted} onSubmitDeleteAgent={onSubmitDeleteAgent}/>}
    </div>
  )
}

export default Users