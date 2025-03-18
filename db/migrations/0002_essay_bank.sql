CREATE TABLE IF NOT EXISTS "essay_bank" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,
  "image_url" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Add some sample data for Academic Task 1
INSERT INTO "essay_bank" ("title", "type", "prompt", "image_url") VALUES
('Population Growth in Urban Areas', 'ACADEMIC_TASK1', 'The graph below shows population growth in three different cities from 1950 to 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.', '/images/essay-bank/population-growth.png'),
('CO2 Emissions by Country', 'ACADEMIC_TASK1', 'The chart below shows CO2 emissions for different countries between 1960 and 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.', '/images/essay-bank/co2-emissions.png'),
('Internet Usage by Age Group', 'ACADEMIC_TASK1', 'The bar chart illustrates internet usage across different age groups in 2010 and 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.', '/images/essay-bank/internet-usage.png'),
('Process of Paper Recycling', 'ACADEMIC_TASK1', 'The diagram below shows the process of paper recycling. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.', '/images/essay-bank/paper-recycling.png'),
('Water Consumption by Sector', 'ACADEMIC_TASK1', 'The pie charts show water consumption by sector in two different countries. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.', '/images/essay-bank/water-consumption.png');

-- Add some sample data for General Task 1
INSERT INTO "essay_bank" ("title", "type", "prompt") VALUES
('Complaint Letter', 'GENERAL_TASK1', 'You recently stayed at a hotel and were unhappy with the service you received. Write a letter to the hotel manager. In your letter: explain why you were staying at the hotel, describe the problems you experienced, suggest what the manager should do about it.'),
('Request for Information', 'GENERAL_TASK1', 'You are planning to take a short course in a college in the UK. Write a letter to the college. In your letter: explain which course you are interested in, ask for information about the course, inquire about accommodation during the course.'),
('Apology Letter', 'GENERAL_TASK1', 'You borrowed a book from your friend but have damaged it. Write a letter to your friend. In your letter: explain how the book got damaged, apologize for what happened, say what you will do to solve this problem.');

-- Add some sample data for Task 2
INSERT INTO "essay_bank" ("title", "type", "prompt") VALUES
('Technology and Children', 'TASK2', 'Some people think that the increasing use of technology, such as mobile phones and computers, is having a negative effect on social interaction. To what extent do you agree or disagree?'),
('Environmental Protection', 'TASK2', 'Many environmental problems are too big for individual countries and individual people to address. We have reached the stage where the only way to protect the environment is at an international level. To what extent do you agree or disagree with this statement?'),
('Education Systems', 'TASK2', 'Some people believe that students should be allowed to evaluate and criticize their teachers as a way of improving education. Others think this would lead to loss of respect and discipline in the classroom. Discuss both these views and give your own opinion.'); 