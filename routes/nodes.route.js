const router = require("express").Router({ mergeParams: true });
const { body, param, validationResult } = require("express-validator");

module.exports = services => {

  router.get('/', async (req, res) => {
    services.models.node
      .find({ members: req.user.sub })
      .select("-__v -authorizationKey")
      .populate({ path: "members", select: "_id firstname lastname" })
      .exec((error, nodes) => {
        if (error) return res.sendStatus(403);
        res.send(nodes);
      });
  });

  router.get('/public', async (req, res) => {
    services.models.node
      .find({ allowPublicStats: true })
      .select("-__v -authorizationKey")
      .exec((error, nodes) => {
        if (error) return res.sendStatus(403);
        res.send(nodes);
      });
  });

  router.get(
    "/:id",
    [
      param("id")
        .isMongoId()
        .trim()
        .escape()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({
          error: "Unprocessable Entity",
          code: 422,
          reason: "Invalid fields",
          detail: errors.array()
        });

      services.models.node
        .findOne({ _id: req.params.id, members: req.user.sub })
        .select("-__v -authorizationKey")
        .populate({ path: "members", select: "_id firstname lastname" })
        .exec((error, node) => {
          if (error || !node) return res.sendStatus(403);

          res.send(node);
        });
    }
  );

  router.put(
    "/:id/actuator",
    [
      param("id")
        .isMongoId()
        .trim()
        .escape(),
      body("actuator")
        .isIn(services.types.actuators)
        .trim()
        .escape(),
      body("state")
        .isNumeric()
        .trim()
        .escape()
      // .custom(value => {
      //   console.log(value);
      //   if (parseInt(value) > 255 || parseInt(value) < 0) return
      //   Promise.reject('Invalid state value');
      // })
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({
          error: "Unprocessable Entity",
          code: 422,
          reason: "Invalid fields",
          detail: errors.array()
        });

      services.models.node
        .findOne({ _id: req.params.id, members: req.user.sub })
        .exec((error, node) => {
          if (error || !node) return res.sendStatus(403);

          const packet = {
            topic: `${node.macAddress}/actuators/${req.body.actuator}`,
            payload: req.body.state,
            qos: 2,
            retain: false
          };

          services.logger.info(
            `Published: [ACTUATOR] ${req.body.state} for ${req.body.actuator} to ${node.macAddress}`
          );

          services.mqtt.publish(packet);
          res.sendStatus(200);
        });
    }
  );

  return router;
};
