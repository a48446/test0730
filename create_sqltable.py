import sqlite3

conn = sqlite3.connect('user.db')
print("Opened database successfully")
c = conn.cursor()
c.execute('''CREATE TABLE userdata
       (account    TEXT    NOT NULL,
       password            TEXT     NOT NULL);''')
print("Table created successfully")
conn.commit()
conn.close()