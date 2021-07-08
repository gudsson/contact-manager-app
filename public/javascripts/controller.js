import { ContactModel } from './api.js'
import { ContactView } from './views.js'

export class App {
  constructor() {
    this.api = new ContactModel();
    this.view = new ContactView();
    this.contacts = [];
    this.tags = [];
  }

  async init() {
    this.api.getAll().then(contacts => {
      this.contacts = contacts;
      this.tags = this.getAllTags();

      this.view.initializeHomepage(contacts);
      this.view.initializeNewContactForm();

      this.addListeners();
    });
  }

  async reload() {
    this.api.getAll().then(contacts => {
      this.contacts = contacts;
      this.tags = this.getAllTags();
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
    this.addContactModifierBtnListeners();
    // add tag button listeners
  }

  addContactModifierBtnListeners() { //DONE
    $('#contact-list').on('click', e => {
      e.preventDefault();
      let $btn = $(e.target).closest('.btn');
      if ($btn.length) {
        let [action, id] = $btn.attr('href').split('/').slice(1);

        if (action === 'delete') this.deleteContact(id);
        if (action === 'edit') this.editContact(id);
      }
    });
  }

  addFormListeners() {
    $('[id*="contact-form"]').on("click", e => {
      let $target = $(e.target);

      if ($target.hasClass('btn-close-form')) {
        e.preventDefault();
        this.view.showContactList(this.contacts);
      }

      if ($target.attr('type') === 'submit') {
        e.preventDefault();

        let $form = $target.closest("form");

        if (this.validateForm($form)) this.submitForm($form);
      }
    });
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

  submitForm($form) {
    let form = $form[0];
    let data = new FormData(form);

    this.api.submit(form.getAttribute('method'), form.getAttribute('action'), data)
      .then(() => {
        this.reload();
      });
  }

  validateForm($form) {
    let validationArr = [];
    validationArr.push(this.validateName($form.find('.form-group-name')));
    validationArr.push(this.validateEmail($form.find('.form-group-email')));
    validationArr.push(this.validatePhoneNumber($form.find('.form-group-phone')));

    return validationArr.every(element => element);
  }

  displayError($container, msg) {
    $container.addClass('has-error');
    $container.find('small').text(msg);
  }

  clearError($container) {
    $container.find('small').empty();
    $container.removeClass('has-error');
  }

  validateName($nameContainer) {
    let name = $nameContainer.find('input').val();
    let isValid = (name.length > 0);

    if (isValid) {
      this.clearError($nameContainer);
    } else this.displayError($nameContainer, 'Please enter the name field.')

    return isValid;
  }

  validateEmail($emailContainer) {
    let email = $emailContainer.find('input').val();
    let isValid = this.isValidEmail(email);

    if (isValid) {
      this.clearError($emailContainer);
    } else this.displayError($emailContainer, 'Please enter the valid email field.')

    return isValid;
  }

  isValidEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email.toLowerCase());
  }

  validatePhoneNumber($phoneContainer){
    let phoneNumber = $phoneContainer.find('input').val();
    let isValid = (phoneNumber.length > 0);

    if (isValid) {
      this.clearError($phoneContainer);
    } else this.displayError($phoneContainer, 'Please enter the phone field.')

    return isValid;
  }

  loadAddContactForm() {
    this.view.showForm({ method: 'POST', title: 'Create Contact'});
    this.addListenerToFormBtns();
  }

  editContact(id) {
    this.view.showEditContactForm(this.getContact(id));
  }

  deleteContact(id) {
    if (confirm('Do you want to delete the contact?')) {
      this.api.delete(id);
      this.reload();
    }
  }

  getContact(id) {
    return this.contacts.find(contact => contact.id === +id);
  }

  getAllTags() {
    let tags = this.contacts.map(contact => contact.tags).filter(tag => tag).toString().split(/,\s?/);
    return [...new Set(tags)];
  }
}

