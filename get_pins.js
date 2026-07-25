const urls = [
"https://www.pinterest.com/pin/917538124323725270/",
"https://www.pinterest.com/pin/917538124323725266/",
"https://www.pinterest.com/pin/917538124323725257/",
"https://www.pinterest.com/pin/917538124323725243/",
"https://www.pinterest.com/pin/917538124323725239/",
"https://www.pinterest.com/pin/917538124323725233/"
];

async function run() {
  for (const url of urls) {
    const res = await fetch(url);
    const text = await res.text();
    const match = text.match(/<meta content="(https:\/\/i\.pinimg\.com\/[^"]+)"[^>]+property="og:image"/);
    if (match) console.log(match[1]);
  }
}
run();
