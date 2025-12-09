<?php

declare(strict_types=1);

namespace App\Model\Attribute;

final class AttributeItem
{
    private string $displayValue;
    private string $value;
    private string $itemId;

    public function __construct(string $displayValue, string $value, string $itemId)
    {
        $this->displayValue = $displayValue;
        $this->value        = $value;
        $this->itemId       = $itemId;
    }

    public function getDisplayValue(): string
    {
        return $this->displayValue;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function getItemId(): string
    {
        return $this->itemId;
    }
}
