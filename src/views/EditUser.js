import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row } from 'reactstrap'
import { toast } from 'react-toastify'
import ReactSelect from 'react-select'
import Loading from '../components/Loading/Loading'
import { useParams } from 'react-router-dom'
import SaleAgentEditForm from 'components/EditUserForms/SaleAgentEditForm'
import REAgentEditForm from 'components/EditUserForms/REAgentEditForm'

function EditUser({  }) {

    const { id } = useParams()

    const [refreash, setRefreash] = useState(false)
    const [agentData, setAgentData] = useState(null)
    const [loading, setLoading] = useState(false)

    // const [agentRole, setAgentRole] = useState(null)

    // const userRoles = [
    //     {value: 0, label: 'Sales Agent'},
    //     {value: 1, label: 'Markeing Agent'},
    //     {value: 2, label: 'Real Estate Agent'},
    //     {value: 3, label: 'Admin'},
    // ]

    // const findAgentRole = () => {
    //     if(agentData.role == 0)
    //         setAgentRole({value: 0, label: 'Sales Agent'})
    //     else if(agentData.role == 1)
    //         setAgentRole({value: 1, label: 'Markeing Agent'})
    //     else if(agentData.role == 2)
    //         setAgentRole({value: 2, label: 'Real Estate Agent'})
    //     else if(agentData.role == 3)
    //         setAgentRole({value: 3, label: 'Admin'})
    //     else{}
    // } 
    
    const onChange = (e) => {
        setAgentData({...agentData, [e.target.name]: e.target.value})
    }

    const onSubmitEditAgentData = async(e) => {
        e.preventDefault();
        setLoading(true)
        if (agentData.role == 0 && agentData.phone.length !== 11) {
            toast.error("Agents phone number is incorrect");
            setLoading(false)
            return;
        }
        if (agentData.role == 2 && agentData.phone.length !== 10) {
            toast.error("Agents phone number is incorrect");
            setLoading(false)
            return;
        }

        agentData.name = `${agentData.fname} ${agentData.lname}`
        const response = await fetch(`/user`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(agentData)
        })
        const res = await response.json();
        if(response.status === 200){
            toast.success(res.message)
        }
        else{
            toast.error(res.message)
        }
        setLoading(false)
    };

    const fetchUserToBeUpdate = async() => {
        const response = await fetch(`/user/get-single/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json();
        if(response.status === 200){
            res.fname = res.name.split(' ')[0]
            res.lname = res.name.split(' ')[1]
            setAgentData(res)
            setRefreash(true)
        }
        else{
            toast.error(res.message)
        }
    }

    useEffect(()=>{
        if(!refreash)
            fetchUserToBeUpdate()
        // if(agentData)
            // findAgentRole();
    }, [refreash])
      
  return (
   <div className='content'>
    <Row>
        <Col md='12'>
        <Card>
            <CardHeader>
                <CardTitle tag="h5">Edit User's Data</CardTitle>
            </CardHeader>
            <CardBody>
                {!agentData && <Loading />}
                {agentData && agentData.role == 0 && <SaleAgentEditForm agentData={agentData} onChange={onChange} onSubmitEditAgentData={onSubmitEditAgentData} loading={loading}/>}
                {agentData && agentData.role == 2 && <REAgentEditForm agentData={agentData} onChange={onChange} onSubmitEditAgentData={onSubmitEditAgentData} loading={loading}/>}
            </CardBody>
        </Card>
    </Col>
  </Row>
</div>
  )
}

export default EditUser