const doctorName = document.getElementById("doctorName")

window.onload = async function fetchData() {
  var docName = localStorage.getItem("mname")

  doctorName.innerText = docName
}
