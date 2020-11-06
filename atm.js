'use strict';

//initialize an array of account objects
let accounts = [];
//initalize global var for current account
let currentAccountIndex;

//read in account objects from localStorage if the key exists
if (localStorage["accounts"] !== undefined){
    accounts = JSON.parse(localStorage["accounts"]);
};

//Account constructor, accepts name and pin, sets id and balance automatically
function Account(name, pin){
    //properties
    this.name = name;
    this.pin = Number(pin);
    this.balance = 0;
}

function showDelete(){
    if (accounts[currentAccountIndex].balance == 0){
        document.getElementById('delete-account').style.display = 'block';
    }
}

function hideDelete(){
    if (accounts[currentAccountIndex].balance >= 0){
        document.getElementById('delete-account').style.display = 'none';
    }
}

//click handlers for switching views
document.getElementById('create-btn').addEventListener('click',function(){
    document.querySelector('body').className = 'create';
});
document.getElementById('access-btn').addEventListener('click',function(){
    document.querySelector('body').className = 'access';
});

//click handlers for main menu buttons
let buttons = document.querySelectorAll('.return-button');
for (let i = 0; i < buttons.length; i++){
    buttons[i].addEventListener('click', function(){
        window.location.reload();
        console.log('reload?');
        return false;
    });
}

//on click of create-submit, create new account
document.getElementById('create-submit').addEventListener('click', function(){
    //get name from create-name
    let name = document.getElementById('create-name').value;
    //get pin from create-pin
    let pin = document.getElementById('create-pin').value;
    //check if account already exists under given name
    for (let index in accounts){
        if (accounts[index].name === name){
            //if exists, alert and do nothing else
            document.getElementById('create-output').innerHTML = 'You already have an account, ' + accounts[index].name + '!';
            return;
        }
    }
    //if doesn't exist, create new local account object
    let account = new Account(name, pin);
    //and push object to array
    accounts.push(account);
    //update array in local storage
    localStorage["accounts"] = JSON.stringify(accounts);
    //set currentAccountIndex
    currentAccountIndex = accounts.length - 1;
    document.querySelector('body').className = 'auth';
    document.getElementById('auth-welcome').innerHTML = 'Welcome, ' + accounts[currentAccountIndex].name + '! Your current balance is: ' + 
        accounts[currentAccountIndex].balance + '<br>' + 'What would you like to do?';
    showDelete();
});

//on click of access-submit, attempt to access existing account
document.getElementById('access-submit').addEventListener('click', function(){
    //get name from access-name
    let name = document.getElementById('access-name').value;
    //get pin from access-pin
    let pin = Number(document.getElementById('access-pin').value);
    for (let index in accounts){
        if (accounts[index].name === name && accounts[index].pin === pin){
            //if name and pin match, access account
            currentAccountIndex = index;
            document.querySelector('body').className = 'auth';
            document.getElementById('auth-welcome').innerHTML = 'Welcome, ' + accounts[currentAccountIndex].name + '! Your current balance is: ' + 
                accounts[currentAccountIndex].balance + '<br>' + 'What would you like to do?';
            showDelete();
            return;
        } else if (accounts[index].name === name && accounts[index].pin !== pin){
            //if name matches but wrong pin, display message
            document.getElementById('access-output').innerHTML = 'Invalid PIN. Please try again.';
        } else {
            //if name not found, display message
            document.getElementById('access-output').innerHTML = 'No account found.';
        }
    }
});

document.getElementById('auth-deposit').addEventListener('click', function(){
    let amount = Number(document.getElementById('auth-amount').value);
    accounts[currentAccountIndex].balance += amount;
    localStorage["accounts"] = JSON.stringify(accounts);
    document.getElementById('auth-welcome').innerHTML = 'Thank you for the deposit. Your updated balance is: ' + accounts[currentAccountIndex].balance;
    hideDelete();
});

document.getElementById('auth-withdraw').addEventListener('click', function(){
    let amount = Number(document.getElementById('auth-amount').value);
    if (accounts[currentAccountIndex].balance < amount){
        document.getElementById('auth-welcome').innerHTML = 'Withdrawal amount exceeds current balance. Please try again.';
        return;
    }
    accounts[currentAccountIndex].balance -= amount;
    localStorage["accounts"] = JSON.stringify(accounts);
    document.getElementById('auth-welcome').innerHTML = 'Thank you for the withdrawal. Your updated balance is: ' + accounts[currentAccountIndex].balance;
    showDelete();
});

document.getElementById('change-submit').addEventListener('click', function(){
    let newPin = Number(document.getElementById('change-pin').value);
    accounts[currentAccountIndex].pin = newPin;
    localStorage["accounts"] = JSON.stringify(accounts);
    document.getElementById('auth-welcome').innerHTML = 'PIN has been updated. Your current balance is: ' + accounts[currentAccountIndex].balance;
});

document.getElementById('delete-account').addEventListener('click', function(){
    document.querySelector('body').className = 'menu';
    document.getElementById('menu-text').prepend('Your account has been deleted. ');
    accounts.splice(currentAccountIndex, 1);
    localStorage['accounts'] = JSON.stringify(accounts);
})