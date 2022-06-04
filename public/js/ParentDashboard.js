const parentName = document.getElementById("parentName");

window.onload = async function fetchData() {
    var uid = localStorage.getItem("pname")

    parentName.innerText = uid;
}