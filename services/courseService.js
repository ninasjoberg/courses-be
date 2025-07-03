export const get = (db, limit = 1000) => {
  const stmt = db.prepare(
    `SELECT id, courseId, institute, course, location, deliveryMethod, category FROM courses LIMIT ?`
  );
  return stmt.all(limit); // returns all matching rows immediately
};

export const getBySearch = (db, search) => {
  const conditions = [];
  const params = {};

  if (search.location) {
    conditions.push("LOWER(location) LIKE LOWER(@location)");
    params.location = `%${search.location}%`;
  }
  if (search.category) {
    conditions.push("LOWER(category) LIKE LOWER(@category)");
    params.category = `%${search.category}%`;
  }
  if (search.institute) {
    conditions.push("LOWER(institute) LIKE LOWER(@institute)");
    params.institute = `%${search.institute}%`;
  }
  if (search.deliveryMethod) {
    conditions.push("LOWER(deliveryMethod) LIKE LOWER(@deliveryMethod)");
    params.deliveryMethod = `%${search.deliveryMethod}%`;
  }

  let sql = "SELECT * FROM courses";
  if (conditions.length) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  sql += " LIMIT 10";

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
    SELECT * FROM courses WHERE courseId IN (SELECT courseId FROM savedCourses) GROUP BY courseId
  `);

  return stmt.all();
};

export const getSavedSearch = (db) => {};
