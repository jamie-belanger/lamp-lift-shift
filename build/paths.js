const path = require("path");

module.exports = {
    // The base path of your source files, especially of your index.js
    SRC: path.resolve(__dirname, "..", "site"),

    // The path to put the generated bundle(s)
    DIST: path.resolve(__dirname, "..", "dist"),

    /*
  This is your public path.
  If you're running your app at http://example.com and I got your DIST folder right,
  it'll simply be "/dist".
  But if you're running it locally at http://localhost/my/app, it will be "/my/app/dist".
  
  That means you should probably *not* hardcode that path here but write it to a
  machine-related config file. (If you don't already have something like that,
  google for "dotenv" or something similar.)
  */
    ASSETS: "/dist",
};
