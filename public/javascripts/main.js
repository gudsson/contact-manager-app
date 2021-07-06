// import { ApiInterface } from './api.js'
// import { TemplateInterface } from './templates.js'
import { ContactsList } from './controller.js'

$(() => {

  let list = new ContactsList();
  list.load();



  // $(document).on('click', e => {
  //   e.preventDefault();
  //   list.printAll();
  // });
});