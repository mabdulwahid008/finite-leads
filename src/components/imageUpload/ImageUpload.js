import React, { useRef, useState } from 'react'
import { RxCross1 } from 'react-icons/rx'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'
import img from '../../assets/img/profile.png'
import { toast } from 'react-toastify'

function ImageUpload({ setImageUploadPopup, setRefresh, profile_image }) {
  const ref = useRef()
  const [profile, setProfile] = useState(profile_image? `http://localhost:5000/${profile_image}` : img)
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const onChange = async( e ) => {
    setImage(e.target.files[0])
    const base64 = await convertBase64(e.target.files[0])
    setProfile(base64)
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

  const uploadProfile = async (e) => {
    e.preventDefault()
    setLoading(true)

    const fd = new FormData();
    fd.append('image', image);
    const response = await fetch('/user/upload-profile',{
        method:'PATCH',
        headers:{
            'Conten-Type': 'Application/json',
            token: localStorage.getItem('token')
        },
        body: fd
    })
    const res = await response.json();
    if(response.status === 200){
        toast.success(res.message)
        setRefresh(true)
        setImageUploadPopup(false)
    }
    else
        toast.error(res.message)

    setLoading(false)
  }

  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card style={{width:'30%'}} className='card-popup'>
            <CardHeader>
                <CardTitle tag="h4">Upload Image
                <p>2MB max image size</p>
                </CardTitle>
                <RxCross1 onClick={()=>{setImageUploadPopup(false)}}/>
            </CardHeader>
            <CardBody>
              <Form onSubmit={uploadProfile} style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <FormGroup style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                  <label htmlFor="file-input" style={{marginTop:-20, marginBottom:-20}}>
                    <img src={profile} style={{height: 250, objectFit:'cover', cursor:'pointer', backgroundColor:'white'}}/>
                  </label>
                  <input required id="file-input" type="file" accept='image/jpg,image/png,image/jpeg' onChange={onChange} style={{opacity:0}}/>
                </FormGroup>
                <Button style={{marginTop:-5}} disabled={loading? true : false}>{loading ? "Please Wait" : "Upload Profile Image"}</Button>
              </Form>
            </CardBody>
        </Card>
    </div>
  )
}

export default ImageUpload
