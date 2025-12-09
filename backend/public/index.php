<?php

declare(strict_types=1);

use Dotenv\Dotenv;
use FastRoute\RouteCollector;
use function FastRoute\simpleDispatcher;

require __DIR__ . '/../vendor/autoload.php';

// ---------- CORS HEADERS ----------
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Preflight (OPTIONS) -> just say OK and exit
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}
// ----------------------------------

// Load environment from .env if Dotenv is installed
if (class_exists(Dotenv::class)) {
    $dotenv = Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->safeLoad();
}

// Router
$dispatcher = simpleDispatcher(static function (RouteCollector $r): void {
    // NOTE: now this matches the namespace above: App\Controller\GraphQL
    $r->addRoute('POST', '/graphql', [App\Controller\GraphQL::class, 'handle']);
});

$httpMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri        = $_SERVER['REQUEST_URI'] ?? '/';

// Strip query string
if (false !== $pos = strpos($uri, '?')) {
    $uri = substr($uri, 0, $pos);
}
$uri = rawurldecode($uri);

$routeInfo = $dispatcher->dispatch($httpMethod, $uri);

switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        break;

    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;

    case FastRoute\Dispatcher::FOUND:
        [$class, $method] = $routeInfo[1];
        $controller       = new $class();
        $response         = $controller->$method($routeInfo[2]);

        if (!headers_sent()) {
            header('Content-Type: application/json; charset=utf-8');
        }

        echo json_encode($response);
        break;
}
