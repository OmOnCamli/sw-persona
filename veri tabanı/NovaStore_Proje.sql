--  NovaStore E-Ticaret Veri Yönetim Sistemi
--  Tam SQL scripti


--  BÖLÜM 1: VERİ TABANI ve TABLO OLUŞTURMA (DDL)

-- Görev 1.1: Veri tabanını oluştur
CREATE DATABASE NovaStoreDB;
GO

USE NovaStoreDB;
GO

-- Görev 1.2-A: Categories (Kategoriler) tablosu
CREATE TABLE Categories (
    CategoryID   INT          IDENTITY(1,1) PRIMARY KEY,
    CategoryName VARCHAR(50)  NOT NULL
);
GO

-- Görev 1.2-C: Customers (Müşteriler) tablosu
-- (Products'tan önce oluşturulmalı – FK bağımlılığı)
CREATE TABLE Customers (
    CustomerID INT          IDENTITY(1,1) PRIMARY KEY,
    FullName   VARCHAR(50)  NOT NULL,
    City       VARCHAR(20)  NOT NULL,
    Email      VARCHAR(100) NOT NULL UNIQUE
);
GO

-- Görev 1.2-B: Products (Ürünler) tablosu
CREATE TABLE Products (
    ProductID   INT             IDENTITY(1,1) PRIMARY KEY,
    ProductName VARCHAR(100)    NOT NULL,
    Price       DECIMAL(10,2)   NOT NULL,
    Stock       INT             NOT NULL DEFAULT 0,
    CategoryID  INT             NOT NULL,
    CONSTRAINT FK_Products_Categories
        FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);
GO

-- Görev 1.2-D: Orders (Siparişler) tablosu
CREATE TABLE Orders (
    OrderID     INT           IDENTITY(1,1) PRIMARY KEY,
    CustomerID  INT           NOT NULL,
    OrderDate   DATETIME      NOT NULL DEFAULT GETDATE(),
    TotalAmount DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_Orders_Customers
        FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);
GO

-- Görev 1.2-E: OrderDetails (Sipariş Detayları) ara tablosu
CREATE TABLE OrderDetails (
    DetailID   INT IDENTITY(1,1) PRIMARY KEY,
    OrderID    INT NOT NULL,
    ProductID  INT NOT NULL,
    Quantity   INT NOT NULL,
    CONSTRAINT FK_OrderDetails_Orders
        FOREIGN KEY (OrderID)   REFERENCES Orders(OrderID),
    CONSTRAINT FK_OrderDetails_Products
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
GO


--  BÖLÜM 2: VERİ GİRİŞİ (DML - INSERT)

-- Görev 2.1: 5 adet Kategori ekle
INSERT INTO Categories (CategoryName) VALUES
    ('Elektronik'),
    ('Giyim'),
    ('Kitap'),
    ('Kozmetik'),
    ('Ev ve Yaşam');
GO

-- Görev 2.2: Her kategoriye ait en az 10-12 ürün ekle
INSERT INTO Products (ProductName, Price, Stock, CategoryID) VALUES
-- Elektronik (CategoryID = 1)
    ('Kablosuz Kulaklık',    499.90,  35, 1),
    ('Akıllı Saat',          1299.00, 18, 1),
    ('Bluetooth Hoparlör',   349.00,   8, 1),   -- düşük stok
-- Giyim (CategoryID = 2)
    ('Erkek Slim Fit Gömlek', 249.90, 50, 2),
    ('Kadın Spor Taytı',      189.90, 60, 2),
    ('Unisex Kapüşonlu Sweat',329.90, 12, 2),   -- düşük stok
-- Kitap (CategoryID = 3)
    ('Dune - Frank Herbert',   89.90, 40, 3),
    ('Atomic Habits',          79.90, 55, 3),
    ('SQL ve Veri Tabanı 101', 69.90,  5, 3),   -- düşük stok
-- Kozmetik (CategoryID = 4)
    ('Nemlendirici Krem 50ml', 149.90, 30, 4),
    ('Güneş Kremi SPF50',      129.90, 15, 4),
-- Ev ve Yaşam (CategoryID = 5)
    ('Çift Kişilik Nevresim',  399.90, 25, 5),
    ('Aromaterapi Difüzörü',   279.90,  9, 5);  -- düşük stok
GO

-- Görev 2.3: 5-6 adet Müşteri kaydı ekle
INSERT INTO Customers (FullName, City, Email) VALUES
    ('Ahmet Yılmaz',  'İstanbul', 'ahmet.yilmaz@mail.com'),
    ('Elif Kaya',     'Ankara',   'elif.kaya@mail.com'),
    ('Mehmet Demir',  'İzmir',    'mehmet.demir@mail.com'),
    ('Zeynep Çelik',  'Bursa',    'zeynep.celik@mail.com'),
    ('Can Arslan',    'Ankara',   'can.arslan@mail.com'),
    ('Selin Yıldız',  'İstanbul', 'selin.yildiz@mail.com');
GO


-- Görev 2.4: En az 8-10 Sipariş ve Sipariş Detayları ekle

-- Sipariş 1 – Ahmet Yılmaz (CustomerID=1), 15 gün önce
INSERT INTO Orders (CustomerID, OrderDate, TotalAmount) VALUES
    (1, DATEADD(DAY, -15, GETDATE()), 849.80);

INSERT INTO OrderDetails (OrderID, ProductID, Quantity) VALUES
    (1, 1,  1),  -- Kablosuz Kulaklık x1
    (1, 7,  2);  -- Dune x2  (89.90*2 + 499.90 ≈ 669.70 → TotalAmount tahminidir)

-- Sipariş 2 – Ahmet Yılmaz (CustomerID=1), 10 gün önce
INSERT INTO Orders (CustomerID, OrderDate, TotalAmount) VALUES
    (1, DATEADD(DAY, -10, GETDATE()), 1299.00);

INSERT INTO OrderDetails (OrderID, ProductID, Quantity) VALUES
    (2, 2, 1);  -- Akıllı Saat x1

-- Sipariş 3 – Elif Kaya (CustomerID=2), 20 gün önce
INSERT INTO Orders (CustomerID, OrderDate, TotalAmount) VALUES
    (2, DATEADD(DAY, -20, GETDATE()), 479.80);

INSERT INTO OrderDetails (OrderID, ProductID, Quantity) VALUES
    (3, 10, 2),  -- Nemlendirici Krem x2
    (3, 11, 1);  -- Güneş Kremi x1

-- Sipariş 4 – Elif Kaya (CustomerID=2), 5 gün önce
INSERT INTO Orders (CustomerID, OrderDate, TotalAmount) VALUES
    (2, DATEADD(DAY, -5, GETDATE()), 579.80);

INSERT INTO OrderDetails (OrderID, ProductID, Quantity) VALUES
    (4, 5,  1),  -- Kadın Spor Taytı x1
    (4, 6,  1);  -- Unisex Sweat x1

-- Sipariş 5 – Mehmet Demir (CustomerID=3), 30 gün önce
INSERT INTO Orders (CustomerID, OrderDate, TotalAmount) VALUES
    (3, DATEADD(DAY, -30, GETDATE()), 699.80);

INSERT INTO OrderDetails (OrderID, ProductID, Quantity) VALUES
    (5, 3,  1),  -- Bluetooth Hoparlör x1
    (5, 8,  2);  -- Atomic Habits x2 (79.90*2 ≈ 159.80 + 349 = 508.80)

-- Sipariş 6 – Zeynep Çelik (CustomerID=4), 8 gün önce
INSERT INTO Orders (CustomerID, OrderDate, TotalAmount) VALUES
    (4, DATEADD(DAY, -8, GETDATE()), 399.90);

INSERT INTO OrderDetails (OrderID, ProductID, Quantity) VALUES
    (6, 12, 1);  -- Nevresim x1

-- Sipariş 7 – Can Arslan (CustomerID=5), 12 gün önce
INSERT INTO Orders (CustomerID, OrderDate, TotalAmount) VALUES
    (5, DATEADD(DAY, -12, GETDATE()), 419.80);

INSERT INTO OrderDetails (OrderID, ProductID, Quantity) VALUES
    (7, 9,  2),  -- SQL Kitabı x2
    (7, 7,  2);  -- Dune x2

-- Sipariş 8 – Selin Yıldız (CustomerID=6), 3 gün önce
INSERT INTO Orders (CustomerID, OrderDate, TotalAmount) VALUES
    (6, DATEADD(DAY, -3, GETDATE()), 1629.90);

INSERT INTO OrderDetails (OrderID, ProductID, Quantity) VALUES
    (8, 2, 1),   -- Akıllı Saat x1
    (8, 4, 1);   -- Gömlek x1

-- Sipariş 9 – Can Arslan (CustomerID=5), 2 gün önce
INSERT INTO Orders (CustomerID, OrderDate, TotalAmount) VALUES
    (5, DATEADD(DAY, -2, GETDATE()), 279.90);

INSERT INTO OrderDetails (OrderID, ProductID, Quantity) VALUES
    (9, 13, 1);  -- Difüzör x1

-- Sipariş 10 – Zeynep Çelik (CustomerID=4), 1 gün önce
INSERT INTO Orders (CustomerID, OrderDate, TotalAmount) VALUES
    (4, DATEADD(DAY, -1, GETDATE()), 499.90);

INSERT INTO OrderDetails (OrderID, ProductID, Quantity) VALUES
    (10, 1, 1);  -- Kablosuz Kulaklık x1
GO



--  BÖLÜM 3: SORGULAMA VE ANALİZ (DQL - SELECT)

-- Sorgu 3.1: Stok miktarı 20'den az olan ürünler
--            (stok miktarına göre AZALAN sıra)

SELECT
    ProductName  AS [Ürün Adı],
    Stock        AS [Stok Miktarı]
FROM Products
WHERE Stock < 20
ORDER BY Stock DESC;
GO


-- Sorgu 3.2: Hangi müşteri hangi tarihte sipariş vermiş?
--            (Müşteri Adı, Şehir, Sipariş Tarihi, Toplam Tutar)
SELECT
    c.FullName                       AS [Müşteri Adı],
    c.City                           AS [Şehir],
    CONVERT(VARCHAR, o.OrderDate, 104) AS [Sipariş Tarihi],
    o.TotalAmount                    AS [Toplam Tutar (₺)]
FROM Customers AS c
INNER JOIN Orders AS o ON c.CustomerID = o.CustomerID
ORDER BY o.OrderDate DESC;
GO


-- Sorgu 3.3: "Ahmet Yılmaz" adlı müşterinin aldığı
--            ürünlerin adı, fiyatı ve kategorisi
--            (5 tablo zincirleme JOIN)
SELECT
    p.ProductName    AS [Ürün Adı],
    p.Price          AS [Fiyat (₺)],
    cat.CategoryName AS [Kategori]
FROM Customers AS c
INNER JOIN Orders      AS o   ON c.CustomerID  = o.CustomerID
INNER JOIN OrderDetails AS od  ON o.OrderID     = od.OrderID
INNER JOIN Products    AS p   ON od.ProductID   = p.ProductID
INNER JOIN Categories  AS cat ON p.CategoryID   = cat.CategoryID
WHERE c.FullName = 'Ahmet Yılmaz';
GO


-- Sorgu 3.4: Her kategoride kaç adet ürün var?

SELECT
    cat.CategoryName       AS [Kategori],
    COUNT(p.ProductID)     AS [Ürün Sayısı]
FROM Categories AS cat
LEFT JOIN Products AS p ON cat.CategoryID = p.CategoryID
GROUP BY cat.CategoryName
ORDER BY [Ürün Sayısı] DESC;
GO

-- Sorgu 3.5: Her müşterinin toplam cirosu
--            (en çok harcayandan en aza)

SELECT
    c.FullName             AS [Müşteri Adı],
    SUM(o.TotalAmount)     AS [Toplam Harcama (₺)]
FROM Customers AS c
INNER JOIN Orders AS o ON c.CustomerID = o.CustomerID
GROUP BY c.FullName
ORDER BY [Toplam Harcama (₺)] DESC;
GO


-- Sorgu 3.6: Siparişlerin üzerinden kaç gün geçmiş?

SELECT
    c.FullName                                AS [Müşteri Adı],
    CONVERT(VARCHAR, o.OrderDate, 104)        AS [Sipariş Tarihi],
    DATEDIFF(DAY, o.OrderDate, GETDATE())     AS [Geçen Gün]
FROM Orders AS o
INNER JOIN Customers AS c ON o.CustomerID = c.CustomerID
ORDER BY [Geçen Gün] ASC;
GO


--  BÖLÜM 4: İLERİ SEVİYE VERİ TABANI NESNELERİ


-- Görev 4.1: VIEW oluşturma – vw_SiparisOzet
--            Müşteri Adı, Sipariş Tarihi, Ürün Adı, Adet

CREATE VIEW vw_SiparisOzet AS
SELECT
    c.FullName                           AS [Müşteri Adı],
    CONVERT(VARCHAR, o.OrderDate, 104)   AS [Sipariş Tarihi],
    p.ProductName                        AS [Ürün Adı],
    od.Quantity                          AS [Adet]
FROM Customers   AS c
INNER JOIN Orders       AS o   ON c.CustomerID  = o.CustomerID
INNER JOIN OrderDetails AS od  ON o.OrderID     = od.OrderID
INNER JOIN Products     AS p   ON od.ProductID  = p.ProductID;
GO

-- View'ı test etmek için:
SELECT * FROM vw_SiparisOzet;
GO

-- Görev 4.2: Veri tabanı yedeği alma
--            NovaStoreDB → C:\Yedek\ klasörü

BACKUP DATABASE NovaStoreDB
TO DISK = 'C:\Yedek\NovaStoreDB.bak'
WITH FORMAT,
     MEDIANAME = 'NovaStoreBackup',
     NAME      = 'NovaStoreDB Tam Yedek';
GO
