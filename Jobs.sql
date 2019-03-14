CREATE TABLE jobs (
    id SERIAL PRIMARY KEY ,
    title text NOT NULL,
    salary float NOT NULL,
    equity float NOT NULL CHECK(equity <= 1.0),
    company_handle text REFERENCES companies(handle) ON DELETE CASCADE,
    date_posted timestamp without time zone default CURRENT_TIMESTAMP
);

INSERT INTO jobs (title, salary, equity, company_handle)
  VALUES ('CEO', 160000.00, 0.8, 'int');