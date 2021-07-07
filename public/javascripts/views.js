export class ContactView {
  constructor() {
    this.$container = $('.main-container');
    this.rowWell = this.buildRowWell();

    this.contactsList = Handlebars.compile($('#contactsList').html());

    this.contactTemplate = Handlebars.compile($('#contactTemplate').html());
    Handlebars.registerPartial('contactTemplate', $('#contactTemplate').html());

    this.formTemplate = Handlebars.compile($('#formTemplate').html());
  }

  buildRowWell() {
    Handlebars.registerPartial('rowWell', $('#rowWell').html());
    return Handlebars.compile($('#rowWell').html());;
  }

  showForm(dataObj) {
    this._appendDiv(this.formTemplate(dataObj));
  }

  showContacts(contacts) {
    this._appendDiv(this.contactsList({ contacts: contacts }));
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
}

// showContactsDead(contacts) {
//   // let contactsList = Handlebars.compile($('#contactsList').html());
//   // let contactTemplate = Handlebars.compile($('#contactTemplate').html());
  
//   // Handlebars.registerPartial('contactTemplate', $('#contactTemplate').html());

//   // $list.html(contactsList({ contacts: contacts }));

//   // // $($container).append($list);
//   this.$container.html(this.contactsList({ contacts: contacts }))

// }