import { ContactModel } from './api.js'
import { ContactView } from './views.js'

export class App {
  constructor() {
    this.api = new ContactModel();
    this.view = new ContactView();
    this.contacts = [];
    this.activeTagFilters = [];
    this.filteredContactList = [];
    this.searchTerm = '';
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
    this.addTagButtonListeners();
    this.addContactModifierBtnListeners();
    this.addFormListeners();
  }

  addRowWellListeners() {
    this.addSearchBoxListener();
    this.addNewContactBtnListener();
  }

  addTagButtonListeners() {
    $("#tag-filters").on('click', e => {
      if ($(e.target).is('a')) {
        e.preventDefault();
        e.stopPropagation();
        $(e.target).toggleClass('active');
        $(e.target).blur();
        this.getSelectedTags();
        this.filterContactList();
      }
    });
  }

  addContactModifierBtnListeners() {
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

  addSearchBoxListener() {
    $('.contact-name-search').on('keyup', e => {
      this.searchTerm = $(e.target).val().toLowerCase();
      this.filterContactList();
    });
  }

  filterContactList() {
    this.filteredContactList = this.contacts.slice();
    this.searchContacts();

    if (this.activeTagFilters.length > 0) this.filterByTags();
    
    if (this.filteredContactList.length === 0) {
      this.view.showEmptySearch(this.searchTerm)
    } else this.view.updateContactList(this.filteredContactList);
  }

  searchContacts() {
    this.filteredContactList = this.filteredContactList.filter(contact => {
      return contact.full_name.toLowerCase().includes(this.searchTerm);
    });
  }

  filterByTags() {
    this.filteredContactList = this.filteredContactList.filter(contact => {
      return this.activeTagFilters.every(tag => contact.tags.includes(tag));
    });
  }

  addNewContactBtnListener() {
    $("#homepage").on('click', e => {
      if ($(e.target).attr('href') === "#contacts/new") {
        e.preventDefault();
        this.view.showNewContactForm();
      }
    });
  }

  submitForm($form) {
    this.cleanTagInput($form);
    let form = $form[0];
    
    let data = new FormData(form);

    this.api.submit(form.getAttribute('method'), form.getAttribute('action'), data)
      .then(() => {
        this.reload();
      });
  }

  cleanTagInput($form) {
    let tagString = $form.find('.contact-tag-input').val();
    let cleanedTagString = tagString.split(/,\s*/).filter(val => val !== '').join(', ');
    $form.find('.contact-tag-input').val(cleanedTagString);
  }

  validateForm($form) {
    let validationArr = [];
    validationArr.push(this.validateName($form.find('.form-group-name')));
    validationArr.push(this.validateEmail($form.find('.form-group-email')));
    validationArr.push(this.validatePhoneNumber($form.find('.form-group-phone')));
    validationArr.push(this.validateTags($form.find('.form-group-tags')));

    return validationArr.every(element => element);
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

  validateTags($tagsContainer){
    let tagString = $tagsContainer.find('input').val();
    let tagArray = tagString.split(/,\s*/).map(tag => tag.toLowerCase()).filter(tag => tag);
    let uniqueTagArray = [...new Set(tagArray)];

    let isValid = (tagArray.length === uniqueTagArray.length);

    if (isValid) {
      this.clearError($tagsContainer);
    } else this.displayError($tagsContainer, 'Tags must be unique.')

    return isValid;
  }

  displayError($container, msg) {
    $container.addClass('has-error');
    $container.find('small').text(msg);
  }
  
  clearError($container) {
    $container.find('small').empty();
    $container.removeClass('has-error');
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

  getSelectedTags() {
    this.activeTagFilters = [...$("#tag-filters").find('.active')].map(element => element.name);
  }

  getAllTags() {
    let tags = this.contacts.map(contact => contact.tags).filter(tag => tag).toString().split(/,\s*/);
    return [...new Set(tags)];
  }
}