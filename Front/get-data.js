export var getData = function (address, query) {
    return $.ajax({
        url: address,
        type: "POST",
        dataType: "json",
        data: query
    })
}

