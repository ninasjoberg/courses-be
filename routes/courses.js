import express from "express";
import { db } from "../scripts/createDb.js";
import {
  get,
  getBySearch,
  addSavedSearch,
  addSavedCourse,
  getSavedCourses,
  getSavedSearches,
} from "../services/courseService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const courses = await get(db, limit);
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
    res.status(500).send({ message: "server error" });
  }
});

router.post("/savedsearches", async (req, res) => {
  console.log("params", req.body.searchParams);
  try {
    await addSavedSearch(db, req.body.searchParams);
    res.status(201).send("created");
  } catch (error) {
    console.log("error from /savedsearches:", error);
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res
        .status(400)
        .send({ message: "You have already saved this course" });
    }
    res.status(500).send({ message: "server error" });
  }
});

router.get("/savedsearches", async (req, res) => {
  try {
    const savedSearches = await getSavedSearches(db);
    res.json(savedSearches);
  } catch (error) {
    console.log("error from /savedsearches :", error);
    res.status(500).send({ message: "server error" });
  }
});

router.post("/savedcourses", async (req, res) => {
  try {
    await addSavedCourse(db, req.body.courseId);
    res.status(201).send("created");
  } catch (error) {
    console.log("error from /savedcourses :", error);
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res
        .status(400)
        .send({ message: "You have already saved this course" });
    }
    res.status(500).send({ message: "server error" });
  }
});

router.get("/savedcourses", async (req, res) => {
  try {
    const savedCourses = await getSavedCourses(db);
    res.json(savedCourses);
  } catch (error) {
    console.error("error from /savedcourses :", error);
    res.status(500).send({ message: "server error" });
  }
});

router.post("/:courseid/apply", async (req, res) => {
  try {
    const { userName, email } = req.body;
    await addApplication(db, req.params.courseid, userName, email);
    res.status(201).send("created");
  } catch (error) {
    console.error("error from /:courseid/apply :", error);
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res
        .status(400)
        .send({ message: "You have already applied for this course" });
    }
    res.status(500).send({ message: "server error" });
  }
});

export default router;
