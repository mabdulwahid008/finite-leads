import React, { useRef, useState } from 'react'
import { RxCross1 } from 'react-icons/rx'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'
import img from '../../assets/img/profile.png'

function ImageUpload({ setImageUploadPopup, setRefresh }) {
  const ref = useRef()
  const [profile, setProfile] = useState(img)
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

  const uploadProfile = async ( e ) => {
    e.prevenDefault()
    setLoading(true)

    // setRefresh(true)
    setLoading(false)
  }

  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card style={{width:'30%'}} className='card-popup'>
            <CardHeader>
                <CardTitle tag="h4">Upload Image</CardTitle>
                <RxCross1 onClick={()=>{setImageUploadPopup(false)}}/>
            </CardHeader>
            <CardBody>
              <Form onSubmit={uploadProfile} style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <FormGroup>
                  <label htmlFor="file-input" style={{marginTop:-20}}>
                    <img src={profile} style={{height: 300, objectFit:'cover', cursor:'pointer', backgroundColor:'white'}}/>
                  </label>
                  <input id="file-input" type="file" accept='image/jpg,image/png,image/jpeg' onChange={onChange} style={{opacity:0}}/>
                </FormGroup>
                <Button style={{marginTop:-30}} disabled={loading? true : false}>{loading ? "Please Wait" : "Upload Profile Image"}</Button>
              </Form>
            </CardBody>
        </Card>
    </div>
  )
}

export default ImageUpload
