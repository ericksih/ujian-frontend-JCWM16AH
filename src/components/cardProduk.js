import Axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Col, Card, Button, Row } from "react-bootstrap";

export default class cardProduk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      produkCard: [],
    };
  }

  getData = () => {
    Axios.get("http://localhost:2000/products")
      .then((res) => {
        this.setState({
          produkCard: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  cardProdukList = () => {
    return this.state.produkCard.map((item, index) => {
      return (
        <Col md={6} key={index}>
          <Card style={{ marginBottom: "100px" }}>
            <Card.Img
              variant="top"
              style={{ height: "300px", width: "100%" }}
              src={item.img}
            />
            <Card.Body style={{ backgroundColor: "#1fab89" }}>
              <Card.Title style={{ color: "white", height: "50px" }}>
                {item.name}
              </Card.Title>
              <Card.Text style={{ color: "white", height: "180px" }}>
                {item.description}
              </Card.Text>
              <Row>
                <Col md={6} style={{ textAlign: "center" }}>
                  <Button variant="danger">Wish List</Button>
                </Col>
                
                <Col md={6}>
                  <Button
                    variant="danger"
                    style={{ textAlign: "center" }}
                    as={Link}
                    to={`/detailproduk?id=${item.id}`}
                  >
                    Buy Now
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      );
    });
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <div>
        <Row>{this.cardProdukList()}</Row>
      </div>
    );
  }
}
