import React, { Component } from 'react'
import axios from 'axios';
const BASEURL=`${process.env.REACT_APP_BE_URL}`;


export default class SignUp extends Component {
    constructor(props) {
        super(props)
    
        this.state = {

        }
    }


    
    render() {
        const {name,email,password,passwordRe,onChange,signUp,logIn,sign,log,signUpStatus}=this.props;
        return (
            <div className={'logSignContainer'}>
            <div className={'logSignSwitch pointer'}>
                <div onClick={sign} className={signUpStatus===1?'inactive':""}>SIGN UP</div>
                <div onClick={log} className={signUpStatus===0?'inactive':""}>LOG IN</div>
            </div>
            {signUpStatus?
            <form onSubmit={logIn} className={'logSignForm'}>
            <h1>LOG IN</h1>
            <input value={email} onChange={onChange} name='email' placeholder='email' type="email"/>
            <input value={password} onChange={onChange} name='password' placeholder='password' type="password"/>
            <input className={"submitButtonMain"} type="submit"/>
            </form>:
            <form onSubmit={signUp} className={'logSignForm'}>
                <h1>SIGN UP</h1>
                <input value={name} onChange={onChange} name='name' placeholder='user name' type="text"/>
                <input value={email} onChange={onChange} name='email' placeholder='email' type="email"/>
                <input value={password} onChange={onChange} name='password' placeholder='password' type="password"/>
                <input value={passwordRe} onChange={onChange} name='passwordRe' placeholder='password again' type="password"/>
                <input className={"submitButtonMain"} type="submit"/>
            </form>}
            </div>
        )
    }
}
