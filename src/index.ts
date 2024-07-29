import Express from "express"
import { Server } from "socket.io"
import { address } from "ip"
import { config } from "dotenv"
import cors from "cors"
import { createServer } from "http"

config()

const app = Express()

app.use(cors())
app.use(Express.json())

const PORT = process.env.PORT ?? 3000

app.get("/", (_, res) => {
  res.json({ message: "LocalClipboard Websocket", ip: address() })
})

const socketServer = createServer(app)
const io = new Server(socketServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log(socket.handshake.query.user + " is connected.")

  socket.on("add-to-clipboard", async (data: { value: string }) =>
    socket.broadcast.emit("add-to-clipboard", data)
  )

  socket.on("disconnect", () =>
    console.log(socket.handshake.query.user + " is disconnected.")
  )
})

socketServer.listen(PORT, () =>
  console.log(`LocalClipboard Websocket at PORT ${PORT}`)
)
