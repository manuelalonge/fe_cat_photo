import './styles.scss';
import './registration.js'

// Login JS

/* The function below activates a toggle for the input field to use for password recovery (you insert there your e-mail and recover your password)
  By clicking on the link, the field is shown or hidden */

function toggleInputField() {
  var input = document.querySelector('.login-section__psw-recovery-field');
  input.classList.toggle('login-section__psw-recovery--display-block');
}

var link = document.querySelector('.login-section__psw-recovery-link');

link.addEventListener('click', toggleInputField);

const form = document.querySelector('#index-main__login__form');
const username = document.getElementById('username');
const password = document.getElementById('password');
const email = document.getElementById('email');

// Event Listener for Login function
form.addEventListener('submit', (e) => {
  e.preventDefault();
  /* checkLength(username, 3, 12);
  isValidEmail(email);
  checkPasswordStrength(password); */  
  fetch('https://cat-photo.herokuapp.com/login/', {
    method: 'post',  
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username.value,
      email: email.value,
      password: password.value,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      console.log(response);
    })
    .then((response) => {
      window.location = 'https://cat-photo-1.netlify.app/landing_page.html';
    })
    .catch((error) => {
      console.log('Request failed', error);
    });
});
