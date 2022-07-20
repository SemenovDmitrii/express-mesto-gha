const Card = require('../models/card');
const ErrorCodes = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ErrorCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(ErrorCodes.CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrorCodes.BAD_REQUEST).send({
          message: `Переданы некорректные данные при создании карточки ${err.message}`,
        });
        return;
      }
      res
        .status(ErrorCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(ErrorCodes.NOT_FOUND)
          .send({ message: 'Карточка с указанным id не найдена' });
        return;
      }
      res.send(card);
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

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(ErrorCodes.NOT_FOUND)
          .send({ message: 'Передан несуществующий id карточки' });
        return;
      }
      res.send(card);
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

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(ErrorCodes.NOT_FOUND)
          .send({ message: 'Передан несуществующий id карточки' });
        return;
      }
      res.send(card);
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
