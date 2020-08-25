const express = require("express");

// npm install --save express-handlebars
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser"); 	// add this line
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false })); // add this line
app.use(bodyParser.json()); // add  this line

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const kittens = [
	{
		name: "Snowy",
		days: 7,
		arrivingOn: "Monday"
	},
	{
		name: "Chips",
		days: 3,
		arrivingOn: "Wednesday"
	},



];

// after you added  this  restart the app
app.get("/", function (req, res) {
	res.render("index", { kittens });
});



app.post("/booking", function (req, res) {

	const days = req.body.days && Number(req.body.days);
	const name = req.body.name;
	const arrivingOn = req.body.day;

	if (days && name && arrivingOn) {
		kittens.push({
			days,
			name,
			arrivingOn
		});
		res.redirect("/");
		
	} else {

		const daysInvalid = days ? {} :
			{
				style: "is-invalid",
				message: "Enter a valid day"
			};

		const kittenNameInvalid = name ? {} :
			{
				style: "is-invalid",
				message: "Enter a valid day"
			};

		const arrivingOnInvalid = arrivingOn ? {} :
			{
				style: "is-invalid",
				message: "Please select a arrival day"
			};


		res.render("index", {
			name,
			days,
			kittens,
			daysInvalid,
			arrivingOnInvalid,
			kittenNameInvalid
		});


	}




})

// app.post("/counter", function(req, res) {

// });

const PORT = process.env.PORT || 3009;

app.listen(PORT, function () {
	console.log("App started on port :" + PORT);
});