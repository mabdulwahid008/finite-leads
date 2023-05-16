import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap'

function REAgentLeadStats() {
  return (
    <Row>
        <Col md='12 mt-3'>
            <Card>
                <CardHeader>
                    <CardTitle tag="h4">RE Agent Stats</CardTitle>
                </CardHeader>
                <CardBody>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Agent</th>
                                <th>State</th>
                                <th>Assigned Leads</th>
                                <th>Rejected Leads</th>
                            </tr>
                        </thead>
                    </Table>
                </CardBody>
            </Card>
        </Col>
    </Row>
  )
}

export default REAgentLeadStats
