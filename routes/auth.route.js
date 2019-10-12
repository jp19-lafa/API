const router = require('express').Router({ mergeParams: true });
const { AuthController } = require('../controllers/auth.controller');
const { body, validationResult } = require('express-validator');

module.exports = (services) => {

  const authController = new AuthController(services);

  // TODO: Cleanup responses
  router.post('/login', [
    body('email').isEmail().trim().escape(),
    body('password').isLength({ min: 5 }).trim().escape()
  ], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({
        error: 'Unprocessable Entity',
        code: 422,
        reason: 'Invalid body fields',
        detail: errors.array()
      });

    const user = await authController.authenticateUserbyCredentials(req.body.email, req.body.password).catch(error => services.logger.error(error));

    if (!user) return res.status(403).send({
      error: 'Forbidden',
      code: 403,
      reason: 'Invalid User Credentials'
    });

    const tokenSet = await authController.generateTokenSet(user).catch(error => services.logger.error(error));

    return res.send(tokenSet);

  });

  router.post('/refresh', [
    body('token').isUUID(4).trim().escape(),
  ], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({
        error: 'Unprocessable Entity',
        code: 422,
        reason: 'Invalid body fields',
        detail: errors.array()
      });

    const user = await authController.authenticateUserByRefreshToken(req.body.token).catch(error => services.logger.error(error));

    if (!user) return res.status(403).send({
      error: 'Forbidden',
      code: 403,
      reason: 'Invalid Refresh Token'
    });

    const tokenSet = await authController.generateTokenSet(user).catch(error => services.logger.error(error));

    return res.send(tokenSet);

  });

  router.post('/register',
  async (req, res) => {
    res.status(418).send('Not Implemented')
  });

  return router;
};
