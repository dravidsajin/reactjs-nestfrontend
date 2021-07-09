import axios from '../axios/axios';
import AuthService from './auth.service';
class UserService{

    login(logindata){
        return axios.post("/user/login", logindata).
        then(result => {                                                                 
            if(result.data.statusCode === 200 && result.data.result){                                                
                AuthService.setUserData(JSON.stringify(result.data.result)); // store the data in localstorage
            }            
            return result;
        });
    }

    register(userdata){        
        return axios.post("/user/createuser", userdata).
        then(result => {                                                                                         
            return result;
        });
    }

    logout(){
        return localStorage.removeItem('user');
    }

    getLoggedUser(accesstoken){
        let authorization = { headers: { Authorization: `Bearer ${accesstoken}` } };
        return axios.get('/user/profile',authorization).
        then(response => {
            return response;
        });
    }

    updateProfile(userdata, accesstoken){
        let authorization = { headers: { Authorization: `Bearer ${accesstoken}` } };
        return axios.patch('/user/updateuser',userdata,authorization).
        then(response => {
            return response;
        });
    }
}

export default new UserService();