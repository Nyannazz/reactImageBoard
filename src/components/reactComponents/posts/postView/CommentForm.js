import React, { Component } from 'react'
import axios from 'axios'
const BASEURL='http://image-board.local/comments';


export default class CommentForm extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             comment: "",
             succes: false
        }
    }
    
    sendComment=(event)=>{
        event.preventDefault();
        if(this.state.comment.length>1 && this.props.currentPost){
            const formData=new FormData();
            formData.append("body",this.state.comment);
            formData.append("postId",this.props.currentPost)
            axios.post(BASEURL,formData)
            .then(response=>{
                if(response.status===200){
                    this.setState({
                        succes:"succes!"
                    })
                }
            })
            .catch(error=>{
                console.log(error)
                this.setState({
                    succes:"something went wrong!"
                })
            })
            
        }
        
    }

    onChange=(event)=>{
        const name=event.target.name;
        const value=event.target.value;
    
        this.setState({[name]:value})
    }
    
    render() {
        return (
            <form className={'commentForm'}>
                {this.state.succes&&<div onClick={()=>this.setState({succes:""})} className={'commentInfo'}>{this.state.succes}</div>}
                <textarea value={this.state.comment} onChange={this.onChange} name="comment" className={'commentText'} placeholder='write a comment' />
                <input onClick={this.sendComment} className={'submitComment mainHover'} type='submit'></input>
            </form>
        )
    }
}
