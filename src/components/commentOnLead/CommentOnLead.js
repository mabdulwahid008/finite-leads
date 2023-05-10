import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'
import ReactSelect from 'react-select'
import { reactStyles } from 'assets/additional/reactStyles'

function CommentOnLead({ lead_id }) {

    // for RE agent to comment
    const [comment, setComment] = useState({lead_id: lead_id, lead_status: null, content: null})
    const [rejectAlready, setRejectAlready] = useState(true)
    const [myComments, setMyComments] = useState(null)

    // for Admin to Read
    const [comments, setComments] = useState(null) 
    const [agentsWhomLeadAssignedTo, setAgentsWhomLeadAssignedTo] = useState(null) 
    const [selectedAgent, setSelectedAgent] = useState(null) 

    const onChange = (e) => {
        setComment({...comment, [e.target.name]: e.target.value})
    }

    const checkIsHerejectAlready = async() => {
        const response = await fetch(`/lead/comment/${lead_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
        })
        const res = await response.json()
        if(response.status === 200){
            setRejectAlready(false)
            for (let i = 0; i < res.length; i++) {
                const obj = leadStatus.filter((lead)=> lead.status === res[i].lead_status)
                res[i].lead_status = obj[0].label
            }
            setMyComments(res)
        }
        else if(response.status === 400){
            setRejectAlready(true)
            for (let i = 0; i < res.length; i++) {
                const obj = leadStatus.filter((lead)=> lead.status === res[i].lead_status)
                res[i].lead_status = obj[0].label
            }
            setMyComments(res)
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

            if(comment.lead_status === 1)
                setRejectAlready(true)

            let radioBtns = document.getElementsByTagName("input");
            for (let i = 0; i < radioBtns.length; i++) {
                    if (radioBtns[i].type == "radio") 
                            radioBtns[i].checked = false;
            }
            const textarea = document.getElementById('content').value = ""
            setComment({lead_id: lead_id, lead_status: null, content: null})
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
        const response = await fetch(`/lead/comments/${lead_id}/${selectedAgent}`, {
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


    const getAgentsWhomLeadAssignedTo = async () => {
        const response = await fetch(`/lead/assined/${lead_id}`, {
            method:'GET',
            headers:{
                'Content_Type': 'Application/json',
                token:localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            if(res.length > 0){
                let arr = [{value:null, label: 'All'}]
                for (let i = 0; i < res.length; i++) {
                    let obj = {
                        value: res[i]._id,
                        label: res[i].name
                    }
                    arr.push(obj)
                }
                setAgentsWhomLeadAssignedTo(arr)
            }
        }
        else
            toast.error(res.message)
    }

    useEffect(()=>{
        if(localStorage.getItem('userRole') == 2)
            checkIsHerejectAlready()
            
        if(localStorage.getItem('userRole') != 2){
            fetchComments()
            getAgentsWhomLeadAssignedTo()
        }
    }, [comment, selectedAgent])

  return (
    <>
    {/* for posting */}
    {myComments && localStorage.getItem('userRole') == 2 && <Card>
        <CardHeader>
            <CardTitle tag="h5">{rejectAlready ? 'My Comments' : 'Have Any Comments?'}</CardTitle>
        </CardHeader>
        <CardBody>
            {!rejectAlready && <Form onSubmit={submitComment}>
                <div style={{margin:'-15px 0px 10px' ,padding:'0px 20px',display:'flex', gap: '40px' }}>
                    <div>
                        <Input type="radio" name="lead_status" value="1" onChange={onChange} required/> <p>Rejected</p>
                    </div>
                    <div>
                        <Input type="radio" name="lead_status" value="0" onChange={onChange} /> <p>Accepted</p>
                    </div>
                    <div>
                        <Input type="radio" name="lead_status" value="4" onChange={onChange}/> <p>Follow Up</p>
                    </div>
                    <div>
                        <Input type="radio" name="lead_status" value="5" onChange={onChange}/> <p>On Contract</p>
                    </div>
                    <div>
                        <Input type="radio" name="lead_status" value="2" onChange={onChange}/> <p>Listed</p>
                    </div>
                    <div>
                        <Input type="radio" name="lead_status" value="3" onChange={onChange}/> <p>Sold</p>
                    </div>
                </div>
                <FormGroup style={{display:'flex', flexDirection:'column'}}>
                    <label>{comment.lead_status == 1 ? 'Enter Reason *' : 'Write Something (optional)'}</label>
                    <textarea name="content" id="content" style={{height: 70}} onChange={onChange} required={comment.lead_status == 1 ? true : false}></textarea>
                </FormGroup>
                <Button>Submit</Button>
            </Form>}
            {myComments && myComments.length > 0 && <div className='comments-box mt-2'>
                {myComments.map((comment)=> {
                    return <FormGroup key={comment._id} style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                        <img src={`${localStorage.getItem('profileImage') != 'null' ? `http://localhost:5000/${comment.profile_image}` : require('../../assets/img/profile.png')}`} style={{width:50, height:50, borderRadius:50, border:'1px solid #25242293'}}/>
                        <div style={{display:'flex', flexDirection:'column', width:'95%'}}>
                            <div className='comment-header'>
                                <label>You:</label>
                                <label>{comment.lead_status}</label>
                            </div>
                            <textarea value={comment.content} readOnly id='commented'></textarea>
                        </div>
                    </FormGroup>    
                })}
            </div>}
        </CardBody>
      </Card>}

    {/* for reading */}
    {agentsWhomLeadAssignedTo &&  <Card>
        <CardHeader>
            <CardTitle tag="h4">Comments By RE Agents</CardTitle>
           <FormGroup style={{width:200}}>
                <label>Filter by RE Agents</label>
                {<ReactSelect styles={reactStyles} options={agentsWhomLeadAssignedTo} onChange={(option)=>setSelectedAgent(option.value)}/>}
           </FormGroup>
        </CardHeader>
        <CardBody>
            <div className='comments-box'>
                {comments && comments.length > 0 && comments.map((comment)=>{
                    return <FormGroup key={comment.lead_id} style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                        <img src={`${comment.profile_image ? `http://localhost:5000/${comment.profile_image}` : require('../../assets/img/profile.png')}`} style={{width:50, height:50, borderRadius:50, border:'1px solid #25242293'}}/>
                        <div style={{display:'flex', flexDirection:'column', width:'95%', padding:'0px 5px'}}>
                            <div className='comment-header'>
                                <label>{comment.name}</label>
                                <label>{comment.lead_status}</label>
                            </div>
                            <textarea value={comment.content} readOnly id='commented'></textarea>
                        </div>
                    </FormGroup>
                })}
            </div>
        </CardBody>
    </Card>}
    </>
  )
}

export default CommentOnLead
