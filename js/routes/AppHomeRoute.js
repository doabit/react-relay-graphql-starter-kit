import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    store: () => Relay.QL`
      query {
        store
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}