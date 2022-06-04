const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const user_name = document.getElementById('name')
const phone_number = document.getElementById('number')

let isError = false;

//Show input error message
function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = "form-control error";
    const small = formControl.querySelector("small");
    small.innerText = message;
}

//Show success outline
function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = "form-control success";
}

//check input length
function checkLength(input, min, max) {
    if (input.value.length < min) {
        alert(`${getFieldName(input)} must be atleast ${min} characters`)
        isError = true;
    } else if (input.value.length > max) {
        alert(`${getFieldName(input)} must be less than ${max} characters`)
        isError = true;
    } else {
        // showSuccess(input);
        isError = false;
    }
}

//Get fieldname
function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

//POST request
function doRequest(username, mail, pass, phone_number) {
    fetch("http://127.0.0.1:3000/api/v1/register/parent", {
        method: "POST",
        body: JSON.stringify({
            email: mail.value,
            name: username.value,
            password: pass.value,
            phone_number: phone_number.value,
        }),
        headers: {
            "Content-type": "application/json",
        },
    })
        .then(function (response) {
            if (response.ok) {
                error.innerText = "";
                window.location.assign("../parent_login.html");
                return response.json();
            }
            if (response.status == 400) {
                console.log("Email is already registered");
                error.innerText = "Email is already registered";
            }
            return Promise.reject(response);
        })
        .catch(function (error) {
            console.warn("Something went wrong.", error);
        });
}

//check required fields
function checkRequired(inputArr) {
    inputArr.forEach((input) => {
        if (input.value.trim() === "") {
            showError(input, `${getFieldName(input)} is required`);
            alert(`${getFieldName(input)} is required`)
            isError = true;
        } else {
            // showSuccess(input);
            isError = false;
        }
    });
}


//Event Listners
form.addEventListener("submit", function (e) {
    e.preventDefault();
    checkRequired([user_name, email, password, phone_number]);
    checkLength(user_name, 2, 15);
    checkLength(email, 3, 60);
    checkLength(password, 6, 10);
    checkLength(phone_number, 10, 10);
    if (!isError) {
        doRequest(user_name, email, password, phone_number);
    }
});