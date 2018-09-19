const notify = (function () {
    $(document).ajaxStart(function () {
        $('#loadingBox').show();
    });
    $(document).ajaxStop(function () {
        $('#loadingBox').hide();
    });

    function showInfo(message) {
        const infoBox = $('#infoBox');
        infoBox.children('span').text(message);
        infoBox.show();
        infoBox.on('click', function () {
            infoBox.hide();
        });

        setTimeout(function () {
            $('#infoBox').fadeOut()
        }, 3000);
    }

    function showError(message) {
        const errorBox = $('#errorBox');
        errorBox.children('span').text(message);
        errorBox.show();
        errorBox.on('click', function () {
            errorBox.hide();
        });
    }

    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON && response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg)
    }

    return {showInfo, showError, handleAjaxError};

}());