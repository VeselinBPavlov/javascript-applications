// Request method (GET, POST, PUT).
// Kinvey module (user, appdata).
// URL endpoint (login, _logout, id).
// Authentication (basic, kinvey).

let remote = (() => {
    const BASE_URL = 'https://baas.kinvey.com';
    const APP_KEY = 'kid_S1SRXZgB7';
    const APP_SECRET = 'a649632002e24bfaabf3038b8f66cda7';

    function makeAuth(auth) {
        if (auth === 'basic') {
            return `Basic ${btoa(APP_KEY + ":" + APP_SECRET)}`;
        } else {
            return `Kinvey ${localStorage.getItem('authtoken')}`;
        }
    }

    function makeRequest(method, module, endpoint, auth) {
        return {
            method: method,
            url: `${BASE_URL}/${module}/${APP_KEY}/${endpoint}`,
            headers: {
                Authorization: makeAuth(auth)
            }
        }
    }

    function get(module, endpoint, auth) {
        return $.ajax(makeRequest('GET', module, endpoint, auth))
    }

    function post(module, endpoint, auth, data) {
        let obj = makeRequest('POST', module, endpoint, auth, data);
        if (data) {
            obj.data = data;
        }
        return $.ajax(obj);
    }

    function update(module, endpoint, auth, data) {
        let obj = makeRequest('PUT', module, endpoint, auth, data);
        obj.data = data;
        return $.ajax(obj);
    }

    function remove(module, endpoint, auth) {
        return $.ajax(makeRequest('DELETE', module, endpoint, auth));
    }

    return { get, post, update, remove };
})();