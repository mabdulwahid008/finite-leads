import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row } from 'reactstrap'
import { RxCross1 } from 'react-icons/rx'
import { AiOutlineUnlock } from 'react-icons/ai'
import { toast } from 'react-toastify'
import ReactSelect from 'react-select'
import Loading from 'components/Loading/Loading'
import { reactStyles } from 'assets/additional/reactStyles'


function AddUser({ setAddNewAgent, setRefresh }) {
    const [loading, setLoading] = useState(false)
    const [refreshIt, setRefreshIt] = useState(false)

    const [formType, setFormType] = useState(0)
    
    // reperesentative options
    const [repOptions, setRepOptions] = useState(null)


    const [agentData, setAgentData] = useState({
        role: 0, 
        lname: '', 
        fname: '', 
        phone: '', 
        email: '', 
        address: '', 
        password: '', 
        brokerage_name: '', 
        broker_name: '',
        office_phone: '',
        city: '',
        country: '',
        zip_code: '',
        state: '',
        service_areas: '',
        service_radius: '',
        re_license_no: '',
        rep: null
    })

    const onFormChange = (option) => {
        setAgentData({
            role: option.value, 
            name: '', 
            phone: '', 
            email: '', 
            address: '', 
            password: '', 
            brokerage_name: '', 
            broker_name: '',
            office_phone: '',
            city: '',
            country: '',
            zip_code: '',
            state: '',
            service_areas: '',
            service_radius: '',
            re_license_no: '',
            rep: null
        })
        setFormType(option.value)
    }
    // changig form's input values
    const onChange = (e) => {
        setAgentData({...agentData, [e.target.name]: e.target.value})
    }

    // for RE Form's rep
    const fetchUsers = async() =>{
        const response = await fetch(`/user/0`,{
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            const options = []
            for (let i = 0; i < res.length; i++) {
               let obj = {
                   value: res[i]._id,
                   label: res[i].name
               }
               options.push(obj)
            }
            setRepOptions(options)
        }
        else
            toast.error(res.message)
    }

    const userRoles = [
        {value: 0, label: 'Sales Agent'},
        {value: 1, label: 'Markeing Agent'},
        {value: 2, label: 'Real Estate Agent'},
        {value: 3, label: 'Admin'},
    ]

    function generatePassword() {
        var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[];,./?";
        var password = "";
        for (var i = 0; i < 12; i++) {
          password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        agentData.password = password;
        setRefreshIt(!refreshIt)
    }

    const addNewSaleAgent = async( e ) => {
        e.preventDefault();
        setLoading(true)
        if(agentData.phone.length !== 11){
            toast.error('Agents phone number is incorrect')
            setLoading(false)
            return;
        }
        if(agentData.password.length < 4){
            toast.error('Password should be 4 character long')
            setLoading(false)
            return;
        }
        if(agentData.role === null){
            toast.error('Assign a role to the user')
            setLoading(false)
            return;
        }

        agentData.name = agentData.fname
        const response = await fetch(`/user`,{
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(agentData) 
        })

        const res = await response.json()

        if(response.status === 200){
            toast.success(res.message)
            setAddNewAgent(false)
            setRefresh(true)
        }
        else{
            toast.error(res.message)
        }
        setLoading(false)
    }

    const addNewREAgent = async ( e ) => {
        e.preventDefault();
        setLoading(true)
        if(agentData.phone.length !== 10){
            console.log(agentData.phone.length);
            toast.error('Agents phone number is incorrect')
            setLoading(false)
            return;
        }
        if(agentData.password.length < 4){
            toast.error('Password should be 4 character long')
            setLoading(false)
            return;
        }
        if(agentData.role === null){
            toast.error('Assign a role to the user')
            setLoading(false)
            return;
        }
        if(agentData.rep === null){
            toast.error('Select repersentative')
            setLoading(false)
            return;
        }

        agentData.name = `${agentData.fname} ${agentData.lname}`

        const response = await fetch(`/user`,{
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(agentData) 
        })

        const res = await response.json()

        if(response.status === 200){
            toast.success(res.message)
            setAddNewAgent(false)
            setRefresh(true)
        }
        else{
            toast.error(res.message)
        }
        setLoading(false)

    } 

    useEffect(()=>{
        fetchUsers()
    }, [refreshIt])
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup add-user-popup'>
            <CardHeader>
                <CardTitle tag="h5">Add New User</CardTitle>
                <RxCross1 onClick={()=> setAddNewAgent(false)}/>
            </CardHeader>
            <CardBody>
                <FormGroup>
                    <label>Assign Role</label>
                    <ReactSelect styles={reactStyles} defaultValue={{value: 0, label: 'Sales Agent'}} options={userRoles} required onChange={onFormChange}/>
                </FormGroup>
                {/* for Sale Agents */}
                {formType == 0 && <Form onSubmit={addNewSaleAgent}>
                    <FormGroup>
                        <label>Name</label>
                        <Input type='text' name='fname' required onChange={onChange}/>
                    </FormGroup>
                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <label>Email</label>
                                <Input type='email' name='email' required onChange={onChange}/>
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <label>Phone</label>
                                <Input type='number' name='phone' required onChange={onChange}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    
                    <FormGroup>
                        <label>Password</label>
                        <Input type='password' name='password' required onChange={onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Address (optional)</label>
                        <Input type='text' name='address' onChange={onChange}/>
                    </FormGroup>
                    <Button color='primary' disabled={loading? true : false}>{`${loading? "Please Wait":"Add New"}`}</Button>
                </Form>}

                {/* for Real Estate Agents */}
                {formType == 2 && !repOptions && <Loading />}
                {formType == 2 && repOptions && <Form onSubmit={addNewREAgent}>
                    <Row>
                        <Col md='6'>
                            <FormGroup>
                                <label>First Name</label>
                                <Input type='text' name='fname' required onChange={onChange} />
                            </FormGroup>
                        </Col>
                        <Col md='6'>
                            <FormGroup>
                                <label>Last Name</label>
                                <Input type='text' name='lname' required onChange={onChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='6'>
                            <FormGroup>
                                <label>Email</label>
                                <Input type='email' name='email' required onChange={onChange} />
                            </FormGroup>
                        </Col>
                        <Col md='6'>
                            <FormGroup>
                                <label>Phone</label>
                                <Input type='number' name='phone' required onChange={onChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='6'>
                            <FormGroup>
                                <label>Brokerage Name</label>
                                <Input type='text' name='brokerage_name' required onChange={onChange} />
                            </FormGroup>
                        </Col>
                        <Col md='3'>
                            <FormGroup>
                                <label>Broker Name</label>
                                <Input type='text' name='broker_name' required onChange={onChange} />
                            </FormGroup>
                        </Col>
                        <Col md='3'>
                            <FormGroup>
                                <label>Office Phone</label>
                                <Input type='text' name='office_phone' required onChange={onChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='6'>
                            <FormGroup>
                                <label>Address</label>
                                <Input type='text' name='address' required onChange={onChange} />
                            </FormGroup>
                        </Col>
                        <Col md='3'>
                            <FormGroup>
                                <label>City</label>
                                <Input type='text' name='city' required onChange={onChange} />
                            </FormGroup>
                        </Col>
                        <Col md='3'>
                            <FormGroup>
                                <label>Zip Code</label>
                                <Input type='text' name='zip_code' required onChange={onChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='6'>
                            <FormGroup>
                                <label>Country</label>
                                <Input type='text' name='country' required onChange={onChange} />
                            </FormGroup>
                        </Col>
                        <Col md='6'>
                            <FormGroup>
                                <label>State</label>
                                <Input type='text' name='state' required onChange={onChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='6'>
                            <FormGroup>
                                <label>Service Areas (separate area with comma)</label>
                                <Input type='text' name='service_areas' required onChange={onChange} />
                            </FormGroup>
                        </Col>
                        <Col md='3'>
                            <FormGroup>
                                <label>Service Radius (miles)</label>
                                <Input type='number' name='service_radius' required onChange={onChange} />
                            </FormGroup>
                        </Col>
                        <Col md='3'>
                            <FormGroup>
                                <label>RE License No</label>
                                <Input type='text' name='re_license_no' required onChange={onChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='6'>
                            <FormGroup style={{position: 'relative'}}>
                                <label>Password</label>
                                <Input defaultValue={agentData.password} type='text' name="password" required onChange={onChange} />
                                <AiOutlineUnlock onClick={generatePassword} style={{position: 'absolute', bottom: 12, right: 10, fontSize: 18, cursor: 'pointer'}}/>
                            </FormGroup>
                        </Col>
                        <Col md='6'>
                            <FormGroup>
                                <label>Repersentative</label>
                                <ReactSelect styles={reactStyles} options={repOptions} onChange={(option)=>{agentData.rep = option.value}}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Button color='primary' disabled={loading? true : false}>{`${loading? "Please Wait":"Add New"}`}</Button>
                </Form>}
            </CardBody>
        </Card>
    </div>
  )
}

export default AddUser