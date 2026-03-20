import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const dist = join(__dirname, 'dist');

app.use(express.static(dist));

app.get('/{*path}', (_req, res) => {
  res.sendFile(join(dist, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
