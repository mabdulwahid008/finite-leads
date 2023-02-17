import  React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row } from 'reactstrap'

function Login() {
    const [loading, setloading] = useState(false)
    const [logins, setLogins] = useState({email: '', password: ''})

    const onChange = ( e ) => {
        setLogins({...logins, [e.target.name]: e.target.value})
        console.log(logins);
    }

    const  onSubmit = ( e ) => {
        e.preventDefault();
        setloading(true)

        localStorage.setItem('token', "true")

        window.location.reload(true)
        setloading(false)
    }
  return (
    <div>
    <Row style={{display:'flex', margin:0, justifyContent: 'center', alignItems:'center', overflow: 'hiden', height: '100vh', width: '100vw', background: '#f4f3ef'}}>
        <Col md="4">
            <Card>
                <CardHeader>
                    <CardTitle tag="h4">Login</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={onSubmit}>
                        <Row>
                            <Col md="12">
                                <FormGroup>
                                    <label>Username</label>
                                    <Input placeholder="Username" type="text" name='email' value={logins.email} required onChange={onChange}/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <FormGroup>
                                    <label>Password</label>
                                    <Input placeholder="Password" type="password"  name="password" value={logins.password} required onChange={onChange}/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <div style={{padding:'0px 15px'}}>
                                <Button color="primary" type="submit" disabled={loading? true: false}>{loading? 'Please Wait...' :  'Login'}</Button>
                            </div>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
        </Col>
    </Row>
</div>
  )
}

export default Login