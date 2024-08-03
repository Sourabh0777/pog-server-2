import express from 'express';
const app = express();
app.get('/', (req, res) => {
  const a = 'working';
  res.send('Hello World');
});

app.listen(5000, () => {
  console.log('listening to port 500');
});
