export class ApiInterface {
  constructor() {
    this.path = '/api/contacts/';
  }

  async get(id) {
    return await this._fetch('GET', id)
      .then(response => response.json())

    // return response;
      // .then(data => console.log(data))
      // .catch(error => console.log('Error:', error));
  }

  post() {}

  put() {}

  delete(id) {
    this._fetch('DELETE', id)
      .then(response => console.log(response));
  }

  _fetch(method, pathId, data) {
    let path = Number.isInteger(pathId) ? this.path + String(pathId) : this.path;

    let requestObj = {};
    requestObj.method = method;
    requestObj.headers = {'Content-Type': 'application/json'};
    if(typeof data === 'object') requestObj.body = JSON.stringify(data);

    return fetch(path, requestObj);
  }
}class ApiInterface {
  constructor() {
    this.path = '/api/contacts/';
  }

  async get(id) {
    return await this._fetch('GET', id)
      .then(response => response.json())

    // return response;
      // .then(data => console.log(data))
      // .catch(error => console.log('Error:', error));
  }

  post() {}

  put() {}

  delete(id) {
    this._fetch('DELETE', id)
      .then(response => console.log(response));
  }

  _fetch(method, pathId, data) {
    let path = Number.isInteger(pathId) ? this.path + String(pathId) : this.path;

    let requestObj = {};
    requestObj.method = method;
    requestObj.headers = {'Content-Type': 'application/json'};
    if(typeof data === 'object') requestObj.body = JSON.stringify(data);

    return fetch(path, requestObj);
  }
}