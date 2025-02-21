import { TypedDocumentNode, gql } from "@apollo/client";

export const DELETE_FOOD: TypedDocumentNode = gql`
  mutation DeleteFood($id: String!) {
    deleteFoodById(id: $id) {
      success
      message
    }
  }
`;
