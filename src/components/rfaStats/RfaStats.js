import Loading from 'components/Loading/Loading'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { RxExternalLink } from 'react-icons/rx'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap'

function RfaStats() {
    const [userWhoUploadedPage, setUserWhoUploadedPage] = useState(1)
    const [totalDataOfUploaded, setTotalDataOfUploaded] = useState(0)
    const [dataOfUploaded, setDataOfUploaded] = useState(null)


    const [userWhoDidNotUploadedPage, setUserWhoDidNotUploadedPage] = useState(1)
    const [totalDataOfNotUploaded, setTotalDataOfNotUploaded] = useState(0)
    const [dataOfNotUploaded, setDataOfNotUploaded] = useState(null)

    const fetchUsersWhoUploaded = async() => {
        const response = await fetch(`/lead/agents/uploadded-rfa/${userWhoUploadedPage}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setDataOfUploaded(res.agentsWhoHasUploaded)
            setTotalDataOfUploaded(res.totalData)
        }
        else{
            toast.error(res.message)
        }
    }

    const fetchUsersWhoDidNotUploaded = async() => {
        const response = await fetch(`/lead/agents/not-uploadded-rfa/${userWhoDidNotUploadedPage}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setDataOfNotUploaded(res.agentsWhoNotHasUploaded)
            setTotalDataOfNotUploaded(res.totalData)
        }
        else{
            toast.error(res.message)
        }
    }

    useEffect(() => {
        fetchUsersWhoUploaded()
    }, [userWhoUploadedPage])

    useEffect(() => {
        fetchUsersWhoDidNotUploaded()
    }, [userWhoDidNotUploadedPage])
  return (
    <Row className='mt-2'>
        <Col>
            <Card>
                <CardHeader>
                    <CardTitle tag="h4">RFA Stats</CardTitle>
                </CardHeader>
                <CardBody>
                    <Row style={{justifyContent:'space-between'}}>
                        {!dataOfUploaded && <Loading />}
                        {dataOfUploaded?.length === 0 && <p style={{paddingLeft:20}}>No data found.</p>}
                        {dataOfUploaded?.length > 0 && <Col md="7">
                            <h6 style={{fontSize: 13}}>Agents Who Has Uploaded</h6>
                            <div style={{minHeight:400, borderRight:'1px dashed #dee2e6', paddingRight:20}}>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Comments</th>
                                        <th className='actions'>RFA</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {dataOfUploaded?.map((agent, index)=>{
                                            return <tr key={agent._id}>
                                                <td>{index+1}</td>
                                                <td>{agent.name}</td>
                                                <td>{agent.comments}</td>
                                                <div className='actions'>
                                                    <a href={`${process.env.REACT_APP_IMAGE_URL}/${agent.rfa}`} target="_blank"><RxExternalLink /></a>
                                                </div>
                                            </tr>
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', paddingRight:20}}>
                                    <div className='dahboard-table'>
                                        <Button className='next-prev' disabled={userWhoUploadedPage === 1 ? true : false} onClick={()=>{if(userWhoUploadedPage !== 1) setUserWhoUploadedPage(userWhoUploadedPage-1)}}>Prev</Button>
                                        <Button className='next-prev' disabled={userWhoUploadedPage >= Math.ceil(totalDataOfUploaded / 10)} onClick={()=>{setUserWhoUploadedPage(userWhoUploadedPage+1)}}>Next</Button>
                                    </div>
                                    <div>
                                        <p  className='text-muted' style={{fontSize:12}}>Page: {userWhoUploadedPage} / Total Data: {totalDataOfUploaded}</p>
                                    </div>
                                </div>
                        </Col>}
                        {dataOfNotUploaded?.length > 0 && <Col md="4">
                            <h6 style={{fontSize: 13}}>Agents Who Has Not Uploaded</h6>
                            <div style={{minHeight:400}}>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {dataOfNotUploaded?.map((agent, index)=>{
                                            return <tr key={agent._id}>
                                                <td>{index+1}</td>
                                                <td>{agent.name}</td>
                                            </tr>
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                                    <div className='dahboard-table'>
                                        <Button className='next-prev' disabled={userWhoDidNotUploadedPage === 1 ? true : false} onClick={()=>{if(userWhoDidNotUploadedPage !== 1) setUserWhoDidNotUploadedPage(userWhoDidNotUploadedPage-1)}}>Prev</Button>
                                        <Button className='next-prev' disabled={userWhoDidNotUploadedPage >= Math.ceil(totalDataOfNotUploaded / 10)} onClick={()=>{setUserWhoDidNotUploadedPage(userWhoDidNotUploadedPage+1)}}>Next</Button>
                                    </div>
                                    <div>
                                        <p  className='text-muted' style={{fontSize:12}}>Page: {userWhoDidNotUploadedPage} / Total Data: {totalDataOfNotUploaded}</p>
                                    </div>
                                </div>
                        </Col>}
                    </Row>
                </CardBody>
            </Card>
        </Col>
    </Row>
  )
}

export default RfaStats
