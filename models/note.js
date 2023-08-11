const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI_PROD;

mongoose.set('strictQuery', false);

console.log('connecting to mongodb');

mongoose
	.connect(MONGODB_URI)
	.then((result) => {
		console.log(result);
		console.log('connected to mongodb');
	})
	.catch((error) => {
		console.log('error connecting to mongodb:', error.message);
	});

const noteSchema = new mongoose.Schema({
	content: {
		type: String,
		minLength: 5,
		required: true,
	},
	important: Boolean,
});

noteSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString,
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
