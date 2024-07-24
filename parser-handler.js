import { Parser13AMonster } from "./obsidian-13A-monster-parser/assets/scripts/13A-monster-parser.js";

const currentMonster = {
  triggeredAttacks: [],
};
const outputFormat = "obsidian";

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
  copyMonsterToClipboard,
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
  displayText("", "#rawNastierTraits");
  displayText("", "#rawDefenses");
}

function clearTriggeredAttacks() {
  delete currentMonster["triggeredAttacks"];
}

async function copyMonsterToClipboard() {
  const text = document.querySelector("#output").value;

  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error.message);
  }
}

function formatMonsterBlock() {
  switch (outputFormat) {
    case "obsidian":
    default: {
      const output = [
        "```statblock",
        "layout: Basic 13th Age Monster Layout",
        "columns: 1",
        Parser13AMonster.Namespace.BlockWriter.writeFullMonster(currentMonster),
        "```",
      ];

      return output.join("\n");
    }
    case "latex":
      return "";
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

  displayText(formatMonsterBlock(), "#output");
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
  displayText(formatMonsterBlock(), "#output");
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
  displayText(formatMonsterBlock(), "#output");
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
  displayText(formatMonsterBlock(), "#output");
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
  displayText(formatMonsterBlock(), "#output");
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

  displayText(formatMonsterBlock(), "#output");
}
