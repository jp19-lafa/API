const router = require('express').Router({ mergeParams: true });

module.exports = (services) => {

  router.get('/',
    async (req, res) => {
      services.logger.info('GET /nodes');

      res.send({ amount: 0, result: [] });
    }
  );

  return router;
};
