#!/bin/bash
urls=(
"https://www.pinterest.com/pin/917538124323725270/"
"https://www.pinterest.com/pin/917538124323725266/"
"https://www.pinterest.com/pin/917538124323725257/"
"https://www.pinterest.com/pin/917538124323725243/"
"https://www.pinterest.com/pin/917538124323725239/"
"https://www.pinterest.com/pin/917538124323725233/"
)
for url in "${urls[@]}"; do
  curl -s "$url" | grep -o 'property="og:image"[^>]*content="[^"]*"' | grep -o 'https://[^"]*'
done
