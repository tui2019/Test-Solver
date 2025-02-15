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




var question_tab = document.getElementsByClassName("test-content-text")[0];
question_tab.addEventListener("click", async ()=>
  {
    console.log("click");
    var questionWrapper = document.getElementsByClassName("test-content-text-inner");
    var anwserWrapper = document.getElementsByClassName("test-options-grid");
    var questionContext = questionWrapper[0].children[0].innerText;
    answers_HTML = Array.from(anwserWrapper[0].children).map(e => e.getElementsByClassName("question-option-inner-content")[0]);
    var anwserContext = answers_HTML.map(e => e.innerText);
    const ansers_request = browser.runtime.sendMessage({
      question: questionContext,
      answers: anwserContext,
      type: "single_choice_question"
    });
    ansers_request.then(handleResponse, handleError);
    await new Promise(t => setTimeout(t, 2000));
  }
)
