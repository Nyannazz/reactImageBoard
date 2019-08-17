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
      this.scrollWait=false;
 
      this.state = {
          uploadOpen: false,
          zoom: false,
          logSignOpen: false,
          loggedIn: false,
          mobileNavOpen: false,

          signUpStatus: 0,
          name: "",
          email: "",
          password: "",
          passwordRe: "",
          token: "",


          //image board state
          posts: [],
          postsSearch: [],
          postsUserFavorite: [],

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
          this.setState({
            loggedIn: false,
            token: ""
          })
          localStorage.removeItem("userState");
        }
    }

    loggedOutByServer=()=>{
      this.setState({
        loggedIn: false,
        token: "",
      })
      alert('you have been logged out')
      localStorage.removeItem("userState");
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
        this.scrollRef.current.addEventListener('scroll',(event)=>this.handleScroll(event));
    }

    handleScroll=(event)=>{
      const scrollVal=event.target.scrollTop;
      const maxScroll=event.target.scrollHeight-event.target.offsetHeight;

      const scrollPercent=scrollVal / maxScroll;
      if(scrollPercent>0.9 && !this.scrollWait){
        //console.log(scrollPercent)
        this.loadMore('posts')
      }
      // after more content was loaded and scrollpercent is below 90% unlock again
      if(this.scrollWait && scrollPercent<=0.9){
        this.scrollWait=false;
      }
    }

    handleBigScreen=(scrollRef)=>{
      /* if there was not enough content loaded to fill the entire screen load more */
      return scrollRef.current.scrollHeight === scrollRef.current.clientHeight
    }


    setScroll=(amount)=>{
        const offset=-80;
        const currentScroll=this.scrollRef.current.scrollTop;
        this.scrollRef.current.scroll(0,currentScroll+amount+offset);
    }
    fullScreenImage=(imageSource)=>{
        this.setState({fullScreenImage:imageSource});
    }

    getUserPosts=(type)=>{
      const currentType=(type==='user' || type ==='favorites')?type : 'user';
      const token=this.state.token;
      if(token){
          this.getPosts(`${BASEURL}/logged/${currentType}`,token,(res)=>{
              //callback to create the first page of postarray
              this.setState({postsUserFavorite: res.data.data,loading: false, error: false} ,()=>this.loadingMore=false)
            })
      }
    }


    getNewPosts=()=>{
      if(!this.mainBoardLoaded){
        const token=this.state.token;
        this.getPosts(`${BASEURL}/posts`,token,(res)=>{
          //callback to create the first page of postarray
          this.setState({
            posts: res.data.data, 
            loading: false, error: false},()=>{
              this.loadingMore=false
              this.mainBoardLoaded=true
              if(this.handleBigScreen(this.scrollRef)){
                /* if screen is not filled load more content should rarly happen but maybe people have giant screens...
                also wait 800ms to give dom some time to render */
                setTimeout(()=>this.loadMore('posts'),800);
              }
          })
        })
      }
      
    }

    searchByTag=(tagName)=>{
      this.searchPosts(`${BASEURL}/posts/search/`,tagName)
    }

    searchByString=(searchString)=>{
      this.searchPosts(`${BASEURL}/posts/search/`,searchString)
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
        }).catch(error=>{
          if(error && error.response && error.response.status===403){
            this.loggedOutByServer();
          }
          this.setState({error: true,loading: false})
        })
      }
      if(this.imageFeed.current_page===this.imageFeed.last_page && this.state.endReached===false){
        this.setState({endReached:true})
      }
        
      }
      loadMore=(saveTo)=>{
        const target=saveTo || 'posts';
        if(!this.loadingMore && this.state[target]){
          this.getPosts(this.imageFeed.next_page_url,this.props.token,(res)=>{
            //callback to append the new post "page" to current post array
            this.setState({[target]:[...this.state[target],...res.data.data]} ,()=>this.loadingMore=false)
          })
        }
      }

      loadOlder=(saveTo)=>{
        const target=saveTo || 'posts';
        if(!this.loadingMore && this.state[target]){
          this.getPosts(this.imageFeed.prev_page_url,this.props.token,(res)=>{
            console.log(res.data[0])
            //callback to append the new post "page" to current post array
            this.setState({[target]:[...res.data[0].data, ...this.state[target]]} ,()=>this.loadingMore=false)
          })
        }
      }

      // imageFeed from image ID

      imageFeedFromPostView=(target, postArray, callback)=>{
        const currentTarget=target? target : "posts";
        this.imageFeed=postArray;
        this.setState({
          [currentTarget]:postArray.data
        },callback)
      }
  
      searchPosts=(url, search)=>{
        /* console.log(search) */
        const token=this.state.token;
        if(search){
          const searchUrl=`${url}${search}`
          const headers=token?{headers:{"Authorization":`Bearer ${token}`}}:{}
          if(searchUrl){
            this.loadingMore=true;
            axios.get(searchUrl, headers)
              .then(res=>{
              this.setState({postsSearch:res.data.data, loading: false, error: false},
                ()=>{
                  this.loadingMore=false;
                  /* this.props.history.push(`/tag/${tag}`); */
                })
              this.imageFeed=res.data;
            }).catch((error)=>{
              this.setState({postsSearch:[],loading: false,error: true},
                ()=>{
                  this.loadingMore=false;
                  /* this.props.history.push(`/tag/${tag}`); */
                })
            })
          }
        }
        else{
          /* this.props.history.push(""); */
        }
      }

    render() {
        return (
        <BrowserRouter>
            <div className="App">
                
                <header className="App-header centerAll">
                <div 
                  onClick={()=>this.setState({mobileNavOpen: !this.state.mobileNavOpen})} 
                  className='mobileToggle'
                >
                  X
                </div>
                <Route path="" render={(props)=>
                    <NavBar
                        mobileNavOpen={this.state.mobileNavOpen} 
                        logOut={this.logOut} 
                        loggedIn={this.state.loggedIn} 
                        openLogSign={()=>this.setState({logSignOpen: true, mobileNavOpen: false})} 
                        openUpload={()=>this.setState({uploadOpen:!this.state.uploadOpen,mobileNavOpen: false})} 
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
                            imageFeedFromPostView={this.imageFeedFromPostView} 
                            loadMore={()=>this.loadMore('postsUserFavorite')} 
                            posts={this.state.postsUserFavorite} 
                            getUserPosts={this.getUserPosts}
                            loggedOutByServer={this.loggedOutByServer} 
                        />}
                    />
                    }  
    
                    <Route path={"/tag/:search"} render={({history, match})=>
                        <ImageBoard 
                          target='postsSearch'
                          imageFeedFromPostView={this.imageFeedFromPostView} 
                          loadMore={()=>this.loadMore('postsSearch')} 
                          key='boardTag' 
                          posts={this.state.postsSearch} 
                          getPosts={this.searchByTag} 
                          pathUrl="/tag" 
                          history={history} 
                          match={match} 
                          token={this.state.token}
                          openFull={this.fullScreenImage}
                          loggedOutByServer={this.loggedOutByServer} 
                        />}
                    />

                    <Route path={"/search/:search"} render={({history, match})=>
                        <ImageBoard 
                          target='postsSearch'
                          imageFeedFromPostView={this.imageFeedFromPostView} 
                          loadMore={()=>this.loadMore('postsSearch')} 
                          key='boardSearch' 
                          posts={this.state.postsSearch} 
                          getPosts={this.searchByString} 
                          pathUrl="/search" 
                          history={history} 
                          match={match} token={this.state.token} 
                          openFull={this.fullScreenImage}
                          loggedOutByServer={this.loggedOutByServer}
                        />}
                    />

                    <Route path={"/"} render={({history})=>
                        <ImageBoard 
                          loadMore={()=>this.loadMore('posts')}
                          loadOlder={()=>this.loadOlder('posts')} 
                          imageFeedFromPostView={this.imageFeedFromPostView} 
                          key='boardNew' 
                          posts={this.state.posts} 
                          getPosts={this.getNewPosts} 
                          pathUrl="" 
                          history={history} 
                          token={this.state.token} 
                          openFull={this.fullScreenImage}
                          loggedOutByServer={this.loggedOutByServer}
                        />
                      }
                    />
                  </Switch>
                </main>
                {this.state.fullScreenImage&&
                <FullScreenModal>
                    <img 
                        onClick={()=>this.setState({zoom:!this.state.zoom})} 
                        alt='' 
                        className="fullScreenImage" 
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
