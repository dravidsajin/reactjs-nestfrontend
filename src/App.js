import React, { Component } from 'react';
import { Switch, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

//services
import UserService from './services/user.service';
import AuthService from './services/auth.service';

//components
import Login from './components/login.component';
import Register from './components/register.component';
import Posts from './components/post.component';
import Profile from './components/profile.component'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userDetails: null
    }
    this.logOut = this.logOut.bind(this);//handling logout
  }

  componentDidMount(){
    const loggedUserData = AuthService.getUserData();
    if(loggedUserData && loggedUserData.accesstoken){

      UserService.getLoggedUser(loggedUserData.accesstoken).then(
        response => {
          this.setState({
            userDetails: response.data.result
          });        
        },
        error => {
          console.log(error);
        }
      ); //get the logged user data
    }    
  }

  logOut() {
    UserService.logout();
  }

  render(){
    return (
      <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav mr-auto">
             {!this.state.userDetails &&
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>
              }

              {!this.state.userDetails &&
                <li className="nav-item">
                  <Link to={"/signup"} className="nav-link">
                    Register
                  </Link>
                </li>
              }
              {this.state.userDetails != null && 
                <li className="nav-item">
                  <Link to={"/posts"} className="nav-link">
                    Home
                  </Link>
                </li>
              }
              {this.state.userDetails != null && 
                <li className="nav-item">
                  <Link to={"/Profile"} className="nav-link">
                    Profile
                  </Link>
                </li>
              }
              {this.state.userDetails != null && 
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={this.logOut}>
                    Logout
                  </a>
                </li>
              }              
            </div>
          </nav>
          <div className="container mt-3">
            <Switch>
              <Route exact path={["/login"]} component={Login} /> 
              <Route exact path={["/register"]} component={Register} />
              <Route exact path={["/", "/posts"]} component={Posts} /> 
              <Route exact path={["/profile"]} component={Profile} />
            </Switch>
          </div>
      </div>
    );
  }  
}

export default App;
