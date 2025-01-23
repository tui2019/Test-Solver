function handleResponse(response) {
  const responseArray = response.split(", ").map(Number);
  for (let i=0; i<responseArray.length;i++){
    var correct_answer = answers_HTML[responseArray[i] -1];
    correct_answer.click();
  }
  
}

function handleError(error) {
  console.log(`Background error: ${error}`);
}

// getting questions and answers and creating event listener
//
var answers_HTML = [];

var questions = document.getElementsByClassName("geS5n");
for (var i = 0; i < questions.length; i++) {
  var question = questions[i];
  var questionText = question.getElementsByClassName("M7eMe")[0];

  questionText.ondblclick = function () {
    answers_HTML = [];
    var answers = [];
    for (var j = 0; j < this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("nWQGrd").length; j++) {
      answers.push(this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("nWQGrd")[j].getElementsByTagName("span")[0].innerText);
      answers_HTML.push(this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("nWQGrd")[j].firstChild);
    }
    for (var j = 0; j < this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("eBFwI").length; j++) {
      answers.push(this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("eBFwI")[j].getElementsByTagName("span")[0].innerText);
      answers_HTML.push(this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("eBFwI")[j].firstChild);
    }
    const ansers_request = browser.runtime.sendMessage({
      question: this.innerText,
      answers: answers,
    });
    ansers_request.then(handleResponse, handleError);

  };
};