export class Templates {
  constructor() {
    this.containter = $('[style]');
    this.rowWell = this.buildRowWell
  }

  buildRowWell() {
    let rowWell = Handlebars.compile($('#rowWell').html());
    Handlebars.registerPartial('rowWell', $('#rowWell').html());
    return rowWell;
  }


  // let rowWell = Handlebars.compile($('#rowWell').html());
  // Handlebars.registerPartial('rowWell', $('#rowWell').html());

  let rawData = {
  // // alert('loaded');
  // let contacts = [{
  //   id: 1,
  //   full_name: 'Jay Gudsson',
  //   email: 'gudsson@gmail.com',
  //   phone_number: '6043519761',
  //   // tags: []
  // }, {
  //   id: 2,
  //   full_name: 'Philomena Chenne',
  //   email: 'phichenne@yahoo.ca',
  //   phone_number: '7783956655',
  //   // tags: []
  // }]
  }

  let contactsList = Handlebars.compile($('#contactsList').html());
  let contactTemplate = Handlebars.compile($('#contactTemplate').html());
  

  Handlebars.registerPartial('contactTemplate', $('#contactTemplate').html());

  // $list.html(contactsList({ contacts: contacts }));

  // // $($container).append($list);
  $container.html(contactsList({ contacts: contacts }))
}