import React, { Component } from 'react'

import { Container, Row, Col } from 'react-bootstrap'

import CardProduk from '../components/cardProduk'

export default class Home extends Component {
    render() {
        return (
            <div>
                <Container>
                    <Row style={{padding: "5% 15%", paddingTop: "10%"}}>
                        <Col md={12}>
                            <h1 style={{textAlign: "Center"}}>Products</h1>
                        </Col>
                    </Row>
                    <CardProduk/>    
                </Container>

            </div>
        )
    }
}