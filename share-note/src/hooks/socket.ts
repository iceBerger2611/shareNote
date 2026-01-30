import { ESocketEvents, type Note } from "@shared";
import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";


export type DispatchType = React.ActionDispatch<[action: {
    event: ESocketEvents;
    note?: Note;
    notesArray?: Note[];
}]>

export const useSocket = (dispatch: DispatchType) => {
    const socketRef = useRef<Socket | null>(null);

     useEffect(() => {
       if (socketRef.current) return;

       const socket = io("http://localhost:3000");
       socketRef.current = socket;

       socket.on("connect", () => {
         console.log(`Socket ${socket.id} connected!`);
       });

       socket.on(ESocketEvents['note:created'].toString(), (note: Note) => {
         dispatch({ event: ESocketEvents["note:created"], note })
       });

       socket.on(ESocketEvents["note:updated"].toString(), (note: Note) => {
         dispatch({ event: ESocketEvents["note:updated"], note });
       });

       socket.on(ESocketEvents["note:deleted"].toString(), (note: Note) => {
         dispatch({ event: ESocketEvents["note:deleted"], note });
       });

       socket.on("disconnect", () => {
         console.log("Socket disconnected");
       });
     }, [dispatch]);
}