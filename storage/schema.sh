    CREATE TABLE IF NOT EXISTS client (
        ID INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        CPF VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(15),
        city VARCHAR(100),
        CEP VARCHAR(10),
        address VARCHAR(255),
        created DATETIME NOT NULL,
        last_updated DATETIME,
        PRIMARY KEY ( ID )
    );

    CREATE TABLE IF NOT EXISTS company (
        ID INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        CNPJ VARCHAR(25) NOT NULL,
        phone VARCHAR(15),
        city VARCHAR(100),
        CEP VARCHAR(10),
        address VARCHAR(255),
        created DATETIME NOT NULL,
        last_updated DATETIME,
        PRIMARY KEY ( ID )
    );

    CREATE TABLE IF NOT EXISTS billing_records (
        ID INT NOT NULL AUTO_INCREMENT,
        company_id_fk INT NOT NULL,
        FOREIGN KEY company_id_fk,
        REFERENCES company (ID)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        cost VARCHAR(25),
        paid BOOLEAN NOT NULL,
        service_type_code INT NOT NULL,
        service_type_description VARCHAR(50) NOT NULL,
        emission_date DATE NOT NULL,
        expiration_date DATE NOT NULL,
        created DATETIME NOT NULL,
        last_updated DATETIME,
        PRIMARY KEY ( ID )
    );
