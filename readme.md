# Lebos Kittens inn

Lebo is running a local cattery and people can book their kittens in for up to 10 days at a time while they are going on holiday.

She wants a system where people can make bookings specifying the name of the kitten, the day of the week the kitten will be booked in and how long the kitten will be staying.

She enlisted our help to create this system for her.

## Setup

Clone this repo from GitHub then run `npm install`.

Run the app using `nodemon`.

## Database setup

Ensure you have PostgreSQL installed on your PC.

### Create the database

```
createdb kitten_inn
```

### Grant access to the database

Now run *psql* as the *postgres* user:

```
sudo -u postgres psql;
```

Grant the `coder` user access to the `kitten_inn` database by running this command: 

```
grant all privileges on database kitten_inn to coder;
```

Type in `\q` to exit *psql* as the *postgres* user.

Connect to your database using: `psql -d kitten_inn`

## Database tables


### Create the tables we need

```sql
create table booking(
	id serial not null primary key,
    name text,
	staying_for int,
	arriving_on text
);
```

### Create the SQL we need

To create  booking use:

```sql
insert into booking (name, staying_for, arriving_on)
	values ("Snowy", 3, "Tuesday");
```

All the bookings:

```sql
select * from booking
```

All the bookings longer than 3 days:

```sql
select * from booking where days > 3
```

## Link the database to our application

To use PostgreSQL in NodeJS you need to install the `pg` module from npm.

`npm install --save pg`

Import the module and get `Pool` reference to use.

```js
const pg = require("pg");
const Pool = pg.Pool;
```

Create Pool instance by using database connection string.

```js
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/kitten_inn';

const pool = new Pool({
    connectionString
  });
```

## Use the SQL in our application

Use SQL in your application like this.

```sql

async function queryDB() {
	
	const param1 = "value";

	let results = await pool.query('select field1, field2 from your_table where id = $1', [param1]);
	
	return results;

}

```






