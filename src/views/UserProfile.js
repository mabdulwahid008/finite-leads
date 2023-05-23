import Loading from "components/Loading/Loading";
import ImageUpload from "components/imageUpload/ImageUpload";
import React, { useEffect, useState } from "react";
import { BsEyeSlash, BsCamera } from "react-icons/bs";
import { toast } from "react-toastify";
import { Button, Card, CardHeader, CardBody, CardFooter, CardTitle, FormGroup, Form, Input, Row, Col } from "reactstrap";
import axios from 'axios'

function UserProfile() {

  const userRoles = [
    { role: 0, value: 'Sales Agent'},
    { role: 1, value: 'Marketing Agent'},
    { role: 2, value: 'Real Estate Agent'},
    { role: 3, value: 'Admin'},
    { role: 5, value: 'Master'},
  ]

  const [mydata, setMyData] = useState(null)

  // for updating new pass
  const [password, setPassword] = useState({old_pass:'', new_pass:''})
  const [loading, setLoading] = useState(false)

  // mobile responsive
  const { innerWidth: width } = window;
  const onMobile = width < 762 ? true : false;

  const [refresh, setRefresh] = useState(false)

  const [imageUploadPopup, setImageUploadPopup] = useState(false)

  const onChangePassword = ( e ) => {
    setPassword({...password, [e.target.name]: e.target.value})
  } 

  
  const submitChangePassword = async( e ) => {
    e.preventDefault()
    setLoading(true)

    const response = await fetch('/user/update-pass', {
      method:'PATCH',
      headers:{
        'Content-Type': 'Application/json',
        token: localStorage.getItem('token')
      },
      body: JSON.stringify(password)
    })
    const res = await response.json()
    if(response.status === 200){
      toast.success(res.message)
      document.getElementById('old_pass').value = ""
      document.getElementById('new_pass').value = ""
      setPassword({old_pass:'', new_pass:''})
    }
    else
      toast.error(res.message)

    setLoading(false)
  }

  const fetchMyProfile = async() => {
    const response = await fetch('/user/profile/data', {
      method:'GET',
      headers:{
        'Content-Type':'Apllication/json',
        token: localStorage.getItem('token')
      }
    })
    let res = await response.json()
    
    if(response.status === 200){
      setMyData(res)
    }
    else
      toast.error(res.message)

  }

  useEffect(()=>{
    setRefresh(false)
    fetchMyProfile()
  }, [refresh])
  return (
    <>
      <div className="content">
        {!mydata && <Loading />}
       {mydata &&  <Row>
          <Col md="4">
            <Card className="card-user">
              <div className="image">
                <img alt="..." src={require("assets/img/damir-bosnjak.jpg")} />
              </div>
              <CardBody>
                <div className="author">
                  <a style={{position:'relative'}}>
                    <img style={{backgroundColor:'#f4f3ef'}}
                      alt="..."
                      className="avatar border-gray"
                      src={mydata.profile_image ? `${process.env.REACT_APP_IMAGE_URL}/${mydata.profile_image}` : require("assets/img/profile.png")}
                    />
                    <BsCamera onClick={() => setImageUploadPopup(true)} style={{position:'absolute', background:'#252422', color:"#51cbce", cursor:'pointer', padding:'5px 7px', borderRadius:20, fontSize:30, top:30, right: 5}}/>
                  </a>
                    <h5 className="username">{mydata.name}</h5>
                  <p className="description">{userRoles.filter((role) => role.role == mydata.role)[0].value}</p>
                </div>
                <p className="description text-center">
                  We like the way you work it <br />
                </p>
              </CardBody>
              <CardFooter>
                <hr />
                  <p className="logout" onClick={()=>{localStorage.clear(); window.location.reload(true)}}>
                    <i className="nc-icon nc-button-power" />
                   Log Out</p>
                {/* <div className="button-container">
                  <Row>
                    <Col className="ml-auto" lg="3" md="6" xs="6">
                      <h5>
                        12 <br />
                        <small>Files</small>
                      </h5>
                    </Col>
                    <Col className="ml-auto mr-auto" lg="4" md="6" xs="6">
                      <h5>
                        2GB <br />
                        <small>Used</small>
                      </h5>
                    </Col>
                    <Col className="mr-auto" lg="3">
                      <h5>
                        24,6$ <br />
                        <small>Spent</small>
                      </h5>
                    </Col>
                  </Row>
                </div> */}
              </CardFooter>
            </Card>
            {/* <Card>
              <CardHeader>
                <CardTitle tag="h4">Team Members</CardTitle>
              </CardHeader>
              <CardBody>
                <ul className="list-unstyled team-members">
                  <li>
                    <Row>
                      <Col md="2" xs="2">
                        <div className="avatar">
                          <img
                            alt="..."
                            className="img-circle img-no-padding img-responsive"
                            src={require("assets/img/faces/ayo-ogunseinde-2.jpg")}
                          />
                        </div>
                      </Col>
                      <Col md="7" xs="7">
                        DJ Khaled <br />
                        <span className="text-muted">
                          <small>Offline</small>
                        </span>
                      </Col>
                      <Col className="text-right" md="3" xs="3">
                        <Button
                          className="btn-round btn-icon"
                          color="success"
                          outline
                          size="sm"
                        >
                          <i className="fa fa-envelope" />
                        </Button>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                      <Col md="2" xs="2">
                        <div className="avatar">
                          <img
                            alt="..."
                            className="img-circle img-no-padding img-responsive"
                            src={require("assets/img/faces/joe-gardner-2.jpg")}
                          />
                        </div>
                      </Col>
                      <Col md="7" xs="7">
                        Creative Tim <br />
                        <span className="text-success">
                          <small>Available</small>
                        </span>
                      </Col>
                      <Col className="text-right" md="3" xs="3">
                        <Button
                          className="btn-round btn-icon"
                          color="success"
                          outline
                          size="sm"
                        >
                          <i className="fa fa-envelope" />
                        </Button>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                      <Col md="2" xs="2">
                        <div className="avatar">
                          <img
                            alt="..."
                            className="img-circle img-no-padding img-responsive"
                            src={require("assets/img/faces/clem-onojeghuo-2.jpg")}
                          />
                        </div>
                      </Col>
                      <Col className="col-ms-7" xs="7">
                        Flume <br />
                        <span className="text-danger">
                          <small>Busy</small>
                        </span>
                      </Col>
                      <Col className="text-right" md="3" xs="3">
                        <Button
                          className="btn-round btn-icon"
                          color="success"
                          outline
                          size="sm"
                        >
                          <i className="fa fa-envelope" />
                        </Button>
                      </Col>
                    </Row>
                  </li>
                </ul>
              </CardBody>
            </Card> */}
          </Col>
          <Col md="8">
            <Card className="card-user">
              <CardHeader>
                <CardTitle tag="h5">Edit Profile</CardTitle>
              </CardHeader>
              <CardBody>
                <Form onSubmit={submitChangePassword}>
                  <Row>
                    <Col className={`${onMobile? '' : 'pr-1'}`} md="5">
                      <FormGroup>
                        <label>Company (disabled)</label>
                        <Input defaultValue="Finite Lead" disabled placeholder="Company"type="text"/>
                      </FormGroup>
                    </Col>
                    <Col className={`${onMobile? '' : 'px-1'}`} md="4">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">Email address</label>
                        <Input disabled defaultValue={mydata.email} placeholder="Username" type="email"/>
                      </FormGroup>
                    </Col>
                    <Col className={`${onMobile? '' : 'pl-1'}`} md="3">
                      <FormGroup>
                        <label>Phone</label>
                        <Input disabled defaultValue={mydata.phone} type="text" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Address</label>
                        <Input disabled defaultValue={mydata.address} type="text" />
                      </FormGroup>
                    </Col>
                  </Row>
                  {localStorage.getItem('userRole') == 2 && <>
                  <Row>
                    <Col className={`${onMobile? '' : 'pr-1'}`} md="4">
                      <FormGroup>
                        <label>City</label>
                        <Input disabled defaultValue={mydata.city} type="text"/>
                      </FormGroup>
                    </Col>
                    <Col className={`${onMobile? '' : 'px-1'}`} md="4">
                      <FormGroup>
                        <label>Country</label>
                        <Input disabled defaultValue={mydata.country} type="text"/>
                      </FormGroup>
                    </Col>
                    <Col className={`${onMobile? '' : 'pl-1'}`} md="4">
                      <FormGroup>
                        <label>Zip Code</label>
                        <Input disabled defaultValue={mydata.zip_code} type="number" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className={`${onMobile? '' : 'pr-1'}`} md="5">
                      <FormGroup>
                        <label>Brokerage Name</label>
                        <Input disabled defaultValue={mydata.brokerage_name} type="text" />
                      </FormGroup>
                    </Col>
                    <Col className={`${onMobile? '' : 'px-1'}`} md="4">
                      <FormGroup>
                        <label>Broker Name</label>
                        <Input disabled defaultValue={mydata.broker_name} type="text" />
                      </FormGroup>
                    </Col>
                    <Col className={`${onMobile? '' : 'pl-1'}`} md="3">
                      <FormGroup>
                        <label>Office Phone</label>
                        <Input disabled defaultValue={mydata.office_phone} type="text" />
                      </FormGroup>
                    </Col>
                  </Row>
                  </>}
                  <Row>
                    <Col className={`${onMobile? '' : 'pr-1'}`} md="6">
                      <FormGroup style={{position:'relative'}}>
                        <label>Old Password</label>
                        <Input defaultValue={password.old_pass} id="old_pass" type="password" name="old_pass" required onChange={onChangePassword}/>
                        <BsEyeSlash style={{position:'absolute', cursor:'pointer', fontSize:18, top:35, right:10}}
                        onClick={()=>{
                          const element = document.getElementById("old_pass")
                          element.type = element.type === "password" ? "text" : "password"
                        }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className={`${onMobile? '' : 'pl-1'}`} md="6">
                      <FormGroup style={{position:'relative'}}>
                        <label>New Password</label>
                        <Input defaultValue={password.new_pass} id="new_pass" type="password" name="new_pass" required onChange={onChangePassword}/>
                        <BsEyeSlash style={{position:'absolute', cursor:'pointer', fontSize:18, top:35, right:10}}
                        onClick={()=>{
                          const element = document.getElementById("new_pass")
                          element.type = element.type === "password" ? "text" : "password"
                        }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <div className="update ml-auto mr-auto">
                      <Button disabled={loading ? true : false}>{loading ? "Please Wait" :  "Update Password"}</Button>
                    </div>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>}
        {imageUploadPopup && <ImageUpload setImageUploadPopup={setImageUploadPopup} setRefresh={setRefresh} profile_image={mydata.profile_image}/>}
      </div>
    </>
  );
}

export default UserProfile;
