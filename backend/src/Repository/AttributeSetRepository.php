<?php

declare(strict_types=1);

namespace App\Repository;

use App\Config\Database;
use App\Model\Attribute\AbstractAttributeSet;
use App\Model\Attribute\AttributeItem;
use App\Model\Attribute\SwatchAttributeSet;
use App\Model\Attribute\TextAttributeSet;
use PDO;
use RuntimeException;

final class AttributeSetRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = (new Database())->getConnection();
    }

    /**
     * @return AbstractAttributeSet[]
     */
    public function findByProductId(string $productId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT id, product_id, name, type FROM attribute_sets WHERE product_id = :pid'
        );
        $stmt->execute(['pid' => $productId]);

        $sets = [];

        $rows = $stmt->fetchAll();

        foreach ($rows as $row) {
            $sets[] = $this->hydrateSet($row);
        }

        return $sets;
    }

    /**
     * @param array<string,mixed> $row
     */
    private function hydrateSet(array $row): AbstractAttributeSet
    {
        $id        = (int) $row['id'];
        $productId = (string) $row['product_id'];
        $name      = (string) $row['name'];
        $type      = (string) $row['type'];

        $map = [
            'text'   => TextAttributeSet::class,
            'swatch' => SwatchAttributeSet::class,
        ];

        if (!isset($map[$type])) {
            throw new RuntimeException('Unknown attribute set type: ' . $type);
        }

        /** @var class-string<AbstractAttributeSet> $class */
        $class = $map[$type];

        $set = new $class($id, $productId, $name);
        $set->setItems($this->loadItems($id));

        return $set;
    }

    /**
     * @return AttributeItem[]
     */
    private function loadItems(int $setId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT display_value, value, item_id FROM attribute_items WHERE set_id = :sid ORDER BY id'
        );
        $stmt->execute(['sid' => $setId]);

        $items = [];

        foreach ($stmt->fetchAll() as $row) {
            $items[] = new AttributeItem(
                (string) $row['display_value'],
                (string) $row['value'],
                (string) $row['item_id']
            );
        }

        return $items;
    }
}
