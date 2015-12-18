import {IndexLink, Link} from 'react-router';
import React from 'react';
import Relay from 'react-relay';


class People extends React.Component {
  render() {
    return (
      <div>
        <h1>Post list</h1>
        <ul>
          {this.props.store.people.map(person =>
             <li key={person.id}>
                <Link to={`/people/${person.id}`}>{person.firstName}</Link>
             </li>
          )}
        </ul>
      </div>
    );
  }
}

export default Relay.createContainer(People, {
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