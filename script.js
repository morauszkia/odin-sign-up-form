// Password visibility button icons
const HIDE = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
</svg>`;

const SHOW = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>`;

// DOM ELEMENTS
// Toggles for Password visibility
const passwordToggleBtnEl = document.getElementById('password-show');
const confirmToggleBtnEl = document.getElementById('confirm-show');

// Inputs and Error Messages
const requiredInputEls = document.querySelectorAll('input[required]');
const allInputEls = document.querySelectorAll('input');

const firstNameInputEl = document.getElementById('first-name');
const firstNameErrorMsgEl = document.getElementById('error-first-name');
const lastNameInputEl = document.getElementById('last-name');
const lastNameErrorMsgEl = document.getElementById('error-last-name');
const emailInputEl = document.getElementById('email');
const emailErrorMsgEl = document.getElementById('error-email');
const phoneInputEl = document.getElementById('phone');
const phoneErrorMsgEl = document.getElementById('error-tel');
const passwordInputEl = document.getElementById('new-password');
const confirmInputEl = document.getElementById('confirm');
const confirmErrorMsgEl = document.getElementById('error-confirm');

// Buttons
const submitBtnEl = document.getElementById('submit-btn');

// SHOW / HIDE PASSWORD INPUT
const toggleShowPassword = (e) => {
  const btnEl = e.target.closest('button');
  const inputEl = btnEl.previousElementSibling;
  const inputType = inputEl.getAttribute('type');
  inputEl.setAttribute('type', inputType === 'password' ? 'text' : 'password');
  btnEl.innerHTML = inputType === 'password' ? HIDE : SHOW;
};

passwordToggleBtnEl.addEventListener('click', toggleShowPassword);
confirmToggleBtnEl.addEventListener('click', toggleShowPassword);

// UTILITY
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

// VALIDATION LOGIC
const isEmpty = (value) => {
  return value.trim().length === 0;
};

const isEmail = (email) => {
  const emailRegex = new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  );

  return emailRegex.test(email);
};

const checkPasswordsMatch = (password, confirm) => {
  return password === confirm;
};

// CHECK PASSWORD STRENGTH
let lowercaseLet = '(?=.*[a-z])';
let uppercaseLet = '(?=.*[A-Z])';
let digit = '(?=.*[0-9])';
let special = '(?=.*[^A-Za-z0-9])';

// At least 8 chars, contains lower, upper case, digit & special char
let strongPassword = new RegExp(
  `${lowercaseLet}${uppercaseLet}${digit}${special}(?=.{8,})`
);

// Contains lower, upper case, digit & special char but only 6 chars long
// or at least 8 chars but does not contain upper case or digit or special char
let mediumPassword = new RegExp(
  `(${lowercaseLet}${uppercaseLet}${digit}${special}(?=.{6,}))|(${lowercaseLet}${uppercaseLet}(${digit}|${special})(?=.{8,}))`
);

const checkPasswordStrength = (value) => {
  return mediumPassword.test(value);
};

// VALIDATION DOM UPDATE
const validateFirstName = () => {
  const firstName = firstNameInputEl.value;

  if (isEmpty(firstName)) {
    firstNameErrorMsgEl.textContent = 'Please provide a first name!';
    firstNameInputEl.classList.add('error');
  } else {
    firstNameErrorMsgEl.textContent = '';
    firstNameInputEl.classList.remove('error');
  }
};

const validateEmail = () => {
  const email = emailInputEl.value;

  if (isEmail(email)) {
    emailErrorMsgEl.textContent = '';
    emailInputEl.classList.remove('error');
  } else {
    emailErrorMsgEl.textContent = 'Please provide a valid e-mail address!';
    emailInputEl.classList.add('error');
  }
};

const showPasswordsMatch = () => {
  const enteredPassword = passwordInputEl.value;
  const enteredConfirm = confirmInputEl.value;

  if (!checkPasswordStrength(enteredPassword)) return;

  if (checkPasswordsMatch(enteredPassword, enteredConfirm)) {
    confirmInputEl.classList.remove('error');
    confirmErrorMsgEl.textContent = '';
  } else {
    confirmInputEl.classList.add('error');
    confirmErrorMsgEl.textContent = 'Passwords do not match!';
  }

  if (enteredConfirm.trim().length === 0) {
    confirmInputEl.classList.add('error');
    confirmErrorMsgEl.textContent = 'Please confirm password!';
  }
};

const pwStrengthMediumEl = document.querySelector('.level-medium');
const pwStrengthStrongEl = document.querySelector('.level-strong');

const showPasswordStrength = () => {
  const password = passwordInputEl.value;
  if (checkPasswordStrength(password)) {
    pwStrengthMediumEl.classList.add('active');
    passwordInputEl.classList.remove('error');
    confirmErrorMsgEl.textContent = 'Please confirm password!';
    if (strongPassword.test(password)) {
      pwStrengthStrongEl.classList.add('active');
    } else {
      pwStrengthStrongEl.classList.remove('active');
    }
  } else {
    pwStrengthMediumEl.classList.remove('active');
    pwStrengthStrongEl.classList.remove('active');
    passwordInputEl.classList.add('error');
    confirmErrorMsgEl.textContent = 'Enter a stronger password!';
  }
};

const checkFormValidity = () => {
  const enteredFirstName = firstNameInputEl.value;
  const enteredEmail = emailInputEl.value;
  const enteredPassword = passwordInputEl.value;
  const enteredConfirm = confirmInputEl.value;

  if (
    !isEmpty(enteredFirstName) &&
    isEmail(enteredEmail) &&
    checkPasswordStrength(enteredPassword) &&
    checkPasswordsMatch(enteredPassword, enteredConfirm)
  ) {
    submitBtnEl.disabled = false;
  } else {
    console.log(checkPasswordsMatch(enteredPassword, enteredConfirm));
    console.log(enteredPassword, enteredConfirm);
    submitBtnEl.disabled = true;
  }
};

const resetForm = () => {
  allInputEls.forEach((input) => (input.value = ''));
  pwStrengthMediumEl.classList.remove('active');
  pwStrengthStrongEl.classList.remove('active');
  submitBtnEl.disabled = true;
};

const submitForm = (event) => {
  event.preventDefault();
  confirm('Form submitted!');
  resetForm();
};

// EVENT LISTENERS
firstNameInputEl.addEventListener('blur', validateFirstName);
firstNameInputEl.addEventListener('input', validateFirstName);
emailInputEl.addEventListener('blur', validateEmail);
emailInputEl.addEventListener(
  'input',
  debounce(() => validateEmail(), 1000)
);
confirmInputEl.addEventListener('input', showPasswordsMatch);
passwordInputEl.addEventListener('input', showPasswordStrength);
requiredInputEls.forEach((input) =>
  input.addEventListener('input', checkFormValidity)
);

submitBtnEl.addEventListener('click', submitForm);
