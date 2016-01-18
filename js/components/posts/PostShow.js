import React from 'react';
import Relay from 'react-relay';

class PostShow extends React.Component {
  render() {
    const {post} = this.props;
    return (
      <div>
        <h1>post {post.id} {post.title}</h1>
        <h3>Author: {post.person.firstName} {post.person.lastName}</h3>
        <p> {post.content} </p>
      </div>
    );
  }
}

export default Relay.createContainer(PostShow, {
  fragments: {
    post: () => Relay.QL`
      fragment on Post {
        person{
          firstName
          lastName
        }
        id
        title
        content
      }
    `,
  }
});
