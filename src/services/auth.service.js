class AuthService{
    constructor(){}

    setUserData(userData){        
        return localStorage.setItem('user', userData);
    }   

    getUserData(){
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();