export class ContactModel {
  constructor() {
    this.path = '/api/contacts/';
    this.defaultHeaderObj = { headers: {'Content-Type': 'application/json'} };
  }

  async getAll() {
    return await this.read(this.path);
  }

  async get(id) {
    return await this.read(this.path + String(id));
  }

  async read(path) {
    const requestObj = Object.assign({ method: 'GET' }, this.defaultHeaderObj);
    return await fetch(path, requestObj).then(response => response.json());
  }

  async submit(method, action, formData) {

    let requestObj = {
      method: method,
      ...this.defaultHeaderObj,
      body: JSON.stringify(Object.fromEntries(formData)), //JSON.stringify(data),
    }
    return await fetch(action, requestObj)//.then(response => console.log(response)) //.then(data => console.log(data));
  }

  async delete(id) {
    const requestObj = Object.assign({ method: 'DELETE' }, this.defaultHeaderObj);
    return await fetch(this.path + String(id), requestObj); //.then(response => response.json());
  }
}