'use strict';

const filterData =
  [
    {title: `All`, count: 7, isChecked: true},
    {title: `Overdue`, count: 0, isDisabled: true},
    {title: `Today`, count: 0, isDisabled: true},
    {title: `Favorites`, count: 7},
    {title: `Repeating`, count: 2},
    {title: `Tags`, count: 6},
    {title: `Archive`, count: 115}
  ];

const getFilterHTML = (objArg) =>
  `<input type="radio" id="filter__${objArg.title}" class="filter__input visually-hidden" name="filter" ${objArg.isChecked ? `checked` : ``} ${objArg.isDisabled ? `disabled` : ``}/>
  <label for="filter__${objArg.title.toLowerCase()}" class="filter__label">${objArg.title.toUpperCase()}
  <span class="filter__${objArg.title.toLowerCase()}-count">${objArg.count}</span>
  </label>`;


const addChildElements = (parentElement, arrArg, getElementHTML) => {
  let elementsHTML = ``;
  arrArg.forEach((obj) => {
    elementsHTML += getElementHTML(obj);
  });

  parentElement.insertAdjacentHTML(`afterBegin`, elementsHTML);
};

const mainFilterElement = document.querySelector(`.main__filter`);
addChildElements(mainFilterElement, filterData, getFilterHTML);
