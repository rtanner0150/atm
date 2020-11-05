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

    //methods
    this.withdraw = function(amount){
        amount = Number(amount);
        this.balance -= amount;
        alert('Withdrew ' + amount + '. New balance is ' + this.balance);
    };
    this.deposit = function(amount){
        amount = Number(amount);
        this.balance += amount;
        alert('Deposited ' + amount + '. New balance is ' + this.balance);
    }
    this.changePin = function(){
        let newPin = Number(prompt('Please enter your new desired PIN: ',''));
        this.pin = newPin;
        alert('PIN has been successfully updated to ' + this.pin);
    }

    this.view = function(){
        let returnResult;
        for (let prop in this){
            returnResult += prop + ': ' + this[prop] + '\n';
        }
        return returnResult;
    }
}

//click handlers for switching views
document.getElementById('create-btn').addEventListener('click',function(){
    document.getElementById('create-view').style.display = 'block';
    document.getElementById('view-btn').style.display = 'none';
});
document.getElementById('access-btn').addEventListener('click',function(){
    document.getElementById('access-view').style.display = 'block';
    document.getElementById('view-btn').style.display = 'none';
});

//click handlers for main menu buttons
let buttons = document.querySelectorAll('.return-button');
for (let i = 0; i < buttons.length; i++){
    buttons[i].addEventListener('click', function(){
        document.getElementById('create-name').value = '';
        document.getElementById('create-pin').value = '';
        document.getElementById('access-name').value = '';
        document.getElementById('access-pin').value = '';
        document.getElementById('auth-amount').value = '';
        document.getElementById('change-pin').value = '';
        document.getElementById('create-view').style.display = 'none';
        document.getElementById('access-view').style.display = 'none';
        document.getElementById('auth-view').style.display = 'none';
        document.getElementById('view-btn').style.display = 'block';
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
            document.getElementById('access-view').style.display = 'none';
            document.getElementById('auth-view').style.display = 'block';
            document.getElementById('auth-welcome').innerHTML = 'Welcome, ' + accounts[currentAccountIndex].name + '! Your current balance is: ' + 
                accounts[currentAccountIndex].balance + '<br>' + 'What would you like to do?';
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
});

document.getElementById('auth-withdraw').addEventListener('click', function(){
    let amount = Number(document.getElementById('auth-amount').value);
    accounts[currentAccountIndex].balance -= amount;
    localStorage["accounts"] = JSON.stringify(accounts);
    document.getElementById('auth-welcome').innerHTML = 'Thank you for the withdrawal. Your updated balance is: ' + accounts[currentAccountIndex].balance;
});

document.getElementById('change-submit').addEventListener('click', function(){
    let newPin = Number(document.getElementById('change-pin').value);
    accounts[currentAccountIndex].pin = newPin;
    localStorage["accounts"] = JSON.stringify(accounts);
    document.getElementById('auth-welcome').innerHTML = 'PIN has been updated. Your current balance is: ' + accounts[currentAccountIndex].balance;
});