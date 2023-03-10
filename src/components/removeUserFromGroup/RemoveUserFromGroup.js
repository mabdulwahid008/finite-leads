import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup } from 'reactstrap'
import { RxCross1 } from 'react-icons/rx'
import { toast } from 'react-toastify'
import ReactSelect from 'react-select'


function RemoveUserFromGroup({setRefreash, selectedGroup, setRemoveUserPopup}) {
    const [laoding, setLaoding] = useState(false)
    const [userToBeRemoved, setUserToBeRemoved] = useState(null)

    let options = []
    for (let i = 0; i < selectedGroup.users.length; i++) {
        let obj = {
            value: selectedGroup.users[i]._id,
            label: selectedGroup.users[i].name
        }
        options.push(obj)
    }
    const onSubmit = async(e) => {
        e.preventDefault();
        setLaoding(true)
        if(!userToBeRemoved){
            setLaoding(false)
            return toast.error("Select a user to be removed")
        }

        let data = {
            _id: selectedGroup._id,
            userId: userToBeRemoved
        }
        console.log(data);
        const response = await fetch(`/chat/remove-member`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(data)
        })

        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            setRemoveUserPopup(false)
            setRefreash(true)
        }
        else{
            toast.error(res.message)
        }
        setLaoding(false)
    }
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup'>
            <CardHeader>
                <CardTitle tag="h5">Remove Member</CardTitle>
                <RxCross1 onClick={()=>setRemoveUserPopup(false)}/>
            </CardHeader>
            <CardBody>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <label>Select user to be removed</label>
                        <ReactSelect options={options} onChange={(option)=>setUserToBeRemoved(option.value)}/>
                    </FormGroup>
                    <Button style={{width: '100%'}} disabled={laoding? true : false}>{laoding? "Please wait" : "Remove"}</Button>
                </Form>
            </CardBody>
        </Card>
    </div>
  )
}

export default RemoveUserFromGroup