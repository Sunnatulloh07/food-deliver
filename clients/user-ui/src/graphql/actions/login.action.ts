"use client";

import { gql, TypedDocumentNode } from "@apollo/client";

export const LOGIN_USER:TypedDocumentNode = gql`
  mutation Login(
    $email: String!
    $password: String!
  ) {
    login(loginDto: {
      email: $email
      password: $password
    }) {
    user {
        name
        email
        phone_number
        address
        role
    }
    accessToken
    refreshToken
    }
  }
`;
