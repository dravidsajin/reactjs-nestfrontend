import React, {Component} from 'react';
import { Form, Button, Container } from "react-bootstrap";

//service section
import UserService from '../services/user.service';

export default class Register extends Component{
    constructor(props){
        super(props);
        this.handleRegister = this.handleRegister.bind(this);        
        this.gender = React.createRef();

        //maintain states
        this.state = {
            disableSubmit: false,
            form: {},
            errors: {},
            registrationerr: null
        }                   
    }    

    componentDidMount(){
        //set the select box default value
        let form = this.state.form;
        form['gender'] = this.gender.current.value;        
        this.setState({form});        
    }

    handleChange(field, e){    
        let form = this.state.form;
        form[field] = e.target.value;        
        this.setState({form});               
    }

    handleRegister(event){
        this.setState({disableSubmit: true, registrationerr: null});
        event.preventDefault();        
        const errors = this.findFormErrors();
        if ( Object.keys(errors).length > 0 ) {
            this.setState({disableSubmit: false});
            this.setState({errors: errors});
        } else {
            // No errors
            let formData = this.state.form;
            UserService.register(formData).then(
                () => {
                    this.props.history.push("/");
                },
                error => {
                    if(error && error.response && error.response.data && error.response.data.message){
                        this.setState({disableSubmit: false});
                        this.setState({registrationerr: error.response.data.message});                    
                    }                    
                }
            );
        }
    }    

    findFormErrors(){
        const { firstname, lastname, email, password, mobilenumber, gender } = this.state.form;
        const Errors = {};
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if ( !firstname || firstname === '' ) Errors.firstname = 'please enter firstname!';
        if ( !lastname || lastname === '' ) Errors.lastname = 'please enter lastname!';
        if ( !email || email === '' ) Errors.email = 'please enter email!';
        if( !regex.test(String(email).toLowerCase())) Errors.email = 'invalid email';
        if ( !password || password === '' ) Errors.password = 'please enter password!';
        if ( !mobilenumber || mobilenumber === '' ) Errors.mobilenumber = 'please enter mobilenumber!';
        if ( !gender || gender === '' ) Errors.gender = 'please select gender!';        
        return Errors;
    }

    render(){               
        return(
            <Container>
                <Form onSubmit={this.handleRegister}>     
                    { this.state.registrationerr &&
                        <Form.Text className="text-muted">
                            { this.state.registrationerr }
                        </Form.Text>
                    }

                    <Form.Group className="mb-3 FormGroup" controlId="firstname">
                        <Form.Label>Firstname</Form.Label>
                        <Form.Control type="text" placeholder="Enter firstname" size="sm" onKeyUp={this.handleChange.bind(this,'firstname')} isInvalid={ !!this.state.errors.firstname } />                           

                        <Form.Control.Feedback type='invalid'>
                            { this.state.errors.firstname }
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3 FormGroup" controlId="lastname">
                        <Form.Label>Lastname</Form.Label>
                        <Form.Control type="text" placeholder="Enter lastname" size="sm" onKeyUp={this.handleChange.bind(this,'lastname')} isInvalid={ !!this.state.errors.lastname } />   

                        <Form.Control.Feedback type='invalid'>
                            { this.state.errors.lastname }
                        </Form.Control.Feedback>                        
                    </Form.Group>

                    <Form.Group className="mb-3 FormGroup" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" placeholder="Enter email" size="sm" onKeyUp={this.handleChange.bind(this,'email')} isInvalid={ !!this.state.errors.email } /> 

                        <Form.Control.Feedback type='invalid'>
                            { this.state.errors.email }
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3 FormGroup" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password" size="sm" onKeyUp={this.handleChange.bind(this,'password')} isInvalid={ !!this.state.errors.password } />

                        <Form.Control.Feedback type='invalid'>
                            { this.state.errors.password }
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3 FormGroup" controlId="mobilenumber">
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter mobilenumber" size="sm" onKeyUp={this.handleChange.bind(this,'mobilenumber')} isInvalid={ !!this.state.errors.mobilenumber } />

                        <Form.Control.Feedback type='invalid'>
                            { this.state.errors.mobilenumber }
                        </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group className="mb-3 FormGroup" controlId="gender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control as="select" size="sm" ref={this.gender} onKeyUp={this.handleChange.bind(this,'gender')}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </Form.Control>
                    </Form.Group>                                                    

                    <Button variant="primary" type="submit" disabled={this.state.disableSubmit} >
                        Submit
                    </Button>
                </Form>
            </Container>
        );
    }
}