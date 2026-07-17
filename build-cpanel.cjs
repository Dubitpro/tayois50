const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("Building React app...");
execSync('npm run build', { stdio: 'inherit' });

const distPath = path.join(__dirname, 'cpanel-dist');
if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, { recursive: true, force: true });
}
fs.mkdirSync(distPath);

console.log("Copying frontend assets...");
execSync(`cp -r dist/* ${distPath}/`);

console.log("Creating PHP API...");
fs.mkdirSync(path.join(distPath, 'api'));

// generate-tribute.php
const phpTribute = `<?php
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
`;
fs.writeFileSync(path.join(distPath, 'api', 'generate-tribute.php'), phpTribute);

// wishes.php
const phpWishes = `<?php
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
`;
fs.writeFileSync(path.join(distPath, 'api', 'wishes.php'), phpWishes);

// .htaccess
const htaccess = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # API Routing
  RewriteRule ^api/wishes/([^/]+)/like$ api/wishes.php?action=like&id=$1 [L,QSA]
  RewriteRule ^api/wishes$ api/wishes.php [L,QSA]
  RewriteRule ^api/generate-tribute$ api/generate-tribute.php [L,QSA]

  # React Router fallback
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/api/
  RewriteRule . /index.html [L]
</IfModule>
`;
fs.writeFileSync(path.join(distPath, '.htaccess'), htaccess);

// wishes.json
fs.writeFileSync(path.join(distPath, 'wishes.json'), fs.readFileSync(path.join(__dirname, 'wishes.json')));

console.log("cPanel distribution ready in ./cpanel-dist/");
