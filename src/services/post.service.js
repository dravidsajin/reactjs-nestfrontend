import axios from '../axios/axios';
class PostService{

    constructor(){}

    addPost(formData, accesstoken){
        let authorization = { headers: { Authorization: `Bearer ${accesstoken}` } };
        return axios.post("/posts/createPost", formData, authorization).then(response => {
            return response;
        });
    }

    getPost(accesstoken, pageno){
        let authorization = { headers: { Authorization: `Bearer ${accesstoken}` } };
        return axios.get("/posts/getAll/"+pageno+"", authorization).then(response => {
            return response;
        });
    }
}

export default new PostService();