// https://aistudio.google.com
// Use VPN to generate and use API key
// https://ai.google.dev/gemini-api/docs/quickstart?lang=web
const API_KEY = "key_here";


function get_ansers(question, answers) {
  alert("Question: " + question + "\nAnswers:\n" + answers.join("\n"));

  (async () => {
    const { GoogleGenerativeAI } = await import("https://esm.run/@google/generative-ai");

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Write a story about a magic backpack.";

    const result = await model.generateContent(prompt);
    alert(result.response.text());
  })();
}



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
