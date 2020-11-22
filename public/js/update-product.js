const addAnotherSpecBtn = document.querySelector(".add-another-spec");

const addAnotherSpecHandler = () => {
  const divEl = document.createElement("div");
  divEl.className = "form-control__specification";
  divEl.innerHTML = `
      <input type="text" name="specificationName" placeholder="Name" />
      <input type="text" name="specificationValue" placeholder="Value" />
    `;
  addAnotherSpecBtn.before(divEl);
  SPEC_COUNTER++;
};

addAnotherSpecBtn.addEventListener("click", addAnotherSpecHandler);
