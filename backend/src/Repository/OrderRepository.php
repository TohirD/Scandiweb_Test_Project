<?php

declare(strict_types=1);

namespace App\Repository;

use App\Config\Database;
use App\Model\Order\Order;
use App\Model\Order\OrderItem;
use App\Model\Order\OrderItemAttribute;
use PDO;

final class OrderRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = (new Database())->getConnection();
    }

    public function save(Order $order): Order
    {
        $this->pdo->beginTransaction();

        try {
            // Insert order
            $stmt = $this->pdo->prepare(
                'INSERT INTO orders (created_at) VALUES (NOW())'
            );
            $stmt->execute();

            $orderId = (int) $this->pdo->lastInsertId();

            $itemsStmt = $this->pdo->prepare(
                'INSERT INTO order_items (order_id, product_id, quantity)
                 VALUES (:order_id, :product_id, :quantity)'
            );

            $attrStmt = $this->pdo->prepare(
                'INSERT INTO order_item_attributes (order_item_id, attribute_name, attribute_value)
                 VALUES (:order_item_id, :attribute_name, :attribute_value)'
            );

            foreach ($order->getItems() as $item) {
                /** @var OrderItem $item */
                $itemsStmt->execute([
                    'order_id'  => $orderId,
                    'product_id'=> $item->getProductId(),
                    'quantity'  => $item->getQuantity(),
                ]);

                $orderItemId = (int) $this->pdo->lastInsertId();

                foreach ($item->getAttributes() as $attr) {
                    /** @var OrderItemAttribute $attr */
                    $attrStmt->execute([
                        'order_item_id'   => $orderItemId,
                        'attribute_name'  => $attr->getName(),
                        'attribute_value' => $attr->getValue(),
                    ]);
                }
            }

            $this->pdo->commit();

            // Reload order with createdAt from DB
            $stmt = $this->pdo->prepare('SELECT created_at FROM orders WHERE id = :id');
            $stmt->execute(['id' => $orderId]);
            $row = $stmt->fetch();

            $savedOrder = new Order($orderId, (string) $row['created_at']);
            $savedOrder->setItems($order->getItems());

            return $savedOrder;
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
}
