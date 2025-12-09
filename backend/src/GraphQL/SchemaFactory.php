<?php

declare(strict_types=1);

namespace App\GraphQL;

use App\Model\Attribute\AbstractAttributeSet;
use App\Model\Attribute\AttributeItem;
use App\Model\Order\Order;
use App\Model\Order\OrderItem;
use App\Model\Order\OrderItemAttribute;
use App\Model\Price;
use App\Model\Product\AbstractProduct;
use App\Model\Category;
use App\Repository\CategoryRepository;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use App\Service\OrderService;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ListOfType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;

final class SchemaFactory
{
    private CategoryRepository $categoryRepository;
    private ProductRepository $productRepository;
    private OrderService $orderService;

    /** @var array<string,ObjectType|InputObjectType|ListOfType> */
    private array $types = [];

    public function __construct()
    {
        $this->categoryRepository = new CategoryRepository();
        $this->productRepository  = new ProductRepository();
        $this->orderService       = new OrderService(
            new OrderRepository(),
            $this->productRepository
        );
    }

    public function createSchema(): Schema
    {
        return new Schema([
            'query'    => $this->getQueryType(),
            'mutation' => $this->getMutationType(),
            'typeLoader' => function (string $name) {
                return $this->getNamedType($name);
            },
        ]);
    }

    private function getQueryType(): ObjectType
    {
        return new ObjectType([
            'name'   => 'Query',
            'fields' => [
                'categories' => [
                    'type'    => Type::listOf($this->getNamedType('Category')),
                    'resolve' => function (): array {
                        return $this->categoryRepository->findAll();
                    },
                ],
                'category'   => [
                    'type'    => $this->getNamedType('Category'),
                    'args'    => [
                        'name' => Type::nonNull(Type::string()),
                    ],
                    'resolve' => function ($root, array $args) {
                        return $this->categoryRepository->findByName($args['name']);
                    },
                ],
                'products'   => [
                    'type'    => Type::listOf($this->getNamedType('Product')),
                    'args'    => [
                        'category' => Type::string(),
                    ],
                    'resolve' => function ($root, array $args): array {
                        $category = $args['category'] ?? null;

                        return $this->productRepository->findAll($category);
                    },
                ],
                'product'    => [
                    'type'    => $this->getNamedType('Product'),
                    'args'    => [
                        'id' => Type::nonNull(Type::id()),
                    ],
                    'resolve' => function ($root, array $args): ?AbstractProduct {
                        return $this->productRepository->findById($args['id']);
                    },
                ],
            ],
        ]);
    }

    private function getMutationType(): ObjectType
    {
        return new ObjectType([
            'name'   => 'Mutation',
            'fields' => [
                'createOrder' => [
                    'type' => $this->getNamedType('Order'),
                    'args' => [
                        'input' => Type::nonNull($this->getNamedType('CreateOrderInput')),
                    ],
                    'resolve' => function ($root, array $args): Order {
                        /** @var array<string,mixed> $input */
                        $input = $args['input'];

                        return $this->orderService->createOrder($input);
                    },
                ],
            ],
        ]);
    }

    /**
     * @return ObjectType|InputObjectType|ListOfType
     */
    private function getNamedType(string $name)
    {
        if (isset($this->types[$name])) {
            return $this->types[$name];
        }

        switch ($name) {
            case 'Category':
                return $this->types[$name] = $this->buildCategoryType();

            case 'Product':
                return $this->types[$name] = $this->buildProductType();

            case 'AttributeSet':
                return $this->types[$name] = $this->buildAttributeSetType();

            case 'AttributeItem':
                return $this->types[$name] = $this->buildAttributeItemType();

            case 'Price':
                return $this->types[$name] = $this->buildPriceType();

            case 'Order':
                return $this->types[$name] = $this->buildOrderType();

            case 'OrderItem':
                return $this->types[$name] = $this->buildOrderItemType();

            case 'OrderItemAttribute':
                return $this->types[$name] = $this->buildOrderItemAttributeType();

            case 'CreateOrderInput':
                return $this->types[$name] = $this->buildCreateOrderInputType();

            case 'OrderItemInput':
                return $this->types[$name] = $this->buildOrderItemInputType();

            case 'SelectedAttributeInput':
                return $this->types[$name] = $this->buildSelectedAttributeInputType();
        }

        throw new \RuntimeException('Unknown GraphQL type: ' . $name);
    }

