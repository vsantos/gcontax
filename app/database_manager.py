import os, sys
import time
from flask import Flask, json
from flaskext.mysql import MySQL

class DatabaseManager():

    def get_current_time(self):
        return time.strftime('%Y-%m-%d %H:%M:%S')

    def getting_database_instance(self):
        # Checking if it exist a kubernetes' mysql pod
        if 'FLASK_WEB_DB_PORT_3306_TCP_ADDR' in os.environ:
            mysql_database_host = os.environ['FLASK_WEB_DB_PORT_3306_TCP_ADDR']
            mysql_port = 3306
        # Checking if it exist a mysql container
        elif 'MYSQL_PORT_3306_TCP_ADDR' in os.environ:
            mysql_database_host = os.environ['MYSQL_PORT_3306_TCP_ADDR']
            mysql_port = 3306
        else:
            mysql_database_host = '127.0.0.1'
            mysql_port = 3309
        return mysql_database_host, mysql_port

    def start_connection(self, mysql_database_host, mysql_port):
        app = Flask(__name__)
        app.config['DEBUG'] = True
        app.config['MYSQL_DATABASE_HOST'] = mysql_database_host
        app.config['MYSQL_DATABASE_USER'] = 'gcontax'
        app.config['MYSQL_DATABASE_PASSWORD'] = 'gcontax'
        app.config['MYSQL_DATABASE_DB'] = 'gcontax'
        app.config['MYSQL_DATABASE_PORT'] = mysql_port
        status_db_connection = False

        mysql = MySQL()
        try:
            mysql.init_app(app)
            conn = mysql.connect()
            cursor = conn.cursor()
            status_db_connection = True
            return status_db_connection, conn, cursor
        except Exception as e:
            error_status, error_message = e.args

            # 2003: Code if we can't reach MySQL
            if error_status == 2003:
                error_treated_message = "[FATAL]: Can't connect to Database. Check if it is up and try again."
                print(error_treated_message)
                return status_db_connection, error_status, error_treated_message
            elif error_status == 1045:
                error_treated_message = "[FATAL]: Access denied when trying to connect to Database: {}".format(mysql_database_host)
                print(error_treated_message)
                return status_db_connection, error_status, error_treated_message
            else:
                error_treated_message = "[FATAL]: Database error: {}".format(e.args)
                print(error_treated_message)
                return status_db_connection, error_status, error_treated_message

    def get_clients_from_database(self):
        try:
            mysql_database_host, mysql_port = self.getting_database_instance()
            status_db_connection, conn, cursor = self.start_connection(mysql_database_host, mysql_port)
            execute_query = """ SELECT * from client"""
            cursor.execute(execute_query)
            db_data = cursor.fetchall()

            clients = []

            for client_id, client_name, client_cpf, client_email, client_phone, client_city, \
                client_cep, client_address, client_created, client_last_updated in db_data:

                client_form = {
                    'id': client_id,
                    'name': client_name,
                    'cpf': client_cpf,
                    'email': client_email,
                    'phone': client_phone,
                    'city': client_city,
                    'cep': client_cep,
                    'address': client_address,
                    'created': client_created,
                    'last_updated': client_last_updated,
                }

                clients.append(client_form)

            conn.commit()
            conn.close()
            return clients
        except Exception as e:
            print(e)
            return False

    def get_companies_from_database(self):
        try:
            mysql_database_host, mysql_port = self.getting_database_instance()
            status_db_connection, conn, cursor = self.start_connection(mysql_database_host, mysql_port)
            execute_query = """ SELECT * from company"""
            cursor.execute(execute_query)
            db_data = cursor.fetchall()

            companies = []

            for company_id, company_name, company_cnpj, company_phone, company_city, \
                company_cep, company_address, company_created, company_last_updated in db_data:

                company_form = {
                    'id': company_id,
                    'name': company_name,
                    'cnpj': company_cnpj,
                    'phone': company_phone,
                    'city': company_city,
                    'cep': company_cep,
                    'address': company_address,
                    'created': company_created,
                    'last_updated': company_last_updated,
                }

                companies.append(company_form)

            conn.commit()
            conn.close()
            return companies
        except Exception as e:
            print(e)
            return False

    def get_billings_from_database(self):
        try:
            mysql_database_host, mysql_port = self.getting_database_instance()
            status_db_connection, conn, cursor = self.start_connection(mysql_database_host, mysql_port)
            execute_query = """ SELECT * from billing_records ORDER BY emission_date"""
            cursor.execute(execute_query)
            db_data = cursor.fetchall()

            billings = []

            for billing_id, billing_company, billing_cost, billing_paid, billing_service_type_code, \
                billing_service_type_description, billing_emission_date, billing_expiration_date, billing_created, billing_last_updated in db_data:

                billings_form = {
                    'id': billing_id,
                    'company': billing_company,
                    'cost': billing_cost,
                    'paid': billing_paid,
                    'service_type_code': billing_service_type_code,
                    'service_type_des': billing_service_type_description,
                    'emission': billing_emission_date,
                    'expiration': billing_expiration_date,
                    'created': billing_created,
                    'last_updated': billing_last_updated,
                }

                billings.append(billings_form)

            conn.commit()
            conn.close()
            return billings
        except Exception as e:
            print(e)
            return False

    def register_new_client(self, client_name='', client_cpf='', client_email='', client_phone='', client_city='', client_cep='', client_address=''):
        created = self.get_current_time()
        last_updated = created
        try:
            mysql_database_host, mysql_port = self.getting_database_instance()
            status_db_connection, conn, cursor = self.start_connection(mysql_database_host, mysql_port)
            execute_query = """INSERT INTO client (name, CPF, email, phone, city, CEP, address, created, last_updated)
                                VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}','{}');
                            """.format(client_name, client_cpf, client_email, client_phone, client_city, client_cep, client_address, created, last_updated)
            print(execute_query)

            cursor.execute(execute_query)
            cursor.close()
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(e)
            return False

    def register_new_company(self, company_name='', company_cnpj='', company_phone='', company_city='', company_cep='', company_address=''):
        created = self.get_current_time()
        last_updated = created
        try:
            mysql_database_host, mysql_port = self.getting_database_instance()
            status_db_connection, conn, cursor = self.start_connection(mysql_database_host, mysql_port)
            print(company_cnpj)
            execute_query = """INSERT INTO company (name, CNPJ, phone, city, CEP, address, created, last_updated)
                                VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}');
                            """.format(company_name, company_cnpj, company_phone, company_city, company_cep, company_address, created, last_updated)

            cursor.execute(execute_query)
            cursor.close()
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(e)
            return False

    def register_new_billing(self, company='', cost='', service_type_cod='', service_type_desc='', emission='', expiration=''):
        created = self.get_current_time()
        last_updated = created
        try:
            mysql_database_host, mysql_port = self.getting_database_instance()
            status_db_connection, conn, cursor = self.start_connection(mysql_database_host, mysql_port)
            execute_query = """
                            INSERT INTO billing_records(company_id_fk, cost, paid, service_type_code, service_type_description, emission_date, expiration_date, created, last_updated)
                            SELECT ID, '{}', 0, '{}', '{}', '{}', '{}', '{}','{}'
                            FROM company
                            WHERE name = '{}'
                            LIMIT 1;
                            """.format(cost, service_type_cod, service_type_desc, emission, expiration, created, last_updated, company)

            cursor.execute(execute_query)
            cursor.close()
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(e)
            return False
