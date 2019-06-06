import React, { Component } from 'react';
import ImageBoard from './reactComponents/ImageBoard.js'
import UserPage from './reactComponents/user/UserPage.js'
import SignUp from './reactComponents/user/SignUp.js'
import NavBar from './reactComponents/NavBar.js'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './scss/customStyles.css';
import CreatePost from './reactComponents/user/CreatePost.js'
import FullScreenModal from './reactComponents/FullScreenModal.js'

export default class ComponentName extends Component {
    constructor(props) {
      super(props)
      this.scrollRef=React.createRef();
      this.state = {
          uploadOpen: false,
          zoom: false,
          logSignOpen: false,
          loggedIn: false
         
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
                    <NavBar loggedIn={this.state.loggedIn} openLogSign={()=>this.setState({logSignOpen: true})} openUpload={()=>this.setState({uploadOpen:!this.state.uploadOpen})} {...props}/>
                }/>    
                </header>
                <main ref={this.scrollRef}>
                  {this.state.uploadOpen&&
                  <div className={"uploadModal centerAll"}>
                    <div className={"innerContent"}>
                        <i onClick={()=>this.setState({uploadOpen: false})} className="material-icons closeButton">
                            close
                        </i>
                        <CreatePost/>
                    </div>
                  </div>}
                  {this.state.logSignOpen&&
                  <div className={"uploadModal centerAll"}>
                    <div className={"innerContent  fixHeightNoBorder"}>
                        <i onClick={()=>this.setState({logSignOpen: false})} className="material-icons closeButton">
                            close
                        </i>
                        <SignUp/>
                    </div>
                  </div>}
                  
                  <Switch>
                  <Route path='/profile' render={({history})=>
                  <UserPage>
                      <ImageBoard simpleMode={true} history={history} openFull={this.fullScreenImage}/>
                  </UserPage>}/>
                  
                  <Route path='/' render={({props})=><ImageBoard openFull={this.fullScreenImage}/>}/>
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
