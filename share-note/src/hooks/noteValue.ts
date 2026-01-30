/* eslint-disable react-hooks/set-state-in-effect */
import { type Note } from "@shared";
import { useEffect, useState } from "react";

export const useInteractiveNoteValue = ({
  id,
  content,
}: {
  id: Note["id"];
  content?: Note["content"];
}) => {
  const [noteContent, setNoteContent] = useState<typeof content>(content);

  useEffect(() => {
    setNoteContent((curr) => {
      const incoming = content ?? "";
      return curr === incoming ? curr : incoming;
    });
  }, [id, content]);

  return { noteContent, setNoteContent };
};
