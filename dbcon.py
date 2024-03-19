import os
import sqlite3

script_directory = os.path.dirname(os.path.abspath(__file__))
db_file_path = os.path.join(script_directory, 'pbw.db')

class DatabaseConnection:
    def __enter__(self):
        self.connection = sqlite3.connect(db_file_path)
        self.cursor = self.connection.cursor()
        return self.cursor

    def __exit__(self, exc_type, exc_value, traceback):
        if self.connection:
            self.connection.commit()
            self.connection.close()

# Function to obtain a connection using the context manager
def dbcon():
    return DatabaseConnection()