const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('give password as argument');
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://abhi_07:${password}@cluster0.lf3y9.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
	content: 'React is a library',
	important: true,
});

// note.save().then((result) => {
// 	console.log('note saved');
// 	mongoose.connection.close();
// });

Note.find({important: true}).then((result) => {
	result.forEach((note) => {
		console.log(note);
	});
	mongoose.connection.close();
});
