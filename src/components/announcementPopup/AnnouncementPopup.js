import React, { useState } from 'react'
import { RxCross1 } from 'react-icons/rx'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup } from 'reactstrap'
import ReactSelect from 'react-select'
import { reactStyles } from 'assets/additional/reactStyles'
import { toast } from 'react-toastify'

function AnnouncementPopup({ setPostPopup }) {
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [for_user_role, setFor_user_role] = useState(null)
    const [img, setImg] = useState(require('../../assets/img/header.jpg'))
    const userGroup = [
        {value: 0, label: "Sale Agents"},
        {value: 1, label: "Marketing Agents"},
        {value: 2, label: "Real Estate Agents"},
    ]

    const onChange = async( e ) => {
        setImage(e.target.files[0])
        const base64 = await convertBase64(e.target.files[0])
        setImg(base64)
    }
    
    const convertBase64 = (file)=>{
        return new Promise((resolve, reject)=>{
            const reader = new FileReader()
            reader.readAsDataURL(file);
            reader.onload =()=>{
                resolve(reader.result)
            }
        })
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        setLoading(true)
        if(for_user_role === null){
            toast.error('Select user group')
            return setLoading(false)
        }

        const fd = new FormData()
        fd.append('for_user_role', for_user_role);
        fd.append('image', image);

        const response = await fetch('/announcement',{
            method:'POST',
            headers:{
                'Conten-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
            body: fd
        })
        const res = await response.json()
        if(response.status === 200)
            toast.success(res.message)
        else
            toast.error(res.message)
        setLoading(false)
    }
  return (
    <div className='popup'>
      <div className='overlay'></div>
      <Card className='card-popup'>
            <CardHeader>
                <CardTitle tag="h4">Post Announcement</CardTitle>
                <RxCross1 onClick={()=>setPostPopup(false)}/>
            </CardHeader>
            <CardBody style={{paddingTop:0}}>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <label>Select User Group</label>
                        <ReactSelect options={userGroup} styles={reactStyles} onChange={(option)=> setFor_user_role(option.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <input required style={{zIndex:0, opacity: 0, marginTop: -200}} type='file' id="image" accept='image/jpg,image/png,image/jpeg' onChange={onChange}/>
                        <label htmlFor='image'>
                            <img src={img} style={{cursor:'pointer', width:'100vw', objectFit:'cover', marginTop:-20}}/>
                        </label>
                    </FormGroup>
                    <Button style={{width: '100%', marginTop:0}} disabled={loading? true : false}>{loading? 'Please Wait': 'Post'}</Button>
                </Form>
            </CardBody>
      </Card>
    </div>
  )
}

export default AnnouncementPopup
