function handleResponse(response) {
  if (type == "single_choice_question") {
    var correct_answer = answers_HTML[response-1];
    correct_answer.click();
  }
  else if (type == "multiple_choice_question") {
    const responseArray = response.split(", ").map(Number);
    for (let i=0; i<responseArray.length; i++) {
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
var type = "";

// Function to attach the event listener
function attachEventListener() {
  const mainContent = document.getElementById("mainContent");

  if (!mainContent) {
    return false;
  }


  mainContent.addEventListener("click", async function(event) {
    const clickedTab = event.target.closest(".a4467d319288c09c67943532e2bcdf19");

    if (clickedTab) {
      // Wait a short time for the content to load fully after clicking the tab
      await new Promise(r => setTimeout(r, 300));

      var answerWrapper = document.getElementsByClassName("_8043fa3b8fc08be90f43195ad3158af5");

      if (answerWrapper && answerWrapper.length > 0) {
        answers_HTML = Array.from(answerWrapper[0].children).map(e => e.getElementsByClassName("MuiFormControlLabel-root")[0]);
        var answerContext = answers_HTML.map(e => e.innerText);
        var questionContext = clickedTab.firstChild.firstChild.innerText;

        // Get additional description if available
        try {
          const descriptionElement = document.getElementsByClassName("c4489eba3f80625a30f7805df37310ed")[0];

          if (descriptionElement && descriptionElement.innerText.trim() !== "") {
            // Add the additional description to the question context
            questionContext += "\n" + descriptionElement.innerText.trim();
          }
        } catch (err) {
          console.log("Error getting additional description:", err);
        }

        // Check for checkboxes to determine if it's multiple choice
        let isMultipleChoice = false;

        if (answers_HTML.length > 0) {
          const checkboxes = answers_HTML[0].querySelectorAll(".MuiCheckbox-root");
          isMultipleChoice = checkboxes.length > 0;
        }

        // Set the appropriate question type
        type = isMultipleChoice ? "multiple_choice_question" : "single_choice_question";

        // Send message with appropriate type
        const answers_request = browser.runtime.sendMessage({
          question: questionContext,
          answers: answerContext,
          type: type
        });

        answers_request.then(handleResponse, handleError);
      }
    }
  });

  return true;
}

// Try to attach the listener immediately first
if (!attachEventListener()) {
  // If it fails, set up a MutationObserver to watch for the mainContent element

  const observer = new MutationObserver(function(mutations, obs) {
    const mainContent = document.getElementById("mainContent");

    if (mainContent) {
      attachEventListener();
      obs.disconnect(); // Stop observing once we've attached the listener
    }
  });

  // Start observing the document with the configured parameters
  observer.observe(document, { childList: true, subtree: true });
}
