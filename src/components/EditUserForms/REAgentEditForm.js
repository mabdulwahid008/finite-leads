import { reactStyles } from 'assets/additional/reactStyles'
import Loading from 'components/Loading/Loading'
import React, { useEffect, useState } from 'react'
import ReactSelect from 'react-select'
import { toast } from 'react-toastify'
import { Button, Col, Form, FormGroup, Input, Row } from 'reactstrap'

function REAgentEditForm({ agentData, onChange, onSubmitEditAgentData, loading}) {
    // reperesentative options
    const [repOptions, setRepOptions] = useState(null)

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
    useEffect(()=>{
        fetchUsers();
    }, [])
  return (
    <>
    {!repOptions && <Loading/>}
    {repOptions && <Form onSubmit={onSubmitEditAgentData}>
        <Row>
            <Col className='pr-1' md='6'>
                <FormGroup>
                    <label>First Name</label>
                    <Input type='text' defaultValue={agentData.fname} name='fname' required onChange={onChange} />
                </FormGroup>
            </Col>
            <Col className='pl-1' md='6'>
                <FormGroup>
                    <label>Last Name</label>
                    <Input type='text' defaultValue={agentData.lname} name='lname' required onChange={onChange} />
                </FormGroup>
            </Col>
        </Row>
        <Row>
            <Col className='pr-1' md='6'>
                <FormGroup>
                    <label>Email</label>
                    <Input type='email' defaultValue={agentData.email} name='email' required onChange={onChange} />
                </FormGroup>
            </Col>
            <Col className='pl-1' md='6'>
                <FormGroup>
                    <label>Phone</label>
                    <Input type='number' defaultValue={agentData.phone} name='phone' required onChange={onChange} />
                </FormGroup>
            </Col>
        </Row>
        <Row>
            <Col className='pr-1' md='6'>
                <FormGroup>
                    <label>Brokerage Name</label>
                    <Input type='text' defaultValue={agentData.brokerage_name} name='brokerage_name' required onChange={onChange} />
                </FormGroup>
            </Col>
            <Col className='px-1' md='3'>
                <FormGroup>
                    <label>Broker Name</label>
                    <Input type='text' defaultValue={agentData.broker_name} name='broker_name' required onChange={onChange} />
                </FormGroup>
            </Col>
            <Col className='pl-1' md='3'>
                <FormGroup>
                    <label>Office Phone</label>
                    <Input type='text' defaultValue={agentData.office_phone} name='office_phone' required onChange={onChange} />
                </FormGroup>
            </Col>
        </Row>
        <Row>
            <Col className='pr-1' md='6'>
                <FormGroup>
                    <label>Address</label>
                    <Input type='text' defaultValue={agentData.address} name='address' required onChange={onChange} />
                </FormGroup>
            </Col>
            <Col className='px-1' md='3'>
                <FormGroup>
                    <label>City</label>
                    <Input type='text' defaultValue={agentData.city} name='city' required onChange={onChange} />
                </FormGroup>
            </Col>
            <Col className='pl-1' md='3'>
                <FormGroup>
                    <label>Zip Code</label>
                    <Input type='text' defaultValue={agentData.zip_code} name='zip_code' required onChange={onChange} />
                </FormGroup>
            </Col>
        </Row>
        <Row>
            <Col className='pr-1' md='3'>
                <FormGroup>
                    <label>Country</label>
                    <Input type='text' defaultValue={agentData.country} name='country' required onChange={onChange} />
                </FormGroup>
            </Col>
            <Col className='px-1' md='3'>
                <FormGroup>
                    <label>State</label>
                    <Input type='text' defaultValue={agentData.state} name='state' required onChange={onChange} />
                </FormGroup>
            </Col>
            <Col className='px-1' md='3'>
                <FormGroup>
                    <label>RE License No</label>
                    <Input type='text' defaultValue={agentData.re_license_no} name='re_license_no' required onChange={onChange} />
                </FormGroup>
            </Col>
            <Col className='pl-1' md='3'>
                <FormGroup>
                    <label>Service Radius (miles)</label>
                    <Input type='number' defaultValue={agentData.service_radius} name='service_radius' required onChange={onChange} />
                </FormGroup>
            </Col>
        </Row>
        <Row>
            {/* <Col className='pr-1' mdd='6'>
                <FormGroup>
                    <label>Service Areas in [lat, long]</label>
                    <Input type='text' defaultValue={agentData.service_areas} placeholder='[lat, long] | [lat, long] | ...' name="service_areas" onChange={onChange} />
                </FormGroup>
            </Col> */}
            <Col className='pr-1' md='6'>
                <FormGroup>
                    <label>Repersentative</label>
                    <ReactSelect styles={reactStyles} options={repOptions} defaultValue={repOptions.filter((option)=> option.value == agentData.rep)} onChange={(option)=>{agentData.rep = option.value}}/>
                </FormGroup>
            </Col>
        </Row>
        <Button disabled={loading? true : false}>{`${loading? "Please Wait":"Update"}`}</Button>
    </Form>}
    </>
  )
}

export default REAgentEditForm
