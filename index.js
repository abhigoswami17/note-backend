require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Note = require('./models/note');

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

const requestLogger = (request, response, next) => {
	console.log('Method: ', request.method);
	console.log('Path: ', request.path);
	console.log('Body: ', request.body);
	console.log('_____');
	next();
};

app.use(requestLogger);

app.get('/', (request, response) => {
	response.send('<h1>Hello Express</h1>');
});

app.get('/api/notes', (request, response) => {
	Note.find({}).then((notes) => {
		response.json(notes);
	});
});

app.get('/api/notes/:id', (request, response, next) => {
	Note.findById(request.params.id)
		.then((note) => {
			if (note) {
				response.status(200).json(note);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => {
			next(error);
		});
});

app.post('/api/notes', (request, response, next) => {
	const body = request.body;

	if (body.content === undefined) {
		return response.status(400).json({
			error: 'content is missing',
		});
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
	});

	note
		.save()
		.then((savedNote) => {
			response.status(201).json(savedNote);
		})
		.catch((error) => next(error));
});

app.put('/api/notes/:id', (request, response, next) => {
	const { content, important } = request.body;

	Note.findByIdAndUpdate(
		request.params.id,
		{ content, important },
		{ new: true, runValidators: true, context: 'query' }
	)
		.then((updatedNote) => {
			response.status(201).json(updatedNote);
		})
		.catch((error) => next(error));
});

app.delete('/api/notes/:id', (request, response, next) => {
	Note.findByIdAndRemove(request.params.id)
		.then((result) => {
			console.log(result);
			response.status(204).end();
		})
		.catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.error(error);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformed id' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
