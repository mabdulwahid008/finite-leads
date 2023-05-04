import React from 'react'
import { BsCardList, BsCheckCircle } from 'react-icons/bs'
import { RxCrossCircled } from 'react-icons/rx'
import { AiOutlineFileDone } from 'react-icons/ai'
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'reactstrap'

function REAgentDashboard() {
  return (
    <div className='content'>
      <Row>
          <Col lg="3" md="6" sm="6">
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
                      <CardTitle tag="p">{}</CardTitle>
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
          <Col lg="3" md="6" sm="6">
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
                      <CardTitle tag="p">{}</CardTitle>
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
          <Col lg="3" md="6" sm="6">
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
                      <CardTitle tag="p">{}</CardTitle>
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
          <Col lg="3" md="6" sm="6">
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
                      <CardTitle tag="p">{} </CardTitle>
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
    </div>
  )
}

export default REAgentDashboard
