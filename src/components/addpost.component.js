import React, { Component } from "react";
import { Form, Button, Container } from "react-bootstrap";
import AuthService from '../services/auth.service';
import PostService from '../services/post.service';
export default class Addpost extends Component{

    constructor(props){
        super(props);
        this.addPost = this.addPost.bind(this);
        this.state = {
            disableSubmit: false,
            errors: {},
            form: {},
            addPostError: null
        }
    }

    handleChange(field, e){
        let form = this.state.form;
        form[field] = e.target.value;        
        this.setState({form}); 
    }

    addPost(event){
        this.setState({disableSubmit: true});
        event.preventDefault();
        console.log(this.state);

        //reset the keys
        this.setState({ error: {}});

        const errors = this.findErrors();
        console.log(errors);
        if ( Object.keys(errors).length > 0 ) {
            this.setState({disableSubmit: false, errors: errors});        
        }else{
            let loggedUser = AuthService.getUserData();
            if(loggedUser && loggedUser.accesstoken){
                let formData = this.state.form;
                formData['post_type'] = 'text';
                PostService.addPost(formData, loggedUser.accesstoken).then(
                response => {
                    this.setState({addPostError: "posted successfully", disableSubmit: false});
                },
                error => {
                    if(error && error.response && error.response.data && error.response.data.message){
                        this.setState({disableSubmit: false, addPostError: error.response.data.message});                     
                    }
                }
                );
            }else{
                this.setState({addPostError: "Unauthorized Access", disableSubmit: false});
            } 
        }
    }

    findErrors(){
        const { post_content } = this.state.form;
        const Errors = {};        

        if ( !post_content || post_content === '' ) Errors.post_content = 'please enter post content!';
        return Errors;
    }

    render(){
        return(  
            <Container>
                <Form onSubmit={this.addPost}>
                    { this.state.addPostError &&
                        <Form.Text className="text-muted">
                            { this.state.addPostError }
                        </Form.Text>
                    }
                    <Form.Group className="mb-3 FormGroup" controlId="postdescription">
                        <Form.Label>Post Text</Form.Label>
                        <Form.Control as="textarea" placeholder="post content" onKeyUp={this.handleChange.bind(this, 'post_content')} style={{ height: '100px' }} isInvalid={ !!this.state.errors.post_content} />

                        <Form.Control.Feedback type='invalid'>
                            { this.state.errors.post_content }
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={this.state.disableSubmit} >
                        Add Post
                    </Button>
                </Form>
            </Container>
        );
    }
}