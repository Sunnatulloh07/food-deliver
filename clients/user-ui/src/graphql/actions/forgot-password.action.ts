import { DocumentNode, gql } from "@apollo/client";

export const FORGOT_PASSWORD: DocumentNode = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(
      forgotPasswordDto: { email: $email }
    ) {
      message
    }
  }
`;
