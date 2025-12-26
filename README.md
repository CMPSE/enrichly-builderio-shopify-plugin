# Builder.io Shopify plugin

Easily connect your Shopify data to your Builder.io content!

## Testing the plugin

1. Start the plugin with `npm run start`
2. Because the Builder.io only accepts plugins served via `https`, use ngrok to create a tunnel to the plugin running locally: `ngrok http http://localhost:1268`
3. In the space -> plugin settings paste this link to connect the plugin: `<ngrok-ull>/plugin.system.js?pluginId=@builder.io/plugin-shopify-enrichly` and click "SAVE" **Note: Sometimes the plugin will not load right away. The only solution that works right now is to just wait some time untill the "Edit Plugin Settings" button appears**
4. Set the plugin setings to appropriate values