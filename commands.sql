CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, title, url, likes) VALUES
('Test User', 'Test blog', 'https://fullstackopen.com/en/part13/using_relational_databases_with_sequelize', 0),
('Another User', 'Very good blog', 'https://www.google.com', 0);