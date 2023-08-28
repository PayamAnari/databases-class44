import connection from './connection.js';
const joinAuthorsAndMentors = async () => {
  const joinQuery = `
    SELECT authors.author_name AS Author, mentors.author_name AS Mentor
    FROM authors
    LEFT JOIN authors AS mentors
    ON authors.mentor = mentors.author_id;
    `;

  connection.query(joinQuery, (error, results) => {
    if (error) throw error;
    console.log('Authors and their papers:', results);
  });
};

const joinAuthorsAndPapers = async () => {
  const joinQuery = `
    SELECT authors.author_name AS Author, COALESCE(research_papers.paper_title, 'No Papers') AS Paper
    FROM authors
    LEFT JOIN author_papers
    ON authors.author_id = author_papers.author_id
    LEFT JOIN research_papers
    ON author_papers.paper_id = research_papers.paper_id;
    `;
  connection.query(joinQuery, (error, results) => {
    if (error) throw error;
    console.log('Authors and their papers:', results);
  });
};

const getQueries = async () => {
  try {
    await joinAuthorsAndMentors();
    await joinAuthorsAndPapers();
  } catch (error) {
    console.log('Error running queries:', error.stack);
  } finally {
    connection.end();
  }
};

getQueries();
