import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

document.getElementById("APIKey").addEventListener("input", getAPIInput, true);
let APIKey_input = document.getElementById("APIKey");
let inputStatus = document.getElementById("inpStatus");
let infoText = document.getElementById("optionInfo");

async function getAPIInput()
{

    if(APIKey_input.value.length == 0)
    {
        inputStatus.innerHTML = null;
        return;
    }

    const avalue =  APIKey_input.value;
    const tgenAI = new GoogleGenerativeAI(avalue);
    const tmodel = tgenAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    let test = null;
    try
    {
        test = await tmodel.generateContent("Test");
    }
    catch(error)
    {
        showError();
        return;
    }
    obtainAPI(avalue);
}


function showError()
{

    inputStatus.innerHTML = "error";
    if(inputStatus.classList.contains("text-success"))
    {

        inputStatus.classList.replace("text-success", "text-danger");
    }
}


function obtainAPI(apiv)
{

    window.localStorage.setItem('userGAPI', apiv);
    preserveOptions();
    browser.runtime.reload();
}


function preserveOptions()
{

    const apiOption = window.localStorage.getItem('userGAPI');
    if(apiOption == null)
    {
        window.localStorage.clear();
        return;
    }
    APIKey_input.setAttribute("placeholder", apiOption);
    APIKey_input.setAttribute("disabled", true);
    inputStatus.innerHTML = "check_circle";
    infoText.innerHTML = "You are ready to use this add-on now!";
    infoText.setAttribute("class", "text-info");
    infoText.setAttribute("style", "font-size: 19px;")
    inputStatus.classList.replace("text-danger", "text-success");
}


window.onload = preserveOptions();
