import { GoogleGenerativeAI } from "./geminiAPI.js";
import translations from './languages.js';

let genAI, model, api_limit;
let multKeys = false;
let key1requests = 0;
let activeKey = 1;
let genAI2, model2, key2requests = 0;
let userLanguage, lang, prompts;

async function initializeAPI() {
  genAI = new GoogleGenerativeAI(await chrome.storage.local.get('userGAPI').then(result => result.userGAPI));
  if (await chrome.storage.local.get('expLogicEnabled').then(result => result.expLogicEnabled) === 'true') {
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });
    api_limit = 10;
  }
  else {
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    api_limit = 15;
  }

  multKeys = false;
  key1requests = 0;
  activeKey = 1;
  if (await chrome.storage.local.get('userGAPI2').then(result => result.userGAPI2)) {
    multKeys = true;
    key2requests = 0;
    genAI2 = new GoogleGenerativeAI(await chrome.storage.local.get('userGAPI2').then(result => result.userGAPI2));
    if (await chrome.storage.local.get('expLogicEnabled').then(result => result.expLogicEnabled) === 'true') {
      model2 = genAI2.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });
    }
    else {
      model2 = genAI2.getGenerativeModel({ model: "gemini-2.0-flash" });
    }
  }
  userLanguage = await chrome.storage.local.get('userLanguage').then(result => result.userLanguage) || 'uk'; // Default to Ukrainian for backward compatibility
  lang = translations[userLanguage] || translations['uk'];
  prompts = lang.prompts;
}


function numberToLetter(number) {
  const alphabet = lang.alphabet;
  if (number < 1 || number > alphabet.length) {
    return undefined; // Or throw an error
  }
  return alphabet[number - 1];
}

function letterToNumber(letter) {
  const alphabet = lang.alphabet;
  const index = alphabet.indexOf(letter);
  if (index === -1) {
    // Try with English alphabet as fallback
    const engAlphabet = translations['en'].alphabet;
    const engIndex = engAlphabet.indexOf(letter);
    if (engIndex === -1) {
      return undefined;
    }
    return engIndex + 1;
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

function sendRequest(request) {
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
    initializeAPI()
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
    const connector = lang.connectors.and;
    var prompt_str = prompts.solveProblemFormat + request.question + ". " + prompts.questions + answers_str + connector + prompts.answerOptions + answers_horizontal_str;
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

chrome.runtime.onInstalled.addListener(() => {
  initializeAPI();
});

chrome.runtime.onStartup.addListener(() => {
  initializeAPI();
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
