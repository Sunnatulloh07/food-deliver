

// Food Create action
import { gql, TypedDocumentNode } from "@apollo/client"

export const FOODS_CREATE: TypedDocumentNode = gql`
   mutation CreateFood(
    $name: String!,
    $description: String!,
    $price: Float!,
    $estimatedPrice: Float,
    $category: String!,
    $images: [String!]!
) {
    createFoods(createFoodDto: {
        name: $name,
        description: $description,
        price: $price,
        estimatedPrice: $estimatedPrice,
        category: $category,
        images: $images,
    }) {
        success
        message
    }
}
`
