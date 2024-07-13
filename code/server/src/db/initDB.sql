--PRODUCTS
DROP TABLE IF EXISTS products;
CREATE TABLE IF NOT EXISTS products(
    model TEXT PRIMARY KEY,
    category TEXT CHECK( category IN('Smartphone','Laptop','Appliance')) NOT NULL,
    quantity INTEGER DEFAULT 1,
    sellingPrice DOUBLE DEFAULT 0,
    arrivalDate DATE NOT NULL,
    details TEXT DEFAULT null
);
INSERT INTO products VALUES ('Realme X2', 'Laptop', 4, 57,'2024-05-01','');
INSERT INTO products VALUES ('Samsung R860 Caliber', 'Laptop', 5, 74,'2024-05-01','');
INSERT INTO products VALUES ('Tecno Pova', 'Smartphone', 3, 15,'2024-05-01','');
INSERT INTO products VALUES ('Sony Ericsson V640', 'Appliance', 1, 78,'2024-05-01','');
INSERT INTO products VALUES ('Icemobile Acqua', 'Smartphone', 2, 73,'2024-05-01','');
INSERT INTO products VALUES ('BlackBerry Curve 9360', 'Smartphone', 4, 15,'2024-05-01','');
INSERT INTO products VALUES ('Motorola Moto E Dual SIM', 'Laptop', 5, 83,'2024-05-01','');
INSERT INTO products VALUES ('Lenovo S660', 'Appliance', 3, 86,'2024-05-01','');
INSERT INTO products VALUES ('OnePlus Nord N10 5G', 'Smartphone', 4, 86,'2024-05-01','');
INSERT INTO products VALUES ('BlackBerry 7130c', 'Smartphone', 2, 21,'2024-05-01','');
INSERT INTO products VALUES ('HTC One X9', 'Laptop', 2, 55,'2024-05-01','');
INSERT INTO products VALUES ('Samsung Galaxy Tab A 8.0 (2017)', 'Laptop', 5, 66,'2024-05-01','');
INSERT INTO products VALUES ('Panasonic Eluga I7', 'Appliance', 1, 60,'2024-05-01','');
INSERT INTO products VALUES ('ZTE Grand X2 In', 'Smartphone', 1, 85,'2024-05-01','');
INSERT INTO products VALUES ('LG G8 ThinQ', 'Smartphone', 4, 86,'2024-05-01','');
--CARTS
DROP TABLE IF EXISTS carts;
CREATE TABLE IF NOT EXISTS carts(
    cartID INTEGER PRIMARY KEY AUTOINCREMENT,
    customer REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
    paid INTEGER CHECK(paid IN (0,1)) DEFAULT 0,
    paymentDate DATE DEFAULT null,
    total DOUBLE DEFAULT 0
    );
INSERT INTO carts VALUES (1, 'ftacker0', 0, null, 867);
INSERT INTO carts VALUES (2, 'mdaish1', 0, null, 1077);
INSERT INTO carts VALUES (3, 'kspriggen2', 0, null, 482);
INSERT INTO carts VALUES (4, 'fcanedo3', 0, null, 489);
INSERT INTO carts VALUES (5, 'tclaw4', 0, null, 0);
--CART PRODUCTS
DROP TABLE IF EXISTS cartProducts;
CREATE TABLE IF NOT EXISTS cartProducts(
    cartID REFERENCES carts(cartID) ON DELETE CASCADE ON UPDATE CASCADE,
    model TEXT DEFAULT null,
    category TEXT CHECK( category IN('Smartphone','Laptop','Appliance')) NOT NULL,
    quantity INTEGER DEFAULT 0,
    price INTEGER DEFAULT 0
);
INSERT INTO cartProducts VALUES (1, 'Realme X2', 'Laptop', 4, 57);
INSERT INTO cartProducts VALUES (1, 'Samsung R860 Caliber', 'Laptop', 5, 74);
INSERT INTO cartProducts VALUES (1, 'Tecno Pova', 'Smartphone', 3, 15);
INSERT INTO cartProducts VALUES (1, 'Sony Ericsson V640', 'Appliance', 1, 78);
INSERT INTO cartProducts VALUES (1, 'Icemobile Acqua', 'Smartphone', 2, 73);
INSERT INTO cartProducts VALUES (2, 'BlackBerry Curve 9360', 'Smartphone', 4, 15);
INSERT INTO cartProducts VALUES (2, 'Motorola Moto E Dual SIM', 'Laptop', 5, 83);
INSERT INTO cartProducts VALUES (2, 'Lenovo S660', 'Appliance', 3, 86);
INSERT INTO cartProducts VALUES (2, 'OnePlus Nord N10 5G', 'Smartphone', 4, 86);
INSERT INTO cartProducts VALUES (3, 'BlackBerry 7130c', 'Smartphone', 2, 21);
INSERT INTO cartProducts VALUES (3, 'HTC One X9', 'Laptop', 2, 55);
INSERT INTO cartProducts VALUES (3, 'Samsung Galaxy Tab A 8.0 (2017)', 'Laptop', 5, 66);
INSERT INTO cartProducts VALUES (4, 'Panasonic Eluga I7', 'Appliance', 1, 60);
INSERT INTO cartProducts VALUES (4, 'ZTE Grand X2 In', 'Smartphone', 1, 85);
INSERT INTO cartProducts VALUES (4, 'LG G8 ThinQ', 'Smartphone', 4, 86);
--Review Table--
DROP TABLE IF EXISTS reviews;
CREATE TABLE IF NOT EXISTS reviews(
    model REFERENCES products(model) ON DELETE CASCADE ON UPDATE CASCADE,
    user REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
    score INTEGER CHECK( score >= 1 AND score <= 5) NOT NULL,
    date TEXT NOT NULL,
    comment TEXT NOT NULL
);
SELECT * FROM products;

SELECT * FROM carts;

SELECT * FROM cartProducts;

SELECT * FROM users;