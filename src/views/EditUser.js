import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import { toast } from 'react-toastify'
import Loading from '../components/Loading/Loading'
import { useParams } from 'react-router-dom'
import SaleAgentEditForm from 'components/EditUserForms/SaleAgentEditForm'
import REAgentEditForm from 'components/EditUserForms/REAgentEditForm'

function EditUser({  }) {

    const { id } = useParams()

    const [refreash, setRefreash] = useState(false)
    const [agentData, setAgentData] = useState(null)
    const [loading, setLoading] = useState(false)

    const userRoles = [
        { role: 0, value: 'Sales Agent'},
        { role: 1, value: 'Marketing Agent'},
        { role: 2, value: 'Real Estate Agent'},
        { role: 3, value: 'Admin'},
        { role: 5, value: 'Master'},
    ]
    
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
        if(agentData.role == 2)
            agentData.name = `${agentData.fname} ${agentData.lname}`
        else
            agentData.name = agentData.fname
        
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
    }, [refreash])
      
  return (
   <div className='content'>
    <Row>
        <Col md="4">
        <Card className="card-user">
              <div className="image">
                <img alt="..." src={require("assets/img/damir-bosnjak.jpg")} />
              </div>
              <CardBody>
                {!agentData && <Loading />}
               {agentData && <>
               <div className="author">
                  <a style={{position:'relative'}}>
                    <img style={{backgroundColor:'#f4f3ef'}}
                      alt="..."
                      className="avatar border-gray"
                      src={agentData.profile_image ? `${process.env.REACT_APP_IMAGE_URL}/${agentData.profile_image}` : require("assets/img/profile.png")}
                    />
                  </a>
                    <h5 className="username">{agentData.name}</h5>
                  <p className="description">{userRoles.filter((role) => role.role == agentData.role)[0].value}</p>
                </div>
                <p className="description text-center">
                  We like the way you work it <br />
                </p>
                </>}
              </CardBody>
            </Card>
        </Col>
        <Col md='8'>
        <Card>
            <CardHeader>
                <CardTitle tag="h5">Edit User's Data</CardTitle>
            </CardHeader>
            <CardBody>
                {!agentData && <Loading />}
                {agentData && (agentData.role == 0 || agentData.role == 3) && <SaleAgentEditForm agentData={agentData} onChange={onChange} onSubmitEditAgentData={onSubmitEditAgentData} loading={loading}/>}
                {agentData && agentData.role == 2 && <REAgentEditForm agentData={agentData} onChange={onChange} onSubmitEditAgentData={onSubmitEditAgentData} loading={loading}/>}
            </CardBody>
        </Card>
    </Col>
  </Row>
</div>
  )
}

export default EditUser