<?php

declare(strict_types=1);

namespace App\Repository;

use App\Config\Database;
use App\Model\Price;
use App\Model\Product\AbstractProduct;
use App\Model\Product\SimpleProduct;
use PDO;

final class ProductRepository
{
    private PDO $pdo;
    private AttributeSetRepository $attributeSetRepository;

    public function __construct()
    {
        $this->pdo                    = (new Database())->getConnection();
        $this->attributeSetRepository = new AttributeSetRepository();
    }

    /**
     * @return AbstractProduct[]
     */
    public function findAll(?string $categoryName = null): array
    {
        if ($categoryName !== null) {
            $stmt = $this->pdo->prepare(
                'SELECT * FROM products WHERE category = :cat ORDER BY id'
            );
            $stmt->execute(['cat' => $categoryName]);
        } else {
            $stmt = $this->pdo->query('SELECT * FROM products ORDER BY id');
        }

        $products = [];

        foreach ($stmt->fetchAll() as $row) {
            $products[] = $this->hydrateProduct($row);
        }

        return $products;
    }

    public function findById(string $id): ?AbstractProduct
    {
        $stmt = $this->pdo->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);

        $row = $stmt->fetch();

        if ($row === false) {
            return null;
        }

        return $this->hydrateProduct($row);
    }

    /**
     * @param array<string,mixed> $row
     */
    private function hydrateProduct(array $row): AbstractProduct
    {
        $product = new SimpleProduct(
            (string) $row['id'],
            (string) $row['name'],
            (bool) $row['in_stock'],
            $row['description'] !== null ? (string) $row['description'] : null,
            $row['category'] !== null ? (string) $row['category'] : null,
            $row['brand'] !== null ? (string) $row['brand'] : null
        );

        $product->setGallery($this->loadGallery($product->getId()));
        $product->setAttributes($this->attributeSetRepository->findByProductId($product->getId()));
        $product->setPrices($this->loadPrices($product->getId()));

        return $product;
    }

    /**
     * @return string[]
     */
    private function loadGallery(string $productId): array
    {
        $stmt = $this->pdo->prepare('SELECT image_url FROM product_gallery WHERE product_id = :pid ORDER BY id');
        $stmt->execute(['pid' => $productId]);

        $images = [];

        foreach ($stmt->fetchAll() as $row) {
            $images[] = (string) $row['image_url'];
        }

        return $images;
    }

    /**
     * @return Price[]
     */
    private function loadPrices(string $productId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT amount, currency_label, currency_symbol FROM prices WHERE product_id = :pid ORDER BY id'
        );
        $stmt->execute(['pid' => $productId]);

        $prices = [];

        foreach ($stmt->fetchAll() as $row) {
            $prices[] = new Price(
                (string) $row['currency_label'],
                (string) $row['currency_symbol'],
                (float) $row['amount']
            );
        }

        return $prices;
    }
}
