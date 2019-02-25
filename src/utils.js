const getMixArray = (arr) =>
  arr.slice().sort(() => 0.5 - Math.random());

const getClipArray = (arr, count) =>
  arr.slice(0, count - 1);

export const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

export const getRandomArray = (arr, count) =>
  getClipArray(getMixArray(arr), count);

export const addChildElements = (parentElement, arrArg, getElementHTML, count = 0) => {
  let elementsHTML = ``;
  arrArg.forEach((obj) => {
    elementsHTML += getElementHTML(obj, count);
  });
  parentElement.innerHTML = elementsHTML;
};
