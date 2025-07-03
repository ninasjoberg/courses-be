import express from "express";
import { db } from "../scripts/createDb.js";
import {
  addApplication,
  getApplications,
} from "../services/applicationService.js";

const router = express.Router();

router.post("/:courseid", async (req, res) => {
  try {
    const { userName, email } = req.body;
    await addApplication(db, req.params.courseid, userName, email);
    res.status(201).send("created");
  } catch (error) {
    console.error("error from /:courseid/apply :", error);
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(400).send("You have already applied for this course");
    }
    res.status(500).send({ message: "server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const applications = await getApplications(db);
    res.json(applications);
  } catch (error) {
    console.error("error from /savedcourses :", error);
    res.status(500).send("server error");
  }
});

export default router;
