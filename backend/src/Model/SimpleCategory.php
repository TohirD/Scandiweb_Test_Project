<?php

declare(strict_types=1);

namespace App\Model;

final class SimpleCategory extends Category
{
    public function getType(): string
    {
        return 'simple';
    }
}
