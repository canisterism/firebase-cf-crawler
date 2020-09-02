import { firestore } from "../../infrastructure/firestoreConnection";
import { Game } from "../../domain/models/game";

export async function registerGame(game: Game): Promise<void> {
  try {
    // hardwareのnameでhardwareのReferenceを取ってくる
    // wikiIdベースでgameの存在チェック
    //   存在する: doc.update({hardwareIds:FieldValue.arrayUnion(hardwareID)})
    //   存在しない: doc.add({...})

    return;
  } catch (error) {
    console.error(error);
    return;
  }
}
