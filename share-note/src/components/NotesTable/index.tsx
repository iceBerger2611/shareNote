import { type Note } from "@shared";
import { CircularProgress, Grid } from "@mui/material";
import NoteCard from "../NoteCard";

const NotesTable = ({ notes }: { notes: Note[] }) => {
  return (
    <Grid container spacing={2} paddingTop="10px" direction='row-reverse'>
      {notes.length === 0 ? (
        <CircularProgress />
      ) : (
        notes.map((note) => (
          <Grid key={note.id} size={2}>
            <NoteCard note={note} />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default NotesTable;
