import React, { useEffect, useState } from 'react'
import { BsGraphUp } from 'react-icons/bs'
import { GiNetworkBars } from 'react-icons/gi'
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import moment from 'moment-timezone'
import { toast } from 'react-toastify'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import { dashboardNASDAQChart } from 'variables/charts'

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
)


function AdminDashboard() {
    
    // for admin or master
    const [sales, setSales] = useState(null)

    const [dailyLeads, setDailyLeads] = useState(0)
    const [monthlyLeads, setMonthlyLeads] = useState(0)
    const [dailySales, setDailySales] = useState(0)
    const [monthlySales, setMonthlySales] = useState(0)

    
    //for stats data comming form api
    const [saleStats, setSaleStats] = useState([0, 0, 0, 0, 0, 0, 0, 0])
    const [leadsStats, setLeadStatus] = useState([0, 0, 0, 0, 0, 0, 0, 0])

    const stats = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
        datasets: [
            {
                data: saleStats,
                label: ' Sales',
                fill: false,
                borderColor: "#fbc658",
                backgroundColor: "transparent",
                pointBorderColor: "#fbc658",
                pointRadius: 4,
                pointHoverRadius: 4,
                pointBorderWidth: 8,
                tension: 0.4
            },
            {
                data: leadsStats,
                label:' Leads',
                fill: false,
                borderColor: "#51cbce",
                backgroundColor: "transparent",
                pointBorderColor: "#51cbce",
                pointRadius: 4,
                pointHoverRadius: 4,
                pointBorderWidth: 8,
                tension: 0.4
            },
        ]
    }

    const calculateStats = () => {
        if(sales){
                const date = moment.tz(Date.now(), "America/Los_Angeles");
                let dateToday =  `${date.year()}-${date.month()+1}-${date.date()}`

                if((date.month()+1) <= 9){
                    if(date.date() <= 9)
                        dateToday = `${date.year()}-0${date.month()+1}-0${date.date()}`
                    else
                        dateToday = `${date.year()}-0${date.month()+1}-${date.date()}`
                }
                
                if(date.date() <= 9){
                    if((date.month()+1) <= 9)
                        dateToday = `${date.year()}-0${date.month()+1}-0${date.date()}`
                    else
                        dateToday = `${date.year()}-${date.month()+1}-0${date.date()}`
                }
                
                const todaySales = sales.filter((sale)=> sale.create_at.includes(dateToday))

                setDailySales(todaySales.length)

                setMonthlySales(sales.length)
            }
    }

    const fetchSales = async() => {

    const date = moment.tz(Date.now(), "America/Los_Angeles");
    let monthStart = ''
    let monthEnd = ''

    if((date.month()+1) <= 9){
        monthStart = `${date.year()}-0${date.month()+1}`
        monthEnd = `${date.year()}-0${date.month()+2}`
    }
    else
        monthStart = `${date.year()}-${date.month()+1}`
        monthEnd = `${date.year()}-${date.month()+2}`
    

    const response = await fetch(`/sale/${monthStart}/${monthEnd}/0`,{
        method: 'GET',
        headers: {
            'Content-Type' : 'Application/json',
            token: localStorage.getItem('token')
        }
    })
    const res = await response.json()
    if(response.status === 200){
        setSales(res)
    }
    else
        toast.error(res.message)
    }

    const fetchLeadsStatus = async() => {
      const response = await fetch(`/lead/dashboard/stats`,{
        method: 'GET',
        headers: {
            'Content-Type' : 'Application/json',
            token: localStorage.getItem('token')
        }
      })
      const res = await response.json()
        if(response.status === 200){
          setDailyLeads(res.dailyLeads)
          setMonthlyLeads(res.monthlyLeads)
          setLeadStatus(res.chartData)
        }
        else
          toast.error(res.message)
    }

    const fetchStats = async() => {
        const response = await fetch(`/sale/stats`,{
            method : 'GET',
            headers: {
            'Content-Type': 'Application/json',
            token: localStorage.getItem('token')
            }
        })
        const res = await response.json();
        if(response.status === 200){
            setSaleStats(res.data)
          }
        else{
            toast.error(res.message)
        }

    }

    useEffect(()=>{
        fetchLeadsStatus()
        fetchStats()
        fetchSales()
    }, [])

    useEffect(()=>{
        calculateStats()
    }, [sales])

  return (
    <div className="content">
    <Row>
      <Col className='pr-1' lg="3" md="6" sm="6">
        <Card className="card-stats">
          <CardBody>
            <Row>
              <Col md="4" xs="5">
                <div className="icon-big text-center icon-warning">
                  {/* <i className="nc-icon nc-chart-bar-32 text-warning" /> */}
                  <BsGraphUp className="text-warning"/>
                </div>
              </Col>
              <Col md="8" xs="7">
                <div className="numbers">
                  <p className="card-category">Today</p>
                  <CardTitle tag="p">{dailySales}</CardTitle>
                  <p />
                </div>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <hr />
            <div className="stats">
             Sales
            </div>
          </CardFooter>
        </Card>
      </Col>
      <Col className="px-1" lg="3" md="6" sm="6">
        <Card className="card-stats">
          <CardBody>
            <Row>
              <Col md="4" xs="5">
                <div className="icon-big text-center icon-warning">
                  {/* <i className="nc-icon nc-money-coins text-success" /> */}
                  <GiNetworkBars className="text-primary"/>
                </div>
              </Col>
              <Col md="8" xs="7">
                <div className="numbers">
                  <p className="card-category">Today</p>
                  <CardTitle tag="p">{dailyLeads} Rs</CardTitle>
                  <p />
                </div>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <hr />
            <div className="stats">
              Leads
            </div>
          </CardFooter>
        </Card>
      </Col>
      <Col className="px-1" lg="3" md="6" sm="6">
        <Card className="card-stats">
          <CardBody>
            <Row>
              <Col md="4" xs="5">
                <div className="icon-big text-center icon-warning">
                  {/* <i className="nc-icon nc-chart-bar-32 text-warning" /> */}
                  <BsGraphUp className="text-warning"/>
                </div>
              </Col>
              <Col md="8" xs="7">
                <div className="numbers">
                  <p className="card-category">This Month</p>
                  <CardTitle tag="p">{monthlySales}</CardTitle>
                  <p />
                </div>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <hr />
            <div className="stats">
              Sales
            </div>
          </CardFooter>
        </Card>
      </Col>
      <Col className="pl-1" lg="3" md="6" sm="6">
        <Card className="card-stats">
          <CardBody>
            <Row>
              <Col md="4" xs="5">
                <div className="icon-big text-center icon-warning">
                  {/* <i className="nc-icon nc-favourite-28 text-primary" /> */}
                  <GiNetworkBars className="text-primary"/>
                </div>
              </Col>
              <Col md="8" xs="7">
                <div className="numbers">
                  <p className="card-category">This Month</p>
                  <CardTitle tag="p">{monthlyLeads} Rs</CardTitle>
                  <p />
                </div>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <hr />
            <div className="stats">
              Leads
            </div>
          </CardFooter>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col md="12">
        <Card className="card-chart">
          <CardHeader>
            <CardTitle tag="h5">Statistics</CardTitle>
            <p className="card-category">Monthly Sales & Leads Stats</p>
          </CardHeader>
          <CardBody>
              <Line data={stats} options={dashboardNASDAQChart.options} width={400} height={100}/>
          </CardBody>
          <CardFooter>
            <div className="chart-legend">
              <i className="fa fa-circle text-warning" /> Sales  
              <i style={{marginLeft:10}} className="fa fa-circle text-primary" /> Leads
            </div>
          </CardFooter>
        </Card>
      </Col>
    </Row>
  </div>
  )
}

export default AdminDashboard
