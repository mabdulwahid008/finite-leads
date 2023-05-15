import React, { useEffect, useState } from 'react'
import { BsCardList, BsCheckCircle, BsEye } from 'react-icons/bs'
import { RxCrossCircled } from 'react-icons/rx'
import { AiOutlineFileDone } from 'react-icons/ai'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import Loading from 'components/Loading/Loading'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

function REAgentDashboard() {
  const [rejectedLeads, setRejectedLeads] = useState(0)
  const [acceptedLeads, setAcceptedLeads] = useState(0)
  const [followUpLeads, setFollowUpLeads] = useState(0)
  const [onContractLeads, setOnContractLeads] = useState(0)
  const [listedLeads, setListedLeads] = useState(0)
  const [soldLeads, setSoldLeads] = useState(0)
  const [newLeads, setNewLeads] = useState(0)
  
  // const [pieChartdata, setPieChartData] = useState(null)

  const data = {
    labels: ['Rejected', 'Accepted', 'Follow Uo', 'On Contract', 'Listed', 'Sold', 'New'],
    datasets : [
      {
        data: [rejectedLeads, acceptedLeads, followUpLeads, onContractLeads, listedLeads, soldLeads, newLeads],
        backgroundColor: ['#ff7f7f', '#7fff7f', '#ffff7f', '#7fbfff', '#bf7fff', '#ffbf7f', '#d3d3d3']
      }
    ]
  }
  const pieChartOptions = {}


  const [leads, setLeads] = useState(null)
  const [totalRecord, setTotalRecord] = useState(0)
  const [page, setPage] = useState(1)



  const fetchMyLeadsStatus = async() => { 
  const date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth()+1 <9 ? `0${date.getMonth()+1}` : date.getMonth()+1

    const response = await fetch(`/lead/agent/dashboard/${year}/${month}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'Application/json',
            token: localStorage.getItem('token')
        }
    })
    const res = await response.json()
    if(response.status === 200){
      setAcceptedLeads(res.accepted)
      setRejectedLeads(res.rejected)
      setListedLeads(res.listed)
      setOnContractLeads(res.onContract)
      setFollowUpLeads(res.followUp)
      setSoldLeads(res.sold)
      setNewLeads(res.neutral)
      
    }
    else
        toast.error(res.message)
  }

  const fetchMyNotSatusLeads = async() => {
    const response = await fetch(`/lead/agent/dahboard-leads/${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'Application/json',
            token: localStorage.getItem('token')
        }
    })
    const res = await response.json()
    if(response.status === 200){
      setLeads(res.data)
      setTotalRecord(res.totalRows)
    }
    else
        toast.error(res.message)
  }

  useEffect(()=>{
    setLeads(null)
    fetchMyNotSatusLeads()
  }, [page])

  useEffect(()=>{
    fetchMyLeadsStatus()
    fetchMyNotSatusLeads();
  }, [])
  return (
    <div className='content'>
        <Row>
          <Col className='pr-1' lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <BsCheckCircle style={{color:'#7fff7f'}}/>
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">This Month</p>
                      <CardTitle tag="p">{acceptedLeads}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                 Accepted Leads
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col className='px-1' lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      {/* <i className="nc-icon nc-money-coins text-success" /> */}
                      <AiOutlineFileDone style={{color:'#7fbfff'}}/>
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">This Month</p>
                      <CardTitle tag="p">{onContractLeads}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  On Contract Leads
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col className='px-1' lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      {/* <i className="nc-icon nc-chart-bar-32 text-warning" /> */}
                      <BsCardList style={{color:'#bf7fff'}}/>
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">This Month</p>
                      <CardTitle tag="p">{listedLeads}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  Listed Leads
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col className='prl-1' lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      {/* <i className="nc-icon nc-favourite-28 text-primary" /> */}
                      <RxCrossCircled style={{color:'#ff7f7f'}}/>
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">This Month</p>
                      <CardTitle tag="p">{rejectedLeads} </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  Rejected Leads
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">New Leads</CardTitle>
              </CardHeader>
              <CardBody style={{height:350, position:'relative'}}>
                  {!leads && <Loading />}
                  {leads && leads.length === 0 && <p>OOPS! No lead in a queue</p>}
                  {leads && leads.length !== 0 && <>
                  <Table>
                    <thead>
                      <tr className='dahboard-table'>
                        <th>#</th>
                        <th style={{width:'20%'}}>First Name</th>
                        <th>Lead Type</th>
                        <th>Working Outside</th>
                        <th>Assigned On</th>
                        <th className='text-right'>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead, index)=>{
                        return <tr key={index} className='dahboard-table'>
                          <td>{index+1}</td>
                          <td>{lead.fname}</td>
                          <td>{lead.lead_type == 0 ? 'Seller' : 'Buyer'}</td>
                          <td>{lead.working_status == 0 ? 'No' : 'Yes'}</td>
                          <td>{lead.assigned_on}</td>
                          <div className='actions'>
                              <Link to={`lead-details/${lead._id}`}><BsEye/></Link>
                          </div>
                        </tr>
                      })}
                    </tbody>
                  </Table>
                  <div style={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center', position:'absolute', bottom:0}}>
                        <div className='dahboard-table'>
                            <Button className='next-prev' disabled={page === 1 ? true : false} onClick={()=>{if(page !== 1) setPage(page-1)}}>Prev</Button>
                            <Button className='next-prev' disabled={totalRecord > 0 && page < Math.ceil(totalRecord / 1) ? false : true} onClick={()=>{if(totalRecord > 0 && page < Math.ceil(totalRecord / 1)) setPage(page+1)}}>Next</Button>
                        </div>
                        <div>
                            <p className='text-muted' style={{fontSize:'12px', marginRight:30}}>Page: {page} / Total Leads: {totalRecord}</p>
                        </div>
                    </div>
                  </>}
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Leads Statistics</CardTitle>
              </CardHeader>
              <CardBody style={{height:350}}>
                      {data && <Pie data={data} options={pieChartOptions}></Pie>}
              </CardBody>
            </Card>
          </Col>
        </Row>
    </div>
  )
}

export default REAgentDashboard
