export class ContactView {
  constructor() {
    this.$container = $('.main-container');
    this.$homepageDiv = this.$container.find('#homepage');
    this.$rowWellDiv = this.$homepageDiv.find('#row-well');
    this.$contactListDiv = this.$homepageDiv.find('#contact-list');
    this.$editContactDiv = this.$container.find('#edit-contact-form');
    this.$newContactDiv = this.$container.find('#new-contact-form');

    this.rowWell = Handlebars.compile($('#rowWell').html());
    this.contactsList = Handlebars.compile($('#contactsList').html());
    this.formTemplate = Handlebars.compile($('#formTemplate').html());
    this.emptySearchList = Handlebars.compile($('#emptySearchList').html()); 
    this.emptyContactList = Handlebars.compile($('#emptyContactList').html()); 

    this.contactTemplate = Handlebars.compile($('#contactTemplate').html());
    Handlebars.registerPartial('contactTemplate', $('#contactTemplate').html());
  }

  initializeHomepage(contacts) {
    this.updateHomepage(contacts);
    this.$homepageDiv.slideDown('slow');
  }

  initializeNewContactForm() {
    this.$newContactDiv.html(this.formTemplate({ method: 'POST', title: 'Create Contact'}));
  }

  refreshEditContactForm(contactObj) {
    let dataObj = {...{ method: 'PUT', title: 'Edit Contact'}, ...contactObj}
    this.$editContactDiv.html(this.formTemplate(dataObj));
  }

  showEditContactForm(contactObj) {
    this.refreshEditContactForm(contactObj);
    this.transition(this.$editContactDiv, this.$homepageDiv);
  }

  showNewContactForm() {
    this.transition(this.$newContactDiv, this.$homepageDiv);
  }
  
  updateContactList(contacts) {
    if (contacts.length === 0) {
      this.$contactListDiv.html(this.emptyContactList());
    } else this.$contactListDiv.html(this.contactsList({ contacts: contacts }));
  }

  showEmptySearch(searchTerm) {
    this.$contactListDiv.html(this.emptySearchList({ searchTerm: searchTerm }));
  }

  showContactList(contacts) {
    this.updateContactList(contacts);

    if (this.$homepageDiv.is(":hidden")) {
      this.transition(this.$homepageDiv, this.$editContactDiv, this.$newContactDiv);
    }
  }

  transition(containerToShow, ...containersToHide) {
    containersToHide.forEach($container => {
      if ($container.is(':visible')) $container.slideUp('slow');
    });
    containerToShow.slideDown('slow');
  }

  updateHomepage(contacts) {
    this.$rowWellDiv.html(this.rowWell);
    this.updateContactList(contacts);
  }
}