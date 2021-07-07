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
    let dataObj = {...{ method: 'POST', title: 'Edit Contact'}, ...contactObj}
    this.$editContactDiv.html(this.formTemplate(dataObj));
  }

  showEditContactForm(contactObj) {
    this.refreshEditContactForm(contactObj);
    this.transition(this.$editContactDiv, this.$homepageDiv);
  }

  showNewContactForm() {
    this.transition(this.$newContactDiv, this.$homepageDiv);
  }

  transition(containerToShow, containerToHide) {
    containerToHide.slideUp('slow');
    containerToShow.slideDown('slow');
  }

  stageContainer(animate = true) {
    let cards = this.view.getSlideCards();
    let animationSpeed = animate ? 'slow' : 0;

    if (cards.length === 2) {
      cards.first().slideUp(animationSpeed, () => { cards.first().remove(); });
      cards.last().slideDown(animationSpeed);
    } else cards.first().slideDown(animationSpeed);
  }

  updateHomepage(contacts) {
    this.$rowWellDiv.html(this.rowWell);
    this.updateContactList(contacts);
  }

  updateContactList(contacts) {
    this.$contactListDiv.html(this.contactsList({ contacts: contacts }));
  }

  updateForm(dataObject) {

  }

  // buildRowWell() {
  //   // Handlebars.registerPartial('rowWell', $('#rowWell').html());
  //   return Handlebars.compile($('#rowWell').html());;
  // }

  showForm(dataObj) {
    this._appendDiv(this.formTemplate(dataObj));
  }

  showContacts(contacts) {
    this._appendDiv(this.contactsList({ contacts: contacts }));
  }

  refreshContacts(contacts) {
    // console.log(this.$container.children()[0])
    let $div = $(this.$container.children()[0])
    $div.html(this.contactsList({ contacts: contacts }));
  } 

  _appendDiv(compliedTemplate) {
    let $div = $('<div></div>');
    $div.html(compliedTemplate);
    $div.hide();
    this.$container.append($div);
  }

  getSlideCards() {
    return this.$container.children('div');
  }

  // reverseCards() {
  //   let $cards = this.$container.$children('div');
  //   this.$container.append($cards.get().reverse());
  // }
}

// showContactsDead(contacts) {
//   // let contactsList = Handlebars.compile($('#contactsList').html());
//   // let contactTemplate = Handlebars.compile($('#contactTemplate').html());
  
//   // Handlebars.registerPartial('contactTemplate', $('#contactTemplate').html());

//   // $list.html(contactsList({ contacts: contacts }));

//   // // $($container).append($list);
//   this.$container.html(this.contactsList({ contacts: contacts }))

// }