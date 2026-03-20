import http from "http";
import app from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { initializeSocketServer } from "./sockets/socketServer.js";

const startServer = async () => {
  await connectDb();
  const server = http.createServer(app);
  initializeSocketServer(server);

  server.listen(env.port, () => {
    console.log(`Backend listening on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
