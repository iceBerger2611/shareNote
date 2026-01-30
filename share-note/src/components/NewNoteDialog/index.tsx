import { api } from "@/api/http";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import type { CreateNote, Note } from "@shared";
import { useState } from "react";

const NewNoteDialog = ({
  open,
  setIsOpen,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const [title, setTitle] = useState<string | null>(null);

  const onCancel = () => setIsOpen(false);

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.stopPropagation()
    setTitle(event.target.value)
  }

  const onConfirm = async () => {
    if (!title) return
    const createNote: CreateNote = { title: title }
    const res = await api<Note>("/api/notes", { method: 'POST', body: JSON.stringify({ noteValues: createNote }) });
    if (res.id) setIsOpen(false)
  }
  return (
    <Dialog open={open}>
      <DialogContent>
        <TextField label='Enter Title' value={title} onChange={onTitleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>cancel</Button>
        <Button disabled={!title} onClick={onConfirm}>
          confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewNoteDialog;
