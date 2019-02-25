import {getRandomInt, getRandomArray, addChildElements} from './utils.js';
import getFilterHTML from './make-filter.js';
import getCardHTML from './make-task.js';

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

const cardData =
  [
    {
      title: `This is example of new task, you can add picture, set date and time, add tags.`,
      classModificators: [`edit`, `black`],
      isDisableDateDeadline: true,
      isDisableRepeatDays: true
    },
    {
      title: `It is example of repeating task. It marks by wave.`,
      classModificators: [`pink`, `repeat`],
      hashtags: [`repeat`, `cinema`, `entertaiment`],
      isDisableDateDeadline: true,
      isDisableRepeatDays: true
    },
    {
      title: `This is card with missing deadline.`,
      classModificators: [`yellow`, `deadline`],
      hashtags: [`repeat`, `cinema`, `entertaiment`],
      isDisableDateDeadline: true,
      isDisableRepeatDays: true
    },
    {
      title: `Here is a card with filled data.`,
      classModificators: [`edit`, `yellow`, `repeat`],
      imgName: `sample-img.jpg`,
      hashtags: [`repeat`, `cinema`, `entertaiment`],
    },
    {
      classModificators: [`blue`],
      hashtags: [`repeat`, `cinema`, `entertaiment`],
      isDisableDateDeadline: true,
      isDisableRepeatDays: true
    },
    {
      classModificators: [`blue`],
      hashtags: [`repeat`, `cinema`, `entertaiment`],
      imgName: `sample-img.jpg`
    }
  ];

const main = () => {
  const mainFilterElement = document.querySelector(`.main__filter`);
  addChildElements(mainFilterElement, filterData, getFilterHTML, cardData.length);

  const boardTasksElement = document.querySelector(`.board__tasks`);
  addChildElements(boardTasksElement, cardData, getCardHTML);

  const onMainFilterElementClick = () => {
    addChildElements(boardTasksElement, getRandomArray(cardData, getRandomInt(0, cardData.length - 1)), getCardHTML);
  };
  mainFilterElement.addEventListener(`click`, onMainFilterElementClick);

};

main();

