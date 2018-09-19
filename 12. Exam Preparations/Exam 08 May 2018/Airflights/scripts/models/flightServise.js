let flightService = (() => {

    function flightsList() {
        return requester.get('appdata', 'flights?query={"isPublished":"true"}', 'kinvey');
    }

    function loadFlightDetails(flightId) {
        return requester.get('appdata', 'flights/' + flightId, 'kinvey');
    }

    function myFlightsList(userId) {
        return requester.get('appdata', `flights?query={"_acl": {"creator":"${userId}"}}`, 'kinvey');
    }

    function editFlight(flightId, destination, origin, departureDate, departureTime, seats, cost, image, isPublished) {
        let flightData = {
            destination: destination,
            origin: origin,
            departureDate: departureDate,
            departureTime: departureTime,
            seats: seats,
            cost: cost,
            image: image,
            isPublished: isPublished
        };
        return requester.update('appdata', 'flights/' + flightId, 'kinvey', flightData);
    }

    function createFlight(destination, origin, departureDate, departureTime, seats, cost, image, isPublished) {
        let flightData = {
            destination: destination,
            origin: origin,
            departureDate: departureDate,
            departureTime: departureTime,
            seats: seats,
            cost: cost,
            image: image,
            isPublished: isPublished
        };
        return requester.post('appdata', 'flights', 'kinvey', flightData);
    }


    function deleteFlight(flightId) {
        return requester.remove('appdata', 'flights/' + flightId, 'kinvey');
    }

    return {
        flightsList,
        loadFlightDetails,
        myFlightsList,
        editFlight,
        createFlight,
        deleteFlight
    }
})();