console.log("hello this is new Child js")
const parent_email = document.querySelector("#parent_email")
const getDetails = document.querySelector("#getDetails")

const parent_id = document.querySelector('[name="parent_id"]')
console.log(parent_id)
const mother_name = document.querySelector('[name="mother_name"]')

const father_name = document.querySelector('[name="father_name"]')

const phoneNumber = document.querySelector('[name="phoneNumber"]')
const address = document.querySelector('[name="address"]')
const email = document.querySelector('[name="email"]')
console.log(email)

// const address = document.querySelector('[name="address"]')

console.log(getDetails)

getDetails.addEventListener("click", async () => {
  try {
    const response = await fetch(`/doctor/getparentinfo/${parent_email.value}`)
    data = await response.json()
    console.log(data)
    parent_id.value = data._id
    mother_name.value = data.mother_name
    father_name.value = data.father_name
    phoneNumber.value = data.phoneNumber
    email.value = data.email
    address.value = data.address

    // address = data.address
  } catch (error) {
    alert("invalid email")
  }
})

// email = parent_email.value
