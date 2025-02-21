"use client";

import { gql, TypedDocumentNode } from "@apollo/client";


export const ACTIVATION_RESTAURANT: TypedDocumentNode = gql`
    mutation ActivateRestaurant($token: String!, $code: String!) {
        activateRestaurant(
            token: $token
            code: $code
        ) {
            message
            error {
                code
                message
            }
        }
    }
`

