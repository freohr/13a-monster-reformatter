import { Parser13AMonster } from "./obsidian-13A-monster-parser/assets/scripts/13A-monster-parser.js";

const currentMonster = {};
const outputFormat = "obsidian";

export function clearCurrentMonster() {
  for (let field in currentMonster) {
    if (currentMonster.hasOwnProperty(field)) {
      delete currentMonster[field];
    }
  }

  displayText("", "#output");
  displayText("", "#rawDescription");
  displayText("", "#rawAttacks");
  displayText("", "#rawTraits");
  displayText("", "#rawNastierTraits");
  displayText("", "#rawDefenses");
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
  Object.assign(currentMonster, newFields);

  return formatMonsterBlock();
}

function displayText(text, target) {
  document.querySelector(target).value = text;
}

function getRawText(id) {
  return document.querySelector(id)?.value;
}

export function parseDescription() {
  const text = getRawText("#rawDescription");
  if (!text) {
    return;
  }

  const monsterParser = new Parser13AMonster.Namespace.BlockParser(text);

  displayText(
    updateCurrentMonster({
      fullDescription: monsterParser.parseDescriptionBlock(),
    }),
    "#output",
  );
}

export function parseAttacks() {
  const text = getRawText("#rawAttacks");
  if (!text) {
    return;
  }

  const monsterParser = new Parser13AMonster.Namespace.BlockParser(text);

  displayText(
    updateCurrentMonster(monsterParser.parseAttackBlock()),
    "#output",
  );
}

export function parseTraits() {
  const text = getRawText("#rawTraits");
  if (!text) {
    return;
  }

  const monsterParser = new Parser13AMonster.Namespace.BlockParser(text);

  displayText(
    updateCurrentMonster({ traits: monsterParser.parseTraitBlock() }),
    "#output",
  );
}

export function parseNastierTraits() {
  const text = getRawText("#rawNastierTraits");
  if (!text) {
    return;
  }

  const monsterParser = new Parser13AMonster.Namespace.BlockParser(text);

  displayText(
    updateCurrentMonster({ nastierTraits: monsterParser.parseTraitBlock() }),
    "#output",
  );
}

export function parseDefenses() {
  const text = getRawText("#rawDefenses");
  if (!text) {
    return;
  }

  const monsterParser = new Parser13AMonster.Namespace.BlockParser(text);

  displayText(
    updateCurrentMonster(monsterParser.parseDefenseBlock()),
    "#output",
  );
}
