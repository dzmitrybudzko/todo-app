var Todo = require('./models/todo');

module.exports = function(app) {
	
	app.get('/api/todos', function(req, res) {

		Todo.find(function(err, todos) {
			if (err)
				res.send(err)

			res.json(todos); 
		});
	});

	app.post('/api/todos', function(req, res) {

		Todo.create({
			title : req.body.title,
			date : req.body.date,
			priority : {
				id: req.body.priority.id,
				name: req.body.priority.name
				},
			done : false
		}, function(err, todo) {
			if (err)
				res.send(err);

			res.json({message: 'todo created'});
			}
		);

	});

	app.delete('/api/todos/:todo_id', function(req, res) {
		
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

				res.json({message: 'todo deleted'});
			})
		});
	});

	app.put('/api/todos/:todo_id', function(req, res) {
		Todo.findByIdAndUpdate(req.params.todo_id, {title : req.body.title,
													date : req.body.date,
													priority : {
														id: req.body.priority.id,
														name: req.body.priority.name
														},
													done : req.body.done},
			function(err, todo) {
				if (err)
					res.send(err);

			res.json({message: 'todo updated'});
		});
	});


	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};