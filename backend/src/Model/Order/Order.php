<?php

declare(strict_types=1);

namespace App\Model\Order;

final class Order
{
    private ?int $id;
    private string $createdAt;

    /** @var OrderItem[] */
    private array $items = [];

    public function __construct(?int $id, string $createdAt)
    {
        $this->id        = $id;
        $this->createdAt = $createdAt;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }

    /**
     * @return OrderItem[]
     */
    public function getItems(): array
    {
        return $this->items;
    }

    /**
     * @param OrderItem[] $items
     */
    public function setItems(array $items): void
    {
        $this->items = $items;
    }
}
