const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

// Create element and render cafe data
function renderCafe(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("div");

  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = "x";

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);

  cafeList.appendChild(li);

  // Deleting Data
  cross.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("cafes").doc(id).delete();
  });
}

// Getting Data
// db.collection("cafes")
//   // .where("city", "==", "manchester")
//   .orderBy('name')
//   .get()
//   .then((snapshot) => {
//     // console.log(snapshot.docs)
//     snapshot.docs.forEach((doc) => {
//       renderCafe(doc);
//     });
//   });

// Getting Data in RealTime
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
  let changes = snapshot.docChanges()
  // console.log(changes)
  changes.forEach(change => {
    // console.log(change.doc.data())
    if(change.type == 'added'){
      renderCafe(change.doc)
    } else if(change.type == 'removed'){
      let li = cafeList.querySelector('[data-id=' + change.doc.id + ']')
      cafeList.removeChild(li)
    }
  })
})

// Saving Data
form.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("cafes").add({
    name: form.name.value,
    city: form.city.value,
  });
  form.name.value = "";
  form.city.value = "";
});
