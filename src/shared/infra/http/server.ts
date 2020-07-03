import app from './app';

const port = process.env.PORT || 3333;

app.listen(3333, async () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${port}`);
});
