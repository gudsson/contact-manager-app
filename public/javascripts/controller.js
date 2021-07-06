import { ContactModel } from './api.js'
import { ContactView } from './views.js'

export class ContactsList {
  constructor() {
    this.api = new ContactModel();
    this.view = new ContactView();
    // this.hb = new HandlebarsInterface();
    this.contacts = [];
    // this.getAll();
  }

  async load() {
    // this.contacts = await this.api.getAll();
    // this.view.loadContacts(this.contacts);
    this.api.getAll().then(contacts => {
      this.contacts = contacts;
      this.view.showContacts(contacts);
      this.addListenersToContactBtns();
      this.addListenersToAddContactBtn();
      this.animateContainer();

      // $('div:hidden').slideDown('slow');
    });
  }

  animateContainer() {
    let cards = this.view.getSlideCards();

    if (cards.length === 2) {
      cards.first().slideUp('slow', () => { cards.first().remove(); });
      cards.last().slideDown('slow');
      
    } else cards.first().slideDown('slow');
  }

  addListenersToAddContactBtn() {
    $("a[href='#contacts/new']").on('click', e => {
      e.preventDefault();
      this.view.showForm('add');
      this.animateContainer();
    });
  }

  addListenersToContactBtns() {
    $('ul.contacts-container').on('click', e => {
      e.preventDefault();
      let $btn = $(e.target).closest('.btn');
      // console.log($btn)
      if ($btn.length) {
        let [action, id] = $btn.attr('href').split('/').slice(1);

        // console.log(action);
        // console.log(id);

        if (action === 'delete') this.removeContact(id);

        
      }
      // console.log($link.attr('href'));
    });
  }

  removeContact(id) {
    this.api.delete(id);
  }

  // getAll() {
  //   this.api.getAll().then(response => this.contacts = response);
  // }

  all() {
    return this.contacts;
  }

  printAll() {
    this.contacts.forEach(contact => console.log(contact));
  }
}

