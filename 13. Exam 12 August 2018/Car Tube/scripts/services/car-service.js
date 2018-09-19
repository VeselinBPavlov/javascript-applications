let carService = (() => {
    function getAllCars() {
        return requester.get('appdata', 'cars?query={}&sort={"_kmd.ect": -1}', 'kinvey');
    }

    function getCar(carId) {
        return requester.get('appdata', 'cars/' + carId, 'kinvey');
    }

    function createCar(brand, description, fuel, imageUrl, model, price, seller, title, year) {
        let carData = {
            brand: brand,
            description: description,
            fuel: fuel,
            imageUrl: imageUrl,
            model: model,
            price: price,
            seller: seller,
            title: title,
            year: year
        };
        return requester.post('appdata', 'cars', 'kinvey', carData);
    }

    function editCar(brand, description, fuel, imageUrl, model, price, seller, title, year, carId) {
        let carData = {
            brand: brand,
            description: description,
            fuel: fuel,
            imageUrl: imageUrl,
            model: model,
            price: price,
            seller: seller,
            title: title,
            year: year
        };
        return requester.update('appdata', 'cars/' + carId, 'kinvey', carData);
    }

    function removeListing(carId) {
        return requester.remove('appdata', 'cars/' + carId, 'kinvey');
    }

    function getMyCars(username) {
        return requester.get('appdata', `cars?query={"seller":"${username}"}&sort={"_kmd.ect": -1}`, 'kinvey');
    }

    return {
        getAllCars,
        createCar,
        removeListing,
        getCar,
        editCar,
        getMyCars
    }
})();