import { DocumentNode, gql } from "@apollo/client";

export const RESET_PASSWORD: DocumentNode = gql`
  mutation ResetPassword(
    $token: String!
    $password: String!
  ) {
    resetPassword(resetPasswordDto: {
      token: $token,
      password: $password
    }) {
      message
    }
  }
`;

