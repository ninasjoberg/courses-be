import express from "express";
import cors from "cors";
import courses from "./routes/courses.js";

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/courses", courses);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
