import './styles.scss'

/* 
The file makes the drag & drop work and creates the thumbnail of the picture when put inside the drsg & drop box.
Moreover it puts the images into the slider once they're put inside the box 
*/

// Landing Page JS
const modal = document.querySelector('.modal');

//slide variables
const mainWrapper = document.querySelector('.main-wrapper');
const slideContainer = document.querySelector('.slideshow-container');

//upload dropzone variables
const loadImageSquare = document.querySelector('.select__area__form');
const form = document.querySelector('.select__area__container');
const btnSubmit = document.querySelector('.select__area__button');
//error message
const messageError = document.querySelector('.message');
const messageText = document.querySelector('.message__text');
const closeMessage = document.querySelector('.close');
const upload = document.querySelector('.select__area__container');
let newImage;
let errorFormat;

const inputImage = document.querySelector('#browse');
(function init() {
  
  inputImage.addEventListener('change', selectImage);
  // message error if the button ok is pressed the box disappear

  upload.addEventListener('submit', uploadForm);
  //exitBtn.addEventListener('click', exitSlider);
})();



// dragAndDrop initialize function
(function dragAndDrop() {
  //drag and drop function: prevent the default behaviour for every event(the default is to not drop)
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      loadImageSquare.addEventListener(eventName, preventDefaults, false)
    })
    
    function preventDefaults (e) {
      e.preventDefault()
      e.stopPropagation()
    }

//drop event
    loadImageSquare.addEventListener('drop', handleDrop, false)

// take the files you drop from e.dataTransfer and call handle Files function
    function handleDrop(e) {
      let dt = e.dataTransfer
      let files = dt.files
      handleFiles(files)
    }

// transform the files in an array and call the previewFile function to display them
    function handleFiles(files) {
      files = [...files]
      files.forEach(previewFile)  
    }

//the preview function the che fileReader object and search the dataURL of the file dropped
    function previewFile(file) {
      if(errorFormat !== undefined) {
        errorFormat.remove();
      }
      let reader = new FileReader()
      reader.readAsDataURL(file);
      reader.onloadend = function() {
        // here I take the dataURL and assign it to a variable to pass it to loadImage function if type is correct
      if(file.type == 'image/jpeg' || file.type == 'image/png') {
        let dragImage = this.result;
        loadImage(dragImage);
      } else {
        errorType();
      }
      }
    }
})();

// image selection from gallery function
function selectImage() {
    if(errorFormat !== undefined) {
        errorFormat.remove();
    }
    const image = Array.from(this.files);
  image.forEach(function(element) {
    // if the file is a jpeg or png take the dataURL and call the loadImage function else return error 
      if(element.type == 'image/jpeg' || element.type == 'image/png') {
        const reader = new FileReader();
        reader.addEventListener('load', loadImage);
        reader.readAsDataURL(element);
      } else {
        errorType();
      }
  });
}

// function called if the type of image is invalid
function errorType() {
  errorFormat = document.createElement('p');
  errorFormat.innerText = 'The format of the file is invalid';
  loadImageSquare.appendChild(errorFormat);
}

//function to return the images on the square
function loadImage(src) {
    //I save the 'this' into the variable because its value depends on the choose: drag and drop or selection from gallery
    let imageLoaded = this;
    const maxImages = 10;

    // here the error message if the images are more than 10
    if(loadImageSquare.children.length >= maxImages){
      //Array.from(loadImageSquare.children)[maxImages-1].remove();
      messageError.style.display = 'inline-block';
      messageText.innerHTML = 'no more than 10';
    } 
    else {
      messageError.style.display = 'none';
      imageCreation();
    //if the 'this' that comes from the selectImage function (from gallery) is undefined it means that I call the drag and drop so I assign the dataURL value to image
      if(imageLoaded == undefined) {
        newImage.src = src;
      } else {
        newImage.src = this.result;
      }
    // when the button is clicked and an image is uploaded the button result appear
    btnSubmit.style.display = 'inline-block';
    // here you can remove the image you want by clicking on X 
      Array.from(loadImageSquare.children).forEach(function(element) {
          element.querySelector('.removeImage').addEventListener('click', function(e) {
              e.preventDefault();
              element.remove();
              // when remove button is clicked and the container has 0 elements the result button has display none
              if(loadImageSquare.children.length == 0) {
                btnSubmit.style.display = 'none';
              }
          });
      });
      closeMessage.addEventListener('click', function() {
        messageError.style.display = 'none';
      });
    }
}  
       
