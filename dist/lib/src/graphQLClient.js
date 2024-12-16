"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplifyImages = exports.executeGraphQLQuery = void 0;
exports.executeGraphQLQuery = async (storeUrl, storeToken, apiVersion, query, variables = {}) => {
    let apiUrl = `https://${storeUrl}/api/${apiVersion}/graphql.json`;
    const response = await fetch(apiUrl, {
        body: JSON.stringify({
            query: query,
            variables: variables,
        }),
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': storeToken
        },
        method: 'POST',
    });
    let responseBody = await response.json();
    let code = response.status;
    // throw error if occurred
    if (!response.ok) {
        console.error(`Storefront api graphql query failed with code ${code}`);
        return;
    }
    return responseBody;
};
exports.simplifyImages = (products) => {
    return products.map((product) => ({
        ...product,
        images: product.images.edges.map((edge) => edge.node ?? {}),
    }));
};
//# sourceMappingURL=graphQLClient.js.map