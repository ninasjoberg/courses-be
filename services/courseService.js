export const get = (db, limit = 10) => {
  const stmt = db.prepare(
    `SELECT id, courseId, institute, course, location, deliveryMethod, category FROM courses LIMIT ?`
  );
  return stmt.all(limit);
};

export const getBySearch = (
  db,
  { location, category, deliveryMethod, offset = 0 },
  limit = 10
) => {
  const conditions = [];
  const params = { offset, limit };

  if (location) {
    conditions.push("LOWER(location) LIKE LOWER(@location)");
    params.location = `%${location}%`;
  }
  if (category) {
    conditions.push("LOWER(category) LIKE LOWER(@category)");
    params.category = `%${category}%`;
  }
  if (deliveryMethod) {
    conditions.push("LOWER(deliveryMethod) LIKE LOWER(@deliveryMethod)");
    params.deliveryMethod = `%${deliveryMethod}%`;
  }

  const sql = `SELECT * FROM courses ${
    conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""
  } LIMIT @limit OFFSET @offset;`;

  const stmt = db.prepare(sql);
  return stmt.all(params);
};

export const addSavedSearch = (db, query) => {
  const stmt = db.prepare(`
    INSERT INTO savedSearches (query)
    VALUES (@query)
  `);
  return stmt.run({ query: JSON.stringify(query) });
};

export const getSavedSearches = (db) => {
  const stmt = db.prepare(`
    SELECT query FROM savedSearches
  `);

  return stmt.all();
};

export const addSavedCourse = (db, courseId) => {
  const stmt = db.prepare(`
    INSERT INTO savedCourses (courseId)
    VALUES (@courseId)
  `);
  return stmt.run({ courseId });
};

export const getSavedCourses = (db) => {
  const stmt = db.prepare(`
    SELECT id, course, deliveryMethod, location FROM courses WHERE courseId IN (SELECT courseId FROM savedCourses) GROUP BY courseId
  `);

  return stmt.all();
};
