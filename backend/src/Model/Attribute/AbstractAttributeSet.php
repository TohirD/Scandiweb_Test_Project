<?php

declare(strict_types=1);

namespace App\Model\Attribute;

abstract class AbstractAttributeSet
{
    protected int $id;
    protected string $productId;
    protected string $name;
    /** @var AttributeItem[] */
    protected array $items = [];

    public function __construct(int $id, string $productId, string $name)
    {
        $this->id        = $id;
        $this->productId = $productId;
        $this->name      = $name;
    }

    abstract public function getType(): string;

    public function getId(): int
    {
        return $this->id;
    }

    public function getProductId(): string
    {
        return $this->productId;
    }

    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return AttributeItem[]
     */
    public function getItems(): array
    {
        return $this->items;
    }

    /**
     * @param AttributeItem[] $items
     */
    public function setItems(array $items): void
    {
        $this->items = $items;
    }
}
