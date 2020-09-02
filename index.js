const express = require("express");

const exphbs = require("express-handlebars");
const bodyParser = require("body-parser"); 	// add this line
const pg = require("pg");
const Pool = pg.Pool; 

const connectionString = process.env.DATABASE_URL || 'postgresql://melissa:pg123@localhost:5432/kitten_inn';
	const pool = new Pool({ //a connection pool
		connectionString
	});

	const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false })); // add this line
app.use(bodyParser.json()); // add  this line

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//const kittens = [

//];

// after you added  this  restart the app
app.get("/", async function (req, res) {
	const kittens = await pool.query('select id, name, staying_for as days, arriving_on as "arrivingOn" from booking'); 

	res.render("index", { kittens : kittens.rows});
});

app.post("/filter", async function (req, res) {

	const daysFilter = req.body.daysFilter;

	let filteredData = [];
	if (daysFilter === "three") {

		const LESS_OR_EQL_THAN_3 = 'select id, name, staying_for as days, arriving_on as "arrivingOn" from booking where staying_for <= 3';

		const result = await pool.query(LESS_OR_EQL_THAN_3);
		filteredData = result.rows;

	//	filteredData = kittens.filter(function(kitten) {
		//	return kitten.days <= 3;
		//});

	} else if 

	(daysFilter === "more") {

	const MORE_OR_EQL_THAN_4 = 'select id, name, staying_for as days, arriving_on as "arrivingOn" from booking where staying_for >= 4';

	const result = await pool.query(MORE_OR_EQL_THAN_4);
	filteredData = result.rows;

	//(daysFilter === "more") {
		//filteredData = kittens.filter(function(kitten) {
			//return kitten.days > 3;
		//});
	} else{
		res.redirect('/'); 
	}

	res.render("index", { kittens : filteredData	 });
});

app.post("/booking",async function (req, res) {

	const days = req.body.days && Number(req.body.days);
	const name = req.body.name;
	const arrivingOn = req.body.day;

	if (days && name && arrivingOn) {
		const INSERT_QUERY = "insert into booking (name, staying_for, arriving_on) values ($1, $2, $3)"; 
		await pool.query(INSERT_QUERY, [name, days, arrivingOn]);

		//kittens.push({
		//	id : kittens.length+1,
		//	days,
		//	name,
		//	arrivingOn
		//});
		res.redirect("/");

	} else {

		function validate(value, result) {
			if (!value) {
				return result;
			}
			return {};
		}

		const daysInvalid = validate(days, {
			style: "is-invalid",
			message: "Enter a valid day"
		});

		const kittenNameInvalid = validate(name, {
				style: "is-invalid",
				message: "Enter a valid day"
			});

		const arrivingOnInvalid = validate(arrivingOn, {
				style: "is-invalid",
				message: "Please select a arrival day"
			});

			const kittens = await pool.query('select id, name, staying_for as days, arriving_on as "arrivingOn" from booking'); 


		res.render("index", {
			name,
			days,
			kittens : kittens.rows,
			daysInvalid,
			arrivingOnInvalid,
			kittenNameInvalid
		});
	}
})

// app.post("/counter", function(req, res) {
// });

const PORT = process.env.PORT || 3002;

app.listen(PORT, function () {
	console.log("App started on port :" + PORT);
});