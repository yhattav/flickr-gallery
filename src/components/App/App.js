import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'art',
      timeout:  false
    };
    this.changeTag=this.changeTag.bind(this);
  }

  changeTag(tag) {
    if(this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({
        tag
      });
    }, 700);
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header" id="top">
          <h2>Flickr Gallery</h2>
          <input className="app-input" onChange={event => this.changeTag(event.target.value)} placeholder="art"/>
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
