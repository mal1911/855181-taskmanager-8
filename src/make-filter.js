import {getRandomInt} from "./utils";

export default (objArg, count) =>
  `<input type="radio" 
    id="filter__${objArg.title}" 
    class="filter__input visually-hidden" 
    name="filter" ${objArg.isChecked ? `checked` : ``} ${objArg.isDisabled ? `disabled` : ``}
  />
  <label for="filter__${objArg.title.toLowerCase()}"
    class="filter__label">${objArg.title.toUpperCase()}
    <span
      class="filter__${objArg.title.toLowerCase()}-count">${getRandomInt(0, count - 1)}
    </span>
  </label>`;
