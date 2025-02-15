// https://aistudio.google.com
// https://ai.google.dev/gemini-api/docs/quickstart?lang=web
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
var genAI = new GoogleGenerativeAI(window.localStorage.getItem('userGAPI'));
var model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function get_answers(request, sender, sendResponse) {
  if (request.type == "text_question") {
    var prompt_str = "Дай відповідь (якщо можливо - одним словом): " + request.question;
    var result = await model.generateContent(prompt_str);
    var responseText = await result.response.text();
  }
  else if (request.type == "single_choice_question") {
    var answers_str = "";
    for (var i = 0; i < request.answers.length; i++) {
      if (i == 0) {
        answers_str += "1.";
      } else {
        answers_str += ` ${i + 1}.`;
      }
      answers_str += request.answers[i];
    }
    var prompt_str = "Допоможи вирішити завдання та дай відповідь лише цифрою(1, 2, 3...): " + request.question + ". Варіанти відповідей: " + answers_str;
    var result = await model.generateContent(prompt_str);
    var responseText = await result.response.text();
  }
  else if (request.type == "multiple_choice_question") {
  var answers_str = "";
  for (var i = 0; i < request.answers.length; i++) {
    if (i == 0) {
      answers_str += "1.";
    } else {
      answers_str += ` ${i + 1}.`;
    }
    answers_str += request.answers[i];
  }
  var prompt_str = "Допоможи вирішити завдання та дай відповідь лише цифрою(1, 2, 3..., без жодних інших слів). Можливі декілька правильних відповідей: " + request.question + ". Варіанти відповідей: " + answers_str;
  var result = await model.generateContent(prompt_str);
      var responseText = await result.response.text();
  }
    return responseText; // Indicate that sendResponse will be called asynchronously
  }

browser.runtime.onMessage.addListener(get_answers);
