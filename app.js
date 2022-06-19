const randomMeal = "https://www.themealdb.com/api/json/v1/1/random.php";
const recipepage = document.querySelector(".recipePage");
const idMeal = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const searchMeal = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const catMeal = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";

//scrolling horizontally

const favBox = document.querySelector(".fav-box");
// favBox.addEventListener("wheel", scrollHorizon);
// function scrollHorizon(e) {
//  e.preventDefault();
//  if (e.deltaY > 0) {
//   favBox.scrollLeft += 200;
//  } else {
//   favBox.scrollLeft -= 200;
//  }
// }
// const catiBox = document.querySelector(".cat-box");
// catiBox.addEventListener("wheel", scrollpHorizon);
// function scrollpHorizon(e) {
//  e.preventDefault();
//  if (e.deltaY > 0) {
//   catiBox.scrollLeft += 200;
//  } else {
//   catiBox.scrollLeft -= 200;
//  }
// }
// --------scroll end---




// --------------------------
async function fetching(url) {
 const data = await fetch(url);
 const data2 = await data.json();
 return data2;
}

//when clicked on cat items
const catItems = document.querySelectorAll(".cat-box .item");
const catBox = document.querySelector(".cat-item-box");
const catTitle = document.querySelector(".cat-item-view h4");
const siv = document.querySelector(".siv");
catItems.forEach((item, ind) => {
 item.onclick = itemClick;
 async function itemClick() {
  siv.classList.add("d-none");
  civ.classList.remove("d-none");
  catTitle.innerText = item.innerText;
  catBox.innerHTML = "";
  let catSelectedItem = item.innerText;
  let datas = await fetching(catMeal + catSelectedItem);
  let finalSearchData = await datas.meals;
  let prevloadedArr = JSON.parse(localStorage.getItem("recipeApp"));
  ///creating cat items based on fetch data

  for (let x = 0; x < finalSearchData.length; x++) {
   catBox.innerHTML += `
    <div class="card" data-mealid="${finalSearchData[x].idMeal}" onclick="abspageload(${finalSearchData[x].idMeal})">
    <div class="heart" onclick="hearting(this,event)"><i class="fa-solid fa-heart"></i></div>

                <img src="${finalSearchData[x].strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${finalSearchData[x].strMeal}</h5>
                </div>
              </div>
    `;
   const selectingAllItem = document.querySelectorAll(".cat-item-box .card");
   if (prevloadedArr) {
    for (let y = 0; y < prevloadedArr.length; y++) {
     if (selectingAllItem[x].dataset.mealid === prevloadedArr[y]) {
      selectingAllItem[x].querySelector(".heart").classList.add("active");
     }
    }
   }
  }
 }
});

////random meal
const ranBox = document.querySelector(".ran-item-box");
const ranBtn = document.querySelector(".ranBtn");
async function ranGen() {
 let datas = await fetching(randomMeal);
 let finalRanData = await datas.meals;
 ranBox.innerHTML = `
  <div class="card" data-mealid="${finalRanData[0].idMeal}" onclick="abspageload(${finalRanData[0].idMeal})">
  <div class="heart" onclick="hearting(this,event)"><i class="fa-solid fa-heart"></i></div>
              <img src="${finalRanData[0].strMealThumb}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">${finalRanData[0].strMeal}</h5>
              </div>
            </div>
  `;
}
ranBtn.onclick = ranGen;
ranGen();

//when searching

const btnSubmit = document.querySelector(".btnSubmit");
const searchitemviewTitle = document.querySelector(".search-item-view h4");
const searchitembox = document.querySelector(".search-item-box");
const search = document.querySelector(".form-control");
const civ = document.querySelector(".civ");

search.oninput = gettingInput;
function gettingInput() {
 const inputData = search.value;
 return inputData;
}
btnSubmit.onclick = searchingFunc;
async function searchingFunc(e) {
 e.preventDefault();

 siv.classList.remove("d-none");
 civ.classList.add("d-none");
 searchitembox.innerHTML = "";
 searchitemviewTitle.innerText = `Search Results For '${gettingInput()}'`;
 let datas = await fetching(searchMeal + gettingInput());
 let finalSearchData = await datas.meals;
 if (finalSearchData === null) {
  searchitembox.innerHTML = "No Results Found";
 } else {
  ///creating search items based on fetch data
  for (let x = 0; x < finalSearchData.length; x++) {
   searchitembox.innerHTML += `
    <div class="card" data-mealid="${finalSearchData[x].idMeal}" onclick="abspageload(${finalSearchData[x].idMeal})">
    <div class="heart" onclick="hearting(this,event)"><i class="fa-solid fa-heart"></i></div>

                <img src="${finalSearchData[x].strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${finalSearchData[x].strMeal}</h5>
                </div>
              </div>
    `;
  }
 }
 search.value = "";
 search.blur();
}

