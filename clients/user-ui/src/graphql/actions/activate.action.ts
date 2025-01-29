"use client";

import { gql, TypedDocumentNode } from "@apollo/client";

export const ACTIVATE_USER:TypedDocumentNode = gql`
  mutation ActivateUser($activationToken: String!, $activationCode: String!) {
    activateUser(
      activationDto: {
        activationToken: $activationToken
        activationCode: $activationCode
      }
    ) {
      message
    }
  }
`;
