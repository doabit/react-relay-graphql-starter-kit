// import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import {createHashHistory} from 'history';
import {IndexRoute, Route} from 'react-router';
import {RelayRouter} from 'react-router-relay';

import App from './components/App';
import About from './components/About';
import People from './components/People';
import Person from './components/Person';
import Posts from './components/Posts';
import Post from './components/Post';

import NoMatch from './components/NoMatch';

import StoreQueries from './queries/StoreQueries';

const PersonQueries = {
  person: () => Relay.QL`query { node(id: $id) }`
};

const PostQueries = {
  post: () => Relay.QL`query { node(id: $id) }`
};

ReactDOM.render(
  <RelayRouter history={createHashHistory({queryKey: false})}>
    <Route
      path="/" component={App}>
      <IndexRoute
        component={People}
        queries={StoreQueries}
      />
      <Route
        path="/people"
        component={People}
        queries={StoreQueries}
      />
      <Route
        path="/people/:id"
        component={Person}
        queries={PersonQueries}
      />
      <Route
        path="/posts"
        component={Posts}
        queries={StoreQueries}
      />
      <Route
        path="/posts/:id"
        component={Post}
        queries={PostQueries}
      />
      <Route path="/about" component={About}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </RelayRouter>,
  document.getElementById('root')
);