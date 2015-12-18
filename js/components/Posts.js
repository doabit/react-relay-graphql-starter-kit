import {Link} from 'react-router';
import React from 'react';
import Relay from 'react-relay';


class Posts extends React.Component {
  render() {
    return (
      <div>
        <h1>Post list</h1>
        <ul>
          {this.props.store.posts.map(post =>
             <li key={post.id}>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
             </li>
          )}
        </ul>
      </div>
    );
  }
}

export default Relay.createContainer(Posts, {
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        posts{
          id
          title
        }
      }
    `,
  },
});