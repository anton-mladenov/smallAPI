const express = require("express")
const app = express()
const Sequelize = require("sequelize")
const sequelize = new Sequelize("postgres://postgres:secret@localhost:5432/postgres")
const bodyParser = require("body-parser")

// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());

var Jobs = sequelize.define("jobs", {
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	title: Sequelize.STRING,
	description: Sequelize.TEXT,
	salary: Sequelize.INTEGER,
	company: Sequelize.STRING,
	createdAt: Sequelize.DATE,
	updatedAt: Sequelize.DATE
}, { 
	tableName: "jobs" 
})

app.get("/", (req, res) => {
	res.status(500).send({
		message: "Nothing on the homepage, bro!"
	})
})
 
app.get("/jobs", (req, res) => {
	Jobs.findAll().then(jobs => {
		res.send({ jobs })
	})
})

app.get("/jobs/:id", (req, res) => {
	let jobId = req.params.id

	Jobs.findById(jobId).then(job => {
		
		if (job) {
			res.send(job)
		} else {
			res.status(404).send({
				message: "No jobs found."
			})
		}

	})
})

app.post("/addnewjob", (req, res) => {

	Jobs.create({
		title: req.body.title,
		description: req.body.description,
		salary: req.body.salary,
		company: req.body.company
	})
	.then(newPosition => Jobs.findById(newPosition.id))
	.then(jobWithId => res.send(jobWithId))

})

app.patch("/jobs/:id", (req, res) => {
	let jobId = req.params.id

	Jobs.findById(jobId)
	.then(job => job.update({
		title: req.body.title,
		description: req.body.description,
		salary: req.body.salary,
		company: req.body.company
	}))
	// .then(newPosition => Jobs.findById(newPosition.id))
	.then(job => res.send(job))
})

app.delete("/jobs/:id", (req, res) => {
	let jobId = req.params.id
	
	Jobs.findById(jobId).then(job => job.destroy()).then(job => res.send("This job was successfully deleted."))

})

app.listen(3000, console.log("Listening on port 3000....."))