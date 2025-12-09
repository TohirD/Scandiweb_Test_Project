<?php

declare(strict_types=1);

namespace App\Model\Product;

use App\Model\Attribute\AbstractAttributeSet;
use App\Model\Price;

abstract class AbstractProduct
{
    protected string $id;
    protected string $name;
    protected bool $inStock;
    protected ?string $description;
    protected ?string $categoryName;
    protected ?string $brand;
    /** @var string[] */
    protected array $gallery = [];
    /** @var AbstractAttributeSet[] */
    protected array $attributes = [];
    /** @var Price[] */
    protected array $prices = [];

    public function __construct(
        string $id,
        string $name,
        bool $inStock,
        ?string $description,
        ?string $categoryName,
        ?string $brand
    ) {
        $this->id           = $id;
        $this->name         = $name;
        $this->inStock      = $inStock;
        $this->description  = $description;
        $this->categoryName = $categoryName;
        $this->brand        = $brand;
    }

    abstract public function getType(): string;

    public function getId(): string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getInStock(): bool
    {
        return $this->inStock;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function getCategory(): ?string
    {
        return $this->categoryName;
    }

    public function getBrand(): ?string
    {
        return $this->brand;
    }

    /**
     * @return string[]
     */
    public function getGallery(): array
    {
        return $this->gallery;
    }

    /**
     * @param string[] $gallery
     */
    public function setGallery(array $gallery): void
    {
        $this->gallery = $gallery;
    }

    /**
     * @return AbstractAttributeSet[]
     */
    public function getAttributes(): array
    {
        return $this->attributes;
    }

    /**
     * @param AbstractAttributeSet[] $attributes
     */
    public function setAttributes(array $attributes): void
    {
        $this->attributes = $attributes;
    }

    /**
     * @return Price[]
     */
    public function getPrices(): array
    {
        return $this->prices;
    }

    /**
     * @param Price[] $prices
     */
    public function setPrices(array $prices): void
    {
        $this->prices = $prices;
    }
}
