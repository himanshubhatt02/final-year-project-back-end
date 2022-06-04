const button = document.getElementById("loginButton");
const email = document.getElementById("email");
const password = document.getElementById("password");

let isError = false;

//POST request
function doRequest(mail, pass) {
    fetch("http://127.0.0.1:3000/api/v1/login/parent", {
        method: "POST",
        body: JSON.stringify({
            email: mail.value,
            password: pass.value,
        }),
        headers: {
            "Content-type": "application/json",
        },
    })
        .then(async function (response) {
            if (response.status == 200) {
                var data = await response.json();
                console.log(response.body);
                localStorage.setItem('pid', data["id"])
                localStorage.setItem('pname', data["pname"])
                window.location.assign("../parent_dashboard.html");
                return response.json();
            }
            if (response.status == 400) {
                console.log("Invaild email or password");
                alert("Invaild email or password")
                return;
            }
            return Promise.reject(response);
        })

}

button.addEventListener('click', (e) => {
    e.preventDefault()
    doRequest(email, password);
})