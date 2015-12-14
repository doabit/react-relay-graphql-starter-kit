import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
} from 'graphql';
import Db from './db';

const Person  = new GraphQLObjectType({
  name: 'Person',
  description: 'This response a Person',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(person) {
          return person.id
        }
      },
      firstName: {
        type: GraphQLString,
        resolve(person) {
          return person.firstName
        }
      },
      lastName: {
        type: GraphQLString,
        resolve(person) {
          return person.lastName
        }
      },
      email: {
        type: GraphQLString,
        resolve(person) {
          return person.email
        }
      },
      posts: {
        type: new GraphQLList(Post),
        resolve(person) {
          return person.getPosts()
        }
      }
    };
  }
});


const Post  = new GraphQLObjectType({
  name: 'Post',
  description: 'This response Post',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(post) {
          return post.id
        }
      },
      title: {
        type: GraphQLString,
        resolve(post) {
          return post.title
        }
      },
      content: {
        type: GraphQLString,
        resolve(post) {
          return post.content
        }
      }
    };
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is root query',
  fields: () => {
    return {
      people: {
        type: new GraphQLList(Person),
        args: {
          id: {
            type: GraphQLInt
          },
          email: {
            type: GraphQLString
          }
        },
        resolve(root, args) {
          return Db.models.person.findAll({where: args});
        }
      },
      posts: {
        type: new GraphQLList(Post),
        resolve(root, args) {
          return Db.models.post.findAll({where: args});
        }
      }
    };
  }
});

// // In memory data store
// const TodoStore = [
//   "Learn some GraphQL",
//   "Build a sample app"
// ];
//
// // Root level queries
// const Query = new GraphQLObjectType({
//   name: "Query",
//   fields: () => ({
//     items: {
//       type: new GraphQLList(GraphQLString),
//       description: "List of todo items",
//       resolve() {
//         // close and send
//         return TodoStore.concat([]);
//       }
//     }
//   })
// });

const Schema = new GraphQLSchema({
  query: Query
});

export default Schema;
