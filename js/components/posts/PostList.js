import React from 'react';
import Relay from 'react-relay';
import Post from './Post';
import CreatePostMutation from "../../mutations/CreatePostMutation";

class PostList extends React.Component {
  // constructor(props) {
  //   super(props);
  // }
  handleSubmit = (e) => {
    e.preventDefault();
    let onSuccess = () => {
      console.log("Create post success");
    };
    let onFailure = (transaction) => {
      var error = transaction.getError() || new Error('Mutation failed.');
      console.error(error);
    };

    Relay.Store.commitUpdate(
      new CreatePostMutation({
        title: this.refs.newTitle.value,
        content: this.refs.newContent.value,
        person: this.refs.newPerson.value,
        store: this.props.store
      }),
      {onFailure, onSuccess}
    );
    this.refs.newTitle.value = "";
    this.refs.newContent.value = "";
  };

  render() {
    let currentNumber = this.props.relay.variables.first;
    var buttonStyle = {};
    if (!this.props.store.posts.pageInfo.hasNextPage) {
      buttonStyle.display = 'none';
    }

    return (
      <div>
        <h1>Post List</h1>
        <ul>
          {this.props.store.posts.edges.map(edge =>
             <Post key={edge.node.id} post={edge.node}></Post>
          )}
        </ul>
        <button
          style={buttonStyle}
          onClick={() => {
            console.log(currentNumber);
            this.props.relay.setVariables({first: currentNumber + 5});
          }}>
            load more
        </button>

        <div>
            <form onSubmit={this.handleSubmit}>
              <div>
                <h5>Add New Post</h5>
                <p>
                  <label htmlFor="newPerson">Person</label><br/>
                  <select type="text" id="newPerson" ref="newPerson">
                    {this.props.store.people.edges.map(edge =>
                       <option key={edge.node.id} value={edge.node.id}>{edge.node.firstName} {edge.node.lastName}</option>
                    )}
                  </select>
                </p>
                <p>
                  <label htmlFor="newTitle">Title</label><br/>
                  <input type="text" id="newTitle" ref="newTitle"/>
                </p>
                <p>
                  <label htmlFor="newContent">Content</label><br/>
                  <textarea type="text" id="newContent" ref="newContent"></textarea>
                </p>
              </div>
              <div>
                <button type="submit">
                  <strong>Add</strong>
                </button>
                <a href="#">Cancel</a>
              </div>
            </form>
        </div>

      </div>
    );
  }
}

export default Relay.createContainer(PostList, {
  initialVariables: {
    first: 5
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        id
        people(first: 10){
          edges{
            node{
              id
              firstName
              lastName
              email
            }
          }
        }

        posts(first: $first){
          edges{
            node{
              id
              ${Post.getFragment('post')}
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
