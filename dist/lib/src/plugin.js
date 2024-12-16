"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_tools_1 = require("@builder.io/plugin-tools");
const shopify_buy_1 = require("shopify-buy");
const package_json_1 = require("../package.json");
const app_context_1 = require("@builder.io/app-context");
const data_plugin_1 = require("./data-plugin");
const graphQLClient_1 = require("./graphQLClient");
const graphQLQueries_1 = require("./graphQLQueries");
plugin_tools_1.registerCommercePlugin({
    name: "Shopify Enrichly",
    // should always match package.json package name
    id: package_json_1.default.name,
    settings: [
        {
            name: "storefrontAccessToken",
            type: "string",
            helperText: "Required to fetch storefront product data",
            required: true,
        },
        {
            name: "storeDomain",
            type: "text",
            helperText: 'Your entire store domain, such as "your-store.myshopify.com"',
            required: true,
        },
        {
            name: "apiVersion",
            type: "text",
            helperText: 'Your Shopify API version, such as "2024-07"',
        },
        {
            name: "organizationIdentifier",
            type: "text",
            helperText: "Organization identifier for selected space",
            required: true,
        },
    ],
    ctaText: "Connect your shopify custom app",
}, async (settings) => {
    const client = shopify_buy_1.default.buildClient({
        storefrontAccessToken: settings.get("storefrontAccessToken"),
        domain: settings.get("storeDomain"),
        apiVersion: settings.get("apiVersion") || "2020-07",
    });
    const service = {
        product: {
            async findById(id) {
                return client.product.fetch(id);
            },
            async findByHandle(handle) {
                return client.product.fetchByHandle(handle);
            },
            async search(search) {
                let results = await graphQLClient_1.executeGraphQLQuery(settings.get("storeDomain"), settings.get("storefrontAccessToken"), settings.get("apiVersion") || "2024-07", graphQLQueries_1.PRODUCT_SEARCH_QUERY, {
                    query: search,
                    first: 250,
                    productFilters: [
                        {
                            productMetafield: {
                                namespace: "custom",
                                key: "organization_" + settings.get("organizationIdentifier"),
                                value: "1",
                            },
                        },
                    ],
                });
                results = graphQLClient_1.simplifyImages(results.data.search.nodes ?? []);
                return Promise.resolve(results);
            },
            getRequestObject(id) {
                return {
                    "@type": "@builder.io/core:Request",
                    request: {
                        url: `${app_context_1.default.config.apiRoot()}/api/v1/shopify/storefront/product/${id}?apiKey=${app_context_1.default.user.apiKey}&pluginId=${package_json_1.default.name}`,
                    },
                    options: {
                        product: id,
                    },
                };
            },
        },
        collection: {
            async findById(id) {
                return client.collection.fetch(id);
            },
            async findByHandle(handle) {
                return client.collection.fetchByHandle(handle);
            },
            async search(search) {
                return client.collection.fetchQuery({
                    query: search ? `title:*${search}*` : "",
                    sortKey: "TITLE",
                });
            },
            getRequestObject(id) {
                return {
                    "@type": "@builder.io/core:Request",
                    request: {
                        url: `${app_context_1.default.config.apiRoot()}/api/v1/shopify/storefront/collection/${id}?apiKey=${app_context_1.default.user.apiKey}&pluginId=${package_json_1.default.name}`,
                    },
                    options: {
                        collection: id,
                    },
                };
            },
        },
    };
    app_context_1.default.registerDataPlugin(data_plugin_1.getDataConfig(service));
    return service;
});
//# sourceMappingURL=plugin.js.map