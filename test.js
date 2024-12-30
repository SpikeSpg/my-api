const a = 2;

if (a === 1) {
    console.log('its 1');
}
else {
    console.log('its 2');
}

function extractKeywords(userAgentString) {
    const regex = /(Mozilla|Chrome|Safari|Edge|Firefox|Opera|MSIE|Trident)/i; // Pattern to match common browsers/keywords
    const matches = userAgentString.match(regex);
    return matches ? matches : [];
}

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0';

const keywords = extractKeywords(userAgent);
console.log(keywords); // Outputs ['Mozilla', 'Chrome', 'Safari', 'Edge']
