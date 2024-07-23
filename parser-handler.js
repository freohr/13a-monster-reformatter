import { Parser13AMonster } from "./obsidian-13A-monster-parser/assets/scripts/13A-monster-parser.js";

const currentMonster = {
  triggeredAttacks: [],
};
const outputFormat = "obsidian";

export const parser = {
  clearCurrentMonster,
  parseDescription,
  parseAttacks,
  parseTraits,
  parseNastierTraits,
  parseDefenses,
};

function clearCurrentMonster() {
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
  return formatMonsterBlock();
}

function displayText(text, target) {
  document.querySelector(target).value = text;
}

function parseDescription(event) {
  const text = event.srcElement.value;

  if (!text) {
    return;
  }

  const monsterParser = new Parser13AMonster.Namespace.PdfBlockParser(text);

  displayText(
    updateCurrentMonster({
      fullDescription: monsterParser.parseDescriptionBlock(),
    }),
    "#output",
  );
}

function parseAttacks(event) {
  const text = event.srcElement.value;
  if (!text) {
    return;
  }

  const monsterParser = new Parser13AMonster.Namespace.PdfBlockParser(text);

  displayText(
    updateCurrentMonster(monsterParser.parseAttackBlock()),
    "#output",
  );
}

function parseTraits(event) {
  const text = event.srcElement.value;
  if (!text) {
    return;
  }

  const monsterParser = new Parser13AMonster.Namespace.PdfBlockParser(text);

  displayText(updateCurrentMonster(monsterParser.parseTraitBlock()), "#output");
}

function parseNastierTraits(event) {
  const text = event.srcElement.value;
  if (!text) {
    return;
  }

  const monsterParser = new Parser13AMonster.Namespace.PdfBlockParser(text);

  displayText(
    updateCurrentMonster({ nastierTraits: monsterParser.parseTraitBlock() }),
    "#output",
  );
}

function parseDefenses(event) {
  const text = event.srcElement.value;
  if (!text) {
    return;
  }

  const monsterParser = new Parser13AMonster.Namespace.PdfBlockParser(text);

  displayText(
    updateCurrentMonster(monsterParser.parseDefenseBlock()),
    "#output",
  );
}
