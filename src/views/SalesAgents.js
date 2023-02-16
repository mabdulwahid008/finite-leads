import React, { useState, useEffect }  from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table, Toast } from 'reactstrap'
import { SALES_AGENTS } from '../variables/SalesAgents'
import { FaRegEdit, FaTrash } from "react-icons/fa";
import DeletePopup from 'components/deleteAgentPopup/DeletePopup';
import { toast } from 'react-toastify';
import AddSaleAgent from 'components/addSaleAgnet/AddSaleAgent';
import EditSaleAgent from 'components/editSaleAgentPopup/EditSaleAgent';

function SalesAgents() {
    const [saleAgents, setSaleAgents] = useState(SALES_AGENTS)

    const [deletePopup, setDeletePopup] = useState(false)
    const [agentToBeDeleted, setAgentToBeDeleted] = useState(null)

    const [addNewAgent, setAddNewAgent] = useState(false)

    const [editAgent, setEditAgent] = useState(false)
    const [agentToBeEdited, setAgentToBeEdited] = useState(null)

    const onSubmitDeleteAgent = () => {
        const filteredAgents = saleAgents.filter((agent) => agent.id !== agentToBeDeleted.id)
        setSaleAgents(filteredAgents)

        setDeletePopup(false)
        
        toast.success(`${agentToBeDeleted.name} deleted`)

        setAgentToBeDeleted(null)
    }

    useEffect(() => {
      
    }, [saleAgents, editAgent])
    
  return (
    <div className='content'>
        <Row>
            <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4">Sales Agents</CardTitle>
                        <Button color='primary'onClick={()=> setAddNewAgent(true)}>Add New</Button>
                    </CardHeader>
                    <CardBody>
                        <Table>
                            <thead>
                                <th style={{width: '5%'}}>#</th>
                                <th style={{width: '15%'}}>Name</th>
                                <th style={{width: '20%'}}>Phone</th>
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
                        </Table>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        {addNewAgent && <AddSaleAgent setAddNewAgent={setAddNewAgent} saleAgents={saleAgents} setSaleAgents={setSaleAgents}/>}
        {editAgent && <EditSaleAgent setEditAgent={setEditAgent} agentToBeEdited={agentToBeEdited} saleAgents={saleAgents} setSaleAgents={setSaleAgents}/> }
        {deletePopup && <DeletePopup setDeletePopup={setDeletePopup} agentToBeDeleted={agentToBeDeleted} setAgentToBeDeleted={setAgentToBeDeleted} onSubmitDeleteAgent={onSubmitDeleteAgent}/>}
    </div>
  )
}

export default SalesAgents