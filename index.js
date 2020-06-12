const dotenv = require("dotenv");
dotenv.config();

const app = require("./router/router");
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}..`);
});
