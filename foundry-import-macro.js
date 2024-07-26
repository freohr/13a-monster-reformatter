class FoundryImporter {
  static async importMonster() {
    try {
      const actorDataString = await this.#createForm();

      const actorBaseData = JSON.parse(actorDataString.baseData);
      const actorItemData = JSON.parse(actorDataString.itemData);

      const actor = await this.#createFoundryActor(
        actorBaseData,
        actorItemData,
      );
      ui.notifications.info(
        `Successfully imported monster ${actorBaseData.name} as actor ${actor.id}`,
      );
    } catch (error) {
      console.error(`Error when importing monster: ${error}`);
    }
  }

  static async #createFoundryActor(actorData, actorItemData) {
    const actor = await Actor.create(actorData);
    await actor.createEmbeddedDocuments("Item", actorItemData);
    return actor;
  }

  static async #createForm() {
    const inputForm = `<form>
    <div>
        <h2>Input the monster data to be imported</h2>
        <label for="descriptionField">Monster Base Data</label>
        <textarea name="descriptionField" id="descriptionField" rows="10" cols="100"></textarea>
        <label for="itemField">Monster Item Data (attacks, traits, etc.)</label>
        <textarea name="itemField" id="itemField" rows="10" cols="100"></textarea>
    </div>
</form>`;

    const prom = new Promise((resolve, reject) => {
      new Dialog({
        title: "Monster Statblock Parser",
        content: inputForm,
        width: 300,
        height: 600,
        resizable: true,
        scrollY: 0,
        buttons: {
          yes: {
            icon: "<i class='fas fa-check'></i>",
            label: "Parse",
            callback: (html) => {
              const description = html
                .find("textarea[name='descriptionField']")
                ?.val();
              const items = html.find("textarea[name='itemField']")?.val();

              const result = {
                baseData: description,
                itemData: items,
              };

              resolve(result);
            },
          },
        },
        default: "yes",
        close: (_) => {
          reject();
        },
      }).render(true);
    });

    const value = await prom
      .then((value) => value)
      .catch((err) => {
        ui.notifications.error(err);
      });

    return value;
  }
}

if (game !== undefined) {
  FoundryImporter.importMonster();
}
