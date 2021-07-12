import React, { Component } from "react";
import { Form, Button, Container } from "react-bootstrap";
import UserService from '../services/user.service';
import * as constants from '../constants/constants';

export default class Login extends Component{
    constructor(props){
        super(props);
        this.email = React.createRef();
        this.password = React.createRef();
        this.LoginSubmit = this.LoginSubmit.bind(this);
        this.state = { 
            invalidemail: null,
            disableSubmit: false,
            loginMessage: null
        };
        // console.log(constants.baseurl);
        this.baseurl = constants.baseurl;        
    }
    LoginSubmit(event){
        event.preventDefault();
        this.setState({disableSubmit: true, loginMessage: null});        
        //validate email
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(regex.test(String(this.email.current.value).toLowerCase())){
            this.setState({invalidemail : null});
            let logindata = {
                email: this.email.current.value,
                password: this.password.current.value
            };                    

            UserService.login(logindata).then(
                () => {
                    console.log("===getting in");                                 
                    window.location.href = this.baseurl+ "Profile";                    
                },
                error => {
                    if(error && error.response && error.response.data && error.response.data.message){
                        this.setState({disableSubmit: false});
                        this.setState({loginMessage: error.response.data.message});                    
                    }
                }
            );  
        }else{
            this.setState({
                invalidemail: "invalid email",
                disableSubmit: false
            });
        }        
    }
    render(){
        return (
            <Container>
            <Form onSubmit={this.LoginSubmit}>
                { this.state.loginMessage != null &&           
                    <Form.Text className="text-muted">
                        {this.state.loginMessage}
                    </Form.Text>
                }
                <Form.Group className="mb-3 FormGroup" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="text" placeholder="Enter email" size="sm" ref={this.email} />   
                    { this.state.invalidemail != null &&           
                    <Form.Text className="text-muted">
                        {this.state.invalidemail}
                    </Form.Text>
                    }
                </Form.Group>

                <Form.Group className="mb-3 FormGroup" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" size="sm" ref={this.password} />
                </Form.Group>                
                <Button variant="primary" type="submit" disabled={this.state.disableSubmit} >
                    Submit
                </Button>
            </Form>            
            </Container> 
        )
    }
}