require "pg"

DB_NAME = "notes_db"
OWNER   = "postgres"

def build_db_path(owner, name)
  "postgres://#{owner}@localhost:5432/#{name}"
end

# CREATES CONNECTION WITH SYSTEM DB
conn = PG.connect build_db_path(OWNER, OWNER)

database_exists? = conn.exec(%{
  SELECT CAST(1 AS integer)
  FROM pg_database
  WHERE datname=$1
}, [DB_NAME]).to_hash.empty? ? false : true

if !database_exists?
  # CREATES THE NOTES_DB DATABASE WITH UTF8 ENCODING AND CLOSE THE CONNECTION
  puts "Creating database: #{DB_NAME}..."
  conn.exec("CREATE DATABASE #{DB_NAME} ENCODING 'UTF8';")
  conn.close

  # CREATES CONNECTION WITH THE NEWLY CREATED DB
  puts "Connecting database: #{DB_NAME}..."
  conn = PG.connect build_db_path(OWNER, DB_NAME)

  # CREATES THE NOTES TABLE IN THE NEWLY CREATED DATABASE
  puts "Creating notes table in #{DB_NAME}..."
  conn.exec(%{
    CREATE TABLE notes (
      id          SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      content     TEXT NOT NULL,
      created_at  TIMESTAMP WITH TIME ZONE NOT NULL,
      updated_at  TIMESTAMP WITH TIME ZONE NOT NULL
    );
  })
  puts "Process finished succesfully"
else
  puts "The database #{DB_NAME} already exists!!"
end

puts "Closing connection..."
conn.close
