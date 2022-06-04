const form = document.getElementById("doctorlogin")
const email = document.getElementById("email")
const password = document.getElementById("password")
let isError = false

//Show input error message
function showError(input, message) {
  const formControl = input.parentElement
  formControl.className = "form-control error"
  const small = formControl.querySelector("small")
  small.innerText = message
}

//Show success outline
function showSuccess(input) {
  const formControl = input.parentElement
  formControl.className = "form-control success"
}

//check input length

function doRequest(mail, pass) {
  fetch("http://127.0.0.1:3000/api/v1/login/medical_staff", {
    method: "POST",
    body: JSON.stringify({
      email: mail.value,
      password: pass.value,
    }),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then(function (response) {
      if (response.ok) {
        error.innerText = ""
        window.location.assign(".final-year-project-front-end/dashboard.html")
        return response.json()
      }
      if (response.status == 400) {
        console.log("Wrong email")
        error.innerText = "Wrong email"
      }
      return Promise.reject(response)
    })
    .catch(function (error) {
      console.warn("Something went wrong.", error)
    })
}

function checkRequired(inputArr) {
  inputArr.forEach((input) => {
    if (input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`)
      alert(`${getFieldName(input)} is required`)
      isError = true
    } else {
      // showSuccess(input);
      isError = false
    }
  })
}

//Event Listners
// form.addEventListener("submit", function (e) {
//   e.preventDefault()
//   checkRequired([email, password])

//   checkLength(email, 3, 60)
//   checkLength(password, 6, 10)

//   if (!isError) {
//     doRequest(email, password)
//   }
// })
