import 'dotenv/config';
import express from 'express';
import './connection';
// import cors from 'cors';
const app = express();
import routes from './routes';
const PORT = 3000;
import bodyParser from 'body-parser';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
// app.use(cors());

app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
   res.header("Access-Control-Allow-Methods", "*");
   next();
});

app.use(routes);

app.listen(PORT, () => {
   console.log(`====> API Server now listening on PORT ${PORT}!`);
});
