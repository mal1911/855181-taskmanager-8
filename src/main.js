import {getRandomInt, getRandomArray, addChildElements} from './utils.js';
import getFilterHTML from './make-filter.js';
import getCardHTML from './make-task.js';
import getTaskObj from './data.js';
import {getHTMLFromData} from "./utils";

const MAX_TASKS = 7;

const filterData =
  [
    {title: `All`, isChecked: true},
    {title: `Overdue`, isDisabled: true},
    {title: `Today`, isDisabled: true},
    {title: `Favorites`},
    {title: `Repeating`},
    {title: `Tags`},
    {title: `Archive`}
  ];

const getCaradsData = (count) => {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(getTaskObj());
  }
  return arr;
};

const cardsData = getCaradsData(MAX_TASKS);

const main = () => {
  const mainFilterElement = document.querySelector(`.main__filter`);
  addChildElements(mainFilterElement, filterData, getFilterHTML, MAX_TASKS);

  const boardTasksElement = document.querySelector(`.board__tasks`);
  boardTasksElement.innerHTML = getHTMLFromData(cardsData, getCardHTML);

  const onMainFilterElementClick = () => {
    boardTasksElement.innerHTML = getHTMLFromData(getRandomArray(cardsData, getRandomInt(1, MAX_TASKS)), getCardHTML);
  };

  mainFilterElement.addEventListener(`click`, onMainFilterElementClick);
};

main();

