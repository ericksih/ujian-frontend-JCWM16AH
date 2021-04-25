import React, { Component } from "react";

import { Col, Row, Container, Image, Button, Toast } from "react-bootstrap";

import swal from "sweetalert";

import Axios from "axios";

import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { login } from "../action";

class DetailProduk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailProduk: {},
      image: "",
      stock: 0,
      total: 0,
      toLogin: false,
      cartErr: false,
      toCart: false,
      cartAdded: false,
    };
  }

  componentDidMount = () => {
    Axios.get(`http://localhost:2000/products${this.props.location.search}`)
      .then((res) => {
        this.setState({
          detailProduk: res.data[0],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  tambahBeliStok = () => {
    if (this.state.detailProduk.stock <= this.state.total) {
      return swal("Data tidak boleh lebih dari stock !", "error");
    } else {
      return this.setState({
        total: this.state.total + 1,
      });
    }
  };

  kurangBeliStok = () => {
    if (this.state.total <= 0) {
      return swal( "Data tidak boleh kurang dari 0!", "error");
    } else {
      return this.setState({
        total: this.state.total - 1,
      });
    }
  };

  handleAddToCart = () => {
    if (!this.props.email) {
      return (
        swal("You Must Login First", "error"),
        this.setState({ toLogin: true })
      );
    } else if (this.state.total === 0) {
      return swal("Please choose quantity!", "error");
    } else {
      let cartData = {
        id: this.state.detailProduk.id,
        name: this.state.detailProduk.name,
        img: this.state.detailProduk.img,
        price: this.state.detailProduk.price,
        qty: this.state.total,
        total: this.state.total * this.state.detailProduk.price,
      };

      let tempCart = this.props.cart;
      tempCart.push(cartData);

      Axios.patch(`http://localhost:2000/users/${this.props.id}`, {
        cart: tempCart,
      })
        .then((res) => {
          Axios.get(`http://localhost:2000/users/${localStorage.id}`)
            .then((res) => {
              this.props.login(res.data);
              this.setState({
                cartAdded: true,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    if (this.state.toLogin) return <Redirect to="/login" />;

    return (
      <div>
        <Container>
          <Row>
            <Col md={6}>
              <Row>
                <Col md={12}>
                  <Image
                    src={this.state.detailProduk.img}
                    rounded
                    style={{ width: "100%" }}
                  />
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <Row>
                <Col md={12}>
                  <h1>{this.state.detailProduk.name}</h1>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <h4>Price : {this.state.detailProduk.price}</h4>
                </Col>
                <Col md={6}>
                  <h4>Stock : {this.state.detailProduk.stock} </h4>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Row>
                    <Col md={3}>
                      <Button onClick={() => this.kurangBeliStok()}> - </Button>
                    </Col>
                    <Col md={6}>
                      <p style={{ fontSize: "25px", textAllign: "center" }}>
                        {" "}
                        {this.state.total}
                      </p>
                    </Col>
                    <Col md={3}>
                      <Button onClick={() => this.tambahBeliStok()}>+</Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <p> {this.state.detailProduk.description} </p>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Button
                    style={{ width: "100%" }}
                    onClick={() => this.handleAddToCart()}
                  >
                    Add To Cart
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>

        <Toast
          show={this.state.cartAdded}
          onClose={() => this.setState({ cartAdded: false })}
        >
          <Toast.Header>
            <strong>Cart is Added</strong>
          </Toast.Header>
          <Toast.Body>
            <p>Cart berhasil dimasukkan</p>
            <Button onClick={() => this.setState({ cartAdded: false })}>
              Tutup
            </Button>
          </Toast.Body>
        </Toast>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    id: state.user.id,
    email: state.user.email,
    cart: state.user.cart,
  };
};

export default connect(mapStateToProps, { login })(DetailProduk);
