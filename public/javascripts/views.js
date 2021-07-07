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