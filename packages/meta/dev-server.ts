import express from 'express';
import path from 'node:path';

const dirname = import.meta.dirname as string;

//cors
const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Content-Type', 'application/json');
  console.log(req.method, req.url);
  next();
});

app.use(express.static(path.join(dirname, 'data')));

app.listen(52200, () => {
  console.log('Server started on http://localhost:52200');
});
