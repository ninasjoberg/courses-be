import express from "express";
import { db } from "../scripts/createDb.js";
import {
  get,
  getBySearch,
  addSaveSearch,
  addSaveCourse,
} from "../services/courseService.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const courses = get(db, limit);
    res.json(courses);
  } catch (error) {
    console.error("error from / :", error);
    res.status(500).send({ message: "server error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const courses = await getBySearch(db, req.query);
    res.json(courses);
  } catch (error) {
    console.log("error from /search :", error);
    res.status(400).send({ message: "bad request" });
  }
});

router.post("/saveSearch", async (req, res) => {
  try {
    const courses = await addSaveSearch(db, req.body.query);
    res.json(courses);
  } catch (error) {
    console.log("error from /search :", error);
    res.status(400).send({ message: "bad request" });
  }
});

router.post("/saveCourse", async (req, res) => {
  try {
    const courses = await addSaveCourse(db, req.body.courseId);
    res.json(courses);
  } catch (error) {
    console.log("error from /search :", error);
    res.status(400).send({ message: "bad request" });
  }
});

export default router;
