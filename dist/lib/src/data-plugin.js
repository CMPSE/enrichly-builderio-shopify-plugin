"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_context_1 = require("@builder.io/app-context");
const package_json_1 = require("../package.json");
const buildPath = ({ resource, resourceId, }) => {
    if (resourceId) {
        return `${resource}/${resourceId}`;
    }
    else {
        switch (resource) {
            case 'collection':
                // we have a unified collection search endpoint
                return `search/collection`;
            case 'product':
                return `search/product`;
        }
    }
};
const buildShopifyUrl = ({ resource, resourceId, query, first, }) => {
    const base = `${app_context_1.default.config.apiRoot()}/api/v1/shopify/storefront`;
    const path = buildPath({ resource, resourceId });
    const search = new URLSearchParams({
        pluginId: package_json_1.default.name,
        apiKey: app_context_1.default.user.apiKey,
        query: query ? `title:*${query}*` : '',
        first: (first || 20).toString(),
        sortKey: 'TITLE',
    });
    return `${base}/${path}?${search}`;
};
const RESOURCE_TYPES = [
    {
        name: 'Product',
        id: 'product',
        description: 'All of your Shopify custom app products.',
    },
    {
        name: 'Collection',
        id: 'collection',
        description: 'All of your Shopify custom app products.',
    },
];
exports.getDataConfig = (service) => {
    return {
        name: 'Shopify',
        icon: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fc9156e9ba658458db6fcad3f101773c7',
        getResourceTypes: async () => RESOURCE_TYPES.map((model) => ({
            ...model,
            inputs: () => [
                {
                    friendlyName: 'limit',
                    name: 'first',
                    type: 'number',
                    defaultValue: 10,
                    max: 60,
                    min: 0,
                },
                { friendlyName: 'Search', name: 'query', type: 'string' },
            ],
            toUrl: ({ entry, query, first }) => buildShopifyUrl({
                query,
                first,
                resource: model.id,
                resourceId: entry,
            }),
            canPickEntries: true,
        })),
        getEntriesByResourceType: async (resourceTypeId, options = {}) => {
            const entry = options.resourceEntryId;
            if (entry) {
                const entryObj = await service[resourceTypeId].findById(entry);
                return [
                    {
                        id: String(entryObj.id),
                        name: entryObj.title,
                    },
                ];
            }
            const response = await service[resourceTypeId].search(options.searchText || '');
            return response.map(result => ({
                id: String(result.id),
                name: result.title,
            }));
        },
    };
};
//# sourceMappingURL=data-plugin.js.map