// making your own ngl anonymouse message app, using everything you've learned so far with the backend

const express = require("express");
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/anonymousDB", {
  useNewUrlParser: true
});

const questionSchema = {
  question: String
};

const Quesiton = mongoose.model("Question", questionSchema);

let questions = [];
let answers = ["my favourite color is blue.",
  "I am Bryan Suello",
  "pisti inatay"
];

//////////////////////////////////////////////////////////////////////

app.route("/")
  .get((req, res) => {
    res.render('index', {
      question: questions,
      answer: answers
    });
  })

  .post((req, res) => {
    let newQuestion = req.body.questionInput;
    questions.push(newQuestion);
    //res.send(`Thanks for the question: ${newQuestion} `);
    //res.send(questions);
    //res.sendFile(__dirname + '/public/thanks.html');
    res.redirect('/');
  });

app.get('/about', (req, res) => {
  res.render('about');
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
