const addCategoryBtn = document.querySelector(".add-category--btn");
const addTagBtn = document.querySelector(".add-tag--btn");
const addSubCategoryBtn = document.querySelector(".add-sub-category--btn");
const addCategoryModal = document.querySelector(".add-category__container");
const addTagModal = document.querySelector(".add-tag__container");
const addSubCategoryModal = document.querySelector(".add-sub-category__container");
const productFilterModal = document.querySelector(".product-filter__container");
// const addAnotherCategoryBtn = document.querySelector(".add-another-category");
const applyFilterBtn = document.querySelector(".apply-filter--btn");
const backdrop = document.querySelector(".backdrop");
const modal = document.querySelectorAll(".modal");
const closeModalBtn = document.querySelectorAll(".close--modal");
let CATEGORY_INPUT_COUNTER = 0;

const backdropOpen = () => {
  backdrop.classList.add("open");
};

const backdropClose = () => {
  backdrop.classList.remove("open");
};

const addCategoryHandler = () => {
  addCategoryModal.classList.add("open");
  backdropOpen();
};

const addSubCategoryHandler = () => {
  addSubCategoryModal.classList.add("open");
  backdropOpen();
};

const backdropHandler = () => {
  backdropClose();
  modal.forEach((modal) => {
    modal.classList.remove("open");
  });
};

// const addAnotherCategoryHandler = () => {
//   if (CATEGORY_INPUT_COUNTER > 5) {
//     return alert("limit reached!");
//   }
//   const divEl = document.createElement("div");
//   divEl.className = "form-control";
//   divEl.innerHTML = `
//     <input
//         type="text"
//         name="categoryName"
//         placeholder="Category Name"
//     />
//   `;
//   addAnotherCategoryBtn.before(divEl);
//   CATEGORY_INPUT_COUNTER++;
// };

const applyFilterHandler = () => {
  productFilterModal.classList.add("open");
  backdropOpen();
};

const addTagHandler = () => {
  addTagModal.classList.add("open");
  backdropOpen();
}

closeModalBtn.forEach(closeModalBtn => {
  closeModalBtn.addEventListener("click", backdropHandler);
});

addCategoryBtn.addEventListener("click", addCategoryHandler);
addTagBtn.addEventListener("click", addTagHandler);
addSubCategoryBtn.addEventListener("click", addSubCategoryHandler);
backdrop.addEventListener("click", backdropHandler);
// addAnotherCategoryBtn.addEventListener("click", addAnotherCategoryHandler);
applyFilterBtn.addEventListener("click", applyFilterHandler);