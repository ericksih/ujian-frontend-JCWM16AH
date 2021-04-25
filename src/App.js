import React, { Component } from "react";

import Navigation from "./components/navigation.js";

import { Switch, Route } from "react-router-dom";

import Home from "./pages/home";
import DetailProduk from "./pages/detailProduk";
import Login from "./pages/login";
import Register from "./pages/register";
import Cart from "./pages/cart";
import History from "./pages/history";

import Axios from "axios";

import { login } from "./action";

import { connect } from "react-redux";

class App extends Component {
  componentDidMount() {
    Axios.get(`http://localhost:2000/users/${localStorage.id}`)
      .then((res) => {
        this.props.login(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <Navigation />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/detailproduk" component={DetailProduk} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/cart" component={Cart} />
          <Route path="/history" component={History} />
        </Switch>
      </div>
    );
  }
}

export default connect(null, { login })(App);
