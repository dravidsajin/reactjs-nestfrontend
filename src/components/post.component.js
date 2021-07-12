import React, {Component} from 'react';
import PostService from '../services/post.service';
import authService from '../services/auth.service';
import { Row, Col, Container, Card, Pagination, Button } from "react-bootstrap";

// icons
import { AiOutlineHeart } from 'react-icons/ai';

export default class Posts extends Component{

    constructor(props){
        super(props);
        this.state = {
            trendingposts: [],
            posts: [],
            geterror: null,
            totalPostCount: 0     
        }
    }

    handleAddToFav = event => {
        console.log("hai");
    }

    handlePageChange(pageno, event){        
        this.fetchPosts(pageno);
    }

    componentDidMount(){
        this.fetchPosts(1);        
    }

    fetchPosts(pageno){
        let loggeduserdata = authService.getUserData();
        if(loggeduserdata && loggeduserdata.accesstoken){
            PostService.getPost(loggeduserdata.accesstoken, pageno).then(
                response => {
                    this.setState({
                        trendingposts: response.data.trendingposts,
                        posts: response.data.posts,
                        totalPostCount: parseInt(response.data.totalcount) < 10 ? 1 : response.data.totalcount 
                    });
                },
                error => {
                    if(error && error.response && error.response.data && error.response.data.message){                     
                        this.setState({geterror: error.response.data.message});                    
                    }                    
                }
            );
        }
    }

    render(){
        let active = 2;
        let items = [];
        let pageCount = this.state.totalPostCount % 10;        
        for (let number = 1; number <= pageCount; number++) {
            items.push(
                <Pagination.Item key={number} onClick={this.handlePageChange.bind(this, number)} active={number === active}>
                {number}
                </Pagination.Item>,
            );
        }

        
        return(            
            <Container>                
                <h1>Trending Posts</h1>
                <Row xs={1} md={3} className="g-4">
                    {this.state.trendingposts.map(function(post, index){                            
                        return <Col>
                            <Card style={{ width: '18rem' }}>
                                { post.post_type == 'image' &&
                                    <Card.Img variant="top" src={post.post_imgurl} />
                                }                                
                                <Card.Body>
                                    <Card.Title></Card.Title>
                                    <Card.Text>
                                        {post.post_content.substring(1, 250)}
                                        <AiOutlineHeart style={{ fill: 'red', float: 'right'}} />
                                    </Card.Text>                    
                                </Card.Body>
                            </Card>
                        </Col>  
                    })}                                                      
                </Row>                

                <h1>Posts</h1>
                <Row xs={1} md={3} className="g-4">
                    {this.state.posts.map(function(post, index){                            
                        return <Col>
                            <Card style={{ width: '18rem' }}>
                                { post.post_type == 'image' &&
                                    <Card.Img variant="top" src={post.post_imgurl} />
                                }                                
                                <Card.Body>
                                    <Card.Title></Card.Title>
                                    <Card.Text>
                                        {post.post_content.substring(1, 50)}
                                        <Button onClick={() => this.handleAddToFav.bind(this)}><AiOutlineHeart style={{ fill: 'red', float: 'right'}} /></Button>
                                    </Card.Text>                    
                                </Card.Body>
                            </Card>
                        </Col>  
                    })}                                                      
                </Row>

                {/* pagination  */}
                <div>
                    <Pagination>{items}</Pagination>
                    <br />
                </div>
            </Container>            
        );
    }
}