import { GoogleGenerativeAI } from "./geminiAPI.js";

document.getElementById("APIKey").addEventListener("input", () => getAPIInput("APIKey", "inpStatus"), true);
document.getElementById("APIKey2").addEventListener("input", () => getAPIInput("APIKey2", "inpStatus2"), true);
document.getElementById("clearKeys").addEventListener("click", clearKeys, true);

let inputStatus = document.getElementById("inpStatus");
let inputStatus2 = document.getElementById("inpStatus2");
let infoText = document.getElementById("optionInfo");

async function getAPIInput(inputId, statusId) {
    const APIKey_input = document.getElementById(inputId);
    const statusElement = document.getElementById(statusId);

    if(APIKey_input.value.length == 0) {
        statusElement.innerHTML = null;
        return;
    }

    const avalue = APIKey_input.value;
    const tgenAI = new GoogleGenerativeAI(avalue);
    const tmodel = tgenAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
    let test = null;
    try {
        test = await tmodel.generateContent("Test");
    }
    catch(error) {
        showError(statusElement);
        return;
    }
    await obtainAPI(avalue, inputId);
}

function showError(statusElement) {
    statusElement.innerHTML = "error";
    if(statusElement.classList.contains("text-success")) {
        statusElement.classList.replace("text-success", "text-danger");
    }
}

async function obtainAPI(apiv, inputId) {
    // Store the API key in the appropriate slot
    if (inputId === "APIKey") {
        await chrome.storage.local.set({ 'userGAPI': apiv });
    } else {
        // If the first API key isn't set, also set it with this value
        const result = await chrome.storage.local.get('userGAPI');
        if (!result.userGAPI) {
            await chrome.storage.local.set({ 'userGAPI': apiv });
        } else {
            await chrome.storage.local.set({ 'userGAPI2': apiv });
        }
    }

    preserveOptions();
    chrome.runtime.reload();
}

async function clearKeys() {
    await chrome.storage.local.remove(['userGAPI', 'userGAPI2']);

    const APIKey_input = document.getElementById("APIKey");
    APIKey_input.removeAttribute("disabled");
    APIKey_input.setAttribute("placeholder", "API Key 1");
    APIKey_input.value = "";
    inputStatus.innerHTML = "";
    inputStatus.classList.replace("text-success", "text-danger");

    const APIKey_input2 = document.getElementById("APIKey2");
    APIKey_input2.removeAttribute("disabled");
    APIKey_input2.setAttribute("placeholder", "API Key 2 (optional)");
    APIKey_input2.value = "";
    inputStatus2.innerHTML = "";
    inputStatus2.classList.replace("text-success", "text-danger");

    chrome.runtime.reload();
}

async function preserveOptions() {
    try {
        // Handle first API key
        const { userGAPI } = await chrome.storage.local.get('userGAPI');
        if(userGAPI !== undefined) {
            const APIKey_input = document.getElementById("APIKey");
            APIKey_input.setAttribute("placeholder", userGAPI);
            APIKey_input.setAttribute("disabled", true);
            inputStatus.innerHTML = "check_circle";
            inputStatus.classList.replace("text-danger", "text-success");
        }

        // Handle second API key
        const { userGAPI2 } = await chrome.storage.local.get('userGAPI2');
        if(userGAPI2 !== undefined) {
            const APIKey_input2 = document.getElementById("APIKey2");
            APIKey_input2.setAttribute("placeholder", userGAPI2);
            APIKey_input2.setAttribute("disabled", true);
            inputStatus2.innerHTML = "check_circle";
            inputStatus2.classList.replace("text-danger", "text-success");
        }

        // Update info text if no API keys are set
        if(userGAPI === undefined && userGAPI2 === undefined) {
            // Clear storage if no API keys are set
            await chrome.storage.local.remove(['userGAPI', 'userGAPI2']);
        }
    } catch (error) {
        console.error("Error preserving options:", error);
    }
}

// Initialize the extension
window.onload = function() {
    preserveOptions();
};