const addImageBtn = document.getElementById("add-img-btn");
const addSpecBtn = document.getElementById("add-spec-btn");
const addDescBtn = document.getElementById("add-desc-btn");
const addKeyBtn = document.getElementById("add-key-btn");

const addAnotherImageHandler = () => {
  const divEl = document.createElement("div");
  divEl.className = "form-group";
  divEl.innerHTML = `
      <input type="file" id="extra-image" name="productImage">
  `;
  addImageBtn.before(divEl);
};

const addAnotherSpecHandler = () => {
  const divEl = document.createElement("div");
  divEl.className = "form-group";
  divEl.innerHTML = `
        <input type="text" name="specName" placeholder="Specification Name">
        <textarea name="specValue" cols="30" rows="10"></textarea>
  `;
  addSpecBtn.before(divEl);
};

const addAnotherDescHandler = () => {
  const divEl = document.createElement("div");
  divEl.className = "form-group";
  divEl.innerHTML = `
        <input type="text" name="descName" placeholder="Description Name">
        <textarea name="descValue" cols="30" rows="10"></textarea>
  `;
  addDescBtn.before(divEl);
};

const addAnotherKeyHandler = () => {
  const divEl = document.createElement("div");
  divEl.className = "form-group";
  divEl.innerHTML = `
        <input type="text" name="keyFeature" placeholder="Key Feature">
  `;
  addKeyBtn.before(divEl);
};

addImageBtn.addEventListener("click", addAnotherImageHandler);
addSpecBtn.addEventListener("click", addAnotherSpecHandler);
addDescBtn.addEventListener("click", addAnotherDescHandler);
addKeyBtn.addEventListener("click", addAnotherKeyHandler);
