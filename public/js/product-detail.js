const indexImage1 = document.querySelector(".index-image1");
const indexImage2 = document.querySelector(".index-image2");
const indexImage3 = document.querySelector(".index-image3");
const indexImage4 = document.querySelector(".index-image4");

const image1 = document.getElementById("image1");
const image2 = document.getElementById("image2");
const image3 = document.getElementById("image3");
const image4 = document.getElementById("image4");

const imageHandler = (imageNum) => {
  switch (imageNum) {
    case "1":
      indexImage1.classList.remove("invisible");
      indexImage2.classList.add("invisible");
      indexImage3.classList.add("invisible");
      indexImage4.classList.add("invisible");
      break;

    case "2":
      indexImage2.classList.remove("invisible");
      indexImage1.classList.add("invisible");
      indexImage3.classList.add("invisible");
      indexImage4.classList.add("invisible");
      break;

    case "3":
      indexImage3.classList.remove("invisible");
      indexImage1.classList.add("invisible");
      indexImage2.classList.add("invisible");
      indexImage4.classList.add("invisible");
      break;

    case "4":
      indexImage4.classList.remove("invisible");
      indexImage1.classList.add("invisible");
      indexImage2.classList.add("invisible");
      indexImage3.classList.add("invisible");
      break;

    default:
      break;
  }
};

image1.addEventListener("click", imageHandler.bind(this, "1"));
image2.addEventListener("click", imageHandler.bind(this, "2"));
image3.addEventListener("click", imageHandler.bind(this, "3"));
image4.addEventListener("click", imageHandler.bind(this, "4"));