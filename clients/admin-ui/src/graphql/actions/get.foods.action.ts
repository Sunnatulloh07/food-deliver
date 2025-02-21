import { TypedDocumentNode, gql } from "@apollo/client";


export const GET_ALL_FOODS:TypedDocumentNode = gql`
    query {
        getRestourantAllFoods {
            success
            data {
                id
                name
                description
                price
                estimatedPrice
                category
                images
                is_active
                restaurant {
                    id
                    name
                    email
                    phone_number
                    city
                    region
                }
                createdAt
                updatedAt
            },
            message
        }
    }
`