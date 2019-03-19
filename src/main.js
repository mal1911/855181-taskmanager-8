import {getRandomInt, getRandomArray, addChildElements} from './utils.js';
import getFilterHTML from './make-filter.js';
import getTaskObj from './data.js';
import Task from './task';
import TaskEdit from './task-edit';
import {removeChildElements} from "./utils";


const MAX_TASKS = 7;

const filterData =
  [
    {title: `All`, isChecked: true},
    {title: `Overdue`, isDisabled: true},
    {title: `Today`, isDisabled: true},
    {title: `Favorites`},
    {title: `Repeating`},
    {title: `Tags`},
    {title: `Archive`},
  ];

const getCaradsData = (count) => {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(getTaskObj());
  }
  return arr;
};

const cardsData = getCaradsData(MAX_TASKS);

const renderTasks = (parentElement, tasksCount) => {
  const data = getRandomArray(cardsData, tasksCount);
  const fragment = document.createDocumentFragment();

  removeChildElements(parentElement);

  data.forEach((task) => {
    const taskComponent = new Task(task);
    const editTaskComponent = new TaskEdit(task);

    taskComponent.onEdit = () => {
      editTaskComponent.render();
      parentElement.replaceChild(editTaskComponent.element, taskComponent.element);
      editTaskComponent.refresh();
      taskComponent.unrender();
    };

    editTaskComponent.onSubmit = (newObject) => {
      task.title = newObject.title;
      task.tags = newObject.tags;
      task.color = newObject.color;
      task.repeatingDays = newObject.repeatingDays;
      task.dueDate = newObject.dueDate;

      taskComponent.update(task);
      taskComponent.render();
      parentElement.replaceChild(taskComponent.element, editTaskComponent.element);
      editTaskComponent.unrender();
    };

    fragment.appendChild(taskComponent.render());
  });
  parentElement.appendChild(fragment);
};

const main = () => {
  const mainFilterElement = document.querySelector(`.main__filter`);
  addChildElements(mainFilterElement, filterData, getFilterHTML, MAX_TASKS);

  const boardTasksElement = document.querySelector(`.board__tasks`);

  renderTasks(boardTasksElement, MAX_TASKS);

  const onMainFilterElementClick = () => {
    renderTasks(boardTasksElement, getRandomInt(1, MAX_TASKS));

  };
  mainFilterElement.addEventListener(`click`, onMainFilterElementClick);
};

main();

