'use strict';

const toDoList = {
  selector: null,
  form: null,
  containerSelector: null,
  container: null,
  deleteBtn: null,


  init(selector, container) {
    if (typeof selector === "string" || selector.trim() !== '') {
      this.selector = selector;
    }
    if (typeof container === 'string' || container.trim() !== '') {
      this.containerSelector = container;
    }


    this.getForm();
    this.getHTMLElement();
    this.removeItem();
  },

  getForm() {

    const formElement = document.querySelector(this.selector);
    this.form = formElement;


    formElement.addEventListener('submit', event => {
      event.preventDefault();
      event.stopPropagation();

      const data = {};

      formElement.querySelectorAll('input, textarea')
        .forEach((item) => {
          data[item.name] = item.value;
        })


      const savedData = this.saveData(data);

      this.renderItem(savedData);
      this.form.reset();
    })

  },

  getHTMLElement() {
    this.container = document.querySelector(this.containerSelector);

    document.addEventListener('DOMContentLoaded', event => {
      event.preventDefault();
      event.stopPropagation();

      const toDo = JSON.parse(localStorage.getItem(this.selector));

      if (!toDo) return 'localStorage is empty';

      toDo.map(todoItem => {
        this.renderItem(todoItem);
      })

    })

  },


  saveData(data) {
    let dataFromStore = localStorage.getItem(this.selector);

    if (!dataFromStore) {
      data.id = 1;

      const array = [];
      array.push(data);
      localStorage.setItem(this.selector, JSON.stringify(array));
    }

    if (dataFromStore) {
      dataFromStore = JSON.parse(dataFromStore);
      const lastToDoId = dataFromStore[dataFromStore.length - 1].id;
      data.id = Number(lastToDoId) + 1;
      dataFromStore.push(data);
      localStorage.setItem(this.selector, JSON.stringify(dataFromStore));

    }
    return data;
  },

  renderItem(data) {
    const title = data.title;
    const description = data.description;
    const wrapper = document.createElement('div');
    wrapper.classList.add('col-4');
    wrapper.setAttribute('data-id', data.id);
    wrapper.innerHTML = `<div class="taskWrapper">
                             <div class="taskHeading">${title}</div>
                                  <div class="taskDescription">${description}</div>
                                  <div class="taskSelect">
                                    <label>Status:
                                      <select>
                                        <option>no-status</option>
                                        <option>pending</option>
                                        <option>сompleted</option>
                                      </select>
                                    </label>
                                  </div>
                                  <button class="closer">X</button>
                             </div>`;

    this.container.appendChild(wrapper);

  },


  removeItem() {
    const data = JSON.parse(localStorage.getItem(this.selector));

      this.container.addEventListener('click', event => {
        this.deleteBtn = document.querySelector('.closer');
        if(event.target.className === this.deleteBtn.className){
          const currentItem = event.target.closest('[data-id]');
          const currentItemId = Number(currentItem.getAttribute('data-id'));

          const filteredData = data.filter(item => item.id !== currentItemId);

          localStorage.setItem(this.selector, JSON.stringify(filteredData));
          currentItem.remove();

          const index = data.findIndex((item) => item.id === currentItemId);

          data.splice(index, 1);
        }

    })
  },


}

toDoList.init('#todoForm', '#todoItems');

