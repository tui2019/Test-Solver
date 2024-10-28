var questions = document.getElementsByClassName("geS5n");
for (var i = 0; i < questions.length; i++) {
  var question = questions[i];
  var questionText =
    question.firstChild.firstChild.firstChild.firstChild.innerText;
  alert(questionText);
}
