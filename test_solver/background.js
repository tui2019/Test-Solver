// https://aistudio.google.com
// https://ai.google.dev/gemini-api/docs/quickstart?lang=web
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
var genAI = new GoogleGenerativeAI("API KEY");
var model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });



async function get_answers(request, sender, sendResponse) {
  var answers_str = "";
  for (var i = 0; i < request.answers.length; i++) {
    if (i == 0) {
      answers_str += "1.";
    } else {
      answers_str += ` ${i + 1}.`;
    }
    answers_str += request.answers[i];
  }
  if(answers_str.len<=0){
    var prompt_str = "Допоможи вирішити завдання та дай розгорнуту відповідь на наступне запитання " + request.question;  
  }
  else{
  var prompt_str = "Допоможи вирішити завдання та дай відповідь лише цифрою(1, 2, 3...) можливі декілька правильних відповідей, без жодних інших слів: " + request.question + ". Варіанти відповідей: " + answers_str;
  }
      var result = await model.generateContent(prompt_str);
      var responseText = await result.response.text();
      // sendResponse({ response: responseText });
    return responseText; // Indicate that sendResponse will be called asynchronously
  }


browser.runtime.onMessage.addListener(get_answers);
