"use client";

import { gql, TypedDocumentNode } from "@apollo/client";


export const LOGIN_RESTAURANT: TypedDocumentNode = gql`
    mutation LoginRestaurant($email: String!, $password: String!) {
        loginRestaurant(loginDto: {
            email: $email
            password: $password
        }) {
            restaurant {
                id
                name
                country
                city
                region
                phone_number
                email
                createdAt
                updatedAt
                picture {
                    public_id
                    url
                }
            }
            error {
                message
            }
        }
    }
`

