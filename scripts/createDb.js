import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";
import stripBom from "strip-bom-stream";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const db = new Database(path.join(__dirname, "../db/data.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS savedSearches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT UNIQUE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS savedCourses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseId TEXT UNIQUE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseId TEXT UNIQUE,
    userName TEXT,
    email TEXT
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseId TEXT,
    institute TEXT,
    course TEXT,
    category TEXT,
    deliveryMethod TEXT,
    location TEXT,
    language TEXT,
    startDate TEXT
  );
`);

const insert = db.prepare(`
  INSERT OR REPLACE INTO courses
  (courseId, institute, course, category, deliveryMethod, location, language, startDate)
  VALUES (@courseId, @institute, @course, @category, @deliveryMethod, @location, @language, @startDate)
`);

fs.createReadStream(path.join(__dirname, "../db/inputData.csv"))
  .pipe(stripBom())
  .pipe(csv({ separator: ";" }))
  .on("data", (row) => {
    const mappedRow = {
      courseId: row.CourseId,
      institute: row.InstituteName,
      course: row.CourseName,
      category: row.Category,
      deliveryMethod: row.DeliveryMethod,
      location: row.Location,
      language: row.Language,
      startDate: row.StartDate,
    };
    insert.run(mappedRow);
  })
  .on("end", () => {
    console.log("CSV import done.");
  })
  .on("error", (err) => {
    console.error("Error reading CSV:", err);
  });
