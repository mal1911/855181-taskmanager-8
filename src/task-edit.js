import {getHTMLFromData} from './utils';
import Component from './component';
import flatpickr from 'flatpickr';
import '../node_modules/flatpickr/dist/flatpickr.min.css';
import moment from 'moment';
const SPACE_KEY = 32;

export default class TaskEdit extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._picture = data.picture;
    this._repeatingDays = data.repeatingDays;
    this._color = data.color;

    this._state.isDate = data.dueDate ? true : false;

    this._onSubmit = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);

    this._onChangeDate = this._onChangeDate.bind(this);
    this._onChangeRepeated = this._onChangeRepeated.bind(this);
    this._onAddHashtag = this._onAddHashtag.bind(this);
    this._onDeleteHashtag = this._onDeleteHashtag.bind(this);

    this._setStartDate(this._dueDate);
    this._setStartTime(this._dueDate);
    this._setRepeatedState();
  }

  _processForm(formData) {
    const entry = {
      title: ``,
      color: ``,
      tags: new Set(),
      dueDate: new Date(),
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      },
    };
    const taskEditMapper = TaskEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (taskEditMapper[property]) {
        taskEditMapper[property](value);
      }
    }

    if (this._dueStartDate && this._dueStartTime) {
      entry.dueDate = moment(this._dueStartDate + this._dueStartTime).utc(false);
    } else {
      entry.dueDate = this._dueDate;
    }
    entry.tags = this._tags;

    return entry;
  }

  static createMapper(target) {
    return {
      text: (value) => {
        target.title = value;
        return target.title;
      },
      color: (value) => {
        target.color = value;
        return target.color;
      },
      repeat: (value) => {
        target.repeatingDays[value] = true;
        return target.repeatingDays[value];
      },
    };
  }

  _isRepeated() {
    return Object.values(this._repeatingDays).some((it) => it === true);
  }

  _isDeadLine() {
    return this._dueDate < Date.now();
  }

  _getClassListHTML() {
    return ` card--${this._color}
           card--edit  
           ${this._isDeadLine() ? ` card--deadline` : ``}   
           ${this._isRepeated() ? ` card--repeat` : ``}
           `;
  }

  _getHashtagHTML(title) {
    return `<span class="card__hashtag-inner">
       <input
         type="hidden"
         name="hashtag"
         value="repeat"
         class="card__hashtag-hidden-input"
       />
       <button
         type="button"
         class="card__hashtag-name">
         #${title}
       </button>
       <button type="button" class="card__hashtag-delete">
         delete
       </button>
     </span>`;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();

    const formData = new FormData(this._element.querySelector(`.card__form`));
    const newData = this._processForm(formData);

    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.update(newData);
    this._setRepeatedState();
  }

  _onChangeDate() {
    this._state.isDate = !this._state.isDate;
    this.refresh();
  }

  _onChangeRepeated() {
    this._state.isRepeated = !this._state.isRepeated;
    this._repeatingDays = false;
    this.refresh();
  }

  _onAddHashtag(evt) {
    if (evt.ctrlKey && evt.keyCode === SPACE_KEY) {
      const value = evt.target.value;
      if (value) {
        this._tags.add(value);
        this.refresh();
      }
    }
  }

  _onDeleteHashtag(evt) {
    const element = evt.target.closest(`.card__hashtag-delete`);
    if (element) {
      let text = element.previousElementSibling.innerText;
      text = text.substring(1, text.length);
      this._tags.delete(text);
      this.refresh();
    }
  }

  refresh() {
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  get template() {
    return `<article class="card ${this._getClassListHTML()}">
            <form class="card__form" method="get">
              <div class="card__inner">
                <div class="card__control">
                  <button type="button" class="card__btn card__btn--edit">
                    edit
                  </button>
                  <button type="button" class="card__btn card__btn--archive">
                    archive
                  </button>
                  <button
                    type="button"
                    class="card__btn card__btn--favorites card__btn--disabled"
                  >
                    favorites
                  </button>
                </div>

                <div class="card__color-bar">
                  <svg class="card__color-bar-wave" width="100%" height="10">
                    <use xlink:href="#wave"></use>
                  </svg>
                </div>

                <div class="card__textarea-wrap">
                  <label>
                    <textarea
                      class="card__text"
                      placeholder="Start typing your text here..."
                      name="text">${this._title}</textarea>
                  </label>
                </div>

                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates">
                      <button class="card__date-deadline-toggle" type="button">
                        date: <span class="card__date-status">${this._state.isDate ? `yes` : `no`}</span>
                      </button>
                      
                      <fieldset class="card__date-deadline" ${!this._state.isDate && `disabled`}>
                        <label class="card__input-deadline-wrap">
                          <input class="card__date" type="text" placeholder="23 September" name="date"
                            value="${moment(this._dueDate).format(`DD MMMM`)}"
                          />
                        </label>
                        <label class="card__input-deadline-wrap">
                          <input class="card__time" type="text" placeholder="11:15 PM" name="time" 
                            value="${moment(this._dueDate).format(`hh:mm A`)}"
                            />
                          </label>
                        </fieldset>
    
                          <button class="card__repeat-toggle" type="button">
                            repeat:<span class="card__repeat-status">${this._state.isRepeated ? `yes` : `no`}</span>
                        </button>
  
                        <fieldset class="card__repeat-days" ${!this._state.isRepeated && `disabled`}>
                          <div class="card__repeat-days-inner">
                            <input
                              class="visually-hidden card__repeat-day-input"
                              type="checkbox"
                              id="repeat-mo-5"
                              name="repeat"
                              value="mo"
                              ${this._repeatingDays.mo && `checked`}
                          />
                          <label class="card__repeat-day" for="repeat-mo-5"
                            >mo</label
                          >
                          <input
                            class="visually-hidden card__repeat-day-input"
                            type="checkbox"
                            id="repeat-tu-5"
                            name="repeat"
                            value="tu"
                            ${this._repeatingDays.tu && `checked`}
                          />
                          <label class="card__repeat-day" for="repeat-tu-5"
                            >tu</label
                          >
                          <input
                            class="visually-hidden card__repeat-day-input"
                            type="checkbox"
                            id="repeat-we-5"
                            name="repeat"
                            value="we"
                            ${this._repeatingDays.we && `checked`}
                          />
                          <label class="card__repeat-day" for="repeat-we-5"
                            >we</label
                          >
                          <input
                            class="visually-hidden card__repeat-day-input"
                            type="checkbox"
                            id="repeat-th-5"
                            name="repeat"
                            value="th"
                            ${this._repeatingDays.th && `checked`}
                          />
                          <label class="card__repeat-day" for="repeat-th-5"
                            >th</label
                          >
                          <input
                            class="visually-hidden card__repeat-day-input"
                            type="checkbox"
                            id="repeat-fr-5"
                            name="repeat"
                            value="fr"
                            ${this._repeatingDays.fr && `checked`}
                          />
                          <label class="card__repeat-day" for="repeat-fr-5"
                            >fr</label
                          >
                          <input
                            class="visually-hidden card__repeat-day-input"
                            type="checkbox"
                            name="repeat"
                            value="sa"
                            ${this._repeatingDays.sa && `checked`}
                            id="repeat-sa-5"
                          />
                          <label class="card__repeat-day" for="repeat-sa-5"
                            >sa</label
                          >
                          <input
                            class="visually-hidden card__repeat-day-input"
                            type="checkbox"
                            id="repeat-su-5"
                            name="repeat"
                            value="su"
                            ${this._repeatingDays.su && `checked`}
                          />
                          <label class="card__repeat-day" for="repeat-su-5"
                            >su</label
                          >
                        </div>
                      </fieldset>
                    </div>

                    <div class="card__hashtag">
                      <div class="card__hashtag-list">${getHTMLFromData(Array.from(this._tags), this._getHashtagHTML)}</div>
                      <label>
                        <input
                          type="text"
                          class="card__hashtag-input"
                          name="hashtag-input"
                          placeholder="Type new hashtag here"
                        />
                      </label>
                    </div>
                  </div>

                  <label class="card__img-wrap ${this._picture ? `` : ` card__img-wrap--empty`}">
                    <input
                      type="file"
                      class="card__img-input visually-hidden"
                      name="img"
                    />
                    <img
                      src="${this._picture ? this._picture : `img/add-photo.svg`}"
                      alt="task picture"
                      class="card__img"
                    />
                  </label>

                  <div class="card__colors-inner">
                    <h3 class="card__colors-title">Color</h3>
                    <div class="card__colors-wrap">
                      <input
                        type="radio"
                        id="color-black-5"
                        class="card__color-input card__color-input--black visually-hidden"
                        name="color"
                        value="black"
                        ${this._color === `black` ? `checked` : ``}
                      />
                      <label
                        for="color-black-5"
                        class="card__color card__color--black"
                        >black</label
                      >
                      <input
                        type="radio"
                        id="color-yellow-5"
                        class="card__color-input card__color-input--yellow visually-hidden"
                        name="color"
                        value="yellow"
                        ${this._color === `yellow` ? `checked` : ``}                        
                        />
                        <label
                          for="color-yellow-5"
                          class="card__color card__color--yellow"
                          >yellow</label
                        >
                        <input
                          type="radio"
                          id="color-blue-5"
                          class="card__color-input card__color-input--blue visually-hidden"
                          name="color"
                          value="blue"
                          ${this._color === `blue` ? `checked` : ``}                          
                          />
                          <label
                            for="color-blue-5"
                            class="card__color card__color--blue"
                            >blue</label
                          >
                          <input
                            type="radio"
                            id="color-green-5"
                            class="card__color-input card__color-input--green visually-hidden"
                            name="color"
                            value="green"
                            ${this._color === `green` ? `checked` : ``}                            
                            />
                            <label
                              for="color-green-5"
                              class="card__color card__color--green"
                              >green</label
                            >
                            <input
                              type="radio"
                              id="color-pink-5"
                              class="card__color-input card__color-input--pink visually-hidden"
                              name="color"
                              value="pink"
                              ${this._color === `pink` ? `checked` : ``}
                              />
                              <label
                                for="color-pink-5"
                                class="card__color card__color--pink"
                                >pink</label
                              >
                            </div>
                          </div>
                        </div>

                        <div class="card__status-btns">
                          <button class="card__save" type="submit">save</button>
                          <button class="card__delete" type="button">delete</button>
                        </div>
                      </div>
                    </form>
                  </article>`;
  }

  _setStartDate(dateObj) {
    this._dueStartDate = moment(dateObj).startOf(`day`).utc(true);
  }

  _onCangeCardDate(dateObj) {
    this._setStartDate(dateObj[0]);
  }

  _setStartTime(dateObj) {
    const dateTime = moment(dateObj).utc(true);
    const date = moment(dateObj).startOf(`day`).utc(true);
    this._dueStartTime = dateTime.diff(date);
  }

  _onCangeCardTime(dateObj) {
    this._setStartTime(dateObj[0]);
  }

  _setRepeatedState() {
    this._state.isRepeated = this._isRepeated() ? true : false;
  }

  bind() {
    this._element.querySelector(`.card__form`)
      .addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, this._onChangeDate);
    this._element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, this._onChangeRepeated);
    this._element.querySelector(`.card__hashtag-input`)
      .addEventListener(`keydown`, this._onAddHashtag);
    this._element.querySelector(`.card__hashtag-list`)
      .addEventListener(`click`, this._onDeleteHashtag);

    if (this._state.isDate) {
      flatpickr(`.card__date`, {
        altInput: true,
        altFormat: `j F`,
        dateFormat: `j F`,
        onChange: this._onCangeCardDate.bind(this)
      });
      flatpickr(`.card__time`, {
        enableTime: true,
        noCalendar: true,
        altInput: true,
        altFormat: `h:i K`,
        dateFormat: `h:i K`,
        onChange: this._onCangeCardTime.bind(this)
      });
    }
  }

  unbind() {
    this._element.querySelector(`.card__form`)
      .removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`)
      .removeEventListener(`click`, this._onChangeDate);
    this._element.querySelector(`.card__repeat-toggle`)
      .removeEventListener(`click`, this._onChangeRepeated);
    this._element.querySelector(`.card__hashtag-input`)
      .removeEventListener(`keydown`, this._onAddHashtag);
    this._element.querySelector(`.card__hashtag-list`)
      .removeEventListener(`click`, this._onDeleteHashtag);
  }

  update(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
    this._dueDate = data.dueDate;
  }
}
