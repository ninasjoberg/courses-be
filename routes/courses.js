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

router.post("/savedsearches", async (req, res) => {
  console.log("params", req.body.searchParams);
  try {
    const searchParams = await addSavedSearch(db, req.body.searchParams);
    res.json(searchParams);
  } catch (error) {
    console.log("error from /search :", error);
    res.status(400).send({ message: "bad request" });
  }
});

router.get("/savedsearches", async (req, res) => {
  try {
    const savedSearches = await getSavedSearches(db);
    res.json(savedSearches);
  } catch (error) {
    console.log("error from /search :", error);
    res.status(400).send({ message: "bad request" });
  }
});

router.post("/savedcourses", async (req, res) => {
  try {
    const courses = await addSavedCourse(db, req.body.courseId);
    res.json(courses);
  } catch (error) {
    console.log("error from /search :", error);
    res.status(400).send({ message: "bad request" });
  }
});

router.get("/savedcourses", async (req, res) => {
  try {
    const savedCourses = await getSavedCourses(db);
    res.json(savedCourses);
  } catch (error) {
    console.error("error from / :", error);
    res.status(500).send({ message: "server error" });
  }
});

export default router;
