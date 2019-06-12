import React, { Component } from 'react'
import PostItem from './posts/PostItem.js'
import PostView from './posts/PostView.js'
import {BoardProvider} from './imageBoardContext.js'
import axios from 'axios'
import {Route, Switch} from 'react-router-dom';
const BASEURL=`${process.env.REACT_APP_BE_URL}`

export default class ImageBoard extends Component {
    constructor(props) {
      super(props)
      /* this.requestModes={
        new: {path:'/posts',pathUrl: ''},
        user: {path:'/logged/user' ,pathUrl: '/profile'}
      } */
      this.imageFeed={};
      this.loadingMore=false;
      this.postWidth=5;
      this.tagname=this.props.match?this.props.match.params.tagname : "";
      this.state = {
         posts: [],
         postOpen: 2,
         postOpenId: 20,
         endReached: false,

         currentMode: this.props.mode
      }
    }
    componentDidMount(){
      //after refresh token gets lost for first render so grab it here too
      let token=this.props.token;
      if(!token){
        //get token from local storage
        const stateStr=localStorage.getItem("userState")
        if(stateStr){
            token=JSON.parse(stateStr).token;
        }
      }
      console.log(this.props)
      this.getPostByMode(this.props.mode, token);
    }


    componentDidUpdate=()=>{
      // if mode changes create new post array for the mode
      if((this.props.mode!==this.state.currentMode) || (this.props.match&&(this.tagname!==this.props.match.params.tagname))){
        this.getPostByMode(this.props.mode, this.props.token)
        if(this.props.match){
          this.tagname=this.props.match.params.tagname;
        }
        this.setState({
          currentMode: this.props.mode
        })
      }
      console.log(this.props)

    }
    getPostByMode=(mode, token)=>{
      switch(mode){
        case "user":
          this.getPosts(`${BASEURL}/logged/user`,token,(res)=>{
            //callback to create the first page of postarray
            this.setState({posts: res.data.data} ,()=>this.loadingMore=false)
          }); 
          break;
        case "favorites":
          this.getPosts(`${BASEURL}/logged/favorites`,token,(res)=>{
            //callback to create the first page of postarray
            this.setState({posts: res.data.data} ,()=>this.loadingMore=false)
          }); 
          break;
        case "tag":
          this.searchByTag(this.props.match.params.tagname);
          break;
        default: 
          this.getPosts(`${BASEURL}/posts`,token,(res)=>{
            //callback to create the first page of postarray
            this.setState({posts: res.data.data} ,()=>this.loadingMore=false)
          }); 
          break;
      }
    }




    getPosts=(url,token, callback)=>{
      /* console.log(this.props) */
      const headers=token?{headers:{"Authorization":`Bearer ${token}`}}:{}
      if(url){
        this.loadingMore=true;
        axios.get(url, headers)
          .then(res=>{
          callback(res)
          console.log(res.data)
          this.imageFeed=res.data;
        }).catch(err=>{
          console.log(err)
        })
      }
      if(this.imageFeed.current_page===this.imageFeed.last_page && this.state.endReached===false){
        this.setState({endReached:true})
      }
      
    }
    loadMore=()=>{
      console.log(this.imageFeed.next_page_url)
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
        console.log(this.props)
        const headers=token?{headers:{"Authorization":`Bearer ${token}`}}:{}
        if(url){
          this.loadingMore=true;
          axios.get(url, headers)
            .then(res=>{
            this.setState({posts:res.data.data},
              ()=>{
                this.loadingMore=false;
                this.props.history.push(`/tag/${tag}`);
              })
            console.log(res.data)
            this.imageFeed=res.data;
          }).catch((err)=>{
            console.log(err)
            this.setState({posts:[]},
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
    const pathUrl=this.props.pathUrl==="/tag"? `/tag/${this.tagname}` : this.props.pathUrl;
    return (
      <BoardProvider value={{state:this.state,openPost:this.openPost}}>
        <Switch>
        
        <Route path={['/post/:postId','/profile/post/:postId','/tag/:tagname/post/:postId']} render={(props)=>    
          this.state.posts.length>0&&
            <PostView 
              token={this.props.token}
              postId={this.state.postOpenId} 
              posts={this.state.posts}
              loadMore={this.loadMore}
              openFull={this.props.openFull}
              pathUrl={pathUrl || ""}
              searchByTag={this.searchByTag}
              {...props}
            />
          }
          />
          <Route path='/' render={(props)=>
          <div id='imageBoard' className={'imageGrid'}>
          {(this.state.posts && this.state.posts.length>0)&&this.state.posts.map((post, index)=>
              <PostItem 
                index={index} 
                key={index} 
                postOpen={this.state.postOpenId} 
                post={post}
                pathUrl={pathUrl || ""}
              />
            )
          }
        </div>}/>
        </Switch>
      </BoardProvider>
    )
  }
}
