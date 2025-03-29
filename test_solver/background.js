// https://aistudio.google.com
// https://ai.google.dev/gemini-api/docs/quickstart?lang=web
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
var genAI = new GoogleGenerativeAI(window.localStorage.getItem('userGAPI'));
var model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", config: { tools: [{ googleSearch: {} }] } });
var multKeys = false;
var key1requests = 0;
var activeKey = 1;
if (window.localStorage.getItem('userGAPI2') !== null){
  multKeys = true;
  var key2requests = 0;
  var genAI2 = new GoogleGenerativeAI(window.localStorage.getItem('userGAPI2'));
  var model2 = genAI2.getGenerativeModel({ model: "gemini-2.0-flash", config: { tools: [{ googleSearch: {} }] } });
}


function numberToLetter(number) {
  const Alphabet_str = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";
    if (number < 1 || number > Alphabet_str.length) {
      return undefined; // Or throw an error
    }
    return Alphabet_str[number - 1];
  }

function sendRequest(request) {
  if (multKeys) {
    if (activeKey == 1) {
      key1requests += 1;
      if (key1requests > 15) {
        activeKey = 2;
        key1requests = 0;
      }
      return model.generateContent(request);
    }
    else {
      key2requests += 1;
      if (key2requests > 15) {
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

if (window.localStorage.getItem('expLogicEnabled') === 'true'){
  async function get_answers(request, sender, sendResponse) {
    if (request.type == "text_question") {
      var prompt_str = "Дай відповідь (якщо можливо - одним словом): " + request.question;
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
      var first_request_prompt = request.question + answers_str
      var result1 = await sendRequest(first_request_prompt);
      var second_request_prompt = 'Це відповідь на питання: "' + result1.response.text() + '". А це варіанти Відповідей: "' + answers_str + '". Дай відповідь лише цифрою(1, 2, 3...).';
      var result = await sendRequest(second_request_prompt);
      var responseText = await result.response.text();
    }

    else if (request.type == "choice_grid") {
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
          answers_horizontal_str += "А.";
        } else {
          answers_horizontal_str += `; ${numberToLetter(i + 1)}.`;
        }
        answers_horizontal_str += request.answers_horizontal[i];
      }

      var first_request_prompt = request.question + answers_str + ' та ' + answers_horizontal_str + ". Вибери відповідь для кожного варіанту відповіді.";
      var result1 = await sendRequest(first_request_prompt);
      var second_request_prompt = 'Це відповідь на питання: "' + result1.response.text() + '". А це варіанти Відповідей: "' + answers_str + ' та ' + answers_horizontal_str + '". Дай відповідь в форматі (1А, 2Б, 3В..., без жодних інших слів).';
      var result = await sendRequest(second_request_prompt);
      var responseText = await result.response.text();
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
      var first_request_prompt = request.question + answers_str + ". Можливі декілька правильних відповідей."
      var result1 = await sendRequest(first_request_prompt);
      var second_request_prompt = 'Це відповідь на питання: "' + result1.response.text() + '". А це варіанти Відповідей: "' + answers_str + '". Дай відповідь лише цифрою(1, 2, 3..., без жодних інших слів). Можливі декілька правильних відповідей.';
      var result = await sendRequest(second_request_prompt);
      var responseText = await result.response.text();
    }
      return responseText; // Indicate that sendResponse will be called asynchronously
    }

  browser.runtime.onMessage.addListener(get_answers);
}
else {
  async function get_answers(request, sender, sendResponse) {
    if (request.type == "text_question") {
      var prompt_str = "Дай відповідь (якщо можливо - одним словом): " + request.question;
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
      var prompt_str = "Допоможи вирішити завдання та дай відповідь лише цифрою(1, 2, 3...): " + request.question + ". Варіанти відповідей: " + answers_str;
      var result = await sendRequest(prompt_str);
      var responseText = await result.response.text();
    }

    else if (request.type == "choice_grid") {
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
          answers_horizontal_str += "А.";
        } else {
          answers_horizontal_str += `; ${numberToLetter(i + 1)}.`;
        }
        answers_horizontal_str += request.answers_horizontal[i];
      }
      var prompt_str = "Допоможи вирішити завдання та дай відповідь в форматі (1А, 2Б, 3В...) без ніяких зайвих слів: " + request.question + ". Питання: " + answers_str + ". Варіанти відповідей: " + answers_horizontal_str;
      var result = await sendRequest(prompt_str);
      var responseText = await result.response.text();
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
    var prompt_str = "Допоможи вирішити завдання та дай відповідь лише цифрою(1, 2, 3..., без жодних інших слів). Можливі декілька правильних відповідей: " + request.question + ". Варіанти відповідей: " + answers_str;
    var result = await sendRequest(prompt_str);
        var responseText = await result.response.text();
    }
      return responseText; // Indicate that sendResponse will be called asynchronously
    }

  browser.runtime.onMessage.addListener(get_answers);
}
