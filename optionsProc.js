import translations from './languages.js';
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

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

function saveLanguageState() {
    window.localStorage.setItem('userLanguage', languageSelect.value);
    applyLanguage(languageSelect.value);
    browser.runtime.reload();
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

function saveExpLogicState() {
    window.localStorage.setItem('expLogicEnabled', expLogicCheckbox.checked);
    browser.runtime.reload();
}

function preserveOptions() {
    // Handle language selection
    const savedLanguage = window.localStorage.getItem('userLanguage') || 'en';
    languageSelect.value = savedLanguage;
    applyLanguage(savedLanguage);

    // Handle experimental logic checkbox
    const expLogicEnabled = window.localStorage.getItem('expLogicEnabled');
    if(expLogicEnabled !== null) {
        expLogicCheckbox.checked = expLogicEnabled === 'true';
    }

    // Handle first API key
    const apiOption = window.localStorage.getItem('userGAPI');
    if(apiOption !== null) {
        const APIKey_input = document.getElementById("APIKey");
        // Preserve the translated placeholder
        const currentLang = translations[languageSelect.value] || translations['en'];
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

    // Update info text if no API keys are set
    if(apiOption === null && apiOption2 === null) {
        // Clear local storage if no API keys are set
        window.localStorage.removeItem('userGAPI');
        window.localStorage.removeItem('userGAPI2');
    }
}

// Initialize the extension
window.onload = function() {
    preserveOptions();
};
