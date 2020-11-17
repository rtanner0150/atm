'use strict';

//initialize an array of account objects
let accounts = [];
//initalize global var for current account
let currentAccountIndex;

//read in account objects from localStorage if the key exists
if (localStorage["accounts"] !== undefined){
    accounts = JSON.parse(localStorage["accounts"]);
};

//set date/time function, calls itself on timeout to continually update
function setDate(){
    let now = new Date();
    let dateContainers = document.querySelectorAll('.date');
    for (let i = 0; i < dateContainers.length; i++){
        dateContainers[i].innerHTML = `${now.getMonth()}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
    }
    // setTimeout(setDate(), 1000);
}
setDate();
setInterval(setDate, 60000);

//Account class definition
class Account{
    //Account constructor, accepts name and pin, sets id and balance automatically
    constructor(name, pin){
        //properties
        this.name = name;
        this.pin = Number(pin);
        this.balance = 0;
    }
}

//since JSON.parse/stringify strips function properties, add back function properties as expressions
for (let index in accounts){
    accounts[index].deposit = function(amount){
        if (amount % 20 !== 0){
            return 'Deposit amount must be increment of 20.';
        }
        if (amount > 200){
            return 'Deposit amount cannot exceed $200.';
        }
        this.balance += amount;
        return 'Thank you for the deposit. Your updated balance is: ' + this.balance;
    };
    accounts[index].withdraw = function(amount){
        if (amount % 20 !== 0){
            return 'Withdrawal amount must be increment of 20.';
        }
        if (amount > 200){
            return 'Withdrawal amount cannot exceed $200.';
        }
        if (amount > this.balance){
            return 'Withdrawal amount cannot exceed current balance.';
        }
        this.balance -= amount;
        return 'Thank you for the withdrawal. Your updated balance is: ' + this.balance;
    };
    accounts[index].changeName = function(newName){
        this.name = newName;
    };
    accounts[index].changePin = function(newPin){

    };
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
    document.getElementById('auth-welcome').innerHTML = accounts[currentAccountIndex].deposit(amount);
    localStorage["accounts"] = JSON.stringify(accounts);
    hideDelete();
});

document.getElementById('auth-withdraw').addEventListener('click', function(){
    let amount = Number(document.getElementById('auth-amount').value);
    document.getElementById('auth-welcome').innerHTML = accounts[currentAccountIndex].withdraw(amount);
    localStorage["accounts"] = JSON.stringify(accounts);
    showDelete();
});

document.getElementById('change-submit').addEventListener('click', function(){
    let newPin = Number(document.getElementById('change-text').value);
    accounts[currentAccountIndex].pin = newPin;
    localStorage["accounts"] = JSON.stringify(accounts);
    document.getElementById('auth-welcome').innerHTML = 'PIN has been updated. Your current balance is: ' + accounts[currentAccountIndex].balance;
});

document.getElementById('delete-account').addEventListener('click', function(){
    document.querySelector('body').className = 'menu';
    document.getElementById('menu-text').prepend('Your account has been deleted. ');
    accounts.splice(currentAccountIndex, 1);
    localStorage['accounts'] = JSON.stringify(accounts);
});

document.getElementById('name-submit').addEventListener('click', function(){
    //get name from text
    let newName = document.getElementById('change-text').value;
    for (let index in accounts){
        if (accounts[index].name === newName){
            //if name already exists, alert and do nothing else
            document.getElementById('auth-welcome').innerHTML = 'An account already exists under that name.';
            return;
        }
        //if name didn't exist, update account with new name
        accounts[currentAccountIndex].name = newName;
        //update array in local storage
        localStorage["accounts"] = JSON.stringify(accounts);
        //display confirm text
        document.getElementById('auth-welcome').innerHTML = 'Account name changed to ' + newName;
    }
})