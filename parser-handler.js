import { MonsterReformatter13A } from "./obsidian-13A-monster-parser/assets/scripts/13A-monster-parser.js";

const currentMonster = new MonsterReformatter13A.Parser.MonsterStatBlock();

let outputFormat = "obsidian";
let inputFormat = "pdf";

// PARSER

export class parser {
  static parseDescription(event) {
    const text = event.srcElement.value;

    if (!text) {
      clearDescription();
      return;
    }

    const monsterParser = new MonsterReformatter13A.Parser.PdfBlockParser(text);
    updateCurrentMonster(monsterParser.parseDescriptionBlock());
  }

  static parseAttacks(event) {
    const text = event.srcElement.value;
    if (!text) {
      clearAttacks();
      return;
    }

    const monsterParser = new MonsterReformatter13A.Parser.PdfBlockParser(text);
    updateCurrentMonster(monsterParser.parseAttackBlock());
  }

  static parseTraits(event) {
    const text = event.srcElement.value;
    if (!text) {
      clearTraits();
      return;
    }

    const monsterParser = new MonsterReformatter13A.Parser.PdfBlockParser(text);
    updateCurrentMonster(monsterParser.parseTraitBlock());
  }

  static parseNastierTraits(event) {
    const text = event.srcElement.value;
    if (!text) {
      clearNastierTraits();
      return;
    }

    const monsterParser = new MonsterReformatter13A.Parser.PdfBlockParser(text);
    updateCurrentMonster(monsterParser.parseNastierTraitBlock());
  }

  static parseDefenses(event) {
    const text = event.srcElement.value;
    if (!text) {
      clearDefenses();
      return;
    }

    const monsterParser = new MonsterReformatter13A.Parser.PdfBlockParser(text);
    updateCurrentMonster(monsterParser.parseDefenseBlock());
  }

  static getMonsterName(event) {
    const text = event.srcElement.value;
    if (!text) {
      clearMonsterName();
      return;
    }

    const newDescription = new MonsterReformatter13A.Parser.MonsterStatBlock(
      text,
    );

    updateCurrentMonster(newDescription);
  }

  static parseHTML(event) {
    const text = event.srcElement.value;
    if (!text) {
      helpers.clearCurrentMonster();
      return;
    }

    const monsterParser =
      MonsterReformatter13A.Parser.SrdHtmlParser.createPureHtmlParser(text);

    updateCurrentMonster(monsterParser.getFullMonster());
  }
}

// HELPERS

export class helpers {
  static changeInputFormat(event) {
    inputFormat = event.srcElement.value;

    if (inputFormat === "html") {
      document.querySelectorAll(".html-input").forEach(showElement);
      document.querySelectorAll(".split-input").forEach(hideElement);
    } else {
      document.querySelectorAll(".html-input").forEach(hideElement);
      document.querySelectorAll(".split-input").forEach(showElement);
    }
  }

  static changeOutputFormat(event) {
    outputFormat = event.srcElement.value;

    if (outputFormat === "foundry") {
      showElement(document.querySelector("#foundry-output"));
      hideElement(document.querySelector("#base-output"));
    } else {
      hideElement(document.querySelector("#foundry-output"));
      showElement(document.querySelector("#base-output"));
    }

    updateDisplay();
  }

  static clearCurrentMonster() {
    currentMonster.clear();

    displayText("", "#output");
    displayText("", "#rawDescription");
    displayText("", "#rawAttacks");
    displayText("", "#rawTraits");
    displayText("", "#rawDefenses");
    displayText("", "#foundry-output#base");
    displayText("", "#foundry-output#items");
  }

  static async copyToClipboard(event) {
    const target = event.srcElement.dataset.for;

    const text = document.querySelector(target).value;

    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error(error.message);
    }
  }
}

// INTERNAL

function displayText(text, target) {
  document.querySelector(target).value = text;
}

function updateDisplay() {
  if (outputFormat === "foundry") {
    const monsterData = formatMonsterBlock();

    displayText(JSON.stringify(monsterData.baseData), "#foundry-output>#base");
    displayText(JSON.stringify(monsterData.itemData), "#foundry-output>#items");
  } else {
    displayText(formatMonsterBlock(), "#output");
  }
}

function hideElement(element) {
  element.classList.toggle("hidden", true);
}

function showElement(element) {
  element.classList.toggle("hidden", false);
}

function displayWarnings() {
  // TODO: display warnings of potential missing fields next to the output
}

function formatMonsterBlock() {
  switch (outputFormat) {
    case "obsidian":
    default: {
      return MonsterReformatter13A.Formatter.ObsidianBlockWriter.writeFullStatblock(
        currentMonster,
      );
    }
    case "latex":
      return MonsterReformatter13A.Formatter.LaTeXBlockWriter.writeMonsterCard(
        currentMonster,
      );
    case "foundry": {
      return {
        baseData:
          MonsterReformatter13A.Formatter.FoundryWriter.createFoundryBaseActorData(
            currentMonster,
          ),
        itemData:
          MonsterReformatter13A.Formatter.FoundryWriter.createFoundryActorItemsData(
            currentMonster,
          ),
      };
    }
  }
}

function updateCurrentMonster(newFields) {
  currentMonster.import(newFields);

  updateDisplay();
}

function deleteField(fieldName) {
  currentMonster[fieldName] = null;
}

function clearDescription() {
  deleteField("fullDescription");
  updateDisplay();
}

function clearAttacks() {
  deleteField("attacks");
  updateDisplay();
}

function clearTraits() {
  deleteField("traits");
  updateDisplay();
}

function clearNastierTraits() {
  deleteField("nastierTraits");
  updateDisplay();
}

function clearDefenses() {
  deleteField("ac");
  deleteField("pd");
  deleteField("md");
  deleteField("hp");

  updateDisplay();
}

function clearMonsterName() {
  deleteField("name");

  updateDisplay();
}
