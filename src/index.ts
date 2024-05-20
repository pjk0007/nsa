import express, { Express, Request, Response } from 'express';
import { nsaRequest } from './apis/nsa';
import cors from 'cors';

const app: Express = express();
const port = 8000;

app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Typescript + Node.js + Express Server');
});

app.post('/', async (req: Request, res: Response) => {
  const uri = req.body.uri;
  const params = req.body.params;
  const method = req.body.method;
  const api_key = req.body.api_key;
  const api_secret = req.body.api_secret;
  const customer_id = req.body.customer_id;
  const body = req.body.body;
  const data = await nsaRequest(
    uri,
    params,
    method,
    api_key,
    api_secret,
    customer_id,
    body
  );
  res.send(data);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
