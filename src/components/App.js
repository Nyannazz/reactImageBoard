import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ImageBoard from './reactComponents/ImageBoard.js'
import UserPage from './reactComponents/user/UserPage.js'
import NavBar from './reactComponents/NavBar.js'
import {AppProvider} from './AppContext.js'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import PostView from './reactComponents/posts/PostView'
import './scss/customStyles.css';
import CreatePost from './reactComponents/user/CreatePost.js'

export default class ComponentName extends Component {
    constructor(props) {
      super(props)
      this.scrollRef=React.createRef();
      this.setScroll=this.setScroll.bind(this)
      this.state = {
          uploadOpen: false
         
      }
    }
    setScroll(amount){
        const offset=-80;
        const currentScroll=this.scrollRef.current.scrollTop;
        this.scrollRef.current.scroll(0,currentScroll+amount+offset);
    }
    render() {
        return (
        <BrowserRouter>
            <div className="App">
                <header className="App-header centerAll">
                    <NavBar openUpload={()=>this.setState({uploadOpen:!this.state.uploadOpen})}/>
                </header>
                <main ref={this.scrollRef}>
                  {this.state.uploadOpen&&<div className={"uploadModal centerAll"}>
                    <div className={"innerContent"}>
                        <i onClick={()=>this.setState({uploadOpen: false})} className="material-icons closeButton">
                            close
                        </i>
                        <CreatePost/>
                    </div>
                  </div>}
                  <Switch>
                  <Route path='/profile' render={({history})=>
                  <UserPage>
                      <ImageBoard simpleMode={true} history={history}/>
                  </UserPage>}/>
                  
                  <Route path='/' component={ImageBoard}/>
                  </Switch>
                </main>
            </div>
        </BrowserRouter>
        );
    }
}
