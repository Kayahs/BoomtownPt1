const jwt = require('jsonwebtoken');

const authenticate = (app, req) => {
  const cookieName = app.get('JWT_COOKIE_NAME');
  const jwtCookie = req.cookies[cookieName];
  const secret = app.get('JWT_SECRET');
  const { userID, csrfToken } = jwt.verify(jwtCookie, secret);

  const headerCSRFToken = req.get('authorization').replace('Bearer ', '');
  const isValidCSRF = headerCSRFToken === csrfToken;

  if (!isValidCSRF) {
    throw new Error('Unauthorized');
  }

  return userID
}

module.exports = authenticate