import { ContactModel } from './api.js'
import { ContactView } from './views.js'

export class ContactsList {
  constructor() {
    this.api = new ContactModel();
    this.view = new ContactView();
    this.contacts = [];
  }

  async load(animate = true) {
    this.api.getAll().then(contacts => {
      this.contacts = contacts;
      
      if (animate) {
        this.view.showContacts(contacts);
        this.animateContainer();
      } else this.view.refreshContacts(contacts);

      this.addListenerToContactBtns();
      this.addListenerToNewContactBtn();
    });
  }

  addListenerToNewContactBtn() {
    $("a[href='#contacts/new']").on('click', e => {
      e.preventDefault();
      this.loadAddContactForm();
      // this.view.showForm({ method: 'POST', title: 'Create Contact'});
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

  animateContainer() {
    let cards = this.view.getSlideCards();

    if (cards.length === 2) {
      cards.first().slideUp('slow', () => { cards.first().remove(); });
      cards.last().slideDown('slow');
    } else cards.first().slideDown('slow');
  }

  addListenerToFormBtns() {
    $('form').on('submit', e => {
      e.preventDefault();
      this.submitForm();
    });

    $('button.btn-close-form').on('click', e => {
      e.preventDefault();
      // e.stopPropagation();
      this.cancelForm();
    });
  }

  cancelForm() {
    this.view.showContacts(this.contacts);
    this.addListenerToNewContactBtn();
    this.animateContainer();
  }

  submitForm() {
    let form = $('form')[0];
    let data = new FormData(form);

    this.api.submit(form.getAttribute('method'), form.getAttribute('action'), data)
      .then(this.load());
  }

  loadAddContactForm() {
    this.view.showForm({ method: 'POST', title: 'Create Contact'});
    this.addListenerToFormBtns();
  }

  loadEditContactForm(id) {
    this.view.showForm(Object.assign({method: 'PUT'}, this.getContact(id)));
    this.addListenerToFormBtns();
  }

  removeContact(id) {
    if (confirm('Do you want to delete the contact?')) {
      this.api.delete(id);
      this.load(false);
      // this.load();
    }
    // TODO: add refresh?
  }

  // getAll() {
  //   this.api.getAll().then(response => this.contacts = response);
  // }

  all() {
    return this.contacts;
  }

  // printAll() {
  //   this.contacts.forEach(contact => console.log(contact));
  // }

  getContact(id) {
    return this.contacts.find(contact => contact.id === +id);
  }
}

