import connection from './connection.js';

const getAuthorsPapers = async () => {
  const query = `
    SELECT research_papers.paper_title AS Paper, COUNT(author_papers.author_id) AS AuthorsCount
    FROM research_papers
    JOIN author_papers ON research_papers.paper_id = author_papers.paper_id
    GROUP BY research_papers.paper_title;
  `;

  connection.query(query, (error, results) => {
    if (error) throw error;
    console.log('Authors and their papers:', results);
  });
};

const femaleAuthorPaperSum = async () => {
  const query = `
    SELECT COUNT(distinct rp.paper_id) as FemaleAuthorPapers
    FROM authors a
    JOIN author_papers ap ON a.author_id = ap.author_id
    JOIN research_papers rp ON ap.paper_id = rp.paper_id
    WHERE a.gender = 'Female';
  `;

  connection.query(query, (error, results) => {
    if (error) throw error;
    console.log('Number of papers by female authors:', results);
  });
};

const avgHIndex = async () => {
  const query3 = `
    SELECT authors.university AS University, AVG(authors.h_index) AS AverageHIndex
    FROM authors
    GROUP BY authors.university; 
  `;

  connection.query(query3, (error, results) => {
    if (error) throw error;
    console.log('Authors and their papers:', results);
  });
};

const sumOfPapersUniversity = async () => {
  const query4 = `
    SELECT authors.university AS University, SUM (research_papers.paper_title) AS SumOfPapers
    FROM authors
    JOIN author_papers ON authors.author_id = author_papers.author_id
  `;
};

const universityHIndexMinMax = async () => {
  const query4 = `
    SELECT authors.university, MIN(authors.h_index) as MinHIndex, MAX(authors.h_index) as MaxHIndex
    FROM authors
    GROUP BY authors.university;
  `;

  connection.query(query4, (error, results) => {
    if (error) throw error;
    console.log('Min and max h-index per university:', results);
  });
};

const getQueries = async () => {
  try {
    await getAuthorsPapers();
    await femaleAuthorPaperSum();
    await avgHIndex();
    await sumOfPapersUniversity();
    await universityHIndexMinMax();
  } catch (error) {
    console.log('Error running queries:', error.stack);
  } finally {
    connection.end();
  }
};

getQueries();
