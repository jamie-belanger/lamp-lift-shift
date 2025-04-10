# 🐋 Docker
The provided `Dockerfile` uses a common PHP/Apache base image and installs extensions required by most sites, then copies the website code into the image.

I also took the liberty of adding a few changes to the Apache and PHP config to harden them based on some industry standards and my own personal experience. Configuration of these settings is done via environment variables, which are passed into the Apache config.


## (Re)Building The Site
The first thing you have to do is build a local container to run. To (re)build the container, run the following:
```bash
docker compose build
```

If you have any weird problems and want to ensure that you are building a fresh container, add `--no-cache` to the end:
```bash
docker compose build --no-cache
```


## Running the App
The `docker-compose.yml` file can then launch that container image along with a recent copy of MySQL for the database. The compose file includes some basic passwords that are only suitable for local usage.

```bash
docker compose up -d
```

> **NOTE**
>
> the `-d` ... it runs the containers in daemon mode (headless). If you do not include this, the containers will dump all their log and debug data into your console. You can still access the logs inside the containers using the `docker logs` command (or Docker Desktop).

Once the containers are running, you can access:
 * The Site / Application at http://localhost:8080
 * MySQL application at http://localhost:33060

If either port conflicts with what's on your machine, just update the port mapping in the compose yaml file.

> **NOTE 2**
>
> If this is your first time running (or you just deleted the MySQL volume), it might take a few seconds for the database seed to run. So don't panic if you immediately surf to the site and get an error.
> 
> You can check the status with something like `docker logs lamp-lift-shift-mysite-mydb-1` and wait until you see a line saying something like "/usr/sbin/mysqld: ready for connections"


## Stopping the App
When you are done working, or want to do a clean restart, bring down the application and the MySQL container with:
```bash
docker compose down
```
If you forget to do this at the end of the day, well, the containers will just keep running. It's not a big deal unless you turn your computer off every day, in which case you will very likely end up with corrupted SQL data inside the volume, and might have to rebuild the database (see [database.md](./database.md) for how).
