'use strict';
/********************************************/
  // Управление модальным окном 
/********************************************/

const KeyCodes = {
  ENTER: 'Enter',
  ESC: 'Escape'
};

let popupButton = document.querySelector('.header__user-button');
let modalUnderlay = document.querySelector('.underlay');
let modal = document.querySelector('.modal');
let modalForm = modal.querySelector('.modal__inputs-container');
let modalClose = modal.querySelector('.modal__button--close');
let modalSubmit = modal.querySelector('.modal__button--submit')
let modalName = modal.querySelector('#modal-name');
let modalTel = modal.querySelector('#modal-tel');
let modalTextarea = modal.querySelector('#modal-text');
let storage = "";

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
  // Проверка валидности телефона
/********************************************/

function onTelInputChange(input) {
  if (input.value.length === 6 && !input.value.includes(')')) {
    input.value += ')';
  }
}

function onTelInputFocus(input) {
  const telStartPattern = "+7("
  input.value = telStartPattern;

  input.addEventListener('input', function() {
    onTelInputChange(input);
  });
}

function onTelInputSubmit(input) {
  const reg = /^([+]?[0-9\s-\(\)]{3,25})*$/i;

  return input.value.match(reg) && input.value.length === 14
}

modalTel.addEventListener('focus', function() {
  onTelInputFocus(modalTel);
})

 modalForm.addEventListener('submit', function(evt) {
   if (!onTelInputSubmit(modalTel)) {
    evt.preventDefault();
    modalTel.setCustomValidity('Введите телефонный номер в формате: +7(xxx)xxxxxxx')
   } 

  localStorage.setItem("name", modalName.value);
  localStorage.setItem("tel", modalTel.value);
  localStorage.setItem("text", modalTextarea.value);
}) 

/********************************************/
  // "Аккордион в подвале"
/********************************************/

const Resolutions = {
  MOBILE_MAX: 767
}

let footer = document.querySelector('.footer');
let footerBlocks = footer.querySelectorAll('.footer__nav, .footer__contacts');

function toggleVisibility(element) {
  let parent = element.parentNode;
  parent.classList.toggle('folded');
}

function hideBlocks() {
  footerBlocks.forEach(block => block.classList.add('folded'));
}

function showBlocks() {
  footerBlocks.forEach(block => block.classList.remove('folded'));
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
