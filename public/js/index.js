const slides = document.querySelectorAll(".recipeSlides img");
const recipes = {{{recipe}}};
  let index = 0;
// adds image to the recipeSlides div above
function showSlide() {
  slides[0].setAttribute("src", recipes[index].image);
}
// switches to next images when user presses the next button
document.getElementById("nextBtn").onclick = function () {
  index = (index + 1) % recipes.length;
  showSlide();
};
// starts the slideshow as user accesses the page
showSlide();