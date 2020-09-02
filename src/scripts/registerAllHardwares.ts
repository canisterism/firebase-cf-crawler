import { firestore } from "../infrastructure/firestoreConnection";
import { hardwares } from "../domain/models/hardware";

(async () => {
  try {
    console.log("Start Registering All Hardwares.");
    const batch = firestore.batch();

    const hardwareCollection = firestore.collection("hardwares");

    hardwares.forEach((hardware) => {
      console.log(`creating ${hardware.name}...`);
      batch.create(hardwareCollection.doc(), {
        wikiId: hardware.wikiId,
        name: hardware.name,
      });
    });

    batch.commit();

    console.log("Registered All Hardwares.");
  } catch (error) {
    console.error(error);
  }
})();
