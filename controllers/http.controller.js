const express = require("express");
const cors = require("cors");
const jwt = require("express-jwt");
const sentry = require('@sentry/node');
const app = express();

module.exports = {

  HttpController: class {

    constructor(services) {

      this.services = services;

      this.services.http = app;

      this.app = app;

      // sentry.init({ dsn: 'https://2d76762c67434792892887d13b2cdda6@sentry.io/1784742' });

      this._init();

      this._registerRoutes();

      this._listen();

    }

    _init() {
      app.use(cors(this._corsOptionDelegate));
      app.use(express.json());
      app.use(sentry.Handlers.requestHandler());
      app.use(
        jwt({ secret: this.services.keys.private }).unless({
          path: [
            "/auth/login",
            "/auth/refresh",
            "/nodes/public",
          ]
        })
      );
      app.use((err, req, res, next) => {
        if (err.name === "UnauthorizedError") {
          res
            .status(401)
            .send({ error: "Unautorized", code: 401, reason: "Invalid Token" });
        }
      });
    }

    _registerRoutes() {
      // Routes
      app.use("/auth", require("../routes/auth.route")(this.services));
      app.use("/nodes", require("../routes/nodes.route")(this.services));
    }

    _corsOptionDelegate(req, callback) {
      let whitelist = [
        "http://localhost:4200",
        "https://api.farmlab.team",
        "https://api.staging.farmlab.team"
      ];
      let corsOptions;
      if (whitelist.indexOf(req.header("Origin")) !== -1) {
        corsOptions = { origin: true };
      } else {
        corsOptions = { origin: false };
      }
      callback(null, corsOptions);
    }

    _listen() {
      app.listen(8080, "0.0.0.0", () => {
        this.services.logger.info("HTTP Server Running");
      });
    }
  }
}
