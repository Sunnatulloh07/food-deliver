import { DocumentNode, gql } from "@apollo/client";

export const GET_LOGGED_IN_USER: DocumentNode = gql`
  query {
    getLoggedInUser {
      user {
        id
        name
        email
        address
        password
        avatar {
          public_id
          url
        }
      }
      accessToken
      refreshToken
    }
  }
`;
