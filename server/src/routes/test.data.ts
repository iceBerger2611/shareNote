import { type CreateNote } from "@app/shared/types";
import { validCreateNote } from "../utils";

export const testData: CreateNote[] = [1, 2, 3, 4, 5, 6].map((num) =>
  validCreateNote(num),
);