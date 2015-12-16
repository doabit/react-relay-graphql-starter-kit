import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
} from 'graphql';

import Db from './database';

import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
  connectionFromArray
} from 'graphql-relay';


var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'Person') {
      return Db.models.person.findById(id);
    } else if (type === 'Post') {
      return Db.models.post.findById(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof Person) {
      return PersonType;
    } else if (obj instanceof Post)  {
      return PostType;
    } else {
      return null;
    }
  }
);

const PersonType  = new GraphQLObjectType({
  name: 'Person',
  description: 'This response a Person',
  fields: () => {
    return {
      id: globalIdField('Person'),
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
        type: new GraphQLList(PostType),
        resolve(person) {
          return person.getPosts()
        }
      }
    };
  }
});


const PostType  = new GraphQLObjectType({
  name: 'Post',
  description: 'This response Post',
  interfaces: [nodeInterface],
  fields: () => {
    return {
      id: globalIdField('Post'),
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

const StoreType = new GraphQLObjectType({
  name: 'Store',
  fields: () => ({
    people: {
      type: new GraphQLList(PersonType),
      args: {
          id: {
            type: GraphQLInt
          },
          email: {
            type: GraphQLString
          }
      },
      resolve: (root, args) => Db.models.person.findAll({where: args})
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (root, args) => {
        return Db.models.post.findAll();
      },
    },
  }),
});

const store = {};

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
      store: {
        type: StoreType,
        resolve: () => store,
      },
    },
});

// const Query = new GraphQLObjectType({
//   name: 'Query',
//   description: 'This is root query',
//   fields: () => {
//     return {
//       people: {
//         type: new GraphQLList(Person),
//         args: {
//           id: {
//             type: GraphQLInt
//           },
//           email: {
//             type: GraphQLString
//           }
//         },
//         resolve(root, args) {
//           return Db.models.person.findAll({where: args});
//         }
//       },
//       posts: {
//         type: new GraphQLList(Post),
//         resolve(root, args) {
//           return Db.models.post.findAll({where: args});
//         }
//       }
//     };
//   }
// });

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
