# 📦️ Webpack
Webpack is used to concatenate and minify Javascript and CSS styles.

## Configuring Scripts and Styles
Now you'll want to configure how these are built and included in your app. I typically have two types of scripts to deal with:

1. Libraries like jQuery
1. Site-specific code

For the first, I prefer to just concatenate and minify them in the final build into a single "vendor" file. For the latter, I prefer minifying them into a "core" file. This is the way I set up Webpack, but you are free to do as you please here.

If you look at the `/build/config.base.js` file, you'll see a lot of comments explaining various sections. I'll highlight a few config approaches I typically take.

In all cases, the output will be in a top-level folder named `/dist` that gets copied into the container during the build.


### Option 1: Packing Files
The first section of the file is for basic Webpack-ing files using the `index.js` files in the `/scripts` and `/styles` folders. This is set up to read the import statements in those files, and any files it pulls in will be minified, stripped of comments, and tree-shaken.

> **⚠️WARNING⚠️**
> 
> Note that last part in particular, because my old code simply was not written with modern Ecmascript modules in mind. So nearly all of it was tree-shook out and I was left with a woefully broken website.

If you want to use this route, there are two basic examples in this file:

```js
mysiteCore: path.resolve(SRC, "scripts", "index.js"),
mysiteStyles: path.resolve(SRC, "styles", "index.js"),
```

### Option 2: Merging Files
Another option I tend to use more often is simple concatenation. This is especially useful if you have code from vendors that is already minified. Note that this will still strip out comments and if the code is not already minified, it will be after going through this (but with all symbols intact and no tree-shaking).

```js
"mysiteCore.js": [
    path.resolve(SRC, "scripts", 'Common.js'),
    path.resolve(SRC, "scripts", 'CommonIO.js'),
    path.resolve(SRC, "scripts", 'WebLinks.js'),
    path.resolve(SRC, "scripts", 'WebLinks_Import.js'),
    path.resolve(SRC, "scripts", 'LLInfobar.js'),
    path.resolve(SRC, "scripts", 'LLMenu.js'),
],
"mysiteVendorCore.css": [
    path.resolve(SRC, "styles", "vendor", "bootstrap.min.css"),
    path.resolve(SRC, "styles", "vendor", "bootstrap-icons.min.css")
]
```

This config will produce two files: `mysiteCore.js` and `mysiteVendorCore.css`. You can make similar sections for any other bundles you want, which can be useful if you want vendor code in another file or if the bundles are just too big and need splitting.

### Option 3: Copying Files
Sometimes you want to copy files as-is to the output directory. The bottom of the plugins section has an example for doing this:

```js
new CopyPlugin({
    patterns: [
        {
            from: path.resolve(SRC, "styles", "vendor", "fonts"),
            to: path.resolve(DIST, "fonts")
        }
    ]
}),
```
While this example shows how to move fonts over (or technically anything in the `/styles/vendor/fonts/` folder), you can easily use this for any files (images, script files, etc). Just keep in mind that the entire site structure will be copied into the container as-is, so technically you'd be duplicating files.




## Testing Production Build
You can, technically, just build the Docker container and test the output. I find this takes too long though. To test the production webpack build more easily, you will first have to ensure you have `npm` installed on your dev machine. Start by installing an appropriate package from here: https://nodejs.org/en/download

Next you have to install required webpack items. These are all the dependencies listed in the `package.json` file. To install them, open a command prompt in the root of this project and type this:
```bash
npm i
```
It should work a while and download a few thousand files into a `.node_modules` folder (which, thankfully, is git-ignored).

When it completes, you are ready to run the webpack build:
```bash
npm run prod
```
This uses a script defined in the `package.json` file.

If that completes without any errors, you're ready to run the app. Compose down if you have not already, and then make the following modifications to the `docker-compose.yml` file:

1. Volumes
   1. UN-comment the three lines under **WEBPACK** comment, which lets you see log messages and overrides the `\dist` folder with a link to local versions
1. Environment
   1. Comment out the `- DEBUG=1` line. That will tell the container to use the webpack versions of the assets.
1. (optional) `docker compose build` if you haven't in a while (or if you changed PHP)
1. `docker compose up -d` to run the application.

At this point, open the dev tools with `F12` and you'll see script and style files being pulled from the `/dist` folder. You can now re-run the `npm run prod` build step whenever you want, and will see the updated assets locally.

