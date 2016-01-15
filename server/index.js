import express from 'express';
import graphQLHTTP from 'express-graphql';
import Schema from './data/schema';
import { graphql } from 'graphql';

const APP_PORT = 3000;
const app = express();

app.use(express.static('public'));

app.use('/graphql', graphQLHTTP({
  schema: Schema,
  graphiql: true
}));

app.listen(APP_PORT, (err) => {
  if(err) {
    throw err;
  }
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
