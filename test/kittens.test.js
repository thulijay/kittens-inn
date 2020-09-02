const assert = require("assert");

describe("The kittens in", function () {

	const pg = require("pg");
	const Pool = pg.Pool; 
	const connectionString = process.env.DATABASE_URL || 'postgresql://melissa:pg123@localhost:5432/kitten_inn';
	const pool = new Pool({ //a connection pool
		connectionString
	});
	const INSERT_QUERY = "insert into booking (name, staying_for, arriving_on) values ($1, $2, $3)"; 

	beforeEach(async function () {
		await pool.query("delete from booking");
	});

	it("should be able to add a bookings", async function () {

		await pool.query(INSERT_QUERY, ["Snowy", 4, "Wednesday"]);
		await pool.query(INSERT_QUERY, ["Spotty", 7, "Wednesday"]);

		const results = await pool.query("select count(*) from booking");
		
		// how many bookings should have been added?
		assert.equal(2, results.rows[0].count);

	});

	it("should be able to find all bookings", async function () {

		await pool.query(INSERT_QUERY, ["Snowy", 4, "Wednesday"]);
		await pool.query(INSERT_QUERY, ["Spotty", 3, "Friday"]);
		await pool.query(INSERT_QUERY, ["Kitty", 7, "Thursday"]);

		const results = await pool.query("select count(*) from booking"); // counting how many rows there are 

		// how many bookings should be found?
		assert.equal(3, results.rows[0].count);
		
	});

	it("should be able to find a booking", async function () {

		await pool.query(INSERT_QUERY, ["Kitty", 7, "Thursday"]);

		const results = await pool.query("select * from booking where name = $1", ["Kitty"]); 

		// what fields should have been found in the database?
		assert.equal("Kitty", results.rows[0].name);
		assert.equal(7, results.rows[0].staying_for);
		assert.equal("Thursday", results.rows[0].arriving_on);

	});

	it("should be able to update a booking", async function () {

		await pool.query(INSERT_QUERY, ["Kitty", 7, "Thursday"]);

		let results = await pool.query("select * from booking where name = $1", ["Kitty"]);

		assert.equal("Kitty", results.rows[0].name);
		assert.equal(7, results.rows[0].staying_for);
		assert.equal("Thursday", results.rows[0].arriving_on);

		await pool.query("update booking set staying_for = $2  where name = $1", ["Kitty", 5]); // updating the name

		results = await pool.query("select * from booking where name = $1", ["Kitty"]);

		// what new values should have been found
		assert.equal("Kitty", results.rows[0].name);
		assert.equal(5, results.rows[0].staying_for);
		assert.equal("Thursday", results.rows[0].arriving_on);

	});


	it("should be able to find bookings for 5 days or longer", async function () {

		await pool.query(INSERT_QUERY, ["Snowy", 5, "Wednesday"]);
		await pool.query(INSERT_QUERY, ["Spotty", 3, "Friday"]);
		await pool.query(INSERT_QUERY, ["Kitty", 7, "Thursday"]);

		const results = await pool.query("select count(*) from booking where staying_for >= 5"); // counting everything greater than 5

		// how many bookings should be found?
		assert.equal(2, results.rows[0].count);
		
	});

	after(function() {
		pool.end();
	})

});