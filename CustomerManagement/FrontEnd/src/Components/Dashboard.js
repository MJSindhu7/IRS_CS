import React, { Component } from 'react';
import axios from "axios";
import NavbarDash from "./NavbarDash";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Sidebar from './Sidebar'
import config from '../config/settings'
import Card from 'react-bootstrap/Card'
import Dropdown from 'react-bootstrap/Dropdown'
import Table from 'react-bootstrap/Table'

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      allCases: {},
      viewcase: null,
      modal: false,
      mstatus: "open",
      flag: false
    };

  }

  showModal = () => {
    console.log("hello");
    this.setState({
      modal: !this.state.modal,
    });
  };
  showModal1 = (viewcase) => {
    console.log("hello1");
    this.setState({
      modal: !this.state.modal,
      viewcase: viewcase,
    });
  };

  handleStatusChange = (modalstatus) => {
    this.setState({
      mstatus: modalstatus
    })
  }

  async componentDidMount() {
    console.log("in get all cases frontend")

    let agentID = localStorage.getItem("agentID");
    let organisationID = localStorage.getItem("organisationID")
    let count = 0
    axios.defaults.withCredentials = true;
    if(agentID){
      count = count+1
      let data = {
        agentID: agentID,
        organisationID: organisationID
      };
      console.log("data is..")
      console.log(data);
  
      axios({
        method: 'get',
        url: 'http://' + config.hostname + ':' + config.backendPort + '/getCases',
        params: data,
      })
        .then((response) => {
          console.log("response from getCases")
          console.log(response)
  
          if (response.status === 200) {
            let receivedCases = response.data.cases;
            console.log("received cases")
            console.log(response.data.cases)
            if (receivedCases) {
              this.setState({ allCases: receivedCases, flag: true });
            } else {
              this.setState({ allCases: {} });
            }
          }
          else {
            this.setState({ allCases: {} });
          }
  
        })
        .catch(error => {
          console.log(error);
          this.setState({ allCases: {} })
        })
    }
    else if(count < 1){
      window.location.reload();
    }
    
  }

  render() {
    const closeBtn = (
      <button className="close" onClick={() => this.showModal()}>
        &times;
       </button>
    );
    var casedetails;
    if (this.state.flag) {
      casedetails = this.state.allCases.map((ticket) => {
        return (
          <div>
            <div onClick={() => this.showModal1(ticket)} >
                  <Table>
                    <tbody >
                      <tr >
                        <td style={{ width: '10rem' }}>{ticket.CaseID}</td>
                        <td style={{ width: '15rem' }}>{ticket.Status}</td>
                        <td style={{ width: '50rem' }}>{ticket.Information} </td>
                      </tr>
                    </tbody>
                  </Table>            
            </div>
          </div>
        );
      });
    }
    return (
      <div>
        <NavbarDash />
        <div className="row">
          <div className="col-2">
            <Sidebar />
          </div>
          <div className="container col-9">  
          <form action="/action_page.php">
            <label for="filters">Filter by case status:   </label>
              <select name="status" id="status">
                <option value="New">New</option>
                <option value="Open">Open</option>
                <option value="Resolved">Resolved</option>
                <option value="Pending">Pending</option>
              </select>
            <br></br>
            <br></br>
            <br></br>
          </form>
          <Table>
          <tr>
            <th style={{ width: '10rem' }}>ID</th>
            <th style={{ width: '15rem' }}>Status</th>
            <th style={{ width: '50rem' }}>Details</th>
          </tr>
          </Table>
          {this.state.allCases.length > 0 ? (
              <div className="col-10">
                {casedetails}
                {this.state.viewcase != null ? (
                  <Modal
                    isOpen={this.state.modal}
                    toggle={() => this.showModal()}
                    className="modal-popup-lg"
                    scrollable
                  >
                    <ModalHeader
                      toggle={() => this.showModal()}
                      close={closeBtn}
                    >
                      Case Details
                   </ModalHeader>
                    <ModalBody className="modal-body">
                      <div className=" row form-group">
                        <p className="font-weight col-7">
                          Information : {this.state.viewcase.Information}
                        </p>
                        <div className="col-3">
                          <button class="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.mstatus}</button>
                          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <button onClick={() => this.handleStatusChange("Working")} class="dropdown-item" >Working</button>
                            <button onClick={() => this.handleStatusChange("Resolved")} class="dropdown-item" >Resolved</button>
                            <button onClick={() => this.handleStatusChange("Postponed")} class="dropdown-item" >Postponed</button>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <p className="font-weight-bold">
                          Resolution Comments : {this.state.viewcase.ResolutionComments}
                        </p>

                      </div>

                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                  </Modal>
                ) : null}
              </div>
            ) : (
                <div>
                  <h4 style={{ margin: "3em" }}>No new cases to display!</h4>
                </div>
              )}
          </div>

        </div>
      </div>
    );
  }
}

export default Dashboard;
