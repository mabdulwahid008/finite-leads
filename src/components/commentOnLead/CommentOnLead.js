import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'

function CommentOnLead({ lead_id }) {
    const [comment, setComment] = useState({lead_status: null, content: null})
    const onChange = (e) => {
        setComment({...comment, [e.target.name]: e.target.value})
    }
    const submitComment = (e) => {
        e.preventDefault()
        console.log(comment);
    }
  return (
    <>
      <Card>
        <CardHeader>
            <CardTitle tag="h5">Have Any Comments?</CardTitle>
        </CardHeader>
        <CardBody>
            <Form onSubmit={submitComment}>
                <div style={{margin:'-15px 0px 10px' ,padding:'0px 20px',display:'flex', gap: '40px' }}>
                    <div>
                        <Input type="radio" name="lead_status" value="0" onChange={onChange} required/> <p>Accepted</p>
                    </div>
                    <div>
                        <Input type="radio" name="lead_status" value="1" onChange={onChange}/> <p>Rejected</p>
                    </div>
                    <div>
                        <Input type="radio" name="lead_status" value="2" onChange={onChange}/> <p>Listed</p>
                    </div>
                    <div>
                        <Input type="radio" name="lead_status" value="3" onChange={onChange}/> <p>Sold</p>
                    </div>
                    <div>
                        <Input type="radio" name="lead_status" value="4" onChange={onChange}/> <p>Follow Up</p>
                    </div>
                    <div>
                        <Input type="radio" name="lead_status" value="5" onChange={onChange}/> <p>On Contract</p>
                    </div>
                </div>
                <FormGroup style={{display:'flex', flexDirection:'column'}}>
                    <label>Write Something (optional)</label>
                    <textarea name="content" style={{height: 70}} onChange={onChange}></textarea>
                </FormGroup>
                <Button>Submit</Button>
            </Form>
        </CardBody>
      </Card>
    </>
  )
}

export default CommentOnLead
