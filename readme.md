# LAMP Lift and Shift
A helper project I created to make it easier to lift and shift legacy PHP sites into Docker containers. But note that this can create some problems due to the PHP and Apache versions in this project being up to date, while the code I put into the container typically is not. So far the improved developer experience of using this container has more than made up for that. Just be aware that shoving old PHP sites into this will not always be a smooth update.


## 🐋 Docker
There are two files provided. `Dockerfile` defines how to build a container for the site / app. This uses a common PHP/Apache base image and installs extensions required by most sites, then copies the website code into the image.

### (Re)Building The Site
The first thing you have to do is build a local container to run. To (re)build the container, run the following:
```bash
docker compose build
```
If you have any weird problems and want to ensure that you are building a fresh container, add `--no-cache` to the end:
```bash
docker compose build --no-cache
```

### Running the App
The `docker-compose.yml` file can then launch that container image along with a recent copy of MySQL for the database. The compose file includes some basic passwords that are only suitable for local usage.

```bash
docker compose up -d
```
> **NOTE**
> the `-d` ... it runs the containers in daemon mode (headless). If you do not include this, the containers will dump all their log and debug data into your console. You can still access the logs inside the containers using the `docker logs` command (or Docker Desktop).

Once the containers are running, you can access:
 * The Site / Application at http://localhost:8080
 * MySQL application at http://localhost:33060

If either port conflicts with what's on your machine, just update the port mapping in the compose yaml file.

> **NOTE 2**
> If this is your first time running (or you just deleted the MySQL volume), it might take a few seconds for the database seed to run. So don't panic if you immediately surf to the site and get an error.
> 
> You can check the status with `docker logs lamp-lift-shift-mysite-mydb-1` and wait until you see a line saying something like "/usr/sbin/mysqld: ready for connections"


### Error Logs
Not only does this setup allow you to develop in real-time (edit any PHP/JS/CSS file in the site folder and reload), but you will also get PHP errors in real-time as well. They get dumped into the `error.log` file in the root folder. There is also an `access.log` file that shows the incoming connections, in case you want to be sure you're hitting the pages.


### Managing the Database
While you're certainly welcome to remote into the MySQL container and manually inspect or manipulate the data from the command line, it's probably going to be a lot less annoying to install something like [MySQL Workbench](https://www.mysql.com/products/workbench/) or [DBeaver](https://dbeaver.io/).

The former is great for its support of every MySQL feature; the latter is great as a cross-database tool, if you manage multiple projects. Just install either, and point it at the localhost address above (don't forget the 33060 in the Port field of the connection).

> ⚠️ **WARNING** ⚠️
> I wasn't able to get DBeaver to connect at all. It threw some kind of public key encryption error. This *may* have been due to enhanced security when running it under Linux. Your mileage may vary, but I recommend sticking to MySQL Workbench.

Use the credentials defined in the `mydb` section of the docker compose file. The "Root" password is great if you need to modify users, but most database work should be handled with the "mradmin" user.


### Rebuilding the Database
The data should persist inside the Docker volume defined in the compose file. But if you want to blow that away and get a fresh database, then delete the volume with this command:
```bash
docker volume rm mysite_mysql
```

The seed files in the root of the `/database` folder will be used to recreate the database automatically the next time you start the container.


### Stopping the App
When you are done working, or want to do a clean restart, bring down the application and the MySQL container with:
```bash
docker compose down
```
If you forget to do this at the end of the day, well, the containers will just keep running. It's not a big deal unless you turn your computer off every day, in which case you will very likely end up with corrupted SQL data inside the volume, and might have to rebuild the database (see section above).


----
# 📦️ Webpack
To test the production webpack build, you will first have to ensure you have `npm` installed on your dev machine. Start by installing an appropriate package from here: https://nodejs.org/en/download

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


