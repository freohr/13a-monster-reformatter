# Monster Reformatter for the 13th Age RPG

This is an interactive parser and reformatter for monster statblocks provided in the format of the 13th Age RPG. I built it because I wanted to easily copy & paste monster stats in various format for my own campaign management. The parser works automatically on input, and updates the desired output gradually.

The available input formats are:

- **PDF Format:** The simplest one, a monster from an official or 3rd party PDF for 13th Age (or the excellent [Paper and Dice patreon](https://www.patreon.com/paperanddice/posts) (not affiliated, not my work, just good conversions from mostly D&D 5e and older monsters)).
  You will need to split the block yourself, as well as do a bit of manual formatting to make sure the parser works correctly. Non-srd monsters will most likely only be available in this format, and this can also be useful for your own creations (follow the official format, paste it here, then bam, reformatted monsters instead of manually doing each format by hand)

* **SRD HTML:** The raw HTML behind the [SRD Page about Monsters](https://www.13thagesrd.com/monsters/). After downloading the page (right click > "Save page as..."), you can simply paste the table for a given monster here.

The available output formats are:

- **Obsidian Fantasy Statblocks:** A statblock to use with the [Obsidian](https://obsidian.md/) module [Fantasy Statblocks](https://github.com/javalent/fantasy-statblocks). Note that if you only need this output and are using SRD monsters, I recommend directly downloading the [SRD in an Obsidian Vault](https://github.com/Obsidian-TTRPG-Community/13th-Age-SRD-Markdown) as the work of translating, organising & tagging the monsters has already been done (baring a final format verification pass).
- **LaTeX Monster Cards:** A LaTeX document class I made to easily create A6 monster cards to use at the table. More information in the [dedicated repo](https://github.com/freohr/13a-monster-cards).
- **Foundry Monster Importer:** A preformatted monster data for ease of importing in the [Foundry system for 13th Age](https://foundryvtt.com/packages/archmage). Grab the import form macro from [there](https://github.com/freohr/13a-uni-parser/raw/main/foundry-import-macro.js) (made by me as well), create a macro in your world (set to "Global" & "Script"), then use it with the output data from here to easily import your monsters.

## ToDo

- Update statblock parser to match the current 13th Age 2e Beta statblock format (size & strength being actually split, with size only being flavor)
- Create an actual Obsidian plugin around the Reformatter framework, instead of relying on CustomJS to load the 2.5k lines file
  - Then reorganize and split the framework into separate manageable files.
