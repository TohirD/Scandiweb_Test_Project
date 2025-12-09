<?php

declare(strict_types=1);

namespace App\Model;

final class Price
{
    private string $currencyLabel;
    private string $currencySymbol;
    private float $amount;

    public function __construct(string $currencyLabel, string $currencySymbol, float $amount)
    {
        $this->currencyLabel  = $currencyLabel;
        $this->currencySymbol = $currencySymbol;
        $this->amount         = $amount;
    }

    public function getCurrencyLabel(): string
    {
        return $this->currencyLabel;
    }

    public function getCurrencySymbol(): string
    {
        return $this->currencySymbol;
    }

    public function getAmount(): float
    {
        return $this->amount;
    }
}
