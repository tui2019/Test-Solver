function LetterToNumber(letter) {
  const Alphabet_str = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";
  const index = Alphabet_str.indexOf(letter);
  if (index === -1) {
    return undefined;
  }
  return index + 1;
}

function handleResponse(response) {
    if (type=="text_question"){
    answers_HTML.value=response;
    answers_HTML.dispatchEvent(new Event('input', { bubbles: true }));
    }
    else if (type=="multiple_choice_question"){
      const responseArray = response.split(", ").map(Number);
      for (let i=0; i<responseArray.length;i++){
        var correct_answer = answers_HTML[responseArray[i]-1];
        correct_answer.click();
      }
    }

    else if (type=="choice_grid"){
      el1 = document.getElementsByClassName("Od2TWd")[2];
      console.log(el1);
      var responseArray = response.split(", ")
      for (var i = 0; i < responseArray.length; i++) {
        console.log(answers_HTML)
        var correct_answer = answers_HTML[i].children[LetterToNumber(responseArray[i][1])].getElementsByClassName("Od2TWd")[0];
        console.log(correct_answer);
        correct_answer.click();
      }
    }

    else if (type=="single_choice_question"){
      var correct_answer = answers_HTML[response-1];
      console.log(correct_answer);
      correct_answer.click();
    }
}

function handleError(error) {
  console.log(`Background error: ${error}`);
}

var answers_HTML = [];
var answers = [];
var type = "";



var questions = document.getElementsByClassName("geS5n");
for (var i = 0; i < questions.length; i++) {
  var question = questions[i];
  var questionText = question.getElementsByClassName("M7eMe")[0];

  questionText.onclick = function () {
    answers_HTML = [];
    answers = [];
    answers_horizontal = [];
    type = "";
    if (this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("nWQGrd").length >= 1) {
      for (var j = 0; j < this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("nWQGrd").length; j++) {
        answers.push(this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("nWQGrd")[j].getElementsByTagName("span")[0].innerText);
        answers_HTML.push(this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("nWQGrd")[j].firstChild);
      }
      type="single_choice_question";
    }

    if (this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("ufh7vf").length >= 1) {
      for (var j = 1; j < this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("ssX1Bd").length-1; j++) {
        answers.push(this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("wzWPxe")[j].innerText);
        answers_HTML.push(this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("H2Gmcc")[j-1]);
      }
      for (var j = 0; j < this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("ssX1Bd")[0].children.length-1; j++) {
        answers_horizontal.push(this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("ssX1Bd")[0].children[j+1].innerText);
      }
      type="choice_grid";
    }

    if (this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("eBFwI").length >= 1) {
      for (var j = 0; j < this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("eBFwI").length; j++) {
        answers.push(this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("eBFwI")[j].getElementsByTagName("span")[0].innerText);
        answers_HTML.push(this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("eBFwI")[j].firstChild);
      }
      type="multiple_choice_question";
    }
    if (this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("AgroKb").length==1){
      answers="text_question";
      type="text_question";
      answers_HTML=this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("AgroKb")[0].querySelectorAll('input, textarea')[0];
    }
    const ansers_request = browser.runtime.sendMessage({
      question: this.innerText,
      answers: answers,
      answers_horizontal: answers_horizontal,
      type: type
    });
    ansers_request.then(handleResponse, handleError);

  };
};
