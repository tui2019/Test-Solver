function handleResponse(response) {
  alert(response);
}

function handleError(error) {
  console.log(`Background error: ${error}`);
}

// getting questions and answers and creating event listener
var questions = document.getElementsByClassName("geS5n");
for (var i = 0; i < questions.length; i++) {
  var question = questions[i];
  var questionText = question.getElementsByClassName("M7eMe")[0];

  questionText.ondblclick = function () {
    var answers = [];
    for (var j = 0; j < this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("nWQGrd").length; j++) {
      answers.push(this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("nWQGrd")[j].getElementsByTagName("span")[0].innerText);
    }
    const ansers_request = browser.runtime.sendMessage({
        question: this.innerText,
        answers: answers,
      });
      ansers_request.then(handleResponse, handleError);
  };
};
