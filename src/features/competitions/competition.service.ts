import {
  addDoc,
  collection,
} from "firebase/firestore";

import { db } from "../../lib/firebase";

import { Competition } from "./competition.types";

export async function createCompetition(
  data: Competition
) {
  const docRef = await addDoc(
    collection(db, "competitions"),
    data
  );

  return docRef.id;
}