function imageCreation() {
  const imageBox = document.createElement('div');
  const imageContainer = document.createElement('div');
  const removeBtn = document.createElement('p');

  imageBox.classList.add('load-images-gallery__selected');
  imageContainer.classList.add('load-images-gallery__img-container');
  removeBtn.classList.add('removeImage');
  removeBtn.innerHTML = 'X'
  newImage = new Image();
  newImage.classList.add('load-images-gallery__ready-image');
  newImage.style.maxWidth = '100%';
  newImage.style.maxHeight = '400px';

  imageBox.appendChild(imageContainer);
  imageContainer.appendChild(newImage);
  imageBox.appendChild(removeBtn);
  loadImageSquare.appendChild(imageBox);
}

console.log(localStorage.getItem('token'));
//Fetch       
function uploadForm(e){
    e.preventDefault();

    const formData = new FormData(this);
    
    for(const file of inputImage.files) {
      formData.append('image', file);
    }

    for (var value of formData.values()) {
      console.log(value);
    }

   fetch('https://cat-photo.herokuapp.com/upload/', { 
    headers: {
      'Authorization': 'Token ' + `${localStorage.getItem('token')}`
    },
    method: 'POST',
    body: formData
  })
  .then((uploadResponseFromBackend) => {
    console.log(uploadResponseFromBackend);
    return uploadResponseFromBackend.json();
  })
  .then(data => {
    console.log(Object.values(data[1]))
    createSlider(data[1][0][0]);
    
    
  })
  .catch(error => {
    console.log(error)
  })

  
    
      /* if there are more than 0 slides already in the slider (maybe because i uploaded images before)
      it will remove them*/
    
}


function createSlider(dataResponse) {
  if(document.querySelectorAll('.slides-image-container').length > 0) {
    document.querySelectorAll('.slides-image-container').forEach(function(element) {
      element.parentNode.removeChild(element);
  })}
  // the modal with silder appear
  modal.style.display = 'block';
  mainWrapper.style.display = 'block';
  
  //here I took all the images loaded inside the dropzone and loop through them
  let readyImages = document.querySelectorAll('.load-images-gallery__ready-image');
  
  readyImages.forEach(function(element,i) {
    const slides = document.createElement('div');
    slides.classList.add('slides-image-container');
    // based on Manuel code for the slider I had to give to the first the display block style
  if(i == 0) {
    slides.style.display = 'block';
  } 

  const image = new Image();
  const result = document.createElement('div');
  result.classList.add('result-wrapper');
  result.innerText = dataResponse;
  image.classList.add('image');
  // here I give to the image on the slider the same src that comes from the images on dropzone
  image.src = element.src;

  slides.appendChild(image);
  slides.appendChild(result);
  slides.children[0].style.display = 'block';
  slideContainer.appendChild(slides);
})
}

// button to exit from the slider when the modal appear
function exitSlider () {
mainWrapper.style.display = 'none';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
if (event.target == mainWrapper) {
  mainWrapper.style.display = 'none';
}
}

// SLIDER SECTION
// Default slide index is 1
var slideIndex = 1;
var slides = document.getElementsByClassName('slides-image-container');
showSlides(slideIndex);
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

// Callback for previous button
prevButton.addEventListener('click', function(){
  plusSlides(-1);
});

// Callback for next button 
nextButton.addEventListener('click', function(){
  plusSlides(1);
});

// Next / previous controls
function plusSlides(n) {
  console.log('Slider buttons are working correctly');

  // Increase slide index when you press the button next and decrease it when you press the button previous
  showSlides(slideIndex += n);
}

// Thumbnail image controls 
 function currentSlide(n) {
   showSlides(slideIndex = n);
}

function showSlides(n) {
  var arr = Array.from(slides);
      console.log(arr);
 console.log(slides);
    var i;

  
    if(slides.length >0) {
      
      if (n > slides.length) {slideIndex = 1}
  
      if (n < 1) {slideIndex = slides.length}
    
      // Display none applied to the slide if it is not the one displayed on the screen
      for (i = 0; i < slides.length; i++) {
          slides[i].style.display = 'none';
      }
    
      // Display the slide using display block if it is the one we're seeing on the screen
      console.log(slides);
      slides[slideIndex-1].style.display = 'block';
    }
  
  }





  
  

 