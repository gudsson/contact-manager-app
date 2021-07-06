// const { stringify } = require("querystring");
import { ApiInterface } from './api.js'
import { Templates } from './templates.js'

$(() => {

  class ContactsList {
    constructor(apiInterface) {
      this.api = new ApiInterface();
      this.hb = new HandlebarsInterface();
      this.contacts = [];
      // this.readAll();
    }

    async load() {
      this.contacts = await this.api.get();
    }

    readAll() {
      this.api.get().then(response => this.contacts = response);
    }

    all() {
      
      return this.contacts;
    }
  }

  let list = new ContactsList(api);


  /////////////////////////////////
  let $container = $('[style]');

  let rowWell = Handlebars.compile($('#rowWell').html());
  Handlebars.registerPartial('rowWell', $('#rowWell').html());

  let obj = {
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
});