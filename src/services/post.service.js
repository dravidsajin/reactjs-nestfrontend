import axios from '../axios/axios';
class PostService{

    constructor(){}

    addPost(formData, accesstoken){
        let authorization = { headers: { Authorization: `Bearer ${accesstoken}` } };
        return axios.post("/posts/createPost", formData, authorization).then(response => {
            return response;
        });
    }
}

export default new PostService();