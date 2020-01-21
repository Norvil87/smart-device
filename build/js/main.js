'use strict';

var KeyCodes = {
  ENTER: 'Enter',
  ESC: 'Escape'
};

var Resolutions = {
  MOBILE_MAX: 767
};

var TEL_LENGTH = 14;

var popupButton = document.querySelector('.header__user-button');
var modalUnderlay = document.querySelector('.underlay');
var form = document.querySelector('.form');
if (form) {
  var formName = form.querySelector('#name');
  var formTel = form.querySelector('#tel');
  var formTextarea = form.querySelector('#text');
  var formButton = form.querySelector('.form__button');
}

var modal = document.querySelector('.modal');

if (modal) {
  var modalForm = modal.querySelector('.modal__inputs-container');
  var modalClose = modal.querySelector('.modal__button--close');
  var modalSubmit = modal.querySelector('.modal__button--submit');
  var modalName = modal.querySelector('#modal-name');
  var modalTel = modal.querySelector('#modal-tel');
  var modalTextarea = modal.querySelector('#modal-text');
}

function onEscPress(evt) {
  if (evt.code === KeyCodes.ESC) {
    closePopup();
  }
}

function openPopup() {
  if (modalUnderlay.classList.contains('hidden')) {
    modalUnderlay.classList.remove('hidden');
    if (!document.body.classList.contains('no-scrolling')) {
      document.body.classList.add('no-scrolling');
    }

    document.addEventListener('keydown', onEscPress);

    var telStorage = localStorage.getItem('tel');
    var nameStorage = localStorage.getItem('name');

    if (nameStorage) {
      modalName.value = nameStorage;
      if (telStorage) {
        modalTel.value = telStorage;
        modalTextarea.focus();
      } else {
        modalTel.focus();
      }
    } else {
      modalName.focus();
    }
  }
}

function closePopup() {
  if (!modalUnderlay.classList.contains('hidden')) {
    modalUnderlay.classList.add('hidden');
    if (document.body.classList.contains('no-scrolling')) {
      document.body.classList.remove('no-scrolling');
    }

    document.removeEventListener('keydown', onEscPress);
  }
}

function onPopupButtonClick() {
  openPopup();
}

function onModalUnderlayClick(evt) {
  if (evt.target === modalClose || evt.target === modalUnderlay) {
    closePopup();
  }
}

if (popupButton) {
  popupButton.addEventListener('click', onPopupButtonClick);
}

if (modalUnderlay) {
  modalUnderlay.addEventListener('click', function (evt) {
    onModalUnderlayClick(evt);
  });
}

function onTelInputChange(key, input) {
  var digitsReg = /^[0-9]$/;

  if (!key.match(digitsReg) || input.value.length === 14) {
    return;
  }

  input.value += key;

  if (input.value.length === 6) {
    input.value += ')';
  }
}

function onTelInputFocus(input) {
  var telStartPattern = '+7(';
  input.value = telStartPattern;

  function onInputKeypress(evt) {
    evt.preventDefault();
    var key = evt.key;
    onTelInputChange(key, input);
  }

  input.addEventListener('keypress', onInputKeypress);

  input.addEventListener('blur', function () {
    input.removeEventListener('keypress', onInputKeypress);
  });
}

if (modalTel) {
  modalTel.addEventListener('focus', function () {
    onTelInputFocus(modalTel);
  });
}

if (formTel) {
  formTel.addEventListener('focus', function () {
    onTelInputFocus(formTel);
  });
}

function validate(input) {
  if (input.value.length < TEL_LENGTH) {
    input.setCustomValidity('Телефонный номер должен состоять из 10 цифр');
  } else {
    input.setCustomValidity('');
  }
}

if (formButton) {
  formButton.addEventListener('click', function () {
    validate(formTel);
  });
}

if (modalSubmit) {
  modalSubmit.addEventListener('click', function () {
    validate(modalTel);
  });
}

if (form) {
  form.addEventListener('submit', function () {
    localStorage.setItem('name', formName.value);
    localStorage.setItem('tel', formTel.value);
    localStorage.setItem('text', formTextarea.value);
  });
}

if (modalForm) {
  modalForm.addEventListener('submit', function () {
    localStorage.setItem('name', modalName.value);
    localStorage.setItem('tel', modalTel.value);
    localStorage.setItem('text', modalTextarea.value);
  });
}

var footerTop = document.querySelector('.footer--top');
if (footerTop) {
  var footerBlocks = Array.prototype.slice.call(footerTop.querySelectorAll('.footer__nav, .footer__contacts'));
}

function toggleVisibility() {
  footerBlocks.forEach(function (block) {
    block.classList.toggle('folded');
  });
}

function checkResolution() {
  return document.documentElement.clientWidth > Resolutions.MOBILE_MAX;
}

if (footerTop) {
  footerTop.addEventListener('click', function (evt) {
    var target = evt.target.closest('h3');

    if (!target) {
      return;
    }

    if (checkResolution()) {
      return;
    }

    toggleVisibility();
  });
}

if (!checkResolution() && footerBlocks) {
  footerBlocks[0].classList.add('folded');
}