////adding to favorites
function hearting(lol,ev) {
  ev.stopPropagation();
 let mealID = lol.parentElement.dataset.mealid;
 let favImgSrc = lol.parentElement.querySelector("img").src;
 let favTitle = lol.parentElement.querySelector(
  ".card-body .card-title",
 ).innerText;

 if (lol.classList.contains("active")) {
  lol.classList.remove("active");
  ///favorite section removing
  let allFavItem = document.querySelectorAll(".fav-box .item");
  allFavItem.forEach((item) => {
   if (item.dataset.mealid === mealID) {
    item.remove();
   }
  });
  if (document.querySelectorAll(".fav-box .item").length == 0) {
   favSec.style.display = "none";
  }
  let prevloadedArr = JSON.parse(localStorage.getItem("recipeApp"));
  let dataArr = prevloadedArr ? prevloadedArr : null || [];
  let ind = dataArr.indexOf(mealID);
  dataArr.splice(ind, 1);
  localStorage.setItem("recipeApp", JSON.stringify(dataArr));
 } else {
  lol.classList.add("active");
  favSec.style.display = "block";

  ///favorite section
  favBox.innerHTML += `
    <div class="item d-flex flex-column align-items-center" data-mealid="${mealID}">
                <i class="fa-regular fa-circle-xmark" onclick="removeItems(this)"></i>
                <img src="${favImgSrc}" class="img-fluid" alt="">
                <p class="">${favTitle}</p>
              </div>
    `;

  let prevloadedArr = JSON.parse(localStorage.getItem("recipeApp"));
  let dataArr = prevloadedArr ? prevloadedArr : null || [];
  dataArr.push(mealID);
  localStorage.setItem("recipeApp", JSON.stringify(dataArr));
 }
}

/////loading previous data of favorites
const favSec = document.querySelector(".favSec");
document.addEventListener("DOMContentLoaded", async () => {
 let myLoadedData = JSON.parse(localStorage.getItem("recipeApp")) || [];
 if (myLoadedData.length > 0) {
  favSec.style.display = "block";

  for (let x = 0; x < myLoadedData.length; x++) {
   let apicall = await fetching(idMeal + myLoadedData[x]);
   let apiDataData = await apicall.meals;
   let callingTheApi = await addingThroughApi();

   async function addingThroughApi() {
    favBox.innerHTML += `
      <div class="item d-flex flex-column align-items-center" data-mealid="${apiDataData[0].idMeal}">
                  <i class="fa-regular fa-circle-xmark" onclick="removeItems(this)"></i>
                  <img src="${apiDataData[0].strMealThumb}" class="img-fluid" alt="">
                  <p class="">${apiDataData[0].strMeal}</p>
                </div>
      `;
   }
  }
 } else {
  favSec.style.display = "none";
 }
});
function removeItems(ev) {
 let myLoadedData2 = JSON.parse(localStorage.getItem("recipeApp"));
 let ind = myLoadedData2.indexOf(ev.parentElement.dataset.mealid);
 myLoadedData2.splice(ind, 1);
 localStorage.setItem("recipeApp", JSON.stringify(myLoadedData2));
 ev.parentElement.remove();
 if (document.querySelectorAll(".fav-box .item").length == 0) {
  favSec.style.display = "none";
 } else {
  favSec.style.display = "block";
 }
 ///checking heart icon
 const ribc = document.querySelectorAll(".ran-item-box .card");
 const cibc = document.querySelectorAll(".cat-item-box .card");
 const sibc = document.querySelectorAll(".search-item-box .card");
 cibc.forEach((ci) => {
  if (ci.dataset.mealid === ev.parentElement.dataset.mealid) {
   ci.querySelector(".heart").classList.remove("active");
  }
 });
 ribc.forEach((ri) => {
  if (ri.dataset.mealid === ev.parentElement.dataset.mealid) {
   ri.querySelector(".heart").classList.remove("active");
  }
 });
 sibc.forEach((si) => {
  if (si.dataset.mealid === ev.parentElement.dataset.mealid) {
   si.querySelector(".heart").classList.remove("active");
  }
 });
}

////
const absPageImg = document.querySelector(".absPageImg img");
const absPageContent = document.querySelector(".absPageContent");
const ingmeasures = document.querySelector(".ing-measures");
const closeModal = document.querySelector(".closeModal");
const abstitle = document.querySelector(".abstitle");
const instruction = document.querySelector(".instruction");

async function abspageload(dd) {
 let data = await fetching(idMeal + dd);
 let res = await data.meals[0];
 let asArray = Object.entries(res);
 let filtered = asArray.filter(([a, b]) => {
  return (
   a == "strMealThumb" ||
   a == "strMeal" ||
   a == "strInstructions" ||
   (a.startsWith("strIngredient") && b != "") ||
   (a.startsWith("strMeasure") && b != "")
  );
 });
 const justStrings = Object.fromEntries(filtered);
 instruction.innerText=justStrings.strInstructions;
 absPageImg.src = justStrings.strMealThumb;
 abstitle.innerText = justStrings.strMeal;
 // ingmeasures.innerHTML= measuring(justStrings);
 ///ing measure func define
 measuring(justStrings);
 function measuring(justStrings) {
  let keyData = Object.keys(justStrings);
  let IngElems = [];
  let MeaElems = [];
  for (let x of keyData) {
   if (x.startsWith("strIngredient")) {
    IngElems.push(justStrings[x]);
   }
   if (x.startsWith("strMeasure")) {
    MeaElems.push(justStrings[x]);
   }
  }
  ingmeasures.innerHTML = "";
  for (let x = 0; x < IngElems.length; x++) {
   ingmeasures.innerHTML += `
    <li>${IngElems[x]} , ${MeaElems[x]}</li>
    `;
  }
  recipepage.style.display='block';
  recipepage.scrollIntoView();
 }
}

closeModal.onclick=(e)=>{
e.stopPropagation();
  recipepage.style.display='none';
}
