require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const authRouter=require("./routes/auth");
const jobRouter=require("./routes/jobs");
const connectDB=require("./db/connect");
const helmet=require("helmet");
const xssclean=require("xss-clean");
const cors=require("cors");
const rateLimiter=require("express-rate-limit")
const swaggerUI=require("swagger-ui-express")
const YAML=require("yamljs")
const swaggerDocument=YAML.load('./swagger.yaml');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authetication=require("./middleware/authentication");

app.use(express.json());
// extra packages

// routes
app.set('trust proxy',1);
app.use(rateLimiter({
  windowMs:15*60*1000,
  max:100
}))
app.use(helmet());
app.use(cors());
app.use(xssclean());


app.get("/",(req,res)=>
{
  res.send("<h1>JobS api</h1> <a href='/api-docs'>Documentation</a>")
})

app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDocument))


app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authetication,jobRouter);
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {

    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
