import React, { Component } from 'react';
import ImageBoard from './reactComponents/ImageBoard.js'
import UserPage from './reactComponents/user/UserPage.js'
import SignUp from './reactComponents/user/SignUp.js'
import NavBar from './reactComponents/NavBar.js'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './scss/customStyles.css';
import CreatePost from './reactComponents/user/CreatePost.js'
import FullScreenModal from './reactComponents/FullScreenModal.js'
import axios from 'axios';
const BASEURL=`${process.env.REACT_APP_BE_URL}`;



export default class ComponentName extends Component {
    constructor(props) {
      super(props)
      this.scrollRef=React.createRef();
      this.state = {
          uploadOpen: false,
          zoom: false,
          logSignOpen: false,
          loggedIn: false,

          signUpStatus: 0,
          name: "",
          email: "",
          password: "",
          passwordRe: "",
          token: ""
         
      }
    }
    onChange=(event)=>{
        this.setState({[event.target.name]:event.target.value})
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
                this.setState({signUpStatus:1})
            }).catch(error=>{
                window.alert("failure")
                console.log(error)
            })
        }
        
    }

    logIn=(event)=>{
        event.preventDefault();
            const formData=new FormData();
            formData.append("email",this.state.email);
            formData.append("password",this.state.password);
            axios.post(`${BASEURL}/login`,formData,{credentials: true}).then(response=>{
                console.log(response)
                this.setState({
                    loggedIn:true, 
                    logSignOpen: false,
                    token:response.data.token,
                    name: "",
                    email: "",
                    password: "",
                    passwordRe: "",
                    },
                    ()=>this.createLocalStore())
            }).catch(error=>{
                window.alert("failure")
                console.log(error)
            })
    }
    logOut=(event)=>{
        event.preventDefault();
        const token=this.state.token;
        if(token){
            /* axios.get(`${BASEURL}/logout`,
            {headers:{"Authorization":`Bearer ${token}`}}
            ).then(()=>{
                this.setState({
                    loggedIn: false,
                    token: ""
                })
                localStorage.removeItem("userState");
            }).catch(error=>console.log(error)) */
            this.setState({
                loggedIn: false,
                token: ""
            })
            localStorage.removeItem("userState");
        }
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

    createLocalStore=()=>{
        localStorage.setItem("userState",JSON.stringify({...this.state}))
    }
    componentDidMount(){
        // try recover from local storage
        const stateStr=localStorage.getItem("userState")
        if(stateStr){
            const state=JSON.parse(stateStr);
            this.setState(state)
        }
    }

    setScroll=(amount)=>{
        const offset=-80;
        const currentScroll=this.scrollRef.current.scrollTop;
        this.scrollRef.current.scroll(0,currentScroll+amount+offset);
    }
    fullScreenImage=(imageSource)=>{
        this.setState({fullScreenImage:imageSource});
    }



    render() {
        return (
        <BrowserRouter>
            <div className="App">
                
                <header className="App-header centerAll">
                <Route path="" render={(props)=>
                    <NavBar 
                        logOut={this.logOut} loggedIn={this.state.loggedIn} 
                        openLogSign={()=>this.setState({logSignOpen: true})} 
                        openUpload={()=>this.setState({uploadOpen:!this.state.uploadOpen})} 
                        {...props}
                    />
                }/>    
                </header>
                
                <main ref={this.scrollRef}>
                  
                  {this.state.uploadOpen&&
                  <div className={"uploadModal centerAll"}>
                    <div className={"innerContent"}>
                        <i onClick={()=>this.setState({uploadOpen: false})} className="material-icons closeButton">
                            close
                        </i>
                        <CreatePost token={this.state.token}/>
                    </div>
                  </div>}

                  {this.state.logSignOpen&&
                  <div className={"uploadModal centerAll"}>
                    <div className={"innerContent  fixHeightNoBorder"}>
                        <i onClick={()=>this.setState({logSignOpen: false})} className="material-icons closeButton">
                            close
                        </i>
                        <SignUp 
                            logIn={this.logIn}
                            signUp={this.signUp}
                            sign={()=>this.setState({signUpStatus:0})}
                            log={()=>this.setState({signUpStatus:1})}
                            signUpStatus={this.state.signUpStatus}
                            onChange={this.onChange}
                            name={this.state.name}
                            email={this.state.email}
                            password={this.state.password}
                            passwordRe={this.state.passwordRe}
                        />
                    </div>
                  </div>}
                  
                  <Switch>
                    {this.state.loggedIn && 
                    <Route path='/profile' render={({history})=>
                        <UserPage 
                            token={this.state.token}
                            history={history}
                            openFull={this.fullScreenImage}
                        />}
                    />
                    }  
                    <Route path='/tag/:tagname' render={({history,match})=>
                        <ImageBoard key="imageBoardTags" mode={"tag"} pathUrl="/tag" history={history} match={match} token={this.state.token} openFull={this.fullScreenImage}/>}
                    />
                    
                    <Route path='/' render={({history})=>
                        <ImageBoard key="imageBoardNew" mode={"new"} pathUrl="" history={history} token={this.state.token} openFull={this.fullScreenImage}/>}
                    />
                  </Switch>
                </main>
                {this.state.fullScreenImage&&
                <FullScreenModal>
                    <img 
                        onClick={()=>this.setState({zoom:!this.state.zoom})} 
                        alt='' 
                        class="fullScreenImage" 
                        src={this.state.fullScreenImage}
                        style={this.state.zoom?{objectFit:"cover"}:{objectFit:"contain",height: "99.6%"}}
                    />
                    <div className={"centerAll shortInfo"}>
                        <p>CLICK THE PICTURE AGAIN TO ZOOM IN!</p>
                    </div>
                    <i onClick={()=>this.setState({fullScreenImage:""})} className="material-icons closeButton">
                        close
                    </i>
                </FullScreenModal>}
            </div>
        </BrowserRouter>
        );
    }
}
