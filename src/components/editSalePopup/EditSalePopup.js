import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'
import { RxCross1 } from 'react-icons/rx'
import { toast } from 'react-toastify'

function EditSalePopup({ saleToBeEdited, setSaleToBeEdited, setEditSalePopup, setRefresh }) {
    const [sale, setSale] = useState(saleToBeEdited)
    const [loading, setLoading] = useState(false)


    const onChange = (e) => {
        setSale({...sale, [e.target.name]: e.target.value})
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        setLoading(true)
        if(sale.client_phone.length !== 9){
            toast.error('Client\'s phone number is incorrect')
            setLoading(false)
            return;
        }
        
        const response = await fetch(`/sale`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(sale)
        })
        const res = await response.json();
        if(response.status === 200){
            toast.success(res.message);
            setEditSalePopup(false)
            setRefresh(true)
        }
        else
            toast.error(res.message)
        setLoading(false)
    }
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup'>
            <CardHeader>
                <CardTitle tag="h5">Edit Sale</CardTitle>
                <RxCross1 onClick={()=>{setEditSalePopup(false); setSaleToBeEdited(null)}}/>
            </CardHeader>
            <CardBody>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <label>Client Name</label>
                        <Input type="text" value={sale.client_name} name="client_name" onChange={onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Client Phone</label>
                        <Input type="number" value={sale.client_phone} name="client_phone" onChange={onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Client Phone</label>
                        <Input type="text" value={sale.client_address} name="client_address" onChange={onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Extra Bonus</label>
                        <Input type="number" defaultValue={sale.extrabonus} name="extrabonus" onChange={onChange}/>
                    </FormGroup>
                    {/* <FormGroup>
                        <label>Multiplier</label>
                        <Input type="number" defaultValue={sale.updated_multiplier? sale.updated_multiplier : sale.multiplier} name="multiplier" onChange={onChange}/>
                    </FormGroup> */}
                    <Button disabled={loading? true : false}>{`${loading? 'Please Wait' : 'Update'}`}</Button>
                </Form>
            </CardBody>
        </Card>
    </div>
  )
}

export default EditSalePopup