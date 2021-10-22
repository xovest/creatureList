// main class
class Creature {
  constructor(name, creator, code) {
    this.name = name;
    this.creator = creator;
    this.code = code;
  }
}

// UI class
class UI {
  static displayCreatures() {
    const creatures = Store.getCreatures();

    creatures.forEach(creature => UI.addCreatureToList(creature));
  }

  static addCreatureToList(creature) {
    const list = document.querySelector('#creature-list');

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${creature.name}</td>
      <td>${creature.creator}</td>
      <td>${creature.code}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteCreature(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#creature-form');
    container.insertBefore(div, form);
    //disappear after 3 sec
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#name').value = '';
    document.querySelector('#creator').value = '';
    document.querySelector('#code').value = '';
  }
}

// store class
class Store {
  static getCreatures() {
    let creatures;
    if (localStorage.getItem('creatures') === null) {
      creatures = [];
    } else {
      creatures = JSON.parse(localStorage.getItem('creatures'));
    }

    return creatures;
  }

  static addCreatures(creature) {
    const creatures = Store.getCreatures();
    creatures.push(creature);
    localStorage.setItem('creatures', JSON.stringify(creatures));
  }

  static removeCreature(code) {
    const creatures = Store.getCreatures();

    creatures.forEach((creature, index) => {
      if (creature.code === code) {
        creatures.splice(index, 1);
      }
    });

    localStorage.setItem('creatures', JSON.stringify(creatures));
  }
}

// displaying
document.addEventListener('DOMContentLoaded', UI.displayCreatures);

// adding
document.querySelector('#creature-form').addEventListener('submit', (e) => {
  e.preventDefault();

  //getting form values
  const name = document.querySelector('#name').value;
  const creator = document.querySelector('#creator').value;
  const code = document.querySelector('#code').value;

  //validation
  if (name === '' || creator === '' || code === '') {
    UI.showAlert('Ya need to fill em all', 'danger');
  } else {
    //initializing creature
    const creature = new Creature(name, creator, code);
  
    //adding it to UI
    UI.addCreatureToList(creature);

    //adding it to the store
    Store.addCreatures(creature);

    //showing the success
    UI.showAlert('Creature Added', 'success');
  
    //clearing the fields
    UI.clearFields();
  }
});

// removing
document.querySelector('#creature-list').addEventListener('click', (e) => {
  //removing from UI
  UI.deleteCreature(e.target);

  //removing from store
  Store.removeCreature(e.target.parentElement.previousElementSibling.textContent);

  //showing message
  UI.showAlert('Creature Removed', 'info');
});