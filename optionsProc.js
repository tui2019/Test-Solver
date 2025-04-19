import translations from './languages.js';
import { GoogleGenerativeAI } from "./geminiAPI.js";

document.getElementById("APIKey").addEventListener("input", () => getAPIInput("APIKey", "inpStatus"), true);
document.getElementById("APIKey2").addEventListener("input", () => getAPIInput("APIKey2", "inpStatus2"), true);
document.getElementById("exp_logic_enable").addEventListener("change", saveExpLogicState, true);
document.getElementById("languageSelect").addEventListener("change", saveLanguageState, true);

let inputStatus = document.getElementById("inpStatus");
let inputStatus2 = document.getElementById("inpStatus2");
let infoText = document.getElementById("optionInfo");
let expLogicCheckbox = document.getElementById("exp_logic_enable");
let languageSelect = document.getElementById("languageSelect");

// Load and apply selected language
function applyLanguage(langCode) {
    if (!translations[langCode]) {
        langCode = 'en'; // Fallback to English
    }

    const lang = translations[langCode];

    // Update placeholders and text content
    document.getElementById("APIKey").setAttribute("placeholder", lang.settings.apiKeyPlaceholder1);
    document.getElementById("APIKey2").setAttribute("placeholder", lang.settings.apiKeyPlaceholder2);

    const apiLink = document.querySelector("#optionInfo a.text-info");
    const apiInfo = document.querySelector("#optionInfo p.text-light");
    if (apiLink) {
        apiLink.textContent = lang.settings.getApiKey;
    }
    if (apiInfo) {
        apiInfo.textContent = lang.settings.apiKeyInfo;
    }

    // Update experimental logic label
    const expLogicLabel = document.querySelector(".toggle-input label.text-light");
    if (expLogicLabel) {
        expLogicLabel.textContent = lang.settings.enableExperimentalLogic;
    }
}

async function saveLanguageState() {
    await chrome.storage.local.set({ 'userLanguage': languageSelect.value });
    applyLanguage(languageSelect.value);
    chrome.runtime.reload();
}

async function getAPIInput(inputId, statusId) {
    const APIKey_input = document.getElementById(inputId);
    const statusElement = document.getElementById(statusId);

    if(APIKey_input.value.length == 0) {
        statusElement.innerHTML = null;
        return;
    }

    const avalue = APIKey_input.value;
    const tgenAI = new GoogleGenerativeAI(avalue);
    const tmodel = tgenAI.getGenerativeModel({ model: "gemini-2.0-flash" });
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

async function saveExpLogicState() {
    await chrome.storage.local.set({ 'expLogicEnabled': expLogicCheckbox.checked });
    chrome.runtime.reload();
}

async function preserveOptions() {
    try {
        // Handle language selection
        const { userLanguage = 'en' } = await chrome.storage.local.get('userLanguage');
        languageSelect.value = userLanguage;
        applyLanguage(userLanguage);

        // Handle experimental logic checkbox
        const { expLogicEnabled } = await chrome.storage.local.get('expLogicEnabled');
        if(expLogicEnabled !== undefined) {
            expLogicCheckbox.checked = expLogicEnabled;
        }

        // Handle first API key
        const { userGAPI } = await chrome.storage.local.get('userGAPI');
        if(userGAPI !== undefined) {
            const APIKey_input = document.getElementById("APIKey");
            // Preserve the translated placeholder
            const currentLang = translations[languageSelect.value] || translations['en'];
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
