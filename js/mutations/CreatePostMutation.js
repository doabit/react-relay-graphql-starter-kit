import Relay from "react-relay";

class CreatePostMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`
      mutation { createPost }
    `;
  }

  getVariables() {
    return {
      title: this.props.title,
      content: this.props.content,
      person: this.props.person
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreatePostPayload {
        postEdge
        store { posts }
      }
    `;
  }

  getConfigs() {
    return [
      // {
      //   type: 'FIELDS_CHANGE',
      //   fieldIDs: {
      //     store: this.props.store.id
      //   }
      // },
      {
      type: 'RANGE_ADD',
      parentName: 'store',
      parentID: this.props.store.id,
      connectionName: 'posts',
      edgeName: 'postEdge',
      rangeBehaviors: {
        '': 'prepend',
      },
    }]
  }

  // getOptimisticResponse() {
  //   return {
  //     postEdge: {
  //       node: {
  //         title: this.props.title,
  //         content: this.props.content,
  //       }
  //     },
  //     store: {
  //       id: this.props.store.id
  //     },
  //   }
  // }
}

export default CreatePostMutation;
