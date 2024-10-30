// Fetch your API_KEY
var key = "insert_your_key_here";

function get_ansers(question, answers) {
  alert("Question: " + question + "\n\nAnswers:\n" + answers.join("\n"));
}


// inserting required scripts into html
// https://aistudio.google.com
// Use VPN to generate API key
// https://ai.google.dev/gemini-api/docs/quickstart?lang=web
var head = document.getElementsByTagName("head")[0];
var script1 = document.createElement("script");
script1.type = "importmap";
script1.innerHTML = '{"imports": {"@google/generative-ai": "https://esm.run/@google/generative-ai"}}'

var script2 = document.createElement("script");
script2.type = "module";
script2.innerHTML = 'import { GoogleGenerativeAI } from "@google/generative-ai"; const API_KEY = ' + key + ';'

head.appendChild(script1);
head.appendChild(script2);

// getting questions and answers and creating event listener
var questions = document.getElementsByClassName("geS5n");
for (var i = 0; i < questions.length; i++) {
  var question = questions[i];
  var questionText = question.getElementsByClassName("M7eMe")[0];

  questionText.ondblclick = function () {
    var answers = [];
    for (var j = 0; j < this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("nWQGrd").length; j++) {
      answers.push(
        this.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("nWQGrd")[j].getElementsByTagName("span")[0].innerText,
      );
    }
    get_ansers(this.innerText, answers);
  };
}
