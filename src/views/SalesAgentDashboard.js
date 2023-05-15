import React, { useCallback, useEffect, useState } from 'react'
import { BsGraphUp } from 'react-icons/bs'
import { GiSwapBag } from 'react-icons/gi'
import { toast } from 'react-toastify'
import moment from 'moment-timezone'
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import { dashboardNASDAQChart } from 'variables/charts'

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
)

function SalesAgentDashboard() {
    
    // for user 
    const [mySales, setMySales] = useState(null)

    const [dailyBonus, setDailyBonus] = useState(0)
    const [monthlyBonus, setMonthlyBonus] = useState(0)
    const [dailySales, setDailySales] = useState(0)
    const [monthlySales, setMonthlySales] = useState(0)

    //for stats data comming form api
    const [arr, setArr] = useState([0, 0, 0, 0, 0, 0, 0, 0],)
    const [data, setData] = useState(null)


    const stats = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
        datasets: [
        {
            data: arr,
            fill: false,
            borderColor: "#fbc658",
            backgroundColor: "transparent",
            pointBorderColor: "#fbc658",
            pointRadius: 4,
            pointHoverRadius: 4,
            pointBorderWidth: 8,
            tension: 0.4
        }]
    }
    
    // for user stats
    const calculateUserStats = () => {
    if(mySales){
        let _dailyBonus = 0;
        let _monthlyBonus = 0;
        let _dailySales = 0;
        let _monthlySales = 0;

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
        
        const todaySales = mySales.filter((sale)=> sale.create_at.includes(dateToday))

        for (let i = 0; i < todaySales.length; i++) {
          if(todaySales[i].updated_multiplier)
            _dailyBonus += todaySales[i].updated_multiplier * 1000
          else
            _dailyBonus += (todaySales[i].multiplier * 1000) + todaySales[i].extrabonus
          _dailySales += 1
        }
        setDailyBonus(_dailyBonus)
        setDailySales(_dailySales)

        for (let i = 0; i < mySales.length; i++) {
          if(mySales[i].updated_multiplier)
            _monthlyBonus += mySales[i].updated_multiplier * 1000
          else
            _monthlyBonus += (mySales[i].multiplier * 1000) + mySales[i].extrabonus
          _monthlySales += 1
        }
        setMonthlyBonus(_monthlyBonus)
        setMonthlySales(_monthlySales)
        

    }
    }
    // for user
    const fectchMySales = async() => {
        const response = await fetch(`/sale/mysales`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setMySales(res)
        }
        else{
            toast.error(res.message)
        }
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
            setArr(res.data)
          }
        else{
            toast.error(res.message)
        }

    }

    useEffect(()=> {
      calculateUserStats()
    }, [mySales])

    useEffect(()=>{
        fectchMySales()
        fetchStats()
    }, [])
    
  return (
    <div className="content">
    <Row>
      <Col lg="3" md="6" sm="6">
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
      <Col lg="3" md="6" sm="6">
        <Card className="card-stats">
          <CardBody>
            <Row>
              <Col md="4" xs="5">
                <div className="icon-big text-center icon-warning">
                  {/* <i className="nc-icon nc-money-coins text-success" /> */}
                  <GiSwapBag className="text-success"/>
                </div>
              </Col>
              <Col md="8" xs="7">
                <div className="numbers">
                  <p className="card-category">Today</p>
                  <CardTitle tag="p">{dailyBonus} Rs</CardTitle>
                  <p />
                </div>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <hr />
            <div className="stats">
              Bonus
            </div>
          </CardFooter>
        </Card>
      </Col>
      <Col lg="3" md="6" sm="6">
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
      <Col lg="3" md="6" sm="6">
        <Card className="card-stats">
          <CardBody>
            <Row>
              <Col md="4" xs="5">
                <div className="icon-big text-center icon-warning">
                  {/* <i className="nc-icon nc-favourite-28 text-primary" /> */}
                  <GiSwapBag className="text-success"/>
                </div>
              </Col>
              <Col md="8" xs="7">
                <div className="numbers">
                  <p className="card-category">This Month</p>
                  <CardTitle tag="p">{monthlyBonus} Rs</CardTitle>
                  <p />
                </div>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <hr />
            <div className="stats">
              Bonus
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
            <p className="card-category">Monthly Sales Stats</p>
          </CardHeader>
          <CardBody>
        
          <Line data={stats} options={dashboardNASDAQChart.options} width={400} height={100}/>

          </CardBody>
          <CardFooter>
            <div className="chart-legend">
              <i className="fa fa-circle text-warning" /> Sales
            </div>
            <hr />
            <div className="card-stats">
              Sales Stats
            </div>
          </CardFooter>
        </Card>
      </Col>
    </Row>
  </div>
  )
}

export default SalesAgentDashboard
