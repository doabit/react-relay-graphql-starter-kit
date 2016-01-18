import React from 'react';
import Relay from 'react-relay';

class PersonShow extends React.Component {
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

export default Relay.createContainer(PersonShow, {
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
