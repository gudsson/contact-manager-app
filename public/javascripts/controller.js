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

      this.addListeners();
    });
  }

  async reload() {
    this.api.getAll().then(contacts => {
      this.contacts = contacts;
      this.view.showContactList(contacts);
    });
  }

  addListeners() {
    this.addRowWellListeners();
    this.addContactListListeners();
    this.addFormListeners();
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
    $('#contact-list').on('click', e => {
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

  addFormListeners() { // TODO:
    $('[id*="contact-form"]').on("click", e => {
      let $target = $(e.target);

      if ($target.hasClass('btn-close-form')) {
        e.preventDefault();
        this.view.showContactList(this.contacts);
      }

      if ($target.attr('type') === 'submit') {
        e.preventDefault();
        let $form = $target.closest("form");
        this.submitForm($form);
      }
    });

    // $('form').on('submit', e => {
    //   e.preventDefault();
    //   this.submitForm();
    // });
  }

  addSearchBoxListener() { // DONE
    $('.contact-name-search').on('keyup', e => {
      let searchTerm = $(e.target).val().toLowerCase();
      this.searchContacts(searchTerm);
    });
  }

  searchContacts(searchTerm) { // DONE
    let matchingContacts = this.contacts.filter(contact => {
      return contact.full_name.toLowerCase().includes(searchTerm);
    });

    if (matchingContacts.length === 0) {
      this.view.showEmptySearch(searchTerm)
    } else this.view.updateContactList(matchingContacts);
  }

  addNewContactBtnListener() { // DONE
    $("#homepage").on('click', e => {
      if ($(e.target).attr('href') === "#contacts/new") {
        e.preventDefault();
        this.view.showNewContactForm();
      }
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

  stageContainer(animate = true) { // Delete
    let cards = this.view.getSlideCards();
    let animationSpeed = animate ? 'slow' : 0;

    if (cards.length === 2) {
      cards.first().slideUp(animationSpeed, () => { cards.first().remove(); });
      cards.last().slideDown(animationSpeed);
    } else cards.first().slideDown(animationSpeed);
  }

  addListenerToFormBtns() { // DELETE
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

  // cancelForm() {
  //   this.view.showContacts(this.contacts);
  //   this.addListenerToNewContactBtn();
  //   this.stageContainer();
  // }

  submitForm($form) {
    let form = $form[0];
    let data = new FormData(form);

    this.api.submit(form.getAttribute('method'), form.getAttribute('action'), data)
      .then(this.reload());
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

