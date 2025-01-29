"use client";

import { gql, TypedDocumentNode } from "@apollo/client";

export const REGISTER_USER: TypedDocumentNode = gql`
  mutation RegisterUser(
    $name: String!
    $email: String!
    $password: String!
    $phone_number: Float!
  ) {
    register(registerDto:{
        name: $name,
        email: $email,
        password: $password, 
        phone_number: $phone_number, 
    } ) {
        activation_token
    }
  }
`;
