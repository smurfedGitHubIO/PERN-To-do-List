const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

app.use(cors());
app.use(express.json());

app.post('/todos', async(req, res) => {
	try{
		const { description } = req.body;
		const newTodo = await pool.query("INSERT INTO todo(description) VALUES($1)", [description]);
		res.json(newTodo.rows[0]);
	} catch(err) {
		console.error(err.message);
	}
});

// GET all todos

app.get('/todos', async(req, res) => {
	try{
		const allTodos = await pool.query("SELECT * FROM todo");
		res.json(allTodos.rows);
	} catch(err) {
		console.error(err.message);
	}
});

// GET a todo

app.get('/todos/:id', async(req, res) => {
	try{
		const oneTodo = await pool.query("SELECT * FROM todo WHERE id=$1", [parseInt(req.params.id)]);
		res.json(oneTodo.rows[0]);
	} catch(err) {
		console.error(err.message);
	}
});

// update a todo

app.put('/todos/:id', async(req, res) => {
	try {
		const { id } = req.params;
		const {description} = req.body;
		const updateTodo = pool.query("UPDATE todo SET description=$1 WHERE id=$2", [description, id]);
		res.json("Todo was updated");
	} catch(err){
		console.error(err.message);
	}
})

// delete a todo

app.delete('/todos/:id', async(req, res) => {
	try {
		const { id } = req.params;
		const deleteTodo = await pool.query("DELETE FROM todo WHERE id=$1", [id]);
		res.json("Todo was deleted");
	} catch(err) {
		console.error(err.message);
	}
})

const PORT = process.env.NODE_ENV || 8000;

app.listen(PORT, () => console.log(`Server running at PORT ${PORT}`));