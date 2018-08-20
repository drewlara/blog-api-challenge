const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models')

BlogPosts.create('Trip to Japan', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', 'Andrew', 'May 5 2018');
BlogPosts.create('Best Austin Breweries', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', 'John', 'June 29 2018');
BlogPosts.create('Tacos in Houston', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', 'Ethan', 'July 31 2018');

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	for (let i = 0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			console.log(`Missing ${field} in request body`);
			return res.status(400).send(message);
		}
	}
	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.puslishDate);
	res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted Post: ${req.params.id}`);
	res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	for (let i = 0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			console.log(`Missing ${field} in request body`);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		console.log(`Request path id: ${req.params.id} does not match Request body id: ${req.body.id}`);
		return res.status(400).sent(message);
	}
	const updateItem = BlogPosts.update({
		id : req.params.id,
		title : req.body.title,
		content : req.body.content,
		author : req.body.author,
		publishDate : req.body.publishDate
	});
	res.status(204).end();
});


module.exports = router;