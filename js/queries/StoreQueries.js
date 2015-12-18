import Relay from 'react-relay';

export default {
  store: () => Relay.QL`query { store }`,
};