import React, { useEffect, useState } from 'react'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { FaTrash } from 'react-icons/fa'
import { RxCross1 } from 'react-icons/rx'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row } from 'reactstrap'

function AddREAgentAreas({ setAreasPopup, areas }) {
    const [serviceAreas, setServiceAreas] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(false)
    const [newArea, setNewArea] = useState({lat:'', long:''})

    
    let areasArr = []

    useEffect(()=>{
        if(areas){
            const area = areas.split(' | ')
            for (let i = 0; i < area.length; i++) {
                let obj = {
                    lat: area[i].split(', ')[0].replace('[', ''),
                    long: area[i].split(', ')[1].replace(']', '')
                }
                areasArr.push(obj)
            }
            setServiceAreas(areasArr)
        }
    }, [])

    useEffect(()=>{
    }, [refresh])

    const addNewArea = (e) => {
        e.preventDefault()
        serviceAreas.push(newArea)
        document.getElementById('lat').value =''
        document.getElementById('long').value =''
        setNewArea({lat:'', long: ''})
        setRefresh(!refresh)
    }

    const removeArea = (index) => {
        serviceAreas.splice(index, 1)
        setRefresh(!refresh)
    }

    const closePopup = () =>{
       let option = window.confirm('Agent Areas will not be updated')
       if(option)
        setAreasPopup(false)
    }

    const updateAreas = () => {
        setLoading(true)
        let areas = ''
        for (let i = 0; i < serviceAreas.length; i++) {
            areas += `[${serviceAreas[i].lat}, ${serviceAreas[i].long}] | `
        }
        console.log(areas);
        setLoading(false)
    }
  return (
    <div className='popup'> 
      <div className='overlay'></div>
      <Card className='card-popup add-areas-popup'>
            <CardHeader>
                <CardTitle tag="h5">Update Areas</CardTitle>
                <RxCross1 onClick={closePopup}/>
            </CardHeader>
            <CardBody>
            {serviceAreas.length > 0 && <div style={{maxHeight:150, overflow:'auto', marginBottom:30}}>
                {serviceAreas.map((area, index)=>{
                return  <Row style={{width:'99%', position:'relative', marginBottom:5}} key={index}>
                                <Col className='pr-1' md="6">
                                    <Input readOnly type="text" value={area.lat}/>
                                </Col>
                                <Col className='pl-1' md="6">
                                    <Input readOnly type="text" value={area.long}/>
                                </Col>
                                <FaTrash style={{position:'absolute', top:5, right:-10, cursor:'pointer', color:'#f1926e'}} onClick={()=>removeArea(index)}/>
                            </Row>
                })}
                </div>}  
                <Form onSubmit={addNewArea} >
                    <Row style={{width:'99%', position:'relative',}}>
                        <Col className='pr-1' md="6">
                            <FormGroup>
                                <label>Latitudes</label>
                                <Input type='text' id='lat' required name='lat' onChange={((e) => setNewArea({...newArea, [e.target.name]: e.target.value}))}/>
                            </FormGroup>
                        </Col>
                        <Col className='pl-1' md="6">
                            <FormGroup>
                                <label>Longitudes</label>
                                <Input type='text' id='long' required name='long' onChange={((e) => setNewArea({...newArea, [e.target.name]: e.target.value}))}/>
                            </FormGroup>
                        </Col>
                        <AiOutlinePlusCircle onClick={addNewArea} style={{position:'absolute', fontSize:25, top:30, right:-15, cursor:'pointer', color:'#51cbce'}} />
                    </Row>
                </Form>
                <Button onClick={updateAreas} disabled={loading? true : false} style={{width:'100%'}}>{loading? 'Please Wait' : 'Update Areas'}</Button>
            </CardBody>
      </Card>
    </div>
  )
}

export default AddREAgentAreas
