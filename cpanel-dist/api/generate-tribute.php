<?php
header('Content-Type: application/json');
$apiKey = getenv('GEMINI_API_KEY') ?: 'YOUR_API_KEY_HERE';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$name = $input['name'] ?? '';
$country = $input['country'] ?? '';
$tone = $input['tone'] ?? 'respectful, royal, and poetic';

$prompt = "Write a short, highly elegant and luxurious 50th Golden Jubilee birthday tribute for Her Majesty The Queen. The tribute should be signed by $name from $country. Tone: $tone. Keep it under 3 sentences. No placeholders. Just the message.";

$url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=' . $apiKey;
$data = [
    'contents' => [
        ['parts' => [['text' => $prompt]]]
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
$text = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';

echo json_encode(['message' => $text]);
