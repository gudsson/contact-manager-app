export class ContactModel {
  constructor() {
    this.path = '/api/contacts/';
    this.defaultHeaderObj = { headers: {'Content-Type': 'application/json'} };
  }

  async getAll() {
    return await this.read(this.path);
  }

  async read(path) {
    const requestObj = Object.assign({ method: 'GET' }, this.defaultHeaderObj);
    return await fetch(path, requestObj).then(response => response.json())
  }

  async submit(method, action, formData) {
    let requestObj = {
      method: method,
      ...this.defaultHeaderObj,
      body: JSON.stringify(Object.fromEntries(formData)),
    }
    return await fetch(action, requestObj);
  }

  async delete(id) {
    const requestObj = Object.assign({ method: 'DELETE' }, this.defaultHeaderObj);
    return await fetch(this.path + String(id), requestObj)
      .then(response => {
        if (response.status === 400) this.errorAlert(response, 'Could not delete contact');
      });
  }

  errorAlert(response, msg) {
    alert(`${response.status} ${response.statusText} - ${msg}`);
  }
}