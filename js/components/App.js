import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Post list</h1>
        <ul>
          {this.props.store.people.map(person =>
             <li key={person.id}>{person.firstName} (ID: {person.id})</li>
          )}
        </ul>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        people{
          id
          firstName
          lastName
          email
        }
      }
    `,
  },
});

