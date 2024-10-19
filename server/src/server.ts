import dotenv from "dotenv";
import server from "./app";

dotenv.config();

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
