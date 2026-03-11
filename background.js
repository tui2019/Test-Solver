import { GoogleGenerativeAI } from "./geminiAPI.js";

let genAI, model, api_limit;
let multKeys = false;
let key1requests = 0;
let activeKey = 1;
let genAI2, model2, key2requests = 0;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const prompts = {
  giveAnswer: "Give an answer (if possible - in one word): ",
  solveProblemNumberOnly: "Help solve this problem and give the answer only as a number (1, 2, 3...): ",
  answerOptions: "Answer options: ",
  solveProblemFormat: "Help solve this problem and give the answer in format (1A, 2B, 3C...) without any extra words: ",
  questions: "Questions: ",
  solveProblemMultiple: "Help solve this problem and give the answer only as a number (1, 2, 3..., without any other words). Multiple correct answers are possible: "
};

async function initializeAPI() {
  const key1 = await chrome.storage.local.get('userGAPI').then(result => result.userGAPI);
  genAI = new GoogleGenerativeAI(key1);
  model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
  api_limit = 5;

  multKeys = false;
  key1requests = 0;
  activeKey = 1;
  const key2 = await chrome.storage.local.get('userGAPI2').then(result => result.userGAPI2);
  if (key2) {
    multKeys = true;
    key2requests = 0;
    genAI2 = new GoogleGenerativeAI(key2);
    model2 = genAI2.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
  }
}


function numberToLetter(number) {
  if (number < 1 || number > alphabet.length) {
    return undefined; // Or throw an error
  }
  return alphabet[number - 1];
}

function letterToNumber(letter) {
  const index = alphabet.indexOf(letter);
  if (index === -1) {
    return undefined;
  }
  return index + 1;
}

function convertGridAnswerToNumeric(answer) {
  if (!answer) return "";

  const parts = answer.split(", ");
  const numbers = [];

  for (const part of parts) {
    if (part.length >= 2) {
      const colLetter = part[1];
      const colNum = letterToNumber(colLetter);
      numbers.push(colNum);
    }
  }
  return numbers.join(", ");
}

async function sendRequest(request) {
  if (multKeys) {
    if (activeKey == 1) {
      key1requests += 1;
      if (key1requests > api_limit) {
        activeKey = 2;
        key1requests = 0;
      }
      return model.generateContent(request);
    }
    else {
      key2requests += 1;
      if (key2requests > api_limit) {
        activeKey = 1;
        key2requests = 0;
      }
      return model2.generateContent(request);
    }
  }
  else {
    return model.generateContent(request);
  }
}

async function get_answers(request, sender, sendResponse) {
  if (!genAI) {
    await initializeAPI();
  }
  if (request.type == "text_question") {
    var prompt_str = prompts.giveAnswer + request.question;
    var result = await sendRequest(prompt_str);
    var responseText = await result.response.text();
  }
  else if (request.type == "single_choice_question") {
    var answers_str = "";
    for (var i = 0; i < request.answers.length; i++) {
      if (i == 0) {
        answers_str += "1.";
      } else {
        answers_str += `; ${i + 1}.`;
      }
      answers_str += request.answers[i];
    }
    var prompt_str = prompts.solveProblemNumberOnly + request.question + ". " + prompts.answerOptions + answers_str;
    var result = await sendRequest(prompt_str);
    var responseText = await result.response.text();
  }
  else if (request.type == "choice_grid" || request.type == "check_box_grid") {
    var answers_str = "";
    for (var i = 0; i < request.answers.length; i++) {
      if (i == 0) {
        answers_str += "1.";
      } else {
        answers_str += `; ${i + 1}.`;
      }
      answers_str += request.answers[i];
    }
    var answers_horizontal_str = "";
    for (var i = 0; i < request.answers_horizontal.length; i++) {
      if (i == 0) {
        answers_horizontal_str += numberToLetter(i + 1) + ".";
      } else {
        answers_horizontal_str += `; ${numberToLetter(i + 1)}.`;
      }
      answers_horizontal_str += request.answers_horizontal[i];
    }
    var prompt_str = prompts.solveProblemFormat + request.question + ". " + prompts.questions + answers_str + " and " + prompts.answerOptions + answers_horizontal_str;
    var result = await sendRequest(prompt_str);
    var responseText = await result.response.text();
    var responseText = convertGridAnswerToNumeric(responseText);
  }
  else if (request.type == "multiple_choice_question") {
    var answers_str = "";
    for (var i = 0; i < request.answers.length; i++) {
      if (i == 0) {
        answers_str += "1.";
      } else {
        answers_str += `; ${i + 1}.`;
      }
      answers_str += request.answers[i];
    }
    var prompt_str = prompts.solveProblemMultiple + request.question + ". " + prompts.answerOptions + answers_str;
    var result = await sendRequest(prompt_str);
    var responseText = await result.response.text();
  }

  return responseText;
}

chrome.runtime.onInstalled.addListener(async () => {
  await initializeAPI();
});

chrome.runtime.onStartup.addListener(async () => {
  await initializeAPI();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  get_answers(request)
    .then(response => {
      sendResponse(response);
    })
    .catch(error => {
      console.error("Error:", error);
      sendResponse("Error: " + error.message);
    });

  return true; // Indicates we'll call sendResponse asynchronously
});
