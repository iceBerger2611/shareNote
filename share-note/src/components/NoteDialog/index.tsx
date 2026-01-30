import { api } from "@/api/http";
import { useInteractiveNoteValue } from "@/hooks/noteValue";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import type { Note, UpdateNote } from "@shared";

const NoteDialog = ({
  note,
  setOpen,
}: {
  note: Note;
  setOpen: (prev: boolean) => void;
}) => {
  const { noteContent, setNoteContent } = useInteractiveNoteValue({
    id: note.id,
    content: note.content,
  });

  const onContentChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newContent = event.target.value;
    setNoteContent(newContent ?? null);
  };

  const onSaveChanges = async () => {
    if (!noteContent) return;
    const updateNote: UpdateNote = { content: noteContent };
    await api<Note>(`/api/notes/${note.id}`, {
      method: "PATCH",
      body: JSON.stringify({ noteValues: updateNote }),
    });
  };

  return (
    <Dialog open maxWidth='md' fullWidth sx={{ justifyContent: "center" }}>
      <DialogTitle alignSelf="center">
        <Typography variant="h4">{note.title}</Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          minRows={29}
          maxRows={80}
          value={noteContent}
          onChange={onContentChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>close</Button>
        <Button disabled={noteContent === note.content} onClick={onSaveChanges}>
          save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteDialog;
