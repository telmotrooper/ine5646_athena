/* Dependencies */
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const logger = require("morgan");
const path = require("path");

/* JavaScript files for each page */
const index = require("./routes/index");
const api = require("./routes/api");
const api_bids = require("./routes/api_bids");
const api_enabled_products = require("./routes/api_enabled_products");
const api_products = require("./routes/api_products");
const api_products_in_biddings = require("./routes/api_products_in_biddings");
const change_status = require("./routes/change_status");
const graphql = require("./routes/graphql");
const refresh_products = require("./routes/refresh_products");
const test = require("./routes/test");
const time = require("./routes/time");
const login = require("./routes/login");

/* Initialize application */
const app = express();

/* Set port and start listening */
app.set("port", (process.env.PORT || 8000));

app.listen(app.get("port"), function() {
	console.log("Node app is running on port", app.get("port"));
});

/* View engine setup */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/* Paths for each page */
app.use("/", index);
app.use("/api", api);
app.use("/api/bids", api_bids);
app.use("/api/products", api_products);
app.use("/api/products_in_biddings", api_products_in_biddings);
app.use("/api/enabled_products", api_enabled_products);
app.use("/api/status", change_status);
app.use("/graphql", graphql);
app.use("/test", test);
app.use("/time", time);
app.use("/refresh_products", refresh_products);
app.use("/login", login);

/* Catch 404 and forward to error handler */
app.use(function(req, res, next) {
	let error = new Error("Not Found");
	error.status = 404;
	next(error);
});

/* Error handler */
app.use(function(err, req, res, next) {
	/* Set locals, only providing error in development */
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	/* Render the error page */
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
