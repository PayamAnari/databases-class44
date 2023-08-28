import connection from './connection.js';
import { createTableAuthors, addMentorToAuthors } from './keys.js';

const createResearchPapersTable = async () => {
  const researchPapersTableQuery = `
    CREATE TABLE IF NOT EXISTS research_papers (
      paper_id INT AUTO_INCREMENT,
      paper_title VARCHAR(255),
      conference VARCHAR(255),
      published_date DATE,
      PRIMARY KEY(paper_id)
    );
  `;

  await connection.query(researchPapersTableQuery);
  console.log('Research papers table created');
};

const createAuthorPapersTable = async () => {
  const authorPapersTableQuery = `
    CREATE TABLE IF NOT EXISTS author_papers (
      author_id INT,
      paper_id INT,
      PRIMARY KEY (author_id, paper_id),
      FOREIGN KEY (author_id) REFERENCES authors(author_id),
      FOREIGN KEY (paper_id) REFERENCES research_papers(paper_id)
    );
  `;

  await connection.query(authorPapersTableQuery);
  console.log('Table created');
};

const populateAuthors = async () => {
  await connection.query('SET foreign_key_checks = 0');

  const insertAuthorsQuery = `
  INSERT INTO authors 
  (author_name, university, date_of_birth, h_index, gender, mentor) 
  VALUES 
  ('John Smith', 'University A', '1990-01-01', 10, 'Male', 3),
  ('Emma Johnson', 'University B', '1991-02-02', 12, 'Female', 1),
  ('Michael Williams', 'University C', '1985-05-15', 8, 'Male', NULL),
  ('Sophia Brown', 'University D', '1987-07-25', 14, 'Female', NULL),
  ('Daniel Davis', 'University E', '1993-03-10', 6, 'Male', NULL),
  ('Olivia Taylor', 'University F', '1992-11-18', 9, 'Female', NULL),
  ('Alexander Anderson', 'University G', '1989-09-05', 11, 'Male', NULL),
  ('Mia Martinez', 'University H', '1994-04-30', 13, 'Female', NULL),
  ('William Thompson', 'University I', '1988-06-12', 7, 'Male', NULL),
  ('Ava Wilson', 'University J', '1995-08-20', 15, 'Female', NULL),
  ('James Clark', 'University K', '1991-12-08', 10, 'Male', NULL),
  ('Charlotte Lewis', 'University L', '1993-02-14', 12, 'Female', NULL),
  ('Benjamin Walker', 'University M', '1986-10-22', 8, 'Male', NULL),
  ('Harper Turner', 'University N', '1990-07-07', 11, 'Female', NULL),
  ('Elijah Baker', 'University O', '1989-09-30', 9, 'Male', NULL);
`;

  await connection.query(insertAuthorsQuery);
  console.log('Inserted authors');

  await connection.query('SET foreign_key_checks = 1');
};

const populatePapers = async () => {
  const insertPapersQuery = `
  INSERT INTO research_papers
  (paper_title, conference, published_date)
  VALUES
  ('The Impact of Climate Change', 'Conference X', '2022-01-01'),
  ('Advancements in Artificial Intelligence', 'Conference Y', '2022-02-01'),
  ('The Role of Robotics in Manufacturing', 'Conference Z', '2022-03-01'),
  ('Exploring Renewable Energy Sources', 'Conference X', '2022-04-01'),
  ('Understanding Human-Computer Interaction', 'Conference Y', '2022-05-01'),
  ('Data Analysis Techniques for Big Data', 'Conference Z', '2022-06-01'),
  ('The Future of Quantum Computing', 'Conference X', '2022-07-01'),
  ('Advancements in Biotechnology', 'Conference Y', '2022-08-01'),
  ('The Role of Social Media in Society', 'Conference Z', '2022-09-01'),
  ('Artificial Neural Networks for Image Recognition', 'Conference X', '2022-10-01'),
  ('Machine Learning Applications in Healthcare', 'Conference Y', '2022-11-01'),
  ('The Impact of Cybersecurity Threats', 'Conference Z', '2022-12-01'),
  ('The Future of Space Exploration', 'Conference X', '2023-01-01'),
  ('Advancements in Nanotechnology', 'Conference Y', '2023-02-01'),
  ('The Role of Blockchain in Finance', 'Conference Z', '2023-03-01'),
  ('Data Privacy in the Digital Age', 'Conference X', '2023-04-01'),
  ('The Impact of E-Commerce on Traditional Retail', 'Conference Y', '2023-05-01'),
  ('Advancements in Virtual Reality Technology', 'Conference Z', '2023-06-01'),
  ('The Role of Artificial Intelligence in Autonomous Vehicles', 'Conference X', '2023-07-01'),
  ('Understanding Consumer Behavior in the Digital Era', 'Conference Y', '2023-08-01'),
  ('The Future of Renewable Energy', 'Conference Z', '2023-09-01'),
  ('Advancements in Quantum Cryptography', 'Conference X', '2023-10-01'),
  ('The Role of Machine Learning in Natural Language Processing', 'Conference Y', '2023-11-01'),
  ('Exploring the Potential of 3D Printing Technology', 'Conference Z', '2023-12-01'),
  ('The Impact of Internet of Things on Smart Cities', 'Conference X', '2024-01-01'),
  ('Advancements in Genetic Engineering', 'Conference Y', '2024-02-01'),
  ('The Role of Augmented Reality in Education', 'Conference Z', '2024-03-01'),
  ('Data Analytics for Business Decision Making', 'Conference X', '2024-04-01'),
  ('The Impact of Social Media on Mental Health', 'Conference Y', '2022-04-01');
`;

  await connection.query(insertPapersQuery);
  console.log('Inserted papers');
};

export const linkAuthorsAndPapers = async () => {
  const disableForeignKeyChecksQuery = `SET FOREIGN_KEY_CHECKS = 0;`;
  const insertDataQuery = `
    INSERT INTO author_papers 
    (author_id, paper_id) 
    VALUES 
    (4, 1), (2, 2), (7, 3), (3, 4), (13, 5), (1, 6), (13, 7), (3, 8), (6, 9), (8, 10),
    (14, 11), (9, 12), (11, 13), (15, 14), (11, 15), (5, 16), (3, 17), (9, 18), (14, 19), (15, 20),
    (11, 21), (1, 22), (7, 23), (9, 24), (15, 25), (8, 26), (11, 27), (13, 28), (9, 29), (4, 30),
    (12, 31), (2, 32), (15, 33), (11, 34), (2, 35);
  `;
  const enableForeignKeyChecksQuery = `SET FOREIGN_KEY_CHECKS = 1;`;

  await connection.query(disableForeignKeyChecksQuery);
  await connection.query(insertDataQuery);
  await connection.query(enableForeignKeyChecksQuery);
  console.log('Author-paper links created');
};

const createDatabase = async () => {
  try {
    await createTableAuthors();
    await addMentorToAuthors();
    await createResearchPapersTable();
    await createAuthorPapersTable();
    await populateAuthors();
    await populatePapers();
    await linkAuthorsAndPapers();
  } catch (error) {
    console.log(error);
  } finally {
    connection.end();
  }
};

createDatabase();
