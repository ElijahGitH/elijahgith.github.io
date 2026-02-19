//Elijah Ramos
//DOM Manipulation


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newContent").style.display = "none";
  document.getElementById("filterContent").style.display = "none";
});

function showFilter() {
  document.getElementById("filterContent").style.display = "block";
  document.getElementById("newContent").style.display = "none";
}

function showAddNew() {
  document.getElementById("newContent").style.display = "block";
  document.getElementById("filterContent").style.display = "none";
}

function filterArticles() {
  const showOpinion = document.getElementById("opinionCheckbox").checked;
  const showRecipe = document.getElementById("recipeCheckbox").checked;
  const showUpdate = document.getElementById("updateCheckbox").checked;

  document.querySelectorAll("#articleList article").forEach((a) => {
    if (a.classList.contains("opinion")) a.style.display = showOpinion ? "" : "none";
    if (a.classList.contains("recipe")) a.style.display = showRecipe ? "" : "none";
    if (a.classList.contains("update")) a.style.display = showUpdate ? "" : "none";
  });
}

function addNewArticle() {
  const title = document.getElementById("inputHeader").value.trim();
  const text = document.getElementById("inputArticle").value.trim();

  const opinion = document.getElementById("opinionRadio").checked;
  const recipe = document.getElementById("recipeRadio").checked;
  const update = document.getElementById("lifeRadio").checked;

  if (title === "" || text === "" || (!opinion && !recipe && !update)) return;

  let typeClass = ""; let markerText = "";

  if (opinion) { typeClass = "opinion"; markerText = "Opinion"; }
  if (recipe) { typeClass = "recipe"; markerText = "Recipe"; }
  if (update) { typeClass = "update"; markerText = "Update"; }

  const list = document.getElementById("articleList");
  const count = document.querySelectorAll("#articleList article").length + 1;

  const article = document.createElement("article");
  article.className = typeClass;
  article.id = "a" + count;
//Had to look up this box of code below
  article.innerHTML =
    `<span class="marker">${markerText}</span>` +
    `<h2>${title}</h2>` +
    `<p>${text}</p>` +
    `<p><a href="moreDetails.html">Read more...</a></p>`;

  list.prepend(article);

  document.getElementById("inputHeader").value = "";
  document.getElementById("inputArticle").value = "";
  document.getElementById("opinionRadio").checked = false;
  document.getElementById("recipeRadio").checked = false;
  document.getElementById("lifeRadio").checked = false;

  filterArticles();
}
