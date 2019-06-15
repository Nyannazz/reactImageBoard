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

      this.imageFeed={};
      this.loadingMore=false;
      this.tagname=this.props.match?this.props.match.params.tagname : "";
      /* this.props.history.listen((location) => {
        this.changeModeByLocation(location);
      }); */
      this.allowedModes=['new','popular','tag','user','favorites'];
      this.currentMode=this.getModeFromPath(this.allowedModes);

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
          token: "",


          //image board state
          posts: [],
          postOpen: 2,
          postOpenId: 20,
          endReached: false,
          loading: true,
          error: false,
         
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




    // get data for image board
    getModeFromPath=(allowedModes)=>{
        const newLocation=this.props.history.location.pathname.split('/')[1];
        if(allowedModes.includes(newLocation)){
          return newLocation
        }
        else if(allowedModes.includes(this.props.mode)){
          return this.props.mode
        }
        return 'new'
        
      }
  
  
      
      
      changeModeByLocation=(location)=>{
  
        const newLocation=location.pathname.split('/')[1];
        console.log(newLocation)
        if(this.allowedModes.includes(newLocation) && this.currentMode!==newLocation){
          console.log(newLocation);
          if(this.props.match){
            this.tagname=this.props.match.params.tagname;
            console.log(location)
  
          }
          this.currentMode=newLocation;
          this.getPostByMode(this.currentMode, this.props.token)
        }
      }
  
  
      componentDidUpdate=()=>{
        const newMode=this.getModeFromPath(this.allowedModes)
        // if mode changes create new post array for the mode
        if((newMode!==this.currentMode) || (this.props.match&&(this.tagname!==this.props.match.params.tagname))){
          this.getPostByMode(newMode, this.props.token)
  
          if(this.props.match){
            this.tagname=this.props.match.params.tagname;
          }
          
          this.currentMode=newMode;
          
        }
  
      }
  /*     getPostByMode=(mode, token)=>{
        switch(mode){
          case "user":
            this.getPosts(`${BASEURL}/logged/user`,token,(res)=>{
              //callback to create the first page of postarray
              this.setState({posts: res.data.data,loading: false, error: false} ,()=>this.loadingMore=false)
            }); 
            break;
          case "favorites":
            this.getPosts(`${BASEURL}/logged/favorites`,token,(res)=>{
              //callback to create the first page of postarray
              this.setState({posts: res.data.data,loading: false, error: false} ,()=>this.loadingMore=false)
            }); 
            break;
          case "tag":
            this.searchByTag(this.props.match.params.tagname);
            break;
          default: 
            this.getPosts(`${BASEURL}/posts`,token,(res)=>{
              //callback to create the first page of postarray
              this.setState({posts: res.data.data, loading: false, error: false} ,()=>this.loadingMore=false)
            }); 
            break;
        }
      } */
      getUserPosts=()=>{
        const token=this.state.token;
        if(token){
            this.getPosts(`${BASEURL}/logged/user`,token,(res)=>{
                //callback to create the first page of postarray
                this.setState({posts: res.data.data,loading: false, error: false} ,()=>this.loadingMore=false)
              }); 
        }
        
      }
  
  
  
      getPosts=(url,token, callback)=>{
        const headers=token?{headers:{"Authorization":`Bearer ${token}`}}:{}
        if(url){
          this.loadingMore=true;
          this.setState({loading: true})
          axios.get(url, headers)
            .then(res=>{
            callback(res)
            this.imageFeed=res.data;
          }).catch(err=>{
            this.setState({error: true,loading: false})
          })
        }
        if(this.imageFeed.current_page===this.imageFeed.last_page && this.state.endReached===false){
          this.setState({endReached:true})
        }
        
      }
      loadMore=()=>{
        if(!this.loadingMore){
          this.getPosts(this.imageFeed.next_page_url,this.props.token,(res)=>{
            //callback to append the new post "page" to current post array
            this.setState({posts:[...this.state.posts,...res.data.data]} ,()=>this.loadingMore=false)
          })
  
        }
      }
  
      searchByTag=(tag)=>{
        if(tag){
          const url=`${BASEURL}/posts/tag/${tag}`
          const token=this.props.token
          const headers=token?{headers:{"Authorization":`Bearer ${token}`}}:{}
          if(url){
            this.loadingMore=true;
            axios.get(url, headers)
              .then(res=>{
              this.setState({posts:res.data.data, loading: false, error: false},
                ()=>{
                  this.loadingMore=false;
                  this.props.history.push(`/tag/${tag}`);
                })
              this.imageFeed=res.data;
            }).catch((err)=>{
              this.setState({posts:[],loading: false,error: true},
                ()=>{
                  this.loadingMore=false;
                  this.props.history.push(`/tag/${tag}`);
                })
            })
          }
        }
        else{
          this.props.history.push("");
        }
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
                    {/* <Route path='/tag/:tagname' render={({history,match})=>
                        <ImageBoard key="imageBoardTags" mode={"tag"} pathUrl="/tag" history={history} match={match} token={this.state.token} openFull={this.fullScreenImage}/>}
                    /> */}
                    
                    <Route path={"/"} render={({history, match})=>
                        <ImageBoard key="imageBoardNew" mode={"new"} pathUrl="" history={history} match={match} token={this.state.token} openFull={this.fullScreenImage}/>}
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
