import {IndexLink, Link} from 'react-router';
import React from 'react';
import Relay from 'react-relay';


class People extends React.Component {
  render() {
    var currentNumber = this.props.relay.variables.limit;
    var buttonStyle = {};
    if (!this.props.store.people.pageInfo.hasNextPage) {
      buttonStyle.display = 'none';
    }

    return (
      <div>
        <h1>People list</h1>
        <ul>
          {this.props.store.people.edges.map(edge =>
             <li key={edge.node.id}>
                <Link to={`/people/${edge.node.id}`}>{edge.node.firstName}</Link>
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

export default Relay.createContainer(People, {
  initialVariables: {
    limit: 5
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        people(first: $limit){
          edges{
            node{
              id
              firstName
              lastName
              email
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
