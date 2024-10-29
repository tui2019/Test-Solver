function get_ansers(question, answers) {
  alert("Question: " + question + "\n\nAnswers:\n" + answers.join("\n"));
}

var questions = document.getElementsByClassName("geS5n");
for (var i = 0; i < questions.length; i++) {
  var question = questions[i];
  // var questionText = question.firstChild.firstChild.firstChild.firstChild;
  var questionText = question.getElementsByClassName("M7eMe")[0];

  questionText.ondblclick = function () {
    var answers = [];
    for (var j = 0; j < this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("nWQGrd").length; j++) {
      answers.push(
        this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("nWQGrd")[j].getElementsByTagName("span")[0].innerText,
      );
    }
    get_ansers(this.innerText, answers);
  };
}
