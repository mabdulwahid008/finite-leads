/*!

=========================================================
* Paper Dashboard React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useCallback, useEffect, useState } from "react";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col
} from "reactstrap";
// core components
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart
} from "variables/charts.js";
import moment from 'moment-timezone'
import { toast } from 'react-toastify'
import { GiSwapBag } from 'react-icons/gi';
import { BsGraphUp } from 'react-icons/bs';

function Dashboard() {
  // for user 
  const [mySales, setMySales] = useState(null)
  // for admin or master
  const [sales, setSales] = useState(null)

  const [dailyBonus, setDailyBonus] = useState(0)
  const [monthlyBonus, setMonthlyBonus] = useState(0)
  const [dailySales, setDailySales] = useState(0)
  const [monthlySales, setMonthlySales] = useState(0)

  //for stats data comming form api
  const [arr, setArr] = useState([0,0,0])

  const stats = useCallback(() => {
    const obj = {  
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
   return obj
  },[arr])


  // for admin or master 
  const calculateStats = () => {
      let _dailyBonus = 0;
      let _totalBonus = 0;
      let _dailySales = 0;
      let _monthlySales = 0

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

          for (let i = 0; i < todaySales.length; i++) {
            if(todaySales[i].updated_multiplier)
              _dailyBonus += todaySales[i].updated_multiplier * 1000
            else
              _dailyBonus += (todaySales[i].multiplier * 1000) + todaySales[i].extrabonus
            _dailySales += 1
          }
          setDailyBonus(_dailyBonus)
          setDailySales(_dailySales)

          for (let i = 0; i < sales.length; i++) {
            if(sales[i].updated_multiplier)
              _totalBonus += sales[i].updated_multiplier * 1000;
            else
              _totalBonus += (sales[i].multiplier * 1000) + sales[i].extrabonus;
            _monthlySales +=1

          }
          setMonthlyBonus(_totalBonus)
          setMonthlySales(_monthlySales)
    }
  }

  // for admin or master 
  const fetchSales = async() => {

    const date = moment.tz(Date.now(), "America/Los_Angeles");
    let monthStart = ''
    let monthEnd = ''

    if((date.month()+1) <= 9){
        if(date.date() <= 9)
            monthStart = `${date.year()}-0${date.month()+1}-01`
        else
            monthStart = `${date.year()}-0${date.month()+1}-01`
    }
    if((date.month()+1) <= 9){
        if(date.date() <= 9)
            monthEnd = `${date.year()}-0${date.month()+1}-31`
        else
            monthEnd = `${date.year()}-0${date.month()+1}-31`
    }
    
    

    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/sale/${monthStart}/${monthEnd}/0`,{
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
      const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/sale/mysales`, {
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
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/sale/stats`,{
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

  useEffect(()=>{
    if(localStorage.getItem('userRole') == 0)
        calculateUserStats()
    if(localStorage.getItem('userRole') == 3 || localStorage.getItem('userRole') == 5)
        calculateStats()
  },[mySales, sales])

  useEffect(()=>{
    if(localStorage.getItem('userRole') == 0)
        fectchMySales(); 
    if(localStorage.getItem('userRole') == 3 || localStorage.getItem('userRole') == 5){
      fetchSales()
    }
    fetchStats()
  },[])


  return (
    <>
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
        {/* <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Users Behavior</CardTitle>
                <p className="card-category">24 Hours performance</p>
              </CardHeader>
              <CardBody>
                <Line
                  data={dashboard24HoursPerformanceChart.data}
                  options={dashboard24HoursPerformanceChart.options}
                  width={400}
                  height={100}
                />
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" /> Updated 3 minutes ago
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row> */}
        <Row>
          {/* <Col md="4">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Email Statistics</CardTitle>
                <p className="card-category">Last Campaign Performance</p>
              </CardHeader>
              <CardBody style={{ height: "266px" }}>
                <Pie
                  data={dashboardEmailStatisticsChart.data}
                  options={dashboardEmailStatisticsChart.options}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-primary" /> Opened{" "}
                  <i className="fa fa-circle text-warning" /> Read{" "}
                  <i className="fa fa-circle text-danger" /> Deleted{" "}
                  <i className="fa fa-circle text-gray" /> Unopened
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-calendar" /> Number of emails sent
                </div>
              </CardFooter>
            </Card>
          </Col> */}
          <Col md="12">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h5">Statistics</CardTitle>
                <p className="card-category">Monthly Sales Stats</p>
              </CardHeader>
              <CardBody>
               <Line
                  data={stats}
                  options={dashboardNASDAQChart.options}
                  width={400}
                  height={100}
                />
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
    </>
  );
}

export default Dashboard;
