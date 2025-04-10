# Usage of the LAMP Lift and Shift Repo
This file is a basic TODO for recommended steps to using this repository.


## Fork It And Customize
Start by forking this repository. Then you can handle some simple customizations:

Search for `mysite`. You'll probably want to change this name in many places to make it easier to find your container and site later. While you *can* change it everywhere to whatever you want, you can also opt to leave some of the internal names as-is and just change the public name of the container image in `docker-compose.yml` (change the first three matches = service name, container name, image name).


## Copy Files In
### Static Pages and favicon
Import any static pages you have and overwrite the `favicon.ico` file with something more appropriate.

### PHP Scripts
You can put these anywhere under the `/site` folder, really.

### Composer
If you have external libraries you want to manage with composer, then set those up. More instructions are in the `composer.md` file in this folder.

### JavaScript and CSS
Now copy your Javascript files into the `/site/scripts` folder. Note that I did *not* set up this repository to handle Typescript (because I just wanted to lift-and-shift, not rewrite my old code). Update the included `index.js` file to import the files you want in your core Webpack file.

Copy CSS style sheets into the `/site/styles` folder. Update the included `index.js` file to import the sheets.

See [webpack.md](./webpack.md) for more instructions.


## Database
If you want to use the database in the compose file, then you can seed it by adding SQL files to the `/database` folder. Any scripts in there will be imported by MySQL automatically.

See [database.md](./database.md) for more instructions.



## Compose Up
Make any changes you like to the environment variables in `docker-compose.yml`. Note that these are just going to affect your local copy. If you want to use this compose file on your server, you can, but just be careful with the variables and how you deploy them.

Use Docker to run the site. The basic DX provided gives you a local database container, live reloading, and easy access to log files.


### Updating Site
Finally, update your site's code to include the new Javascript and CSS pages, as well as any other structural changes you need to handle other PHP pages and composer includes.

I typically have all my JS and CSS includes done from a single header file, which makes it easy to manage. Here's a typical example that also shows how I toggle between Dev and Production includes:
```php
<?php 
if ((getenv("DEBUG") ?? 0) == 1) {
?>
   <link rel="stylesheet" href="/styles/Weblinks.css">
   <link rel="stylesheet" href="/styles/Common.css">
   <link rel="stylesheet" href="/styles/messi.css">
   <link rel="stylesheet" href="/styles/LLInfobar.css">
   <link rel="stylesheet" href="/styles/LLMenu.css">
   <script src="/scripts/jquery.min.js"></script>
   <script src="/scripts/jquery.md5.min.js"></script>
   <script src="/scripts/jquery.cookie.min.js"></script>
   <script src="/scripts/masonry.pkgd.min.js"></script>
   <script src="/scripts/messi.min.js"></script>
   <script src="/scripts/Common.js"></script>
   <script src="/scripts/CommonIO.js"></script>
   <script src="/scripts/WebLinks.js"></script>
   <script src="/scripts/WebLinks_Import.js"></script>
   <script src="/scripts/LLInfobar.js"></script>
   <script src="/scripts/LLMenu.js"></script>
<?php
} else { // Production, so load the webpacked scripts

    $appVersion = "?v=". getenv("APP_VERSION") ?? gmdate("Y-m-d");
?>
    <link rel="stylesheet" href="/dist/mysiteStyles.css<?php echo $appVersion ?>">
    <script src="/dist/mysiteVendorCore.js<?php echo $appVersion ?>"></script>
    <script src="/dist/mysiteCore.js<?php echo $appVersion ?>"></script>
<?php
}
```
In my case, I have all the raw scripts included as-is for dev builds, which makes it pretty easy to tweak the site with live reloading. When it comes to the production container, I've got all my CSS crammed into one file and all JS split across two. All three files are minified and optimized by Webpack.

