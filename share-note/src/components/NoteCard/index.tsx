import { Card, CardActions, CardContent, IconButton, Skeleton } from "@mui/material";
import type { Note } from "@shared";
import { Delete } from "@mui/icons-material";
import { api } from "@/api/http";
import { useState } from "react";
import NoteDialog from "../NoteDialog";

const NoteCard = ({ note }: { note: Note }) => {
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState<boolean>(false);

  const onDelete = async () => {
    await api<Note>(`/api/notes/${note.id}`, { method: "DELETE" });
  };

  return (
    <>
      {isNoteDialogOpen && (
        <NoteDialog note={note} setOpen={setIsNoteDialogOpen} />
      )}
      <Card
        sx={{ margin: "2px", borderRadius: '16px', ":hover": { cursor: 'pointer', border: '3px solid blue', margin: 0 } }}
        onDoubleClick={() => setIsNoteDialogOpen(true)}
      >
        {note.title}
        <CardContent>
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
        </CardContent>
        <CardActions>
          <IconButton onClick={onDelete}>
            <Delete />
          </IconButton>
        </CardActions>
      </Card>
    </>
  );
};

export default NoteCard;
