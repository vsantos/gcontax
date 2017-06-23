import flask
import json
from flask import render_template, redirect, request
# To accept all 'Origins'
from flask_cors import CORS, cross_origin
# Custom lib
from database_manager import DatabaseManager

app = flask.Flask(__name__)
CORS(app)

def __init__():
    database_manager = DatabaseManager()
    mysql_database_host, mysql_port = database_manager.getting_database_instance()
    conn, cursor = database_manager.start_connection(mysql_database_host, mysql_port)

@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response

@app.errorhandler(404)
def page_not_found(e):
    return render_template('not_found.html'), 404

@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html'), 200

@app.route('/contabil')
def contab():
    return render_template('contabil.html'), 200

@app.route('/admin')
def admin():
    mysql_database_host, mysql_port = database_manager.getting_database_instance()
    status_db_connection, conn, cursor = database_manager.start_connection(mysql_database_host, mysql_port)
    return render_template('admin.html'), 200

@app.route('/api/v1/client', methods=['POST', 'GET'])
def db_client():
    mysql_database_host, mysql_port = database_manager.getting_database_instance()
    status_db_connection, conn, cursor = database_manager.start_connection(mysql_database_host, mysql_port)

    if request.method == 'POST':
        if not status_db_connection:
            return json.dumps({"status":status_db_connection,"details":cursor}), 500, {'Content-Type': 'application/json; charset=utf-8'}

        # Calling database method for insert client
        response = database_manager.register_new_client(request.form['name'], request.form['cpf'], request.form['email'],
                                                        request.form['phone'], request.form['city'], request.form['cep'], request.form['address'])
        if response:
            return json.dumps({"status":response,"details":'Registry created'}), 200, {'Content-Type': 'application/json; charset=utf-8'}
        else:
            return json.dumps({"status":response,"details":'Could not create registry'}), 500, {'Content-Type': 'application/json; charset=utf-8'}

    if request.method == 'GET':
        if not status_db_connection:
            return json.dumps({"status":status_db_connection,"details":cursor}), 500, {'Content-Type': 'application/json; charset=utf-8'}

        clients = database_manager.get_clients_from_database()
        return json.dumps({"status":status_db_connection, "clients": clients}, indent=4, sort_keys=True, default=str), 200, {'Content-Type': 'application/json; charset=utf-8'}


@app.route('/api/v1/company', methods=['POST', 'GET'])
def db_company():
    mysql_database_host, mysql_port = database_manager.getting_database_instance()
    status_db_connection, conn, cursor = database_manager.start_connection(mysql_database_host, mysql_port)

    if not status_db_connection:
        return json.dumps({"status":status_db_connection,"details":cursor}), 500, {'Content-Type': 'application/json; charset=utf-8'}

    if request.method == 'POST':
        # Calling database method for insert client
        response = database_manager.register_new_company(request.form['name'], request.form['cnpj'], request.form['phone'],
                                                        request.form['city'], request.form['cep'], request.form['address'])

        print(response)
        if response:
            return json.dumps({"status":response,"details":'Registry created'}), 200, {'Content-Type': 'application/json; charset=utf-8'}
        else:
            return json.dumps({"status":response,"details":'Could not create registry'}), 500, {'Content-Type': 'application/json; charset=utf-8'}

    if request.method == 'GET':
        companies = database_manager.get_companies_from_database()
        return json.dumps({"status":status_db_connection, "companies": companies}, indent=4, sort_keys=True, default=str), 200, {'Content-Type': 'application/json; charset=utf-8'}

@app.route('/api/v1/billing', methods=['POST', 'GET'])
def db_billing():
    mysql_database_host, mysql_port = database_manager.getting_database_instance()
    status_db_connection, conn, cursor = database_manager.start_connection(mysql_database_host, mysql_port)

    if not status_db_connection:
        return json.dumps({"status":status_db_connection,"details":cursor}), 500, {'Content-Type': 'application/json; charset=utf-8'}

    if request.method == 'POST':
        response = database_manager.register_new_billing(request.form['company'], request.form['cost'], request.form['service_type_cod'],
                                                        request.form['service_type_desc'], request.form['emission'], request.form['expiration'])

        if response:
            return json.dumps({"status":response,"details":'Registry created'}), 200, {'Content-Type': 'application/json; charset=utf-8'}
        else:
            return json.dumps({"status":response,"details":'Could not create registry'}), 500, {'Content-Type': 'application/json; charset=utf-8'}

    if request.method == 'GET':
        billings = database_manager.get_billings_from_database()
        return json.dumps({"status":status_db_connection, "billings": billings}, indent=4, sort_keys=True, default=str), 200, {'Content-Type': 'application/json; charset=utf-8'}

if __name__ == '__main__':
    database_manager = DatabaseManager()
    app.run(debug=True, port=8080, host='0.0.0.0', threaded=True)
