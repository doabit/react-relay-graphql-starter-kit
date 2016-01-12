import {Link} from 'react-router';
import React from 'react';
import Relay from 'react-relay';

class Post extends React.Component {
  render() {
    const {post} = this.props;
    return (
      <li>
         <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </li>
    );
  }
}

export default Relay.createContainer(Post, {
  fragments: {
    post: () => Relay.QL`
      fragment on Post {
        id
        title
      }
    `,
  }
});
