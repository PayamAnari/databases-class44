import connection from './connection.js';
export const createTableAuthors = async () => {
  const authorsTableQuery = `
    CREATE TABLE IF NOT EXISTS authors (
      author_id INT AUTO_INCREMENT,
      author_name VARCHAR(255),
      university VARCHAR(255),
      date_of_birth DATE,
      h_index INT,
      gender ENUM('Female', 'Male', 'Other'),
      PRIMARY KEY(author_id)
    );
  `;

  await connection.query(authorsTableQuery);
  console.log('Authors table created');
};

export const addMentorToAuthors = async () => {
  const addMentorColumn = `
    ALTER TABLE authors
    ADD COLUMN mentor INT,
    ADD FOREIGN KEY (mentor) REFERENCES authors(author_id);
  `;

  try {
    await connection.query(addMentorColumn);
    console.log('Mentor column added');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Mentor column already exists');
    } else {
      console.error('Error adding mentor column:', error);
    }
  }
};
