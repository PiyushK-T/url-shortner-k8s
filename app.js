import express from "express";
import exphbs from "express-handlebars";
const app = express();
import configRoutes from './routes/index.js';

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// app.use(express.static('public'));
const staticDir = express.static("public");
app.use("/public", staticDir);


app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});