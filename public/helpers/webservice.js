const webservice = (type, url) => {
    var xhr = new XMLHttpRequest();

    xhr.open(type, url, true);

    xhr.onreadystatechange = () => {
        console.log(xhr.status);
        if (xhr.status === 0) {
        } else if (xhr.status === 200) {
            console.log("success");
        } else {
            console.log("error");
        }
    };

    // xhr.onerror = (e) => {
    //     fail(e);
    // };

    // xhr.ontimeout = (e) => {
    //     fail(e);
    // };

    // xhr.onabort = (e) => {
    //     fail(e);
    // };
};

module.exports = webservice;
