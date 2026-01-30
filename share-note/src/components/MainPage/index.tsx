import { CircularProgress, Stack } from "@mui/material"
import TopRuler from "../TopRuler"
import NotesTable from "../NotesTable"
import { useEffect, useReducer } from "react";
import { noteReducer } from "@/reducers/notes";
import { useSocket } from "@/hooks/socket";
import { api } from "@/api/http";
import { ESocketEvents, type Note } from "@shared";

const MainPage = () => {
    const [notesAcc, dispatch] = useReducer(noteReducer, {});
    
      useSocket(dispatch);
    
      useEffect(() => {
        api<Note[]>("/api/notes").then((notes) =>
          dispatch({ event: ESocketEvents["notes:loaded"], notesArray: notes }),
        );
      }, []);

    return (
      <Stack direction="column">
        <TopRuler />
        {Object.values(notesAcc).length === 0 ? (
          <CircularProgress />
        ) : (
          <NotesTable notes={Object.values(notesAcc)} />
        )}
      </Stack>
    );
}

export default MainPage