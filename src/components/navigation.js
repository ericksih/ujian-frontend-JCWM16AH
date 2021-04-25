import React, { Component } from 'react'

import {Navbar, Nav, Dropdown, Badge} from 'react-bootstrap'

import {Link} from 'react-router-dom'

import {Redirect} from 'react-router-dom'

import {logout} from '../action'

import {connect} from 'react-redux'


class Navigation extends Component {

    constructor(props){
        super(props)
        this.state = {
            checkLogout: "Belum",
        }
    }

    handleLogout = () => {
        localStorage.removeItem('id')
        this.props.logout()
        this.setState({
            ...this.props,
            checkLogout: "Sudah"
        })
    }

    render() {

        if(this.state.checkLogout === "Sudah"){
            return(
                this.setState({
                    ...this.props,
                    checkLogout: "Belum"
                }),
                <Redirect to='/login'/>
            ) 
        }

        return (
            <div>
                <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">Shoes</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link>
                            <Link to='/'>
                                <p>Home</p>
                            </Link>                        
                        </Nav.Link>
                        {this.props.email ?
                            <>
                                <Nav.Link>
                                    <Link to='/cart'>
                                        <p className="navLinkProperty">My Cart<Badge style={{padding: "5px", fontSize: "20px", marginLeft: "3px"}}  variant="dark"> {this.props.cart.length} </Badge></p>
                                    </Link>                        
                                </Nav.Link>
                                <Nav.Link>
                                    <Link to='/history'>
                                        <p className="navLinkProperty">My History</p>
                                    </Link>                        
                                </Nav.Link>
                            </>
                            :
                            <></>
                        }                        
                    </Nav>
                </Navbar.Collapse>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {this.props.email ? this.props.email : "Email"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {
                            this.props.email
                            ?
                            <Dropdown.Item className="dropdownItem" onClick={this.handleLogout}>Logout</Dropdown.Item>
                            :
                            <>
                            <Dropdown.Item className="dropdownItem" as={Link} to='/login'>
                                Login
                            </Dropdown.Item>
                            <Dropdown.Item className="dropdownItem" as={Link} to='/register'>
                                Register
                            </Dropdown.Item>
                            </>
                        }
                    </Dropdown.Menu>
                </Dropdown>
                </Navbar>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        email: state.user.email,
        cart: state.user.cart,
    }
}

export default connect(mapStateToProps, {logout})(Navigation)