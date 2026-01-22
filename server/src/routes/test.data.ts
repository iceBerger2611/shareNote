import { createNote } from "@app/shared";
import { validCreateNote } from "../utils";

export const testData: createNote[] = [1, 2, 3, 4, 5, 6].map((num) => validCreateNote(num));