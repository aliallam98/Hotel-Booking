import express from "express";
import {config} from "dotenv"
// import cookieParser from "cookie-parser"
// import cors from "cors"

const app = express();
config()
const port = process.env.PORT || 5000;


// app.use(cookieParser());
// app.use(express.json());
// app.use(
//   cors({
//     origin: "*", //process.env_FRONTEND_URL 
//     credentials: true,
//   })
// );

// Routes
// app.use("/api/auth");
// app.use("/api/user");
// app.use("/api/hotel");
// app.use("/api/booking");

app.listen(port, () => console.log(`server is listening on port : ${port}`));
