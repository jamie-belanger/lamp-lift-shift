# 🪄 Composer
Composer is a PHP package manager that I use in some sites.

See: https://getcomposer.org/

But I don't have PHP installed on my dev machine, and don't really want to either. Yes, you can "install" any library by grabbing source and dumping it into the **vendor** folder (or anywhere else really). I originally did that with some dependencies... but as soon as you want a library that depends on another, you're setting yourself up for pain. Composer unravels those dependency chains for you.

To get around installing PHP and Composer on my machine, I dug around and found that someone already shoved it into a Docker container. So these instructions are a walkthrough on how to install and update dependencies via Composer inside a Docker container.

**NOTE:** This is not something that will have to be run very often; just when you need to add or update a dependency.


## Running the container
The container can be executed with this command (on Linux / WSL2 Ubuntu prompt):
```bash
cd site/libraries
docker run --rm --interactive --tty --volume $PWD:/app --user $(id -u):$(id -g) composer/composer install
```

What this does is map the current directory (`$PWD`) and invoke the install command inside the container. That should dump all the composer output into the current directory. So it's important that you first change into **THIS DIRECTORY** before running. The user bit ensures that you're running as yourself inside the container.

For now, you can manually update the `composer.json` file, then delete the `composer.lock` file, and re-run the above to get any new dependencies. Or use the provided shell script to simplify it further. There's more functionality which I haven't played with yet. Supposedly you can replace the last word with `update` and composer will attempt to update the packages and their dependencies, accomplishing the same thing but more efficiently.


## Including the vendor libraries
This can be done with a single PHP line:
```php
require_once "/libraries/vendor/autoload.php";
```
This script, built by Composer, handles including all the PHP libraries it has installed.


> **NOTE**
> 
> The provided `Dockerfile` does NOT run composer during the build process. It just copies the vendor libraries directly into the container.
