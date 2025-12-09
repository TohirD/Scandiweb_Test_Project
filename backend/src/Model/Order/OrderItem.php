<?php

declare(strict_types=1);

namespace App\Model\Order;

final class OrderItem
{
    private ?int $id;
    private string $productId;
    private int $quantity;

    /** @var OrderItemAttribute[] */
    private array $attributes = [];

    public function __construct(?int $id, string $productId, int $quantity)
    {
        $this->id        = $id;
        $this->productId = $productId;
        $this->quantity  = $quantity;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProductId(): string
    {
        return $this->productId;
    }

    public function getQuantity(): int
    {
        return $this->quantity;
    }

    /**
     * @return OrderItemAttribute[]
     */
    public function getAttributes(): array
    {
        return $this->attributes;
    }

    /**
     * @param OrderItemAttribute[] $attributes
     */
    public function setAttributes(array $attributes): void
    {
        $this->attributes = $attributes;
    }
}
