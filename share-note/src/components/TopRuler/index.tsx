import { Button, Stack } from "@mui/material";
import NewNoteDialog from "../NewNoteDialog";
import { useState } from "react";

const TopRuler = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <>
      <NewNoteDialog
        open={isCreateDialogOpen}
        setIsOpen={setIsCreateDialogOpen}
      />
      <Stack direction="row" justifyContent="space-between">
        <Button
          onClick={() => setIsCreateDialogOpen((prevOpen) => !prevOpen)}
        //   sx={{
        //       border: "1px solid red",
        //     }}
            >
          add new note
        </Button>
            <Button>
                filter
            </Button>
      </Stack>
    </>
  );
};

export default TopRuler;
