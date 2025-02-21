"use client";

import { gql, TypedDocumentNode } from "@apollo/client";


export const REGISTER_RESTAURANT: TypedDocumentNode = gql`
    mutation RegisterRestaurant(
        $name: String!,
        $country: String!,
        $city: String!,
        $region: String!,
        $phone_number: Float!,
        $email: String!,
        $password: String!
        $picture: PictureInput!
    ) {
        registerRestaurant(restaurantDto: {
            name: $name,
            country: $country,
            city: $city,
            region: $region,
            phone_number: $phone_number,
            email: $email,
            password: $password,
            picture: $picture
        }) {
            message
            error {
                code
                message
            }
        }
    }
`
