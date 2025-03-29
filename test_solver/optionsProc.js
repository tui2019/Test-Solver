import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

document.getElementById("APIKey").addEventListener("input", () => getAPIInput("APIKey", "inpStatus"), true);
document.getElementById("APIKey2").addEventListener("input", () => getAPIInput("APIKey2", "inpStatus2"), true);
document.getElementById("exp_logic_enable").addEventListener("change", saveExpLogicState, true);

let inputStatus = document.getElementById("inpStatus");
let inputStatus2 = document.getElementById("inpStatus2");
let infoText = document.getElementById("optionInfo");
let expLogicCheckbox = document.getElementById("exp_logic_enable");

async function getAPIInput(inputId, statusId) {
    const APIKey_input = document.getElementById(inputId);
    const statusElement = document.getElementById(statusId);

    if(APIKey_input.value.length == 0) {
        statusElement.innerHTML = null;
        return;
    }

    const avalue = APIKey_input.value;
    const tgenAI = new GoogleGenerativeAI(avalue);
    const tmodel = tgenAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    let test = null;
    try {
        test = await tmodel.generateContent("Test");
    }
    catch(error) {
        showError(statusElement);
        return;
    }
    obtainAPI(avalue, inputId);
}

function showError(statusElement) {
    statusElement.innerHTML = "error";
    if(statusElement.classList.contains("text-success")) {
        statusElement.classList.replace("text-success", "text-danger");
    }
}

function obtainAPI(apiv, inputId) {
    // Store the API key in the appropriate slot
    if (inputId === "APIKey") {
        window.localStorage.setItem('userGAPI', apiv);
    } else {
        // If the first API key isn't set, also set it with this value
      if (!window.localStorage.getItem('userGAPI')) {
        window.localStorage.setItem('userGAPI', apiv);
      }
      else {
        window.localStorage.setItem('userGAPI2', apiv);
      }
    }

    preserveOptions();
    browser.runtime.reload();
}

function preserveOptions() {
    // Handle experimental logic checkbox
    const expLogicEnabled = window.localStorage.getItem('expLogicEnabled');
    if(expLogicEnabled !== null) {
        expLogicCheckbox.checked = expLogicEnabled === 'true';
    }

    // Handle first API key
    const apiOption = window.localStorage.getItem('userGAPI');
    if(apiOption !== null) {
        const APIKey_input = document.getElementById("APIKey");
        APIKey_input.setAttribute("placeholder", apiOption);
        APIKey_input.setAttribute("disabled", true);
        inputStatus.innerHTML = "check_circle";
        inputStatus.classList.replace("text-danger", "text-success");
    }

    // Handle second API key
    const apiOption2 = window.localStorage.getItem('userGAPI2');
    if(apiOption2 !== null) {
        const APIKey_input2 = document.getElementById("APIKey2");
        APIKey_input2.setAttribute("placeholder", apiOption2);
        APIKey_input2.setAttribute("disabled", true);
        inputStatus2.innerHTML = "check_circle";
        inputStatus2.classList.replace("text-danger", "text-success");
    }

    // Update info text if at least one API key is set
    if(apiOption !== null || apiOption2 !== null) {

    } else {
        // Clear local storage if no API keys are set
        window.localStorage.removeItem('userGAPI');
        window.localStorage.removeItem('userGAPI2');
    }
}

function saveExpLogicState() {
    window.localStorage.setItem('expLogicEnabled', expLogicCheckbox.checked);
    browser.runtime.reload();
}

window.onload = preserveOptions();
