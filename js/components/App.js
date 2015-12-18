import React from 'react';
import {Link} from 'react-router';

class App extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/people">People</Link></li>
          <li><Link to="/posts">Posts</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
}

export default App;