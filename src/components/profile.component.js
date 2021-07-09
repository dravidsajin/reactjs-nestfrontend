import React, {Component} from 'react';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import { Form, Button, Container } from "react-bootstrap";
export default class Profile extends Component{

    constructor(props){
        super(props);
        this.handleUpdate = this.handleUpdate.bind(this);        
        this.state = {
            userData: {},
            profileError: null,
            disableSubmit: false,
            form: {},
            errors: {}
        }
    }

    componentDidMount(){
        
        const loggedUserData = AuthService.getUserData();
        if(loggedUserData && loggedUserData.accesstoken){
            UserService.getLoggedUser(loggedUserData.accesstoken).then(
                response => {
                    this.state.userData = response.data.result;        
                    
                    //set the default values
                    let form = this.state.form;
                    form['firstname'] = response.data.result.firstname;
                    form['lastname'] = response.data.result.lastname;
                    form['mobilenumber'] = response.data.result.mobilenumber;
                },
                error => {
                    if(error && error.response && error.response.data && error.response.data.message){                        
                        this.setState({profileError: error.response.data.message});                    
                    }                    
                }
            );
        }
    }

    handleChange(field, e){    
        let form = this.state.form;
        form[field] = e.target.value;        
        this.setState({form}); 
        console.log(this.state);              
    }

    handleUpdate(event){
        event.preventDefault();        
        this.setState({disableSubmit: true});
        const errors = this.findErrors();
        if ( Object.keys(errors).length > 0 ) {
            this.setState({disableSubmit: false});
            this.setState({errors: errors});
        } else {
            let loggedUser = AuthService.getUserData();
            if(loggedUser && loggedUser.accesstoken){
                let formData = this.state.form;
                UserService.updateProfile(formData, loggedUser.accesstoken).then(
                response => {
                    this.setState({profileError: "Profile updated successfully", disableSubmit: false});
                },
                error => {
                    if(error && error.response && error.response.data && error.response.data.message){
                        this.setState({disableSubmit: false, registrationerr: error.response.data.message});                     
                    }
                }
                );
            }else{
                this.setState({profileError: "Unauthorized Access", disableSubmit: false});
            }           
        }
    }

    findErrors(){
        const { firstname, lastname, mobilenumber } = this.state.form;
        const Errors = {};        

        if ( !firstname || firstname === '' ) Errors.firstname = 'please enter firstname!';
        if ( !lastname || lastname === '' ) Errors.lastname = 'please enter lastname!';              
        if ( !mobilenumber || mobilenumber === '' ) Errors.mobilenumber = 'please enter mobilenumber!';              
        return Errors;
    }

    render(){
        return(
            <Container>
                <Form onSubmit={this.handleUpdate}>
                    { this.state.profileError &&
                        <Form.Text className="text-muted">
                            { this.state.profileError }
                        </Form.Text>
                    }
                    <Form.Group className="mb-3 FormGroup" controlId="firstname">
                        <Form.Label>Firstname</Form.Label>
                        <Form.Control type="text" defaultValue={this.state.userData.firstname} placeholder="Enter firstname" size="sm" onKeyUp={this.handleChange.bind(this,'firstname')} isInvalid={ !!this.state.errors.firstname } />

                        <Form.Control.Feedback type='invalid'>
                            { this.state.errors.firstname }
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3 FormGroup" controlId="lastname">
                        <Form.Label>Lastname</Form.Label>
                        <Form.Control type="text" defaultValue={this.state.userData.lastname} placeholder="Enter lastname" size="sm" onKeyUp={this.handleChange.bind(this,'lastname')} isInvalid={ !!this.state.errors.lastname } />

                        <Form.Control.Feedback type='invalid'>
                            { this.state.errors.lastname }
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3 FormGroup" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" defaultValue={this.state.userData.email} placeholder="Enter email" size="sm" disabled />
                    </Form.Group>

                    <Form.Group className="mb-3 FormGroup" controlId="mobilenumber">
                        <Form.Label>Mobilenumber</Form.Label>
                        <Form.Control type="text" defaultValue={this.state.userData.mobilenumber} placeholder="Enter mobilenumber" onKeyUp={this.handleChange.bind(this,'mobilenumber')} size="sm" isInvalid={ !!this.state.errors.mobilenumber } />

                        <Form.Control.Feedback type='invalid'>
                            { this.state.errors.mobilenumber }
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={this.state.disableSubmit} >
                        Update Profile
                    </Button>
                </Form>
            </Container>
        );
    }
}