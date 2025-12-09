<?php

declare(strict_types=1);

namespace App\Repository;

use App\Config\Database;
use App\Model\Category;
use App\Model\SimpleCategory;
use PDO;

final class CategoryRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = (new Database())->getConnection();
    }

    /**
     * @return Category[]
     */
    public function findAll(): array
    {
        $stmt = $this->pdo->query('SELECT id, name FROM categories ORDER BY id');
        $rows = $stmt->fetchAll();

        $categories = [];

        foreach ($rows as $row) {
            $categories[] = new SimpleCategory((int) $row['id'], $row['name']);
        }

        return $categories;
    }

    public function findByName(string $name): ?Category
    {
        $stmt = $this->pdo->prepare('SELECT id, name FROM categories WHERE name = :name LIMIT 1');
        $stmt->execute(['name' => $name]);

        $row = $stmt->fetch();

        if ($row === false) {
            return null;
        }

        return new SimpleCategory((int) $row['id'], $row['name']);
    }
}
