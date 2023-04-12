const webservice = () => {
    var xhr = new XMLHttpRequest();

    xhr.open("type", "http://localhost:8080/isthissentry", true);
    console.log(xhr.status);

    xhr.onreadystatechange = () => {
        console.log(xhr.status);
        if (xhr.status === 0) {
        } else if (xhr.status === 200) {
            console.log("success");
        } else {
            console.log("error");
        }
    };
};

export default webservice;
