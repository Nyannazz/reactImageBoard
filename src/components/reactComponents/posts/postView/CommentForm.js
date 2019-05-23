import React, { Component } from 'react'

export default class CommentForm extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    
    render() {
        return (
            <form className={'commentForm'}>
                <textarea className={'commentText'} placeholder='write a comment' ></textarea>
                <input className={'submitComment'} type='submit'></input>
            </form>
        )
    }
}
