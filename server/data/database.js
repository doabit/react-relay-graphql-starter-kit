import Sequelize from 'sequelize';
import path from 'path';

const Conn = new Sequelize('development', null, null, {
    dialect: 'sqlite',
    storage:  path.join(__dirname, '../../data/development.sqlite')
});

const Person = Conn.define('person', {
  // type: {
  //   type: new Sequelize.VIRTUAL(Sequelize.STRING),
  //   get() {
  //     return 'Person';
  //   }
  // },
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
  // type: {
  //   type: new Sequelize.VIRTUAL(Sequelize.STRING),
  //   get() {
  //     return 'Post';
  //   }
  // },
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

module.exports = {
   Conn, Person, Post
};
