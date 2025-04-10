# 📚️ Database
This project is designed for lifting LAMP stack sites, which means MySQL. It should be compatible with MariaDB as well. If you want to spin up a different type of database, you're welcome to try but it's not something for which I wanted to plan ahead. I imagine you'd have to tweak the PHP config and add a new driver to the `Dockerfile`, but it should be possible without too much effort.


## Seeding the Database
MySQL is configured to load any SQL script files it finds under the `/database` folder. This is only done when the database is first created (see "Rebuilding" below).

Since all the files are processed in order alphabetically, I typically will preface each with a number to ensure they run in order. This gives me the flexibility of building schema, seeding tables, and running patches as needed.

Examples:

`1-schema.sql`:
```sql
CREATE TABLE `Member` (
    `Member_RecID` int unsigned NOT NULL AUTO_INCREMENT,
    `Member_ID` varchar(30) NOT NULL,
    `Password` varchar(32) NOT NULL DEFAULT '',
    `Email` varchar(320) NOT NULL DEFAULT 'temp',
    `Admin_Flag` tinyint NOT NULL DEFAULT '0',
    `Member_Since` datetime DEFAULT NULL,
    `Last_Updated` datetime DEFAULT NULL,
    PRIMARY KEY (`Member_RecID`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

/* etc */
```

`2-seed.sql`:
```sql
INSERT INTO Member (Member_RecID, Member_ID, Password, Email, Admin_Flag, Member_Since, Last_Updated) VALUES
    (1, 'Bob', 'c7c2c5e4d50343bda61c5d5053259796', 'user1@mysite.com', 1, now(), now()),
    (2, 'Jim', 'b21f72a9acfc40868b7abe5b70fd4d80', 'user2@mysite.com', 1, now(), now());

/* etc */
```

Note that the schema example does NOT include creating the database. That should happen automatically due to environment variables. You can, of course, use these files to create additional schemas if needed.

Also note that this is just an example. Nobody stores passwords like that in real life... right?


## Managing the Database
While you're certainly welcome to remote into the MySQL container and manually inspect or manipulate the data from the command line, it's probably going to be a lot less annoying to install something like [MySQL Workbench](https://www.mysql.com/products/workbench/) or [DBeaver](https://dbeaver.io/).

The former is great for its support of every MySQL feature; the latter is great as a cross-database tool, if you manage multiple projects. Just install either, and point it at the localhost address above (don't forget the `33060` in the Port field of the connection).

> ⚠️ **WARNING** ⚠️
> 
> I wasn't able to get DBeaver to connect at all. It threw some kind of public key encryption error. This *may* have been due to enhanced security when running it under Linux. Your mileage may vary, but I recommend sticking to MySQL Workbench.

Use the credentials defined in the `mydb` section of the docker compose file. The "Root" password is great if you need to modify users, but most database work should be handled with the "mradmin" user.


## Rebuilding the Database
The data should persist inside the Docker volume defined in the compose file. But if you want to blow that away and get a fresh database, then delete the volume with this command:
```bash
docker volume rm mysite_mysql
```

The seed files noted above will be used to recreate the database automatically the next time you start the container.
