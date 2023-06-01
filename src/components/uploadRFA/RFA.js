import React, { useState } from 'react'
import { RxCross1 } from 'react-icons/rx'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'

function RFA({setRfaPopup}) {
    const [comments, setComments] = useState(null)
    const [rfa , setRfa] = useState(null)

    const onSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData()
        fd.append('comments', comments)
        fd.append('rfa', rfa)
    }

  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup'>
            <CardHeader>
                <CardTitle tag="h4">Upload Signed RFA</CardTitle>
                <RxCross1 onClick={()=>{setRfaPopup(false)}}/>
            </CardHeader>
            <CardBody style={{padding:"0px 15px 10px"}}>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <label>Any Comments (optional)</label>
                        <Input type='text' onChange={(e)=>setComments(e.target.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Referral Agreement</label>
                        <Input type='file' accept='application/pdf' onChange={(e)=>setRfa(e.target.files[0])}/>
                    </FormGroup>
                    <Button style={{width:'100%'}}>Upload</Button>
                </Form>
            </CardBody>
        </Card>
    </div>
  )
}

export default RFA 
