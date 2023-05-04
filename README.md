![Rijksmuseum Plugin Icon](/Artwork/Icon.png)


# Rijksmuseum Gallery
### Figma Plugin
Sometimes you just want to get some inspiration and what's better than going to the museum? Well, letting the museum come to you! With this plugin you can view some of the masterpieces in the Rijksmuseum, in Amsterdam, right inside your design tools. So if you're just in need of some inspiration or if you think your designs belong in the museum, run the plugin and import some art!


### Features
* Importing artpieces into Figma/Figjam
* Filtering on toppieces / on display
* Show/Hide frame
* Show/Hide captions
* Free-form text search

### Known issues
* Plugin can eat up a lot of memory, if it happens, restart figma
* With free-form text search, the plugin will always return the first result (highest relevancy)


## Development
### Running locally
* Make a branch or copy the codebase locally
* Run `yarn` to install dependencies.
* Run `yarn build:watch` to start webpack in watch mode.
* Open `Figma` -> `Plugins` -> `Development` -> `Import plugin from manifest...` and choose `manifest.json` file from this repo.

### Making changes
* To change the UI of your plugin (the react code), start editing [App.tsx](./src/app/components/App.tsx).  
* To interact with the Figma API edit [controller.ts](./src/plugin/controller.ts).  
* Read more on the [Figma API Overview](https://www.figma.com/plugin-docs/api/api-overview/).


## Credits
Made possible by the Rijksmuseum and their open [Rijksdata API](https://data.rijksmuseum.nl/object-metadata/api/)
