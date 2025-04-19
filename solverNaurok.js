function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
function handleResponse(response) {
  var correct_answer = answers_HTML[response-1];
  correct_answer.style.opacity = "0";
  delay(1000).then(() => correct_answer.style.opacity = "1");

}

function handleError(error) {
  console.log(`Background error: ${error}`);
}

var answers_HTML = [];
var answers = [];




var question_tab = document.getElementsByClassName("test-content-text")[0];
question_tab.addEventListener("click", async ()=>
  {
    var questionWrapper = document.getElementsByClassName("test-content-text-inner");
    var anwserWrapper = document.getElementsByClassName("test-options-grid");
    var questionContext = questionWrapper[0].children[0].innerText;
    answers_HTML = Array.from(anwserWrapper[0].children).map(e => e.getElementsByClassName("question-option-inner-content")[0]);
    var anwserContext = answers_HTML.map(e => e.innerText);

    chrome.runtime.sendMessage({
        question: questionContext,
        answers: anwserContext,
        type: "single_choice_question"
    }, handleResponse);

    await new Promise(t => setTimeout(t, 2000));
  }
)
