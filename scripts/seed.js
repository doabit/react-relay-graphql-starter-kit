import _ from 'lodash';
import Faker from 'faker';

import { Conn, Post, Person } from '../server/data/database';

Conn.sync({force: true}).then(() => {
  _.times(10, (i) => {
    return Person.create({
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email()
    }).then(person => {
      return person.createPost({
        title: `Sample title by ${person.firstName}`,
        content: 'this is content'
      });
    });
  });
});
