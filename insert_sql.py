# import sqlite3
# conn = sqlite3.connect('user.db')

# c = conn.cursor()

# c.execute("CREATE TABLE userdata (account,password)")

# conn.commit()
# conn.close()


import sqlite3
conn = sqlite3.connect('user.db')

c = conn.cursor()

c.execute("INSERT INTO userdata VALUES ('test','password')")

conn.commit()
conn.close()
