<?php
header('Content-Type: application/json');
$file = '../wishes.json';

if (!file_exists($file)) {
    file_put_contents($file, json_encode([]));
}

$action = $_GET['action'] ?? '';
$id = $_GET['id'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo file_get_contents($file);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $wishes = json_decode(file_get_contents($file), true) ?: [];
    
    if ($action === 'like' && $id) {
        $found = false;
        foreach ($wishes as &$wish) {
            if ($wish['id'] === $id) {
                $wish['likes'] = ($wish['likes'] ?? 0) + 1;
                $found = $wish;
                break;
            }
        }
        if ($found) {
            file_put_contents($file, json_encode($wishes, JSON_PRETTY_PRINT));
            echo json_encode($found);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
        }
        exit;
    }
    
    // Create new wish
    $input = json_decode(file_get_contents('php://input'), true);
    if (!empty($input['name']) && !empty($input['country']) && !empty($input['message'])) {
        $newWish = [
            'id' => (string)(time() * 1000),
            'name' => $input['name'],
            'country' => $input['country'],
            'message' => $input['message'],
            'createdAt' => date('c'),
            'likes' => 0
        ];
        array_unshift($wishes, $newWish);
        file_put_contents($file, json_encode($wishes, JSON_PRETTY_PRINT));
        echo json_encode($newWish);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Missing fields']);
    }
}
