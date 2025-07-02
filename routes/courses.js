import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send({ message: "Hello from Courses endpoint" });
});

export default router;
