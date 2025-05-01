import fastify from "fastify"
import createPoll from './routes/create-poll';
import getPoll from "./routes/get-poll";
import voteOnPoll from "./routes/vote-on-poll";
import listPolls from "./routes/list-poll";
import cookie from "@fastify/cookie"
import fastifyWebsocket from "@fastify/websocket";
import { pollResults } from "./ws/poll-results";
import cors from "@fastify/cors";
import dotenv from "dotenv";

dotenv.config();

const app = fastify()
const PORT = parseInt(process.env.PORT || "3333");

app.register(cookie, {
  secret: process.env.COOKIE_SECRET || "default-secret",
  hook: "onRequest",
})

app.register(cors, {
  origin: process.env.CORS_ORIGIN || true, 
  credentials: true,
})

app.register(fastifyWebsocket)

app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)
app.register(listPolls)
app.register(pollResults)

app.listen({ port: PORT }).then(() => {
  console.log("HTTP server is running!", PORT)
})
