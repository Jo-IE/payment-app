'use strict';
const visa = 'http://secureservercdn.net/198.71.233.106/990.175.myftpupload.com/wp-content/uploads/2018/05/Visa-Logo-Design-Vector.jpg';
const mastercard = 'https://cdn.vox-cdn.com/thumbor/pYruc_wBlzdyxrP5uetHtTOvrdk=/0x0:1000x1000/1820x1213/filters:focal(421x430:581x590):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/62800797/Mastercard_logo.0.jpg';

const supportedCards = {
    visa, mastercard
  };

  const countries = [
    {
      code: "US",
      currency: "USD",
      currencyName: '',
      country: 'United States'
    },
    {
      code: "NG",
      currency: "NGN",
      currencyName: '',
      country: 'Nigeria'
    },
    {
      code: 'KE',
      currency: 'KES',
      currencyName: '',
      country: 'Kenya'
    },
    {
      code: 'UG',
      currency: 'UGX',
      currencyName: '',
      country: 'Uganda'
    },
    {
      code: 'RW',
      currency: 'RWF',
      currencyName: '',
      country: 'Rwanda'
    },
    {
      code: 'TZ',
      currency: 'TZS',
      currencyName: '',
      country: 'Tanzania'
    },
    {
      code: 'ZA',
      currency: 'ZAR',
      currencyName: '',
      country: 'South Africa'
    },
    {
      code: 'CM',
      currency: 'XAF',
      currencyName: '',
      country: 'Cameroon'
    },
    {
      code: 'GH',
      currency: 'GHS',
      currencyName: '',
      country: 'Ghana'
    }
  ];

  const billHype = () => {
    const billDisplay = document.querySelector('.mdc-typography--headline4');
    if (!billDisplay) return;

    billDisplay.addEventListener('click', () => {
      const billSpan = document.querySelector("[data-bill]");
      if (billSpan &&
        appState.bill &&
        appState.billFormatted &&
        appState.billFormatted === billSpan.textContent) {
        window.speechSynthesis.speak(
          new SpeechSynthesisUtterance(appState.billFormatted)
        );
      }
    });
  };

  const appState = {};
  const cardDigits = [[],[],[],[]];
  
  

  const formatAsMoney = (amount, buyerCountry) => {
      let index = countries.findIndex((item) => {
          return (item.country === buyerCountry);
      });
      if(index === -1){index = 0};
      buyerCountry = countries[index];

      return amount.toLocaleString('en-' + buyerCountry.code, {style: 'currency', currency: buyerCountry.currency })
  };

  const flagIfInvalid = (field, isValid) => {
     return(isValid === true? 
     field.classList.remove('is-invalid')
     :
     field.classList.add('is-invalid'))
  }


const expiryDateFormatIsValid = field => {
    const dateRegex = /^((0{0,1}[1-9]){1}|(1[0-2]){1})(\/)\d{2}$/;
    return dateRegex.test(field.value);
}
  
  const validateCardExpiryDate = () => {
    const dateInput = document.querySelectorAll('[data-cc-info] input')[1];
    const fullDate = dateInput.value.split('/').join('/01/');
    const currentDate = Date.now();
    const expiryDate = new Date(fullDate);
    const timeElapsed = expiryDate-currentDate;
    if(expiryDateFormatIsValid(dateInput) && timeElapsed > 0){
            flagIfInvalid(dateInput, true);
            return true;
    }
    else{
    flagIfInvalid(dateInput, false);
    return false;
    }

  };

  const validateCardHolderName = () => {
    const nameInput = document.querySelectorAll('[data-cc-info] input')[0];

     let cardholdername = nameInput.value;
     const nameRegex = /^([a-zA-Z]{3,})\s([a-zA-Z]{3,})$/;
     let validation = nameRegex.test(cardholdername);
     
     flagIfInvalid(nameInput, validation);
     return validation;
     
  };

  const smartCursor = (event, fieldIndex, fields) => {
      const size = event.target.value.length;
         if(fieldIndex < 4 && (size === 4)){
             setTimeout(() => {
             fields[fieldIndex+1].focus();
             }, 500);
         }
         else if (fieldIndex === 4 && size === 20){
             setTimeout(() => {
             fields[fieldIndex + 1].focus();
             }, 500);
         }
         else if (fieldIndex === 5 && size === 6){
             setTimeout(() => { 
             document.querySelector('.mdc-button').focus();
             }, 500);
         }
    
  };

  const detectCardType = (first4Digits) => {

      const firstInput = first4Digits[0];
     const creditCard = document.querySelector('div[data-credit-card]');
     const logo = document.querySelector('[data-card-type]');
     if(firstInput == '4'){
         creditCard.classList.remove('is-mastercard')
         creditCard.classList.add('is-visa');
            logo.src='supportedCards.visa';
            return 'is-visa';
     }
     else if(firstInput == '5'){
         creditCard.classList.remove('is-visa');
         creditCard.classList.add('is-mastercard');

         logo.src=supportedCards.mastercard;
         return 'is-mastercard';
     }
     else{
         creditCard.classList.remove('is-visa');
         creditCard.classList.remove('is-mastercard');
         logo.src = 'https://placehold.it/120x60.png?text=Card' }
  }

