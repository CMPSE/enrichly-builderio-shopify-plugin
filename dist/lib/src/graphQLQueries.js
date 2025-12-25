"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_SEARCH_QUERY = `
query searchProducts($query: String!, $first: Int, $productFilters: [ProductFilter!]) {
    search(query: $query, first: $first, types: PRODUCT, productFilters: $productFilters) {
        totalCount
        nodes {
            ... on Product {
                id
                title
                vendor
                handle
                description
                featuredImage {
                    altText
                    url
                    height
                    width
                }
                images(first: 5) {
                    edges {
                        node {
                            id
                            url
                            altText
                            height
                            width
                            originalSrc
                            src
                            transformedSrc
                        }
                    }
                }
            }
        }
        pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        }
    }
}
`;
//# sourceMappingURL=graphQLQueries.js.map