    private function buildCategoryType(): ObjectType
    {
        return new ObjectType([
            'name'   => 'Category',
            'fields' => [
                'id'   => Type::int(),
                'name' => Type::nonNull(Type::string()),
                'type' => Type::nonNull(Type::string()),
            ],
            'resolveField' => static function (Category $category, $args, $context, ResolveInfo $info) {
                switch ($info->fieldName) {
                    case 'id':
                        return $category->getId();
                    case 'name':
                        return $category->getName();
                    case 'type':
                        return $category->getType();
                }

                return null;
            },
        ]);
    }

    private function buildProductType(): ObjectType
    {
        return new ObjectType([
            'name'   => 'Product',
            'fields' => function () {
                return [
                    'id'          => Type::nonNull(Type::id()),
                    'name'        => Type::nonNull(Type::string()),
                    'inStock'     => Type::nonNull(Type::boolean()),
                    'description' => Type::string(),
                    'category'    => Type::string(),
                    'brand'       => Type::string(),
                    'type'        => Type::nonNull(Type::string()),
                    'gallery'     => Type::nonNull(Type::listOf(Type::nonNull(Type::string()))),
                    'attributes'  => Type::nonNull(Type::listOf($this->getNamedType('AttributeSet'))),
                    'prices'      => Type::nonNull(Type::listOf($this->getNamedType('Price'))),
                ];
            },
            'resolveField' => static function (AbstractProduct $product, $args, $context, ResolveInfo $info) {
                $field = $info->fieldName;

                switch ($field) {
                    case 'id':
                        return $product->getId();
                    case 'name':
                        return $product->getName();
                    case 'inStock':
                        return $product->getInStock();
                    case 'description':
                        return $product->getDescription();
                    case 'category':
                        return $product->getCategory();
                    case 'brand':
                        return $product->getBrand();
                    case 'type':
                        return $product->getType();
                    case 'gallery':
                        return $product->getGallery();
                    case 'attributes':
                        return $product->getAttributes();
                    case 'prices':
                        return $product->getPrices();
                }

                return null;
            },
        ]);
    }

    private function buildAttributeSetType(): ObjectType
    {
        return new ObjectType([
            'name'   => 'AttributeSet',
            'fields' => [
                'id'        => Type::nonNull(Type::int()),
                'productId' => Type::nonNull(Type::id()),
                'name'      => Type::nonNull(Type::string()),
                'type'      => Type::nonNull(Type::string()),
                'items'     => Type::nonNull(Type::listOf($this->getNamedType('AttributeItem'))),
            ],
            'resolveField' => static function (AbstractAttributeSet $set, $args, $context, ResolveInfo $info) {
                switch ($info->fieldName) {
                    case 'id':
                        return $set->getId();
                    case 'productId':
                        return $set->getProductId();
                    case 'name':
                        return $set->getName();
                    case 'type':
                        return $set->getType();
                    case 'items':
                        return $set->getItems();
                }

                return null;
            },
        ]);
    }

    private function buildAttributeItemType(): ObjectType
    {
        return new ObjectType([
            'name'   => 'AttributeItem',
            'fields' => [
                'displayValue' => Type::nonNull(Type::string()),
                'value'        => Type::nonNull(Type::string()),
                'id'           => Type::nonNull(Type::string()),
            ],
            'resolveField' => static function (AttributeItem $item, $args, $context, ResolveInfo $info) {
                switch ($info->fieldName) {
                    case 'displayValue':
                        return $item->getDisplayValue();
                    case 'value':
                        return $item->getValue();
                    case 'id':
                        return $item->getItemId();
                }

                return null;
            },
        ]);
    }

