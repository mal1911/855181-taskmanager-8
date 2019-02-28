import {getRandomArray, getRandomInt} from "./utils";

const titles = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`,
];

const hashtags = [
  `homework`,
  `theory`,
  `practice`,
  `intensive`,
  `keks`,
];

const colors = [
  `black`,
  `yellow`,
  `blue`,
  `green`,
  `pink`];

export default () => (
  {
    title: titles[getRandomInt(0, 2)],
    dueDate: Date.now() + getRandomInt(-7, 7) * 24 * 60 * 60 * 1000,
    tags: new Set(getRandomArray(hashtags, getRandomInt(0, 3))),
    picture: `http://picsum.photos/100/100?r=${Math.random()}`,
    color: colors[getRandomInt(0, 4)],
    repeatingDays: {
      'mo': getRandomInt(0, 1),
      'tu': getRandomInt(0, 1),
      'we': getRandomInt(0, 1),
      'th': getRandomInt(0, 1),
      'fr': getRandomInt(0, 1),
      'sa': getRandomInt(0, 1),
      'su': getRandomInt(0, 1),
    },
    isFavorite: getRandomInt(0, 1),
    isDone: getRandomInt(0, 1),
    isEdit: getRandomInt(0, 1),
  }
);

