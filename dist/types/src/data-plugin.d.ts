import { APIOperations, CommerceAPIOperations } from '@builder.io/plugin-tools';
interface DataPluginConfig extends APIOperations {
    name: string;
    icon: string;
}
export declare const getDataConfig: (service: CommerceAPIOperations) => DataPluginConfig;
export {};
