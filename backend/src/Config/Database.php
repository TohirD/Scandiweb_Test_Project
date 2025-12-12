<?php

namespace App\Config;

use PDO;
use PDOException;

class Database
{
    private $host = '127.0.0.1';
    private $db   = 'scandiweb_test';
    private $user = 'root';
    private $pass = '';
    private $charset = 'utf8mb4';

    // private $host = 'auth-db2078.hstgr.io';
    // private $db   = 'u121136056_Shop_test';
    // private $user = 'u121136056_Shop_test';
    // private $pass = 'Admin#Admin1';
    // private $charset = 'utf8mb4';

    public function getConnection(): PDO
    {
        $dsn = "mysql:host={$this->host};dbname={$this->db};charset={$this->charset}";

        try {
            $pdo = new PDO($dsn, $this->user, $this->pass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }
}
