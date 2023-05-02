import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'

function CommentOnLead({ lead_id }) {

    // for RE agent to comment
    const [comment, setComment] = useState({lead_id: lead_id, lead_status: null, content: null})
    const [commentedAlready, setCommentedAlready] = useState(true)

    // for Admin to Read
    const [comments, setComments] = useState(null) 

    const onChange = (e) => {
        setComment({...comment, [e.target.name]: e.target.value})
    }

    const checkIsHeCommentedAlready = async() => {
        const response = await fetch(`/lead/comment/${lead_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
        })
        const res = await response.json()
        if(response.status === 200){
            if(res.length > 0)
                setCommentedAlready(true)
            else
                setCommentedAlready(false)
        }
        else
            toast.error(res.message)
    }

    const submitComment = async(e) => {
        e.preventDefault()
        const response = await fetch('/lead/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(comment)
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            setCommentedAlready(true)
        }
        else
            toast.error(res.message)
    }

    const leadStatus = [
        { status : 0, label : 'Accepted'},
        { status : 1, label : 'Rejected'},
        { status : 2, label : 'Listed'},
        { status : 3, label : 'Sold'},
        { status : 4, label : 'Follow Up'},
        { status : 5, label : 'On Contract'}
    ]


    const fetchComments = async() => {
        const response = await fetch(`/lead/comments/${lead_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            for (let i = 0; i < res.length; i++) {
                const obj = leadStatus.filter((lead)=> lead.status === res[i].lead_status)
                res[i].lead_status = obj[0].label
            }
            setComments(res)
        }
        else
            toast.error(res.message)
    }

    useEffect(()=>{
        if(localStorage.getItem('userRole') == 2)
            checkIsHeCommentedAlready()
            
        if(localStorage.getItem('userRole') != 2)
            fetchComments()
    }, [])

  return (
    <>
    {/* for posting */}
    {!commentedAlready && localStorage.getItem('userRole') == 2 && <Card>
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
      </Card>}

    {/* for reading */}
    {comments && comments.length > 0 && <Card>
        <CardHeader>
            <CardTitle tag="h4">Comments By RE Agent</CardTitle>
        </CardHeader>
        <CardBody>
            <div className='comments-box'>
                {comments.map((comment)=>{
                    return <FormGroup key={comment.lead_id} style={{display:'flex', flexDirection:'column'}}>
                        <div className='comment-header'>
                            <label>{comment.name}</label>
                            <label>{comment.lead_status}</label>
                        </div>
                        <textarea value={comment.content} readOnly style={{height:70}}></textarea>
                    </FormGroup>
                })}
            </div>
        </CardBody>
    </Card>}
    </>
  )
}

export default CommentOnLead