    private function buildPriceType(): ObjectType
    {
        return new ObjectType([
            'name'   => 'Price',
            'fields' => [
                'amount'         => Type::nonNull(Type::float()),
                'currencyLabel'  => Type::nonNull(Type::string()),
                'currencySymbol' => Type::nonNull(Type::string()),
            ],
            'resolveField' => static function (Price $price, $args, $context, ResolveInfo $info) {
                switch ($info->fieldName) {
                    case 'amount':
                        return $price->getAmount();
                    case 'currencyLabel':
                        return $price->getCurrencyLabel();
                    case 'currencySymbol':
                        return $price->getCurrencySymbol();
                }

                return null;
            },
        ]);
    }

    private function buildOrderType(): ObjectType
    {
        return new ObjectType([
            'name'   => 'Order',
            'fields' => function () {
                return [
                    'id'        => Type::nonNull(Type::int()),
                    'createdAt' => Type::nonNull(Type::string()),
                    'items'     => Type::nonNull(Type::listOf($this->getNamedType('OrderItem'))),
                ];
            },
            'resolveField' => static function (Order $order, $args, $context, ResolveInfo $info) {
                switch ($info->fieldName) {
                    case 'id':
                        return $order->getId();
                    case 'createdAt':
                        return $order->getCreatedAt();
                    case 'items':
                        return $order->getItems();
                }

                return null;
            },
        ]);
    }

    private function buildOrderItemType(): ObjectType
    {
        return new ObjectType([
            'name'   => 'OrderItem',
            'fields' => function () {
                return [
                    'id'         => Type::int(),
                    'productId'  => Type::nonNull(Type::id()),
                    'quantity'   => Type::nonNull(Type::int()),
                    'attributes' => Type::nonNull(Type::listOf($this->getNamedType('OrderItemAttribute'))),
                ];
            },
            'resolveField' => static function (OrderItem $item, $args, $context, ResolveInfo $info) {
                switch ($info->fieldName) {
                    case 'id':
                        return $item->getId();
                    case 'productId':
                        return $item->getProductId();
                    case 'quantity':
                        return $item->getQuantity();
                    case 'attributes':
                        return $item->getAttributes();
                }

                return null;
            },
        ]);
    }

    private function buildOrderItemAttributeType(): ObjectType
    {
        return new ObjectType([
            'name'   => 'OrderItemAttribute',
            'fields' => [
                'name'  => Type::nonNull(Type::string()),
                'value' => Type::nonNull(Type::string()),
            ],
            'resolveField' => static function (OrderItemAttribute $attr, $args, $context, ResolveInfo $info) {
                switch ($info->fieldName) {
                    case 'name':
                        return $attr->getName();
                    case 'value':
                        return $attr->getValue();
                }

                return null;
            },
        ]);
    }

    private function buildCreateOrderInputType(): InputObjectType
    {
        return new InputObjectType([
            'name'   => 'CreateOrderInput',
            'fields' => [
                'items' => Type::nonNull(Type::listOf(Type::nonNull($this->getNamedType('OrderItemInput')))),
            ],
        ]);
    }

    private function buildOrderItemInputType(): InputObjectType
    {
        return new InputObjectType([
            'name'   => 'OrderItemInput',
            'fields' => [
                'productId'         => Type::nonNull(Type::id()),
                'quantity'          => Type::nonNull(Type::int()),
                'selectedAttributes'=> Type::listOf($this->getNamedType('SelectedAttributeInput')),
            ],
        ]);
    }

    private function buildSelectedAttributeInputType(): InputObjectType
    {
        return new InputObjectType([
            'name'   => 'SelectedAttributeInput',
            'fields' => [
                'name'  => Type::nonNull(Type::string()),
                'value' => Type::nonNull(Type::string()),
            ],
        ]);
    }
}
