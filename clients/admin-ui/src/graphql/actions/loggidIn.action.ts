// GET_LOGGID_IN
import { gql, TypedDocumentNode } from "@apollo/client"

export const GET_LOGGID_IN: TypedDocumentNode = gql`
  query {
    getLoggedInRestaurant {
      restaurant {
        id
        name
        country
        city
        region
        phone_number
        email
        avatar {
          public_id
          url
        }
      }
    }
  }
`
