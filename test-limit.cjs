const http = require('http');
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/upload-video',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=boundary',
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', data.substring(0, 100)));
});
req.write('--boundary\r\nContent-Disposition: form-data; name="video"; filename="test.mp4"\r\nContent-Type: video/mp4\r\n\r\n');
req.write('a'.repeat(200 * 1024 * 1024)); // 200MB
req.write('\r\n--boundary--\r\n');
req.end();
