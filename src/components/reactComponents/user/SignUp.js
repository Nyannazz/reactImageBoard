import React, { Component } from 'react'
import axios from 'axios';
const BASEURL=`${process.env.REACT_APP_BE_URL}`;


export default class SignUp extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             name: "",
             email: "",
             password: "",
             passwordRe: "",
             signUpStatus: 0
        }
    }
    signUp=(event)=>{
        event.preventDefault();
        if(this.validateState){
            const formData=new FormData();
            formData.append("name",this.state.name);
            formData.append("email",this.state.email);
            formData.append("password",this.state.password);
            axios.post(`${BASEURL}/signup`,formData).then(response=>{
                console.log(response)
                this.setState({singUpStatus:1})
            }).catch(error=>{
                window.alert("failure")
                console.log(error)
            })
        }
        
    }
    signUp=(event)=>{
        event.preventDefault();
            const formData=new FormData();
            formData.append("name",this.state.name);
            formData.append("email",this.state.email);
            formData.append("password",this.state.password);
            axios.post(`${BASEURL}/login`,formData).then(response=>{
                console.log(response)
                this.setState({singUpStatus:1})
            }).catch(error=>{
                window.alert("failure")
                console.log(error)
            })
        
        
    }
    validateState=()=>{
        const {name,email,password,passwordRe}=this.state;
        let valid=false;
        //matching pw length in backend
        if(name.length>3 &&
            email.length>4  &&
            password.length>7 &&
            password===passwordRe){
                valid=true;
            }
        return valid;
    }
    onChange=(event)=>{
        this.setState({[event.target.name]:event.target.value})
    }

    
    render() {
        const {name,email,password,passwordRe,signUpStatus}=this.state;
        return (
            <div className={'logSignContainer'}>
            {signUpStatus?
            <form onSubmit={this.signUp} className={'logSignForm'}>
            <h1>LOG IN</h1>
            <input value={email} onChange={this.onChange} name='email' placeholder='email' type="email"/>
            <input value={password} onChange={this.onChange} name='password' placeholder='password' type="password"/>
            <input className={"submitButtonMain"} type="submit"/>
            </form>:
            <form onSubmit={this.logIn} className={'logSignForm'}>
                <h1>SIGN UP</h1>
                <input value={name} onChange={this.onChange} name='name' placeholder='user name' type="text"/>
                <input value={email} onChange={this.onChange} name='email' placeholder='email' type="email"/>
                <input value={password} onChange={this.onChange} name='password' placeholder='password' type="password"/>
                <input value={passwordRe} onChange={this.onChange} name='passwordRe' placeholder='password again' type="password"/>
                <input className={"submitButtonMain"} type="submit"/>
            </form>}
            </div>
        )
    }
}
