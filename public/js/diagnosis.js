console.log("i am diagnosis")
const medName = document.querySelector("#medName")
const addMed = document.querySelector("#addMed")
const medicineList = document.querySelector(".medicineList")
const template = document.querySelector("#medicine-item-template")
console.log(medName.value)
console.log(addMed)
console.log(medicineList)

addMed.addEventListener("click", () => {
  console.log("u clikced button")

  const item = template.content.cloneNode(true)
  item.querySelector('[name="medicines"]').value = medName.value
  medicineList.append(item)
  medName.value = ""
})
