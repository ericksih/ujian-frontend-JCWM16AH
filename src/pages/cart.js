import Axios from 'axios'
import React, { Component } from 'react'

import { Col, Container, Row, Table, Button, Form, Modal } from 'react-bootstrap'

import { connect } from 'react-redux'

import { Redirect } from 'react-router-dom'

import {login} from '../action'

import swal from 'sweetalert';


class Cart extends Component {

    constructor(props){
        super(props)
        this.state = {
            dataUserCart: [],
            selectedCart: null,
            kuantitiBaru: 0,
            newFootSize: 0,
            dataProducts: [],
            reqPayment: false,
            reqPass: false,
            errPass: false,
            errPayment: false,
            cartEmpty: false,
            toHistory: false,
            confirmationBayar: false,
        }
    }

    //#region Get Data

    getDataProducts = () => {
        Axios.get(`http://localhost:2000/products`)
        .then((res) => {
            this.setState({
                dataProducts: res.data
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    //#endregion

    //#region Life Cycle

        componentDidMount = () => {
            this.getDataProducts()
        }

    //#endregion

    //#region Show Data

    isiTable = () => {
        return this.props.cart.map((item, index) => {
            if(this.state.selectedCart === index){
                return(
                    <tr key={index}>
                            <td style={{textAlign: "center"}}>{index + 1}</td>
                            <td>{item.name}</td>
                            <td style={{textAlign: "right"}}>{item.price}</td>
                            <td style={{textAlign: "center"}}>
                                <Row>
                                    <Col md={3} style={{paddingRight: "0px"}}>
                                        <Button onClick={() => this.handleMinusKuantiti()} style={{width: "100%", padding: "5px 0px", textAlign: "center"}}>
                                            <i className="fas fa-minus" style={{textAlign: "center"}}></i>
                                        </Button>
                                    </Col>  
                                    <Col md={6} style={{padding: "0px"}}>
                                        <Form.Control style={{ width: '100%', textAlign: "center"}} onChange={(e) => this.quantityChange(e)} value={this.state.kuantitiBaru} min={0} />
                                    </Col>
                                    <Col md={3} style={{paddingLeft: "0px"}}>
                                        <Button onClick={() => this.handlePlusKuantiti(index)} style={{width: "100%", padding: "5px 0px",  textAlign: "center"}}>
                                            <i className="fas fa-plus"></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </td>
                            <td style={{textAlign: "right"}}>{this.state.kuantitiBaru * item.price}</td>
                            <td>
                                <Row>
                                    <Col md={6} style={{textAlign: "center"}}>
                                        <Button variant="success" onClick={() => this.handleSaveEditCart(index)}>SAVE</Button>
                                    </Col>
                                    <Col md={6} style={{textAlign: "center"}}>
                                        <Button variant="danger" onClick={() => this.setState({ selectedCart: null})}>Cancel</Button>
                                    </Col>
                                </Row>
                            </td>
                    </tr>
                )
            }else{
                return (
                    <tr key={index}>
                        <td style={{textAlign: "center"}}>{index + 1}</td>
                        <td>{item.name}</td>
                        <td style={{textAlign: "right"}}>{item.price}</td>
                        <td style={{textAlign: "center"}}>{item.qty}</td>
                        <td style={{textAlign: "right"}}>{item.total}</td>
                        <td>
                            <Row>
                                <Col md={6} style={{textAlign: "center"}}>
                                    <Button variant="primary" onClick={() => this.setState({selectedCart: index, kuantitiBaru: item.qty})}>Edit</Button>
                                </Col>
                                <Col md={6} style={{textAlign: "center"}}>
                                    <Button variant="danger" onClick={() => this.deleteCart(index)}>Delete</Button>
                                </Col>
                            </Row>
                        </td>
                    </tr>
                )
            }
        })
    }

    totalPrice = () => {
        let counter = 0
        this.props.cart.map(item => counter += item.total)
        return counter
    }


        quantityChange = (e) => {
            this.setState({
                kuantitiBaru: e.target.value
            })
        }

        handlePlusKuantiti = (index) => {
            let tempCart = this.props.cart[index]
            let tempProduk = this.state.dataProducts
            let tempIndex = 0

            for(let i of tempProduk){
                if(i.id === tempCart.id){
                    tempIndex = i.id                    
                }
            }

            console.log(tempIndex)

            if(this.state.kuantitiBaru >= tempProduk[tempIndex].stock-1){
                return swal("Melebihi stock yang ada!!")
            }else{
                this.setState({
                    kuantitiBaru: this.state.kuantitiBaru + 1
                })
            }
        }

        handleMinusKuantiti = () => {
            if(this.state.kuantitiBaru <= 0){
                return swal("Data tidak boleh kurang dari 0!")
            }else{
                this.setState({
                    kuantitiBaru: this.state.kuantitiBaru - 1
                })
            }
        }

        handleSaveEditCart = (index) => {
            let tempCart = this.props.cart[index]

            tempCart.qty = this.state.kuantitiBaru
            tempCart.total = this.state.kuantitiBaru * this.props.cart[index].price

            let tempCartHasil = this.props.cart
            tempCartHasil.splice(index, 1, tempCart)

            
            Axios.patch(`http://localhost:2000/users/${localStorage.id}`, {cart: tempCartHasil})
            .then((res) => {
                console.log(res.data)

                Axios.get(`http://localhost:2000/users/${localStorage.id}`)
                .then((res) => {
                    this.props.login(res.data)
                    this.setState({selectedCart: null})
                })
                .catch((err) => {
                    console.log(err)
                })

            })
            .catch((err) => {
                console.log(err)
            })

        }




    deleteCart = (index) => {
        let tempCart = this.props.cart
        tempCart.splice(index, 1)

        Axios.patch(`http://localhost:2000/users/${localStorage.id}`, {cart: tempCart})
        .then((res) => {
            console.log(res)

            Axios.get(`http://localhost:2000/users/${localStorage.id}`)
            .then((res) => {
                swal( "Data berhasil dihapus!", "success")
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


    checkOut = () => {
        if(this.props.cart.length === 0) return swal("Cart Kamu Masih Kosong !")
        this.setState({ confirmationBayar: true })
    }

    

    confirmPayment = () => {
        let tempCart = this.props.cart
        let tempProduk = this.state.dataProducts

        let total = this.totalPrice()


  
        let tempProductUpdate = []
        for(let i of tempCart){
            for(let j of tempProduk){
                if(i.id === j.id){
                    tempProductUpdate.push(j)
                }
            }
        }
    

        let tempStock = []
        for(let i in tempProductUpdate){
            for(let cart of tempCart){
                if(cart.id === tempProductUpdate[i].id){
                    let update = {
                        id: cart.id,
                        updatedTotal: tempProductUpdate[i].stock - cart.qty
                    }
                    tempStock.push(update)
                }
            }
        }
        console.log(tempStock)


        for(let i of tempStock){
            Axios.get(`http://localhost:2000/products/${i.id}`)
            .then((res) => {
                let stockTemp = res.data.stock
                let stockBaru = i.updatedTotal
                stockTemp.forEach(item => {
                    if(item.id === i.id){
                        item.stock = i.updatedTotal
                    }
                })
                console.log(stockBaru)
                Axios.patch(`http://localhost:2000/products/${i.id}`, {stock: stockBaru})
                .then((res) => {
                    console.log(res.data)
                })
                .catch((err) => {
                    console.log(err)
                })
            })
            .catch((err) => {
                console.log(err)
            })
        }
    //#endregion

        let history = {
            userId: this.props.id,
            email: this.props.email,
            date: new Date().toLocaleString(),
            total: total,
            product: this.props.cart,
            status: "belum di bayar"
        }

        console.log(history)

        Axios.post(`http://localhost:2000/history`, history)
        .then((res) => {
            Axios.patch(`http://localhost:2000/users/${localStorage.id}`, { cart: [] })
            .then((res) => {

                Axios.get(`http://localhost:2000/users/${localStorage.id}`)
                .then((res) => {
                    this.props.login(res.data)
                    this.setState({reqPayment: false, toHistory:true})
                })
                .catch((err) => {
                    console.log(err)
                })

            })
            .catch((err) => {
                console.log(err)
            })

        })
        .catch((err) => {
            console.log(err)
        })

    }

    //#endregion


    render() {
        console.log(this.state.dataProducts)

        if(this.state.toHistory) return <Redirect to='/history' />

        return (
            <div>
                <Container fluid>
                    <Row style={{padding:"8% 5%"}}>
                        <Col md={12}>
                            <Row>
                                <Col md={6} style={{textAlign: "left", color: "#1fab89"}}>
                                    <h1><span><i class="fas fa-shopping-cart"></i></span> Cart Pembelian</h1>
                                </Col>
                                <Col md={6} style={{textAlign: "right", color: "#2F4F4F"}}>
                                    <Button variant="info" style={{width:"40%"}} onClick={() => this.checkOut()}>
                                        CHECKOUT
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr style={{backgroundColor: "#1fab89", color: "white", textAlign: "center"}}>
                                            <td>No</td>
                                            <td>Nama</td>
                                            <td>Harga</td>
                                            <td>Jumlah Item</td>
                                            <td>Total</td>
                                            <td>Actions</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.isiTable()}
                                        <tr>
                                            <td colSpan={5} style={{textAlign:"center"}}> 
                                                <p style={{margin:"0px"}}>Total Belanja</p>
                                            </td>
                                            <td colSpan={4} style={{textAlign:"center"}}>
                                                Rp. {this.totalPrice()}, 00 
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>

                <Modal show={this.state.confirmationBayar} onHide={() => this.setState({ confirmationBayar: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Yakin ingin melakukan pembayaran ini ?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={() => this.setState({ confirmationBayar: false })}>
                            Close
                        </Button>
                        <Button variant="light" onClick={() => this.confirmPayment()} >
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>


            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        cart: state.user.cart,
        id: state.user.id,
        email: state.user.email,
        password: state.user.password
    }
}

export default connect(mapStateToProps,{ login })(Cart)

