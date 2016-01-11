import {Link} from 'react-router';
import React from 'react';
import Relay from 'react-relay';
// import Post from './Post';


class Posts extends React.Component {
  render() {
    var currentNumber = this.props.relay.variables.limit;
    var buttonStyle = {};
    if (!this.props.store.posts.pageInfo.hasNextPage) {
      buttonStyle.display = 'none';
    }

    return (
      <div>
        <h1>Post list</h1>
        <ul>
          {this.props.store.posts.edges.map(edge =>
             <li key={edge.node.id}>
                <Link to={`/posts/${edge.node.id}`}>{edge.node.title}</Link>
             </li>
          )}
        </ul>
        <button
          style={buttonStyle}
          onClick={() => this.props.relay.setVariables({limit: currentNumber + 5})}>
            load more
        </button>
      </div>
    );
  }
}

export default Relay.createContainer(Posts, {
  initialVariables: {
    limit: 5
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        posts(first: $limit){
          edges{
            node{
              id
              title
            }
          },
          pageInfo {
            hasNextPage
          }
        }
      }
    `,
  },
});