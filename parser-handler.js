import { Parser13AMonster } from "./obsidian-13A-monster-parser/assets/scripts/13A-monster-parser.js";

const currentMonster = {
  triggeredAttacks: [],
};
let outputFormat = "obsidian";

export const parser = {
  parseDescription,
  parseAttacks,
  parseTraits,
  parseNastierTraits,
  parseDefenses,
};

export const helpers = {
  clearCurrentMonster,
  clearTriggeredAttacks,
  copyToClipboard,
  changeOutputFormat,
};

function displayText(text, target) {
  document.querySelector(target).value = text;
}

function clearCurrentMonster() {
  for (let field in currentMonster) {
    if (currentMonster.hasOwnProperty(field)) {
      delete currentMonster[field];
    }
  }

  currentMonster.triggeredAttacks = [];

  displayText("", "#output");
  displayText("", "#rawDescription");
  displayText("", "#rawAttacks");
  displayText("", "#rawTraits");
  displayText("", "#rawDefenses");
  displayText("", ".foundry-output#base");
  displayText("", ".foundry-output#items");
}

function clearTriggeredAttacks() {
  delete currentMonster["triggeredAttacks"];
}

async function copyToClipboard(event) {
  const target = event.srcElement.dataset.for;

  const text = document.querySelector(target).value;

  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error.message);
  }
}

function updateDisplay() {
  if (outputFormat === "foundry") {
    const monsterData = formatMonsterBlock();

    displayText(JSON.stringify(monsterData.baseData), ".foundry-output#base");
    displayText(JSON.stringify(monsterData.itemData), ".foundry-output#items");
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

function changeOutputFormat(event) {
  outputFormat = event.srcElement.value;

  if (outputFormat === "foundry") {
    document.querySelectorAll(".foundry-output").forEach(showElement);
    document.querySelectorAll(".base-output").forEach(hideElement);
  } else {
    document.querySelectorAll(".foundry-output").forEach(hideElement);
    document.querySelectorAll(".base-output").forEach(showElement);
  }

  updateDisplay();
}

function displayWarnings() {
  if (!currentMonster.name) {
  }

  if (Parser13AMonster.Namespace.Helpers.isEmpty(currentMonster.attacks)) {
  }

  if (Parser13AMonster.Namespace.Helpers.isEmpty(currentMonster.traits)) {
  }
}

function formatMonsterBlock() {
  switch (outputFormat) {
    case "obsidian":
    default: {
      return Parser13AMonster.Namespace.ObsidianBlockWriter.writeFullStatblock(
        currentMonster,
      );
    }
    case "latex":
      return Parser13AMonster.Namespace.LaTeXBlockWriter.writeMonsterCard(
        currentMonster,
      );
    case "foundry": {
      return {
        baseData:
          Parser13AMonster.Namespace.FoundryParser.createFoundryBaseActorData(
            currentMonster,
          ),
        itemData:
          Parser13AMonster.Namespace.FoundryParser.createFoundryActorItemsData(
            currentMonster,
          ),
      };
    }
  }
}

function updateCurrentMonster(newFields) {
  // Deal with Triggered attacks manually
  // Since they can be in the middle of traits or in their dedicated blocks, they can be parsed in multiple places
  // So we need to manage a manual Set of those (because JS can't deal with a custom hashing for their Set)
  let triggeredAttacks = [];
  if (Object.hasOwn(newFields, "triggeredAttacks")) {
    triggeredAttacks = [...newFields.triggeredAttacks];
    delete newFields["triggeredAttacks"];
  }

  for (let attack of triggeredAttacks) {
    if (!currentMonster.triggeredAttacks.some((a) => attack.equals(a))) {
      currentMonster.triggeredAttacks.push(attack);
    }
  }

  // Do the rest, replacing a block instead of concatenating
  Object.assign(currentMonster, newFields);

  updateDisplay();
}

function parseDescription(event) {
  const text = event.srcElement.value;

  if (!text) {
    clearDescription();
    return;
  }

  const monsterParser = new Parser13AMonster.Namespace.PdfBlockParser(text);
  updateCurrentMonster({
    fullDescription: monsterParser.parseDescriptionBlock(),
  });
}

function deleteField(fieldName) {
  if (Object.hasOwn(currentMonster, fieldName)) {
    delete currentMonster[fieldName];
  }
}

function clearDescription() {
  deleteField("fullDescription");
  updateDisplay();
}

function parseAttacks(event) {
  const text = event.srcElement.value;
  if (!text) {
    clearAttacks();
    return;
  }

  const monsterParser = new Parser13AMonster.Namespace.PdfBlockParser(text);
  updateCurrentMonster(monsterParser.parseAttackBlock());
}

function clearAttacks() {
  deleteField("attacks");
  updateDisplay();
}

function parseTraits(event) {
  const text = event.srcElement.value;
  if (!text) {
    clearTraits();
    return;
  }

  const monsterParser = new Parser13AMonster.Namespace.PdfBlockParser(text);
  updateCurrentMonster(monsterParser.parseTraitBlock());
}

function clearTraits() {
  deleteField("traits");
  updateDisplay();
}

function parseNastierTraits(event) {
  const text = event.srcElement.value;
  if (!text) {
    clearNastierTraits();
    return;
  }

  const monsterParser = new Parser13AMonster.Namespace.PdfBlockParser(text);
  updateCurrentMonster(monsterParser.parseNastierTraitBlock());
}

function clearNastierTraits() {
  deleteField("nastierTraits");
  updateDisplay();
}

function parseDefenses(event) {
  const text = event.srcElement.value;
  if (!text) {
    clearDefenses();
    return;
  }

  const monsterParser = new Parser13AMonster.Namespace.PdfBlockParser(text);
  updateCurrentMonster(monsterParser.parseDefenseBlock());
}

function clearDefenses() {
  deleteField("ac");
  deleteField("pd");
  deleteField("md");
  deleteField("hp");

  updateDisplay();
}
