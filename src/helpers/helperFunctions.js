import axios from "axios";

export const onChange=(event)=>{
    this.setState({
        [event.target.name]:event.target.value
    })
}

export const getPosts=(url,token)=>{
    const headers=token?{headers:{"Authorization":`Bearer ${token}`}}:{}
    return axios.get(url,headers)
}