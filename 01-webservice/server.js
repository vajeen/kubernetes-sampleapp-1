const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const mysql = require('mysql');
const router = express.Router();

const dbConn = mysql.createConnection({
	host: 'mysql-service',
	user: 'api',
	password: 'api123',
	database: 'books'
});

dbConn.connect(function(err){
	if (err) throw err;
	console.log("Database connected")
});

var book = function(book){
	this.title = book.title;
	this.author = book.author;
	this.year = book.year;
};

book.create = function(newBook, result){

	dbCon.query("INSERT INTO books set ?", newBook, function (err,res){
		if(err){
			console.log("error: ", err);
			result(err,null);
		} else{
			console.log(res.insertId);
			result(null, res.InsertId);
		}
	});
};

book.findByAuthor = function (author, result) {
	dbConn.query("select * from books where author = ?", author, function (err, res){
		if (err){
			console.log("error: ", err);
			result(null, err);
		} else{
			console.log( 'books: ',res);
			result(null, res)
		}
	})
};

book.findAll = function (result) {
        dbConn.query("select * from books", '', function (err, res){
                if (err){
                        console.log("error: ", err);
                        result(null, err);
                } else{
                        console.log( 'All books: ',res);
                        result(null, res)
                }
        })
};

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.get('/', (req, res) => {
	book.findAll(function(err, book){
		if (err)

		res.send(err);

		res.json(book);
	});
});

app.get('/:author', (req, res) => {
	book.findByAuthor( req.params.author, function(err, book){
		if (err)
		res.send(err);
		res.json(book);
	});
});

app.post('/', (req, res) => {
	const newBook = new book(req.body);
	book.create(newBook, function(err, book){
		if (err)

		res.send(err);

		res.json({error: false, message: "book added", data: book})
	});
});
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
