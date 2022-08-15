const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  login,
  getUser,
  getUsers,
  createUser,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

routerUsers.get('/users', getUsers);

routerUsers.get('/users/me', getCurrentUser);

routerUsers.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24),
    }),
  }),
  getUser,
);

routerUsers.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(
        /^http[s]*:\/\/[a-z0-9.\-_~:/?#[\]@!$&'()*+,;=]+|www\.[a-z0-9.-_~:?#[\]@!$&'()*+,;=]+/,
      ),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

routerUsers.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);

routerUsers.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(
        /^http[s]*:\/\/[a-z0-9.\-_~:/?#[\]@!$&'()*+,;=]+|www\.[a-z0-9.-_~:?#[\]@!$&'()*+,;=]+/,
      ),
    }),
  }),
  updateAvatar,
);

routerUsers.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

module.exports = routerUsers;
