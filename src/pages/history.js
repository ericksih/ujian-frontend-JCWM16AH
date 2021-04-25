import Axios from 'axios'
import React, { Component } from 'react'
import { Col, Container, Row, Accordion, Card, Button, Table, Image } from 'react-bootstrap'

import {connect} from 'react-redux'

// import {Redirect} from 'react-router-dom'

import {getHistory} from '../action'

import swal from 'sweetalert';

import {login} from '../action'




 class History extends Component {


    componentDidMount() {
        Axios.get(`http://localhost:2000/history?userId=${localStorage.id}`)
        .then((res) => {
            console.log(res)
            this.props.getHistory(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    handleBatalPembayaran = (index) => {
        let tempHistory = this.props.history
        tempHistory.splice(index, 1)

        Axios.patch(`http://localhost:2000/history?userId=${localStorage.id}`, {tempHistory})
        .then((res) => {
            console.log(res)
            Axios.get(`http://localhost:2000/users/${localStorage.id}`)
            .then((res) => {
                swal("Data berhasil dihapus!", "success")
                this.props.login(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    accordionOuter = () => {
        return this.props.history.map((item, index) => {
            return(
                <Card key={index}>
                    <Card.Header>
                        <Row>
                            <Col md={4}>
                            <Accordion.Toggle as={Button} variant="link" eventKey={index + 1}>
                                Detail Product!
                            </Accordion.Toggle>
                            </Col>
                            <Col md={8}>
                                <p>Date : {item.date}, Total Purchasing: IDR {item.total.toLocaleString()}, status: {item.status}</p>
                                <Button onClick={() => this.handleBatalPembayaran(index)} >Batalkan Pembayaran</Button>
                            </Col>
                        </Row>
                    </Card.Header>
                    <Accordion.Collapse eventKey={index + 1}>
                        <Table>
                            <thead>
                                <tr>
                                    <td>#</td>
                                    <td>Nama Barang</td>
                                    <td>Gambar</td>
                                    <td>Harga</td>
                                    <td>Quantity</td>
                                    <td>Total</td>
                                </tr>
                            </thead>
                            <tbody>
                                {this.accordionInside(item)}
                            </tbody>
                        </Table>
                    </Accordion.Collapse>
                </Card>
            )
        })
    }

    accordionInside = (item) => {
        return item.product.map((item, index) => {
            return(
                <tr>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>
                        <Image src={item.img} style={{ height: 100, width: 100 }} rounded></Image>
                    </td>
                    <td>IDR{item.price}</td>
                    <td>{item.qty}</td>
                    <td>IDR {item.total.toLocaleString()}</td>
                </tr>
            )
        })
    }

    


    render() {
        return (
            <div>
                <Container fluid>
                    <Row style={{padding: "8% 25%", paddingBottom: "3%"}}>
                        <Col md={12} style={{textAlign: "center"}}>
                            <h1>History Transaction</h1>
                        </Col>
                    </Row>
                    <Row style={{padding: "3% 10%", paddingBottom: "10%"}}>
                        <Col md={12} >
                        <Accordion>
                            {this.accordionOuter()}
                        </Accordion>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        email: state.user.email,
        history: state.history,
        id: state.user.id,
    }
}

export default connect(mapStateToProps, {getHistory, login})(History)