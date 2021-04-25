import React, { Component } from 'react'

import Axios from 'axios'

import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap'

import '../css/register.css'

import {Redirect} from 'react-router-dom'

import swal from 'sweetalert';

export default class Register extends Component {

    constructor(props){
        super(props);
        this.state = {
            checkRegister: "Belum",
            dbAccount: "",
            emailValidationErr: [false, ""],
            passwordValidationErr: [false, ""],
            visible1: false,
            visible2: false
        }
    }

    handleRegister = () => {
        var emailRegister = this.refs.emailRegister.value;
        var passwordRegister = this.refs.passwordRegister.value;
        var repeatPasswordRegister = this.refs.repeatPasswordRegister.value;

        Axios.get('http://localhost:2000/users')
        .then((res) => {
            this.setState({
                ...this.props,
                dbAccount: res.data
            });

            let tempAccount = [...this.state.dbAccount]
            for(let i=0;i<tempAccount.length;i++){
               if(emailRegister === tempAccount[i].email){
                    return swal( "Email is exist", "error");
                }
            }

            if(passwordRegister !== repeatPasswordRegister){
                return swal("Your repeated password is incorrect", "error");
            }

            Axios.post('http://localhost:2000/users', {
                email: emailRegister,
                password: passwordRegister,
                cart: []
            })
            .then((res2) =>{
                swal("Good job!", "Register Telah Berhasil!", "success");
                
                this.setState({
                    ...this.props,
                    checkRegister: "Sudah"
                })
    
                this.refs.emailRegister.value = "";
                this.refs.passwordRegister.value = "";
            })
            .catch((err2) => {
                console.log(err2)
            })

        })
        .catch((err) => {
            console.log(err)
        })

    }

    userValid = (e) => {
        // console.log(e)
        let username = e.target.value
        // console.log(username)
        let symb = /[!@#$%^&*;]/

        if (symb.test(username) || username.length < 6) return this.setState({ usernameValidationErr: [true, "*Can't include symbol and min 6 char"] })

        this.setState({usernameValidationErr: [false, ""]})
    }

    emailValid = (e) => {
        let email = e.target.value
        console.log(email)
        let regex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!regex.test(email)) return this.setState({emailValidationErr: [true, "*Email not valid"]})

        this.setState({emailValidationErr: [false, ""]})
    }

    passValid = (e) => {
        let password = e.target.value

        let regex = new RegExp("^(?=.*[0-9])(?=.{6,})");

        if(!regex.test(password)) return this.setState({passwordValidationErr: [true, "*Must contain min 1 numeric and 6 length"]})

        this.setState({passwordValidationErr: [false, ""]})
    }



    render() {

        if(this.state.checkRegister === "Sudah")
        return <Redirect to='/login'/>

        return (
            <div>
                <Container fluid style={{padding: "0% 15%", paddingTop: "5%"}}>
                    <Row>
                        <Col md={6} id="backgroudHeroRegister"> 
                            <Row>
                                <Col md={12}>
                                    <p id="fontHeroStyleRegister">Register Form.</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={6} id="backgroundHeroFormRegister">
                            <Form id="formRegisterLayout">
                            <InputGroup className="inputGroupRegister">
                                <InputGroup.Prepend style={{width: "100%"}}>
                                    <InputGroup.Text id="basic-addon1" className="boxIconRegister">
                                        <i className="fas fa-envelope" style={{color: "white"}} ></i>
                                    </InputGroup.Text>
                                    <Form.Control ref="emailRegister" className="fieldRegister" type="text" placeholder="Enter Email"  onChange={(e) => this.emailValid(e)}/>
                                </InputGroup.Prepend>
                            </InputGroup>
                            <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '10px' }}>
                                {this.state.emailValidationErr[1]}
                            </Form.Text>
                            <InputGroup className="inputGroupRegister">
                                <InputGroup.Prepend style={{width: "100%"}}>
                                    <InputGroup.Text id="basic-addon1" className="boxIconRegister" style={{cursor: 'pointer'}} onClick={() => this.setState({ visible1: ! this.state.visible1})} >
                                        <i className={this.state.visible1 ? "fas fa-eye" : "fas fa-eye-slash"} style={{color: "white"}} ></i>
                                    </InputGroup.Text>
                                    <Form.Control ref="passwordRegister" className="fieldRegister" type={this.state.visible1 ? "text" : "password"} placeholder="Enter Password" onChange={(e) => this.passValid(e)} />
                                </InputGroup.Prepend>
                            </InputGroup>
                            <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '10px' }}>
                                {this.state.passwordValidationErr[1]}
                            </Form.Text>
                            <InputGroup className="inputGroupRegister">
                                <InputGroup.Prepend style={{width: "100%"}}>
                                    <InputGroup.Text id="basic-addon1" className="boxIconRegister" style={{cursor: 'pointer'}} onClick={() => this.setState({ visible2: ! this.state.visible2})} >
                                        <i className={this.state.visible2 ? "fas fa-eye" : "fas fa-eye-slash"} style={{color: "white"}} ></i>
                                    </InputGroup.Text>
                                    <Form.Control ref="repeatPasswordRegister" className="fieldRegister" type={this.state.visible2 ? "text" : "password"} placeholder="Repeat Password" />
                                </InputGroup.Prepend>
                            </InputGroup>    
                                <Button id="buttonRegister" onClick={this.handleRegister}>REGISTER</Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}