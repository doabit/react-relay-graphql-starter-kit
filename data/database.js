import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';
import path from 'path';

const Conn = new Sequelize('development', null, null, {
    dialect: 'sqlite',
    storage:  path.join(__dirname, './development.sqlite')
});

const Person = Conn.define('person', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});

const Post = Conn.define('post', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Person.hasMany(Post);
Post.belongsTo(Person);

// Conn.sync({force: true}).then(() => {
//   _.times(10, (i) => {
//     return Person.create({
//       firstName: Faker.name.firstName(),
//       lastName: Faker.name.lastName(),
//       email: Faker.internet.email()
//     }).then(person => {
//       return person.createPost({
//         title: `Sample title by ${person.firstName}`,
//         content: 'this is content'
//       });
//     });
//   });
// });
// export default Conn;
module.exports = {
   Person, Post
};
