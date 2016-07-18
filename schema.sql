
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  is_admin INTEGER DEFAULT 0
);

CREATE TABLE comments (
  id INTEGER PRIMARY KEY,
  user_id INT,
  comment TEXT NOT NULL,
  timestamp INTEGER NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY(user_id) REFERENCES users(id)
);

/* Create admin accounts here */