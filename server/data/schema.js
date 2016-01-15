import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
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
  offsetToCursor,
  cursorForObjectInConnection,
  // connectionFromArray,
  connectionFromPromisedArray,
  mutationWithClientMutationId
} from 'graphql-relay';


import {
  getArrayData,
  getModelsByClass,
  resolveArrayByClass,
  resolveArrayData,
  resolveModelsByClass
} from './methods';

const _ = require('lodash');

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    switch (type) {
      case 'Person':
        return Person.findById(id);
      case 'Post':
        return Post.findById(id);
      case 'Store':
        return store;
      default:
        return null;
    }
  },
  (obj) => {
    if (obj instanceof Person.Instance) {
      return PersonType;
    } else if (obj instanceof Post.Instance)  {
      return PostType;
    } else if (obj instanceof Store)  {
      return StoreType;
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
        type: postConnection,
        args: connectionArgs,
        resolve: (person, args) => {
          return connectionFromPromisedArray(
            resolveArrayData(person.getPosts(), true), args
          )
        }
      }
      // posts: {
      //   type: new GraphQLList(PostType),
      //   resolve(person) {
      //     console.log(person)
      //     return person.getPosts()
      //   }
      // }
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
          // return Person.findById(post.personId)
          return post.getPerson();
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
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField("Store"),
    people: {
      type: personConnection,
      args: connectionArgs,
      resolve: (root, args) => {
        return connectionFromPromisedArray(
          resolveArrayData(Person.findAll(), true), args
        )
      }
    },
    posts: {
      type: postConnection,
      args: connectionArgs,
      resolve: (_, args) => {
        return connectionFromPromisedArray(
          resolveArrayData(Post.findAll(), true), args
        )
      }
    }
  }),
});

class Store {}
// Mock data
let store = new Store();

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


const createPostMutation = mutationWithClientMutationId({
  name: 'CreatePost',

  inputFields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    person: { type: new GraphQLNonNull(GraphQLString) },
  },

  // outputFields: {
  //   postEdge: {
  //     type: postEdge,
  //     resolve: ({obj}) => {
  //       console.log("obj")
  //
  //        // return { node: obj.ops[0], cursor: obj.insertedId }
  //     }
  //   },
  //   store: {
  //     type: StoreType,
  //     resolve: () => store
  //   }
  // },

  outputFields: {
    postEdge: {
      type: postEdge,
      resolve: ({newPost, cursor}) => {
        return {
          cursor,
          node: newPost
        }
        // return Post.findAll()
        // .then(posts => {
        //   return {
        //     cursor,
        //     node: newPost
        //   }
        // })
      }
    },
    store: {
      type: StoreType,
      resolve: () => store
    }
  },

  mutateAndGetPayload: ({title, content, person}) => {
    const {type, id} = fromGlobalId(person);
    return Post.create({title: title, content: content, personId: id})
    .then(newPost => {
      return Post.findAll().then(posts => {
        return {
          newPost,
          cursor: offsetToCursor(
            _.findIndex(posts, post => post.id === newPost.id)
          )
        }
      })
    })
 }

  // mutateAndGetPayload: ({title, content}) => {
    // console.log(title);
    // Post.create({
    //   personId: 1,
    //   title: title,
    //   content: content
    // }).then( post =>{
    //   console.log(post.id);
    //   return {post};
    // });
    // let localPostId = post.id
    // return {localPostId}
    // return db.collection("links").insertOne({
    //   title,
    //   content,
    //   createdAt: Date.now()
    // });
  // }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      createPost: createPostMutation
    })
  })
});

export default Schema;
