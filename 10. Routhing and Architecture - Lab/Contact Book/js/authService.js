let auth = (() => {

    function isAuth() {
        return localStorage.getItem('authtoken') !== null;
    }

    function saveSession(userData) {
        localStorage.setItem('authtoken', userData['_kmd']['authtoken']);
        localStorage.setItem('username', userData['username']);
        localStorage.setItem('firstName', userData['firstName']);
        localStorage.setItem('lastName', userData['lastName']);
        localStorage.setItem('email', userData['email']);
        localStorage.setItem('phone', userData['phone']);
        localStorage.setItem('userId', userData['_id']);
    }

    function register(username, password, firstName, lastName, phone, email) {
        let obj = { username, password, firstName, lastName, phone, email };
        return remote.post('user', '', 'basic', obj);
    }
    
    function login(username, password) {
        let obj = { username, password };
        return remote.post('user', 'login', 'basic', obj);
    }

    function logout() {
       return remote.post('user', '_logout', 'kinvey');
    }

    function edit(username, firstName, lastName, phone, email, id) {
        let obj = { username, firstName, lastName, phone, email };
        return remote.update('user', `${id}`, 'kinvey', obj);
    }

    return { register, login, logout, isAuth, saveSession, edit}
})();