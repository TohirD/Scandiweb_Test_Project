<?php

declare(strict_types=1);

namespace App\Service;

use App\Model\Order\Order;
use App\Model\Order\OrderItem;
use App\Model\Order\OrderItemAttribute;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use InvalidArgumentException;

final class OrderService
{
    private OrderRepository $orderRepository;
    private ProductRepository $productRepository;

    public function __construct(OrderRepository $orderRepository, ProductRepository $productRepository)
    {
        $this->orderRepository   = $orderRepository;
        $this->productRepository = $productRepository;
    }

    /**
     * @param array<string,mixed> $input
     */
    public function createOrder(array $input): Order
    {
        if (!isset($input['items']) || !is_array($input['items']) || count($input['items']) === 0) {
            throw new InvalidArgumentException('Order must contain at least one item');
        }

        $items = [];

        foreach ($input['items'] as $itemInput) {
            $items[] = $this->buildOrderItem($itemInput);
        }

        $order = new Order(null, date('Y-m-d H:i:s'));
        $order->setItems($items);

        return $this->orderRepository->save($order);
    }

    /**
     * @param array<string,mixed> $itemInput
     */
    private function buildOrderItem(array $itemInput): OrderItem
    {
        if (!isset($itemInput['productId'], $itemInput['quantity'])) {
            throw new InvalidArgumentException('Order item must have productId and quantity');
        }

        $productId = (string) $itemInput['productId'];
        $quantity  = (int) $itemInput['quantity'];

        if ($quantity <= 0) {
            throw new InvalidArgumentException('Quantity must be positive');
        }

        $product = $this->productRepository->findById($productId);
        if ($product === null) {
            throw new InvalidArgumentException('Unknown product id: ' . $productId);
        }

        $orderItem = new OrderItem(null, $product->getId(), $quantity);

        $attributes = [];

        if (isset($itemInput['selectedAttributes']) && is_array($itemInput['selectedAttributes'])) {
            foreach ($itemInput['selectedAttributes'] as $attrInput) {
                if (!isset($attrInput['name'], $attrInput['value'])) {
                    continue;
                }
                $attributes[] = new OrderItemAttribute(
                    (string) $attrInput['name'],
                    (string) $attrInput['value']
                );
            }
        }

        $orderItem->setAttributes($attributes);

        return $orderItem;
    }
}
