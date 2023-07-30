import sqlite3
import json
from typing import Text
from flask import session, redirect, Flask, render_template, request
from log_utils import *

app = Flask(__name__)


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == "POST":
        try:
            account = request.values['Account']
            password = request.values['Password']
            conn = sqlite3.connect('user.db')
            cursor = conn.cursor()
            print("Insert Start")
            cursor.execute("INSERT INTO %s (account,password) VALUES (:1,:2)" % "userdata", [
                           account, password])
            conn.commit()
            print("Insert End")
            conn.close()

        except:
            return render_template('register.html')
    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.values['send'] == '登入':

            conn = sqlite3.connect('user.db')
            cursor = conn.cursor()
            print("Selete Start")
            print(request.values["Account"])
            rows = cursor.execute("""
            SELECT COUNT(*) FROM userdata WHERE password = '%s'
            """ % (request.values["Account"]))
            conn.commit()
            print("Selete End")
            conn.close()
            if rows:
                return render_template('index.html')
    return render_template('login.html')


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    return render_template('logout.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000')
