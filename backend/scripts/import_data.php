<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\Database;

$db = (new Database())->getConnection();

$json = file_get_contents(__DIR__ . '/data.json');
$data = json_decode($json, true);

// Insert categories
foreach ($data['data']['categories'] as $c) {
    $stmt = $db->prepare("INSERT IGNORE INTO categories (name) VALUES (?)");
    $stmt->execute([$c['name']]);
}

// Insert products
foreach ($data['data']['products'] as $p) {
    $stmt = $db->prepare("
        INSERT INTO products (id, name, in_stock, description, category, brand)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $p['id'],
        $p['name'],
        $p['inStock'] ? 1 : 0,
        $p['description'],
        $p['category'],
        $p['brand']
    ]);

    // Gallery
    foreach ($p['gallery'] as $img) {
        $stmt = $db->prepare("INSERT INTO product_gallery (product_id, image_url) VALUES (?, ?)");
        $stmt->execute([$p['id'], $img]);
    }

    // Prices
    foreach ($p['prices'] as $price) {
        $stmt = $db->prepare("
            INSERT INTO prices (product_id, amount, currency_label, currency_symbol)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([
            $p['id'],
            $price['amount'],
            $price['currency']['label'],
            $price['currency']['symbol']
        ]);
    }

    // Attributes
    foreach ($p['attributes'] as $attrSet) {
        $stmt = $db->prepare("
            INSERT INTO attribute_sets (product_id, name, type)
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$p['id'], $attrSet['name'], $attrSet['type']]);
        $setId = $db->lastInsertId();

        foreach ($attrSet['items'] as $item) {
            $stmt = $db->prepare("
                INSERT INTO attribute_items (set_id, display_value, value, item_id)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([
                $setId,
                $item['displayValue'],
                $item['value'],
                $item['id']
            ]);
        }
    }
}

echo "Import completed successfully!\n";
