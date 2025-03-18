-- Add sample essays to the essay bank
INSERT INTO essay_bank (title, type, prompt, image_url, created_at, updated_at)
VALUES 
  -- Academic Task 1 samples
  (
    'Bar Chart: Global Coffee Consumption', 
    'ACADEMIC_TASK1', 
    'The bar chart below shows the annual coffee consumption in kilograms per person in five different countries in 2018. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
    '/images/coffee-consumption-chart.png',
    NOW(),
    NOW()
  ),
  (
    'Line Graph: Internet Usage Trends', 
    'ACADEMIC_TASK1', 
    'The line graph illustrates the percentage of households with internet access in four different countries between 2000 and 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
    '/images/internet-usage-graph.png',
    NOW(),
    NOW()
  ),
  (
    'Pie Charts: Energy Sources Comparison', 
    'ACADEMIC_TASK1', 
    'The pie charts below show the main energy sources in the USA in 1980 and 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
    '/images/energy-sources-pies.png',
    NOW(),
    NOW()
  ),
  
  -- General Task 1 samples
  (
    'Formal Letter: Job Application', 
    'GENERAL_TASK1', 
    'You have seen an advertisement for a part-time job at a local restaurant. Write a letter to the manager. In your letter: introduce yourself, explain what experience and qualities you have, explain why you want this job.',
    NULL,
    NOW(),
    NOW()
  ),
  (
    'Informal Letter: Invitation to Friend', 
    'GENERAL_TASK1', 
    'You are organizing a surprise birthday party for your friend. Write a letter to another friend inviting them to the party. In your letter: explain about the party, describe what arrangements you have made so far, suggest what the person could bring to the party.',
    NULL,
    NOW(),
    NOW()
  ),
  (
    'Semi-formal Letter: Accommodation Issue', 
    'GENERAL_TASK1', 
    'You are staying in rented accommodation. There is a problem with the heating system. Write a letter to your landlord. In your letter: describe the problem, explain how it is affecting you, say what action you would like the landlord to take.',
    NULL,
    NOW(),
    NOW()
  ),
  
  -- Task 2 samples
  (
    'Technology and Children', 
    'TASK2', 
    'Some people believe that the widespread use of smartphones and tablets by children has a negative impact on their development. To what extent do you agree or disagree?',
    NULL,
    NOW(),
    NOW()
  ),
  (
    'Environmental Protection vs. Economic Growth', 
    'TASK2', 
    'Some people think that environmental problems are too big for individuals to solve, while others believe that governments and large companies should be responsible. Discuss both views and give your opinion.',
    NULL,
    NOW(),
    NOW()
  ),
  (
    'Remote Work Advantages and Disadvantages', 
    'TASK2', 
    'Working from home has become more common in many professions. What are the advantages and disadvantages of this development?',
    NULL,
    NOW(),
    NOW()
  ); 