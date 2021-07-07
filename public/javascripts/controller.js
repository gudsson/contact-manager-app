import { ContactModel } from './api.js'
import { ContactView } from './views.js'

export class App {
  constructor() {
    this.api = new ContactModel();
    this.view = new ContactView();
    this.contacts = [];
  }

  async init() {
    this.api.getAll().then(contacts => {
      this.contacts = contacts;

      this.view.initializeHomepage(contacts);
      this.view.initializeNewContactForm();
      // this.view.initializeEditContactForm();

      // loadAddContactForm() {
      //   this.view.showForm({ method: 'POST', title: 'Create Contact'});
      //   this.addListenerToFormBtns();
      // }

      this.addListeners();
      // console.log(contacts)
      // if (animate) {
      //   this.view.showContacts(contacts);
      //   this.stageContainer();
      // } else this.view.refreshContacts(contacts);

      // this.addListenersToContactList();
    });
  }

  async reload() {
    this.api.getAll().then(contacts => {
      this.contacts = contacts;
      this.view.updateContactList(contacts);
      console.log(contacts);
    });
  }

  addListeners() {
    this.addRowWellListeners();
    this.addContactListListeners();
  }

  addRowWellListeners() {
    this.addSearchBoxListener();
    this.addNewContactBtnListener();
  }

  addContactListListeners() {
    // this.addListenerToContactBtns();
    this.addContactModifierBtnListeners();
    // this.addListenerToNewContactBtn();
  }

  addContactModifierBtnListeners() {
    $('ul.contacts-container').on('click', e => {
      e.preventDefault();
      let $btn = $(e.target).closest('.btn');
      if ($btn.length) {
        let [action, id] = $btn.attr('href').split('/').slice(1);

        // if (action === 'delete') this.removeContact(id);
        if (action === 'delete') this.deleteContact(id);
        if (action === 'edit') this.editContact(id);
        // this.stageContainer(); // should this be here?
      }
    });
  }

  addFormListeners() {

  }

  addSearchBoxListener() { // DONE
    $('.contact-name-search').on('keyup', e => {
      let searchTerm = $(e.target).val().toLowerCase();
      let matchingContacts = this.contacts.filter(contact => {
        return contact.full_name.toLowerCase().includes(searchTerm);
      });
      this.view.updateContactList(matchingContacts);
    });
  }

  addNewContactBtnListener() {
    $("a[href='#contacts/new']").on('click', e => {
      e.preventDefault();
      alert($(e.target).text());
      this.view.showNewContactForm();
      // this.loadAddContactForm();
      // this.stageContainer();
    });
  }

  // addListenerToSearchBox() {
  //   $('.contact-name-search').on('keyup', e => {
  //     let 
  //   });
  // }

  addListenerToNewContactBtn() { // Delete
    $("a[href='#contacts/new']").on('click', e => {
      e.preventDefault();
      this.loadAddContactForm();
      this.stageContainer();
    });
  }

  // addListenerToContactBtns() { // Delete
  //   $('ul.contacts-container').on('click', e => {
  //     e.preventDefault();
  //     let $btn = $(e.target).closest('.btn');
  //     if ($btn.length) {
  //       let [action, id] = $btn.attr('href').split('/').slice(1);

  //       if (action === 'delete') this.removeContact(id);
  //       if (action === 'edit') this.loadEditContactForm(id);
  //       this.stageContainer(); // should this be here?
  //     }
  //   });
  // }

  stageContainer(animate = true) {
    let cards = this.view.getSlideCards();
    let animationSpeed = animate ? 'slow' : 0;

    if (cards.length === 2) {
      cards.first().slideUp(animationSpeed, () => { cards.first().remove(); });
      cards.last().slideDown(animationSpeed);
    } else cards.first().slideDown(animationSpeed);
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
    this.stageContainer();
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

  editContact(id) {
    // this.view.showEditContactForm(Object.assign({method: 'PUT'}, this.getContact(id)));
    this.view.showEditContactForm(this.getContact(id));
    // this.addListenerToFormBtns();
  }

  loadEditContactForm(id) {
    // this.view.showEditContactForm(Object.assign({method: 'PUT'}, this.getContact(id)));
    this.view.showEditContactForm(this.getContact(id));
    // this.addListenerToFormBtns();
  }

  deleteContact(id) {
    if (confirm('Do you want to delete the contact?')) {
      this.api.delete(id);
      this.reload();
    }
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

