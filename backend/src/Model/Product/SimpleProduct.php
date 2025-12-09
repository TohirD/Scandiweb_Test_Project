<?php

declare(strict_types=1);

namespace App\Model\Product;

final class SimpleProduct extends AbstractProduct
{
    public function getType(): string
    {
        return 'simple';
    }
}
