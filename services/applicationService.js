export const addApplication = (db, courseId, userName, email) => {
  const stmt = db.prepare(`
    INSERT INTO applications (courseId, userName, email)
    VALUES (@courseId, @userName, @email)
  `);
  return stmt.run({ courseId, userName, email });
};

export const getApplications = (db) => {
  const stmt = db.prepare(`
    SELECT * FROM courses WHERE courseId IN (SELECT courseId FROM applications) GROUP BY courseId
  `);

  return stmt.all();
};
