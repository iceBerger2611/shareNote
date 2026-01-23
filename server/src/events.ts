import { Events } from "@app/shared/types"
import { Server as IOServer } from "socket.io"
import { ESocketEvents } from '@app/shared/consts'

export const makeEvents = (io: IOServer): Events => ({
  noteCreated: (note) => io.emit(ESocketEvents["note:created"].toString(), note),
  noteUpdate: (note) => io.emit(ESocketEvents["note:updated"].toString(), note),
  noteDeleted: (note) => io.emit(ESocketEvents["note:deleted"].toString(), note),
});