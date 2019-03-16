export const getMixArray = (arr) =>
  arr.slice().sort(() => 0.5 - Math.random());

export const getClipArray = (arr, count) =>
  arr.slice(0, count - 1);

export const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (1 + max - min)) + min;

export const getRandomArray = (arr, count) =>
  getClipArray(getMixArray(arr), count);

const addZero = (arg) =>
  arg < 10 ? `0${arg.toString()}` : arg.toString();

export const getDateString = (date) => {
  const dateObj = new Date(date);
  return `${addZero(dateObj.getDate())}.${addZero(dateObj.getMonth())}.${dateObj.getFullYear()}`;
};

export const getTimeString = (date) => {
  const dateObj = new Date(date);
  return `${addZero(dateObj.getHours())}:${addZero(dateObj.getMinutes())}`;
};

export const getHTMLFromData = (arrArg, getElementHTML) =>
  arrArg.map((obj) => getElementHTML(obj)).join(``);


export const addChildElements = (parentElement, arrArg, getElementHTML, count = 0) => {
  let elementsHTML = ``;
  arrArg.forEach((obj) => {
    elementsHTML += getElementHTML(obj, count);
  });
  parentElement.innerHTML = elementsHTML;
};

export const removeChildElements = (parentElement) => {
  parentElement.innerHTML = ``;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};
