import React, { useState, useEffect } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'
import { RxCross1 } from 'react-icons/rx'
import { toast } from 'react-toastify'

function MultiplierPopup({ setMultiplierPopup }) {
    const [updateMultiplier, setUpdateMultiplier] = useState(0)
    const [multiplier, setMultiplier] = useState(null)
    const [loading, setLoading] = useState(false)

    const getMultiplier = async() => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/multiplier`,{
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setMultiplier(res.multiply_with)
            setUpdateMultiplier(res)
        }
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        setLoading(true)
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/multiplier`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(updateMultiplier)
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            setMultiplierPopup(false)
        }
        else
            toast.error(res.message)
        setLoading(false)
    }

    useEffect(() => {
      getMultiplier()
    }, [])
    
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup'>
            <CardHeader>
                <CardTitle tag="h5">Update Multiplier</CardTitle>
                <RxCross1 onClick={()=>{setMultiplierPopup(false)}}/>
            </CardHeader>
            <CardBody>
               {multiplier && <>
                    <p>Current Multiplier: {multiplier}</p>
                    <Form onSubmit={onSubmit}>
                        <FormGroup>
                            <label>Multiply With</label>
                            <Input type='number' name="multiply_with" onChange={(e)=> setUpdateMultiplier({...updateMultiplier, [e.target.name]:e.target.value})}/>
                        </FormGroup>
                        <Button disabled={loading? true : false} style={{width: '100%'}}>{`${loading? 'Please wait' : 'Update'}`}</Button>
                    </Form>
                </>}
            </CardBody>
        </Card>
    </div>
  )
}

export default MultiplierPopup