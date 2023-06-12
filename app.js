
const express = require("express");
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb+srv://bryansuello:ukr1zjct5@cluster0.9bhawvq.mongodb.net/anonymousDB", { useNewUrlParser: true, useUnifiedTopology: true });

const questionSchema = {
  question: String,
  answers: [{ type: String }]  // Add the 'answers' field to the schema
};

const Question = mongoose.model("Question", questionSchema);

//////////////////////////////////////////////////////////////////////

app.route("/")

  .get((req, res) => {

    Question.find()
      .populate('answers') // By adding the populate('answers') method chain to the query, you instruct Mongoose to populate the answers field of each question document with the associated answers.
      .then((questions) => {
        res.render('index', {
          questions: questions
        });
      })
      .catch(err => {
        res.status(500).send(err.message);
      })
  })

  .post((req, res) => {
    const question = new Question({
      question: req.body.questionInput,
    });
    question.save()
      .then(() => {
        console.log('Question added to Database.');
        res.redirect('/'); // answers keep redirecting to / 
      })
      .catch(err => {
        res.status(400).send("Unable to save question to database.");
      });

  });


app.route('/answers')

  .get((req, res) => {

    Question.find()
      .populate('answers')
      .then((questions) => {
        res.render('answers', {
          questions: questions,
        });
      })
      .catch(err => {
        res.status(500).send(err.message);
      })
  })

  .post((req, res) => {

    const questionId = req.body.questionId.toString();
    const answer = req.body.answerInput;

    Question.findByIdAndUpdate(
      questionId,
      { $push: { answers: answer } },
      { new: true } // Add this option to return the updated document
    )
      .then((updatedQuestion) => {
        console.log('Answer added to the question.');
        console.log(updatedQuestion); // Check if the question is updated in the console
        res.redirect('/answers');
      })
      .catch(err => {
        res.status(400).send("Unable to save answer to question.");
      });

  });


app.route('/about')
  .get((req, res) => {
    res.render('about');
  });




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
