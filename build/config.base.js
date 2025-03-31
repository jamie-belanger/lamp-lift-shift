const path = require("path");
const { SRC, DIST } = require("./paths");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        // Each entry point defined here will be another script file.
        // You can add more if you need to split the resulting code files in the production build.
        // Here's two examples of how to accomplish this:

        // First we'll make a master script file using the /site/scripts/index.js entry point
        // WARNING: This will likely tree-shake most or all code out if you haven't updated it to ES6
        //          modules! If you're pasting old vanilla JS into this repo, you'll be better off
        //          adding this manually down below (see MergeIntoSingleFilePlugin, below)
        //
        mysiteCore: path.resolve(SRC, "scripts", "index.js"),
        // This will be built as /dist/mysiteCore.js
        // It's up to you to include the correct version in your site's code

        // And a similar approach for packing CSS styles:
        mysiteStyles: path.resolve(SRC, "styles", "index.js"),
        // Adding additional lines follows the same syntax as above
    },
    plugins: [
        // Plugin to minify the CSS styles
        new MiniCssExtractPlugin(),

        // MergeIntoSingleFilePlugin lets us basically concatenate all the pre-minified vendor libraries
        // without letting webpack process them (which will fail anyway). This also lets us have full control
        // over how we merge them.
        // Be cafeul here in general... remember these are concatenating, so the order of inclusion matters
        // when you have dependencies (like Bootstrap requiring Popper, so Popper should be listed first).
        new MergeIntoSingleFilePlugin({
            files: {
                // Example "vendor core" library:
                // "mysiteVendorCore.js": [
                //     path.resolve(SRC, "scripts", "vendor", "popper.min.js"),
                //     path.resolve(SRC, "scripts", "vendor", "jquery.min.js"),
                //     path.resolve(SRC, "scripts", "vendor", "bootstrap.bundle.min.js"),
                //     path.resolve(SRC, "scripts", "vendor", "bootstrap-select.min.js")
                // ],

                // And you can do the same with minified CSS:
                // "mysiteVendorCore.css": [
                //     path.resolve(SRC, "styles", "vendor", "bootstrap.min.css"),
                //     path.resolve(SRC, "styles", "vendor", "bootstrap-icons.min.css")
                // ]
            }
        }),

        // Copy plugin literally copies files to the dist folder. Useful when you have fonts,
        // but can also be used with pre-minified JS/CSS if you'd rather do that than concatenate them.
        // new CopyPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(SRC, "styles", "vendor", "fonts"),
        //             to: path.resolve(DIST, "fonts")
        //         }
        //     ]
        // }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader", options: { url: false } }
                ],
            }
        ],
    },
    optimization: {
        minimizer: [`...`, new CssMinimizerPlugin()],
    },
    output: {
        // Put all the bundled stuff in your dist folder
        path: DIST,

        // The output path as seen from the domain we're visiting in the browser
        publicPath: DIST,
    },
};
