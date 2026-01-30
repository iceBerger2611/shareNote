import { ESocketEvents, type Note } from "@shared";
import { type Reducer } from "react";

const transformNotesArrayToRecord = (arr: Note[]): Record<string, Note> => {
  return arr.reduce<Record<string, Note>>((acc, note) => {
    if (note.id) {
      acc[note.id] = note;
    }
    return acc;
  }, {});
};

export const noteReducer: Reducer<Record<string, Note>, { event: ESocketEvents, note?: Note, notesArray?: Note[] }> = (
  prevState,
  action,
) => {
    let newState: Record<string, Note> = { ...prevState } 
    switch (action.event) {
        case ESocketEvents['notes:loaded']:
            if (!action.notesArray) {
                newState = {}
                break
            }
            newState = transformNotesArrayToRecord(action.notesArray);
            break;
        case ESocketEvents['note:created']:
            if (action.note) newState[action.note.id] = action.note;
            break;
        case ESocketEvents['note:updated']:
            if (action.note && newState[action.note.id]) {
              newState[action.note.id] = action.note;
            }
            break;
        case ESocketEvents['note:deleted']: 
            if (action.note && newState[action.note.id]) {
              delete newState[action.note.id];
            }
            break;
        default:
            break;
    }
  return newState;
};
