import webpack from 'webpack';
import config from '../webpack.config';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import Schema from './data/schema';
import { graphql } from 'graphql';

const APP_PORT = 3000;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  hot: true,
  contentBase: './public',
  historyApiFallback: true
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static('public'));

app.use('/graphql', graphQLHTTP({
  schema: Schema,
  graphiql: true
}));

app.listen(APP_PORT, (err2) => {
  if(err2) {
    throw err2;
  }
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
