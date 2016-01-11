import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
} from 'graphql';

import {
  Post,
  Person
} from './database';

import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
  connectionArgs,
  connectionDefinitions,
  // connectionFromArray,
  connectionFromPromisedArray
} from 'graphql-relay';


import {
  getArrayData,
  getModelsByClass,
  resolveArrayByClass,
  resolveArrayData,
  resolveModelsByClass
} from './methods';

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    switch (type) {
      case 'Person':
        return Person.findById(id);
      case 'Post':
        return Post.findById(id);
      default:
        return null;
    }
  },
  (obj) => {
    if (obj instanceof Person.Instance) {
      return PersonType;
    } else if (obj instanceof Post.Instance)  {
      return PostType;
    } else {
      return null;
    }
  }
);

const PersonType  = new GraphQLObjectType({
  name: 'Person',
  description: 'This response a Person',
  interfaces: [nodeInterface],
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
      },
      person: {
        type: PersonType,
        resolve(post) {
          return post.getPerson()
        }
      }
    };
  }
});

const {
  connectionType: postConnection,
  edgeType: postEdge
} = connectionDefinitions({name: 'Post', nodeType: PostType});

const {
  connectionType: personConnection,
  edgeType: personEdge
} = connectionDefinitions({name: 'Person', nodeType: PersonType});

const StoreType = new GraphQLObjectType({
  name: 'Store',
  fields: () => ({
    people: {
      type: personConnection,
      args: connectionArgs,
      resolve: (root, args) => {
        return connectionFromPromisedArray(
          resolveArrayData(Person.findAll()), args
        )
      }
    },
    posts: {
      type: postConnection,
      args: connectionArgs,
      resolve: (root, args) => {
        return connectionFromPromisedArray(
          resolveArrayData(Post.findAll()), args
        )
      }
    }
  }),
});

export class Store extends Object {}
// Mock data
var store = new Store();

store.id = '1';

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeField,
      store: {
        type: StoreType,
        resolve: () => store,
      },
    },
});


const Schema = new GraphQLSchema({
  query: Query
});

export default Schema;
