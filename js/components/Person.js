import React from 'react';
import Relay from 'react-relay';

class Person extends React.Component {
  render() {
    const {person} = this.props;
    return (
      <div>
        <h1>Person {person.firstName} {person.lastName}</h1>
        <p>Email: {person.email} </p>
      </div>
    );
  }
}

export default Relay.createContainer(Person, {
  fragments: {
    person: () => Relay.QL`
      fragment on Person {
        id
        firstName
        email
      }
    `,
  }
});