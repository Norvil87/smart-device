'use strict';

const KeyCodes = {
  ENTER: 'Enter',
  ESC: 'Escape'
};

const Resolutions = {
  MOBILE_MAX: 767
};

const TEL_LENGTH = 14;

let popupButton = document.querySelector('.header__user-button');
let modalUnderlay = document.querySelector('.underlay');
let form = document.querySelector('.form');
let formName = form.querySelector('#name');
let formTel = form.querySelector('#tel');
let formTextarea = form.querySelector('#text');
let formButton = form.querySelector('.form__button');
let modal = document.querySelector('.modal');
let modalForm = modal.querySelector('.modal__inputs-container');
let modalClose = modal.querySelector('.modal__button--close');
let modalSubmit = modal.querySelector('.modal__button--submit')
let modalName = modal.querySelector('#modal-name');
let modalTel = modal.querySelector('#modal-tel');
let modalTextarea = modal.querySelector('#modal-text');

/********************************************/
  // Управление модальным окном 
/********************************************/

function onEscPress(evt) {
  if (evt.code === KeyCodes.ESC) {
    closePopup();
  }
}

function openPopup() {
  if (modalUnderlay.classList.contains('hidden')) {
    modalUnderlay.classList.remove('hidden');
    document.addEventListener('keydown', onEscPress);

    let telStorage = localStorage.getItem("tel");
    let nameStorage = localStorage.getItem("name");

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
    document.removeEventListener('keydown', onEscPress);
  }
}

function onPopupButtonClick() {
  openPopup();
}

function onModalUnderlayClick(evt) {
  if(evt.target === modalClose || evt.target === modalUnderlay) {
    closePopup();
  }
}

popupButton.addEventListener('click', onPopupButtonClick);

modalUnderlay.addEventListener('click', function(evt) {
  onModalUnderlayClick(evt);
});

/********************************************/
  // Проверка валидности телефона и маска ввода
/********************************************/
function onTelInputChange(key, input) {
    const digitsReg = /^[0-9]$/; 

    if (!key.match(digitsReg) || input.value.length === 14) {
      return;
    };

    input.value += key;

    if (input.value.length === 6) {
      input.value += ')';
    }   
}

function onTelInputFocus(input) {
  const telStartPattern = "+7("
  input.value = telStartPattern;

  function onInputKeypress(evt) {
    evt.preventDefault();
    let key = evt.key;
    onTelInputChange(key, input);
  }

  input.addEventListener('keypress', onInputKeypress);

  input.addEventListener('blur', function() {
    input.removeEventListener('keypress', onInputKeypress);
  })
}

modalTel.addEventListener('focus', function() {
  onTelInputFocus(modalTel);
})

formTel.addEventListener('focus', function() {
  onTelInputFocus(formTel);
})

function validate(input) {
  if(input.value.length < TEL_LENGTH) {
    input.setCustomValidity('Телефонный номер должен состоять из 10 цифр')
  } else {
    input.setCustomValidity('')
  }
}

formButton.addEventListener('click', function() {
  validate(formTel);
});

modalSubmit.addEventListener('click', function() {
  validate(modalTel);
});

form.addEventListener('submit', function(evt) {
  localStorage.setItem("name", formName.value);
  localStorage.setItem("tel", formTel.value);
  localStorage.setItem("text", formTextarea.value);
}); 

modalForm.addEventListener('submit', function(evt) {
  localStorage.setItem("name", modalName.value);
  localStorage.setItem("tel", modalTel.value);
  localStorage.setItem("text", modalTextarea.value);
}); 

/********************************************/
  // "Аккордион в подвале"
/********************************************/

let footer = document.querySelector('.footer');
let footerBlocks = Array.prototype.slice.call(footer.querySelectorAll('.footer__nav, .footer__contacts'));

function toggleVisibility(element) {
  let parent = element.parentNode;
  parent.classList.toggle('folded');
}

function hideBlocks() {
  footerBlocks.forEach(function(block) {
    block.classList.add('folded');
  });
}

function showBlocks() {
  footerBlocks.forEach(function(block) {
    block.classList.remove('folded');
  });
}

function checkResolution() {
    return document.documentElement.clientWidth > Resolutions.MOBILE_MAX
}

footer.addEventListener('click', function(evt) {
  let target = evt.target.closest('h3');

  if(!target) return;
  if(checkResolution()) return

  toggleVisibility(target);
})

if (!checkResolution()) {
  hideBlocks();
}
