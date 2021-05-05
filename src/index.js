import './styles.scss';

// Login JS

/* The function below activates a toggle for the input field to use for password recovery (you insert there your e-mail and recover your password)
  By clicking on the link, the field is shown or hidden */

function toggleInputField() {
  var input = document.querySelector('.login-section__psw-recovery-field');
  input.classList.toggle('login-section__psw-recovery--display-block');
}

var link = document.querySelector('.login-section__psw-recovery-link');

link.addEventListener('click', toggleInputField);

const loginForm = document.querySelector('#index-main__login__form');
const username = document.getElementById('username');
const password = document.getElementById('password');

// Event Listener for Login function
loginForm.addEventListener('submit', (e) => {
  localStorage.removeItem('token');
  e.preventDefault();
  fetch('https://cat-photo.herokuapp.com/login/', { 
    method: 'post',  
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': 'Token'
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  })
    .then((loginResponseFromBackend) => {
      console.log(loginResponseFromBackend);
      return loginResponseFromBackend.json();
    })
    .then((loginResponseToCreateToken) => {
      console.log(loginResponseToCreateToken);
      return localStorage.setItem('token', loginResponseToCreateToken.token);
    })    
     .then((loginResponseForRedirect) => {
      console.log(loginResponseForRedirect);
      window.location.href = 'landing_page.html';
    })  
    .catch((error) => {
      console.log('Request failed', error);
    });
});
