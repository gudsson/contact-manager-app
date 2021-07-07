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
    this.api.getAll().then(contacts => {
      this.contacts = contacts;
      this.view.showContacts(contacts);
      this.addListenerToContactBtns();
      this.addListenerToAddContactBtn();
      this.addListenerToForm();
      this.animateContainer();
    });
  }

  async reload() {
    this.api.getAll().then(contacts => {
      this.contacts = contacts;
      this.view.showContacts(contacts);
      this.animateContainer();
    });
  }

  animateContainer() {
    let cards = this.view.getSlideCards();

    if (cards.length === 2) {
      cards.first().slideUp('slow', () => { cards.first().detach(); });
      cards.last().slideDown('slow');
    } else cards.first().slideDown('slow');
  }

  addListenerToAddContactBtn() {
    $("a[href='#contacts/new']").on('click', e => {
      e.preventDefault();
      this.view.showForm({ method: 'POST', title: 'Create Contact'});
      this.animateContainer();
    });
  }

  addListenerToContactBtns() {
    $('ul.contacts-container').on('click', e => {
      e.preventDefault();
      let $btn = $(e.target).closest('.btn');
      if ($btn.length) {
        let [action, id] = $btn.attr('href').split('/').slice(1);

        if (action === 'delete') this.removeContact(id);
        if (action === 'edit') this.loadEditContactForm(id);
        this.animateContainer();
      }
    });
  }

  addListenerToForm() {
    $('div.main-container').on('click', e => {
      let elem = $(e.target);
      if (elem.is('.btn') && elem.closest('form').length > 0) {
        e.preventDefault();

        if (elem.is('[type=submit]')) {
          this.submitForm();
        }
      }
    });
  }

  submitForm() {
    let form = $('form')[0];
    let data = new FormData(form);

    this.api.submit(form.getAttribute('method'), form.getAttribute('action'), data)
      .then(this.reload());
  }

  loadEditContactForm(id) {
    this.view.showForm(Object.assign({method: 'PUT'}, this.getContact(id)));
    
  }

  removeContact(id) {
    this.api.delete(id);
    // TODO: add refresh?
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

  getContact(id) {
    return this.contacts.find(contact => contact.id === +id);
  }
}