const smartInput = (event, fieldIndex, fields) => {

    const numcodesArray = ['Digit0', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9'];
    
    const numkeys = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9'];

    const navkeys = ['Backspace', 'Delete', 'Shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'];
    console.log(event)
    if(fieldIndex < 4){
       let selectionStart = event.target.selectionStart;
    if (!(numkeys.includes(event.key)) && !(navkeys.includes(event.key))){
        event.preventDefault();
    }else if(event.key === 'Backspace'|| event.code === "Delete" ){

        
        selectionStart = (selectionStart - 1 > 0)? selectionStart - 1 : 0;
        appState.cardDigits[fieldIndex].splice(selectionStart, 1);
        event.target.value = appState.cardDigits[fieldIndex].map(item => '#').join('');
        event.target.selectionStart = selectionStart;
            /*const deleteIndex = event.target.selectionStart;
            
            appState.cardDigits[fieldIndex].splice([deleteIndex-1], 1, '')	;*/
                
             
        } 
        else if(numkeys.includes(event.key)){
            /*if(event.target.value.length === 0 && appState.cardDigits.length < fieldIndex + 1){
                appState.cardDigits.push([]);
            }
        //const addIndex = event.target.selectionStart;
          if(event.target.value.length < 4){
        appState.cardDigits[fieldIndex].push(event.key);
          }*/
          appState.cardDigits[fieldIndex][selectionStart] = +event.key;
          //event.target.value = event.target.value.substr(0, selectionStart) + event.key + event.target.value.substr(selectionStart + 1);
        
        
        console.log(appState.cardDigits);
        /*if(fieldIndex === 0){detectCardType(appState.cardDigits[0]);}*/
        if(fieldIndex < 3){
        setTimeout(() => {
            appState.cardDigits[fieldIndex] = event.target.value.split('').map((item, ind) => (item >= '0' && item <= '9') ? item : appState.cardDigits[fieldIndex][ind]);
            event.target.value = event.target.value.replace(/\d/g, '#');
        }, 500)
        }
        }
    } if(fieldIndex === 4){
        if (event.keyCode !== 20 && event.keyCode !== 32 && !(event.keyCode >= 65 && event.keyCode <= 90) && !(navkeys.includes(event.key) )){
            event.preventDefault();
        }
    }
    if(fieldIndex === 5){
        if(!(numkeys.includes(event.key)) && !(navkeys.includes(event.key)) && event.keyCode !== 191) {
            event.preventDefault();
        }
    }
    if(fieldIndex === 0){
        const four = appState.cardDigits[0];
        detectCardType(four);
    }

    fields[fieldIndex].addEventListener('keyup', (evt) => {
        smartCursor(evt, fieldIndex, fields);
    })
}


  const enableSmartTyping = () => {
      const inputArray = [...document.querySelectorAll('input')];
      inputArray.forEach((field, index, fields) => {
          field.addEventListener('keydown', (event) => {
              smartInput(event, index, fields)
          })
      })
  }
  const validateWithLuhn = (digits) => {
      const sumTotal = digits.reverse().map((item, index) => {
           item = Number(item);
           if(index % 2=== 1){
               let double = item * 2;
               if(double > 9) return double - 9;
               else return double;
           }
           return item;
      }).reduce((acc, curr) => {
          return acc + curr;
      })
        return sumTotal % 10 === 0;
  };

  const validateCardNumber = () => {
      const cardDiv = document.querySelector('div[data-cc-digits]');
      const flatArray = appState.cardDigits.flat();
          const numberValidation = validateWithLuhn(flatArray);
          flagIfInvalid(cardDiv, numberValidation);
          return numberValidation;
  }

  const validatePayment = () => {
      validateCardNumber();
      validateCardHolderName();
      validateCardExpiryDate();
  }

const acceptCardNumbers = (event, fieldIndex) => {}

  const uiCanInteract = () => {
      const submitBtn = document.querySelector('.mdc-button');
      const focusedInput = document.querySelector('[data-cc-digits] input');
      focusedInput.focus();
      submitBtn.addEventListener('click', validatePayment);
      billHype();
      enableSmartTyping();

  };

  const displayCartTotal = ({results}) => {
     const [data] = results;
     const {itemsInCart, buyerCountry} = data;

     appState.items = itemsInCart;
     appState.country = buyerCountry;

     appState.bill= itemsInCart.reduce((acc, curr) => {
        return (acc.price*acc.qty) + (curr.price*curr.qty);
     })

     appState.billFormatted = formatAsMoney(appState.bill, appState.country)

     const displayBillSpan = document.querySelector("span[data-bill");
     displayBillSpan.textContent = appState.billFormatted;

     appState.cardDigits = [[], [], [], []];

     uiCanInteract();
  };

  const fetchBill = () => {
    const apiHost = 'https://randomapi.com/api';
    const apiKey = '006b08a801d82d0c9824dcfdfdfa3b3c';
    const apiEndpoint = `${apiHost}/${apiKey}`;

    fetch(apiEndpoint)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        displayCartTotal(data);
    })
    .catch((err) => {
        console.log(err);
    })
    
  };
  
  const startApp = () => {
      fetchBill();
  };

  startApp();