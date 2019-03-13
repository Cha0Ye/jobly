CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text UNIQUE NOT NULL,
    num_employees integer,
    description text,
    logo_url text
);

INSERT INTO companies
  VALUES ('app', 'Apple Inc', 1000),
         ('ibm', 'IBM', 2000),
         ('smg', 'Samsung', 3000),
         ('LG', 'Lifes Good', 4000),
         ('int', 'Intel', 5000),
         ('amd', 'AMD', 6000);

