import express, { Application, Request, Response } from "express";
import cors from "cors";
import routes from "./app/routes";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(cors());

// parser
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Working Successfully");
});

export default app;
