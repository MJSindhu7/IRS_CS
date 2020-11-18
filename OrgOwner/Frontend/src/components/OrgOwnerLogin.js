import React, { Component } from "react";
import Card from 'react-bootstrap/Card'
import NavbarLogin from './NavbarLogin'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import config from '../config/settings'
import { Redirect } from 'react-router'

class OrgOwnerLogin extends Component {
  constructor() {
    super();
    this.state = {
      userName: "",
      password: "",
      SignedUpFlag: false,
      message: "",
    }
  }

  onChangeHandler = (e) => {
    var name= e.target.name
    var str = (e.target.value).toLowerCase()
    this.setState({
        [name]: str
    })
  }

  componentDidMount = () => {
    localStorage.clear();

  }

  submitLogin = (e) => {
    console.log("in submit Login")
    const data = {
        Username: this.state.userName,
        Password: this.state.password
    }
    console.log("data is..")
    console.log(data);
    e.preventDefault();
    axios.defaults.withCredentials = true;

    axios({
      method: 'post',
      url: config.rooturl+ '/orgOwner/login',
      data: data,
    })
      .then(response => {
        console.log("Status Code : ", response.status);
        console.log("Response from Login ")
        console.log(response);

        if (response.data && response.data.responseMessage && response.data.responseMessage.toLowerCase().indexOf('login successful') !== -1) {
          this.setState({
            SignedUpFlag: true
          })
          //localStorage.setItem("token", response.data.token);
          localStorage.setItem("userName", response.data.cookie2);
          localStorage.setItem("firstName", response.data.cookie3);
          localStorage.setItem("lastName", response.data.cookie4);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("orgOwnerId", response.data.orgOwnerId);
        } else {
          this.setState({
            SignedUpFlag: false,
            message : 'Invalid Credentials'
          })
          console.log(this.state.message)

        }
      }).catch(error => {
        console.log(error);
        this.setState({
          SignedUpFlag: false,
          message : 'Invalid Credentials'
        })
        console.log(this.state.message)
      })
  }

  render() {
    if (this.state.SignedUpFlag === true) {
      return <Redirect to="/OrgOwnerDashboard" />
    }
    return (
        <div>
          <NavbarLogin />
          <br></br>
          <br></br>
          <br></br>
          <center>
            <Card style={{ width: '25rem' }}>
              <div className="container">
                <div className="row">
                  <div className="col-md-8 m-auto">
                    <br></br>
                    <h4>Org Owner Login</h4>
                    <br></br>
                    <Form className="input">
                      <Form.Row>
                        <Form.Label>UserName</Form.Label>
                        <Form.Control name="userName" placeholder="User Name" onChange={this.onChangeHandler} />
                        
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" placeholder="Password" type="password" onChange={this.onChangeHandler} />
                        <br></br>
                        <Button className="btn btn-info btn-block mt-4" onClick={this.submitLogin} >Login</Button>
                      </Form.Row>
                      <p className="text-danger">{this.state.message}</p>
                      <br></br>
                      <br></br>
  
                    </Form>
                  </div>
                </div>
              </div>
            </Card>
          </center>
        </div>
      );
  }
}

export default OrgOwnerLogin;