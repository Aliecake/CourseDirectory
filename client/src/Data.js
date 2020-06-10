import config from './config';

export default class Data {
  api(path, method, body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {
      const encodedCredentials = btoa(
        `${credentials.emailAddress}:${credentials.password}`
      );

      options.headers.Authorization = `Basic ${encodedCredentials}`;
    }
    return fetch(url, options);
  }

  // USER
  async getUser(emailAddress, password) {
    const response = await this.api(`/users`, 'GET', null, true, {
      emailAddress,
      password,
    });

    if (response.status === 200) {
      return response.json().then(data => data);
    }
    if (response.status === 401) {
      return null;
    }
    throw new Error();
  }

  async createUser(user) {
    const response = await this.api(`/users`, 'POST', user);
    // 500 error if user already exists
    if (response.status === 201) {
      return [];
    }
    if (response.status === 400) {
      return response.json().then(data => data);
    }
    throw new Error();
  }

  // COURSES
  async getCourses() {
    const response = await this.api('/courses', 'GET');
    if (response.status === 200) {
      console.log(`200 OK - got courses`);
      return response.json();
    }
    console.log(`no courses`);
  }

  async getOneCourse(id) {
    const response = await this.api(`/courses/${id}`, 'GET');
    if (response.status === 200) {
      return response.json();
    }
    console.log(`course doesnt exist`);
  }

  async handleDelete(id, emailAddress, password) {
    // PW undefined
    const response = await this.api(`/courses/${id}`, 'DELETE', null, true, {
      emailAddress,
      password,
    });
    console.log(response.status);
    if (response.status === 204) {
      console.log(`deleted`);
    } else {
      console.log(`forbidden`);
    }
  }
}
