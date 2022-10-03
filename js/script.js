'use strict';

const toDoList = {
  selector : null,
  form : null,
  containerSelector: null,
  container : null,


  init (selector, container) {
    if (typeof selector === "string" || selector.trim() !== '') {
      this.selector = selector;
    }

    if(typeof container === 'string' || container.trim() !== ''){
      this.containerSelector = container;
    }


    this.getForm();
    this.getHTMLElement()
  },

    getForm () {

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
      })

    },

  getHTMLElement () {
    const todoContainer = document.querySelector(this.containerSelector);
    this.container = todoContainer;

    document.addEventListener('DOMContentLoaded', event => {
      event.preventDefault();
      event.stopPropagation();

      const toDo = JSON.parse(localStorage.getItem(this.selector));

      if (!toDo) return '121';

      toDo.map(todoItem => {
        this.renderItem(todoItem);
      })

    })

  },


  saveData (data) {
    let dataFromStore = localStorage.getItem(this.selector);

    if (!dataFromStore) {
      const array = [];
      array.push(data);
      localStorage.setItem(this.selector, JSON.stringify(array));
    }

     if(dataFromStore){
       dataFromStore = JSON.parse(dataFromStore);
       dataFromStore.push(data);
       localStorage.setItem(this.selector, JSON.stringify(dataFromStore));

     }
     return data;
     },

  renderItem (data) {
    const title = data.title;
    const description = data.description;

    const wrapper = document.createElement('div');
    wrapper.classList.add('col-4');
    wrapper.innerHTML = `
 <div class="taskWrapper">
       <div class="taskHeading">${title}</div>
      <div class="taskDescription">${description}</div>
  </div>`;

    this.container.appendChild(wrapper);
  }


}

toDoList.init('#todoForm', '#todoItems');

