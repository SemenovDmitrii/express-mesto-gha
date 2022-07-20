const User = require('../models/user');
const ErrorCodes = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ErrorCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(ErrorCodes.NOT_FOUND)
          .send({ message: 'Пользователь по указанному id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id' });
        return;
      }
      res
        .status(ErrorCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(ErrorCodes.CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrorCodes.BAD_REQUEST).send({
          message: `Переданы некорректные данные при создании пользователя ${err.message}`,
        });
        return;
      }
      res
        .status(ErrorCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(ErrorCodes.NOT_FOUND)
          .send({ message: 'Пользователь с указанным id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res
        .status(ErrorCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(ErrorCodes.NOT_FOUND)
          .send({ message: 'Пользователь с указанным id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res
        .status(ErrorCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};
