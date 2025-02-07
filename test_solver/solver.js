function handleResponse(response) {
    if (answers=="text_question"){
    answers_HTML.value=response;
    answers_HTML.dispatchEvent(new Event('input', { bubbles: true }));
    }
    else{
      const responseArray = response.split(", ").map(Number);
      for (let i=0; i<responseArray.length;i++){
        var correct_answer = answers_HTML[responseArray[i]-1];
        correct_answer.click();
      }
    }
}

function handleError(error) {
  console.log(`Background error: ${error}`);
}

var answers_HTML = [];
var answers = [];

function solveGoogleForm()
{

  var questions = document.getElementsByClassName("geS5n");
  for (var i = 0; i < questions.length; i++) {
    var question = questions[i];
    var questionText = question.getElementsByClassName("M7eMe")[0];

    questionText.onclick = function () {
      answers_HTML = [];
      answers = [];
      for (var j = 0; j < this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("nWQGrd").length; j++) {
        answers.push(this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("nWQGrd")[j].getElementsByTagName("span")[0].innerText);
        answers_HTML.push(this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("nWQGrd")[j].firstChild);
      }
      for (var j = 0; j < this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("eBFwI").length; j++) {
        answers.push(this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("eBFwI")[j].getElementsByTagName("span")[0].innerText);
        answers_HTML.push(this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("eBFwI")[j].firstChild);
      }
      if (this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("AgroKb").length==1){
        answers="text_question";
        answers_HTML=this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("AgroKb")[0].querySelectorAll('input, textarea')[0];
      }

      const ansers_request = browser.runtime.sendMessage({
        question: this.innerText,
        answers: answers,
      });
      ansers_request.then(handleResponse, handleError);

    };
  };
}

async function solveNaurok()
{

  var question_tab = document.getElementsByClassName("test-content-text")[0];
  question_tab.addEventListener("click", async ()=>
    {

      var questionWrapper = document.getElementsByClassName("test-content-text-inner");
      var anwserWrapper = document.getElementsByClassName("test-options-grid");
      var questionContext = questionWrapper[0].children[0].innerText;
      answers_HTML = Array.from(anwserWrapper[0].children).map(e => e.getElementsByClassName("question-option-inner-content")[0]);
      var anwserContext = answers_HTML.map(e => e.innerText);
      const ansers_request = browser.runtime.sendMessage({
        question: questionContext,
        answers: anwserContext,
      });
      ansers_request.then(handleResponse, handleError);
      await new Promise(t => setTimeout(t, 2000));
    }
  )

}

if(window.location.href.indexOf("docs.google") > 0)
{

  solveGoogleForm();
}
else if(window.location.href.indexOf("naurok") > 0)
{

  solveNaurok();
}
