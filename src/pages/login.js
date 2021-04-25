import React, { Component } from 'react'

import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap'

import '../css/login.css'

import Axios from 'axios'

import swal from 'sweetalert';

import {Redirect} from 'react-router-dom'

//#region REDUX
import {login} from '../action'

import {connect} from 'react-redux'

class Login extends Component {

    constructor(props){
        super(props)
        this.state = {
            users: [],
            visible: false,
            dbAccount: "",
        }
    }

    handleLogin = () => {
        let email = this.refs.email.value
        let password = this.refs.password.value

        if(!email || !password) return swal("Email/Password Salah", "error");

        Axios.get(`http://localhost:2000/users?email=${email}&password=${password}`)
        .then((res) => {
            if(res.data.length === 0) return swal("Email / Password Salah");
            
            swal( `hai ${email} selamat datang`, " login success");

            // Membuat Local Storage
            localStorage.id = res.data[0].id;
            this.props.login(res.data[0])

        })
      
    }




    render() {

        if(this.props.email) return <Redirect to='/'/>

        return (
            <div>
                <Container>
                    <Row>
                        <Col md={6} id="backgroudHeroLogin">
                            <Row>
                                <Col md={12}>
                                    <Row>
                                        <Col md={12}>
                                            <p className="fontHeroStyle">Login</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <p className="fontHeroStyle">Page.</p>
                                        </Col>
                                    </Row>

                                </Col>
                            </Row>   
                        </Col>
                        <Col md={6}>
                            <Row>
                                <Col md={12} id="backgroundHeroForm">
                                    <Form id="formLoginLayout">
                                        <InputGroup className="inputGroupLogin">
                                            <InputGroup.Prepend style={{width: "100%"}}>
                                                <InputGroup.Text id="basic-addon1" className="boxIconLogin">
                                                    <i className="fas fa-envelope" style={{color: "white"}} ></i>
                                                </InputGroup.Text>
                                                <Form.Control ref="email" className="fieldLogin" type="text" placeholder="Enter Email" />
                                            </InputGroup.Prepend>
                                        </InputGroup>
                                        <InputGroup className="inputGroupLogin">
                                            <InputGroup.Prepend style={{width: "100%" }}>
                                                <InputGroup.Text id="basic-addon1" className="boxIconLogin" style={{cursor: 'pointer'}} onClick={() => this.setState({ visible: ! this.state.visible})} >
                                                    <i className={this.state.visible ? "fas fa-eye" : "fas fa-eye-slash"} style={{color: "white"}} ></i>
                                                </InputGroup.Text>
                                                <Form.Control ref="password" className="fieldLogin" type={this.state.visible ? "text" : "password"} placeholder="Enter Password"/>                                            </InputGroup.Prepend>
                                        </InputGroup>
                                        <Button id="buttonLogin" onClick={this.handleLogin}>LOGIN</Button>
                                    </Form>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return{
        email: state.user.email
    }
} 

export default connect(mapStateToProps, {login})(Login)