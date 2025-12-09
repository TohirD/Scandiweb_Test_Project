<?php
declare(strict_types=1);

namespace App\Controller;

use App\GraphQL\SchemaFactory;
use GraphQL\Error\DebugFlag;
use GraphQL\Error\FormattedError;
use GraphQL\GraphQL as GraphQLExecutor;

final class GraphQL
{
    private SchemaFactory $schemaFactory;

    public function __construct()
    {
        $this->schemaFactory = new SchemaFactory();
    }

    /**
     * @param array<string,mixed> $vars
     *
     * @return array<string,mixed>
     */
    public function handle(array $vars = []): array
    {
        $rawInput = file_get_contents('php://input');
        $input    = json_decode($rawInput ?: '{}', true);

        $query         = $input['query'] ?? null;
        $variables     = isset($input['variables']) && is_array($input['variables']) ? $input['variables'] : null;
        $operationName = $input['operationName'] ?? null;

        if ($query === null) {
            return [
                'errors' => [
                    ['message' => 'No query provided'],
                ],
            ];
        }

        try {
            $schema = $this->schemaFactory->createSchema();

            $result = GraphQLExecutor::executeQuery(
                $schema,
                $query,
                null,
                null,
                $variables,
                $operationName
            );

            return $result->toArray();
        } catch (\Throwable $e) {
            return [
                'errors' => [
                    FormattedError::createFromThrowable($e, DebugFlag::INCLUDE_DEBUG_MESSAGE),
                ],
            ];
        }
    }
}
