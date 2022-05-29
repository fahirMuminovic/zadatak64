/**
 * Ovo rjesenje uglavnom koristi klase i metode
 * Program u terminal odonosno konzolu ispisuje feedback za svaku simuliranu transakciju npr. ako je: 
 * - stanje na racunu manje od iznosa koji klijent zeli da podigne, ispisat ce se poruka: "Error Not enough balance on account!"
 * - klijent zeli da uplati iznos od 0 KM ili manji od 0 program ispisuje: "Error amount can\'t be negative or zero!"
 * - klijent zeli da vidi stanje racuna program ispisuje: "Your balance is: INSERT_AMOUNT_HERE"
 * 
 * Zbog toga sto je konzola pretrpana ovim porukama program ispisuje sve podatke iz baze podataka u file imenovan OUTPUT.json
 */

const DATA_BASE = {
    BANKS: [],
    PEOPLE: [],
}

//class Bank has internal classes Account and Transaction
//both class Bank and class Account can withdraw, deposit or check ballace of account
//this simulates if a customer goes directly to the bank or uses an ATM or app from the bank or similar
class Bank {
    static ID = 0;

    static Account = class {

        constructor(owner, bankName, PIN) {
            this.accountNo = this.getAccountOrderNumber(bankName);
            this.ID = this.generateAccNumber();
            this.owner = owner.firstName + ' ' + owner.lastName;
            this.ownerID = owner.ID;
            this.bank = bankName;
            this.balance = 0;
            this.bankAccountPIN = PIN;
        }
        generateAccNumber() {
            return Math.floor(Math.random() * 9999999999);
        }
        getBankByName(bankName) {
            let bank = {};
            for (let i = 0; i < DATA_BASE.BANKS.length; i++) {
                if (bankName === DATA_BASE.BANKS[i].name) {
                    bank = DATA_BASE.BANKS[i];
                }
            }
            return bank;
        }
        getAccountOrderNumber(bankName) {
            const bank = this.getBankByName(bankName);
            return (bank.accounts.length) + 1;
        }
        deposit(accountPIN, amount) {
            //check if PIN is correct and if amount that is being deposited grater than 0 then deposit amount
            if (accountPIN === this.bankAccountPIN) {
                if (amount > 0) {
                    this.balance += amount;
                } else {
                    console.log('Error amount can\'t be negative or zero!');
                    return 0;
                }
            } else {
                console.log('Error Wrong PIN number!');
                return 0;
            }

            //make a transaction record of this transaction
            const transaction = new Bank.Transaction('DEPOSIT', this.ID, this.ownerID, amount);

            //add the transaction to the list of transactions of the bank where the account is  
            const bank = this.getBankByName(this.bank);
            bank.transactions.push(transaction);

            return transaction;
        }

        withdraw(accountPIN, amount) {
            //check if PIN is correct and enough balance is on account then withdraw amount
            if (accountPIN === this.bankAccountPIN) {
                if (amount > 0) {
                    if (this.balance > amount) {
                        this.balance -= amount;
                    } else {
                        console.log('Error Not enough balance on account!');
                        return 0;
                    }
                } else {
                    console.log('Error amount can\'t be negative!');
                    return 0;
                }
            } else {
                console.log('Error Wrong PIN number!');
                return 0;
            }

            //make a transaction record of this transaction
            const transaction = new Bank.Transaction('WITHDRAW', this.ID, this.ownerID, amount);

            //add the transaction to the list of transactions of the bank where the account is 
            const bank = this.getBankByName(this.bank);
            bank.transactions.push(transaction);

            return transaction;
        }

        checkBalance(accountPIN) {
            //check if PIN is correct then display account balance
            if (this.bankAccountPIN === accountPIN) {
                console.log(`Your balance is: ${this.balance}`);
            } else {
                console.log('Error Wrong PIN number!');
                return 0;
            }

            //make a transaction record of this transaction
            const transaction = new Bank.Transaction('CHECK_BALANCE', this.ID, this.ownerID, this.balance);
            //add the transaction to the list of transactions of the bank where the account is 
            const bank = this.getBankByName(this.bank);
            bank.transactions.push(transaction);

            return transaction;
        }
    }

    static Transaction = class {
        static transactionID = 0;
        //static currentTime = new Date();

        constructor(type, account, person, amount) {
            this.transactionCount = ++Bank.Transaction.transactionID;
            this.ID = this.generateTransactionNumber();
            this.type = type;
            this.account = account;
            this.person = person;
            this.amount = amount;
            this.timeStamp = this.makeTimeStamp();
        }
        makeTimeStamp() {
            const date = new Date();
            //add day.month.year to timeStamp + one space + add hours:minutes:seconds to timeStamp
            return date.toLocaleString();
        }
        generateTransactionNumber() {
            //add a random string base16 value to the time stamp to make sure that the transaction number is unique 
            return this.makeTimeStamp().slice(11) + Math.random().toString(16);
        }
    }

    constructor(name, location) {
        this.ID = ++Bank.ID;
        this.name = name;
        this.location = location;
        this.accounts = [];
        this.transactions = [];
    }

    createAccount(person) {
        //make a PIN number to access the account
        const PIN = this.generatePIN();
        //make the account
        const account = new Bank.Account(person, this.name, PIN);
        //add account to the list of accounts of the bank
        this.accounts.push(account);
        //give the person that is the owner of the account the account PIN
        person.bankAccountPIN = PIN;
        //give the person the bank account
        person.bankAccount = account;

        return account;
    }

    deleteAccount(account) {
        let indexOfAcc = this.accounts.indexOf(account);
        if (indexOfAcc != -1) {
            this.accounts.splice(indexOfAcc, 1);
            console.log('Account has been successfully deleted');
            return 1;
        } else {
            console.log('Error in Account deletion process');
            return 0;
        }
    }

    createWantedNumberOfAccounts(numOfAccToCreate) {

        function checkAvaliableNumOfAccToCreate() {
            let counter = 0;
            for (let i = 0; i < DATA_BASE.PEOPLE.length; i++) {
                const person = DATA_BASE.PEOPLE[i];
                if (person.bankAccount === undefined) {
                    counter++;
                }
            }
            return counter;
        }

        if (checkAvaliableNumOfAccToCreate() >= numOfAccToCreate) {
            let counter = 0;
            for (let i = 0; i < DATA_BASE.PEOPLE.length; i++) {
                const person = DATA_BASE.PEOPLE[i];

                if (person.bankAccount === undefined) {
                    this.createAccount(person);
                    counter++;
                }
                if (counter === numOfAccToCreate) {
                    break;
                }
            }
        } else {
            console.log('Error Not enough people without accounts. MAX_NUM_OF_ACC_TO_CRATE: ', checkAvaliableNumOfAccToCreate());
            return 0;
        }
    }

    getAccByID(accountID) {
        let acc = {};
        for (let i = 0; i < this.accounts.length; i++) {
            if (accountID === this.accounts[i].ID) {
                acc = this.accounts[i];
            }
        }
        return acc;
    }

    isAccValid(accountID) {
        const acc = this.getAccByID(accountID);

        if (accountID === acc.ID) {
            return true;
        } else return false;
    }

    isPINValid(accountID, accountPIN) {
        const acc = this.getAccByID(accountID);
        if (acc.bankAccountPIN === accountPIN) {
            return true;
        } else return false;
    }

    deposit(accountID, accountPIN, amount) {
        const acc = this.getAccByID(accountID);
        if (this.isAccValid(accountID)) {
            if (this.isPINValid(accountPIN)) {
                if (amount > 0) {
                    acc.balance += amount;
                } else {
                    console.log('Error amount can\'t be negative or zero!');
                    return 0;
                }
            } else {
                console.log('Error Wrong PIN number!');
                return 0;
            }
        } else {
            console.log('Error account doesn\'t exist!');
            return 0;
        }

        const transaction = new Bank.Transaction('DEPOSIT', acc.ID, acc.ownerID, amount);
        this.transactions.push(transaction);

        return transaction;
    }

    withdraw(accountID, accountPIN, amount) {
        const acc = this.getAccByID(accountID);
        if (this.isAccValid(accountID)) {
            if (this.isPINValid(accountPIN)) {
                if (amount > 0) {
                    if (acc.balance > amount) {
                        acc.balance -= amount;
                    } else {
                        console.log('Error Not enough balance on account!');
                        return 0;
                    }
                } else {
                    console.log('Error amount can\'t be negative!');
                    return 0;
                }
            } else {
                console.log('Error Wrong PIN number!');
                return 0;
            }
        } else {
            console.log('Error account doesn\'t exist!');
            return 0;
        }

        const transaction = new Bank.Transaction('WITHDRAW', acc.ID, acc.ownerID, amount);
        this.transactions.push(transaction);
        ž

        return transaction;
    }

    checkBalance(accountID, accountPIN) {
        const acc = this.getAccByID(accountID);
        if (this.isAccValid(accountID)) {
            if (this.isPINValid(accountPIN)) {
                console.log(`Your balance is: ${acc.balance}`);
            } else {
                console.log('Error Wrong PIN number!');
                return 0;
            }
        } else {
            console.log('Error Wrong account ID');
            return 0;
        }

        const transaction = new Bank.Transaction('CHECK_BALANCE', acc.ID, acc.ownerID, acc.balance);
        this.transactions.push(transaction);

        return transaction;
    }

    generatePIN() {
        return Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    }
}

class Person {
    static ID = 0;

    constructor(firstName, lastName, gender) {
        this.ID = ++Person.ID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.dateOfBirth = this.generateDateOfBirth();
        this.JMBG = this.generateJMBG(this);
        this.bankAccountPIN = undefined;
        this.bankAccount = undefined;
    }

    generateJMBG(person) {
        /*  JMBG je individualna i neponovljiva oznaka identifikacionih podataka o licu i sastoji se od 13 cifara svrstanih u 6 grupa, i to:
            I grupa dan rođenja (dvije cifre)
            II grupa mjesec rođenja (dvije cifre)
            III grupa godina rođenja (tri cifre)
            IV grupa broj registra JMB - registraciona područja (dvije cifre)
            V grupa kombinacija pola i rednog broja za lica rođena istog dana (tri cifre) - muškarci 000-499 - žene 500-999
            VI grupa kontrolni broj (jedna cifra). 
            Zakon on JMBG BiH: https://advokat-prnjavorac.com/zakoni/Zakon-o-JMB-BiH.pdf 
        */
        let JMBG = '';

        //I, II and III group of JMBG
        let dateOfBirthArray = person.dateOfBirth.split('.');
        const dayOfBirth = dateOfBirthArray[0];
        const monthOfBirth = dateOfBirthArray[1];
        //substring method gives us only the last three digits of yearOfBirth
        const yearOfBirth = dateOfBirthArray[2].substring(1);

        //add day, month and year to JMBG
        JMBG += dayOfBirth;
        JMBG += monthOfBirth;
        JMBG += yearOfBirth;

        //IV group of JMBG
        JMBG += Math.floor(Math.random() * (19 - 14 + 1)) + 14;

        //V group of JMBG
        if (person.gender === 'M') {
            JMBG += Math.floor(Math.random() * 5);
            JMBG += Math.floor(Math.random() * 10);
            JMBG += Math.floor(Math.random() * 10);
        } else if (person.gender === 'F') {
            JMBG += Math.floor(Math.random() * (9 - 5 + 1) + 5);
            JMBG += Math.floor(Math.random() * 10);
            JMBG += Math.floor(Math.random() * 10);
        }

        //VI group of JMBG
        JMBG += Math.floor(Math.random() * 9 + 1);

        //check if JMBG already exist
        for (const individual of DATA_BASE.PEOPLE) {
            if (individual.ID === person.ID) {
                continue;
            }
            const JMBGofIndividual = individual.JMBG;
            if (JMBGofIndividual === JMBG) {
                console.log(`There has been an JMBG error.These persons have the same JMBG:
                ${individual}
                ${person}
                a new JMBG will be generated`);
                generateJMBG(person);
            }
        }

        return JMBG;
    }


    generateDateOfBirth() {
        //check for leapYear
        function isLeapYear(year) {
            return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
        }

        let dateOfBirth = '';
        //get current year to generate a valid year of birth
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        //generate a random year that is in the range of the current year and 100 years ago
        const year = Math.floor(Math.random() * (currentYear - (currentYear - 100) + 1) + (currentYear - 100));
        let month = Math.floor(Math.random() * 12 + 1);
        let day = 0;

        //generate a valid value for day 
        //if odd month then it has 31 days
        if (month % 2 !== 0) {
            //31 days
            day = Math.floor(Math.random() * 31 + 1);
        }
        //if even month than either 30 or 28/29 days 
        else if (month % 2 === 0) {
            //if february than 28 or 29 day depending on if it's a leap year or not
            if (month === 2) {
                if (isLeapYear(year)) {
                    day = Math.floor((Math.random() * 29) + 1);
                } else {
                    day = Math.floor((Math.random() * 28) + 1);
                }
            } else {
                //if it's not february and an even month then it has 30 days
                day = Math.floor((Math.random() * 30) + 1);
            }
        }

        //append 0 if day and/or month are one digit
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }

        //format for date
        dateOfBirth = day + '.' + month + '.' + year;

        return dateOfBirth;
    }
}

//simulate 10 randomly chosen transaction for an account
//aka simulation method 1
function simulateRandomTransactionsForAccount(account) {
    for (let i = 0; i < 10; i++) {

        const randomTransaction = Math.floor(Math.random() * 3);
        //randomAmount to deposit or withdraw
        const randomAmount = Math.floor((Math.random() * 10000) + 1);

        //randomTransaction 0 is deposit
        if (randomTransaction === 0) {
            account.deposit(account.bankAccountPIN, randomAmount);
        }
        //randomTransaction 1 is withdraw
        else if (randomTransaction === 1) {
            account.withdraw(account.bankAccountPIN, randomAmount);
        }
        //randomTransaction 2 is checkBalance
        else if (randomTransaction === 2) {
            account.checkBalance(account.bankAccountPIN);
        }
    }
}

//simulate 10 randomly chosen transaction for all accounts of a bank
//aka simulation method 1
function simulateRandomTransactionsOnAllAcountsOfBank(bank) {
    for (let i = 0; i < bank.accounts.length; i++) {
        const account = bank.accounts[i];
        simulateRandomTransactionsForAccount(account);
    }
}


//simulate the three possible transactions on one account 4 times
//aka simulation method 2
function simulateTransactionsForAccount(account) {
    //randomAmount to deposit or withdraw
    let randomAmount = Math.floor((Math.random() * 10000) + 1);

    for (let i = 0; i < 4; i++) {
        if (account.deposit(account.bankAccountPIN, randomAmount)) {
            randomAmount = Math.floor((Math.random() * 10000) + 1);
            if (account.withdraw(account.bankAccountPIN, randomAmount)) {
                randomAmount = Math.floor((Math.random() * 10000) + 1);
                account.checkBalance(account.bankAccountPIN);
            }
            account.deposit(account.bankAccountPIN, randomAmount)
        }
    }
}

//simulate the three possible transactions 4 times on all accounts of a bank
//aka simulation method 2
function simulateTransactionsOnAllAcountsOfBank(bank) {
    for (let i = 0; i < bank.accounts.length; i++) {
        const account = bank.accounts[i];
        simulateTransactionsForAccount(account);
    }
}

function printAccountDetails(account, bank) {
    const transactions = bank.transactions;
    const thisAccountsID = account.ID;

    let thisAccountsTransactions = [];

    if (bank.accounts.indexOf(account) === -1) {
        return console.log('Error Account doesn\'t exist');
    }

    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].account === thisAccountsID) {
            thisAccountsTransactions.push(transactions[i]);
        }
    }

    console.log('\nAccount details:\n');
    console.log(account);
    console.log('\nThis account\'s transactions:\n');
    console.log(thisAccountsTransactions);
}

/*TESTIRANJE APLIKACIJE */


//read names from file and make instances of Person objects with them, then push to PEOPLE array
const fs = require('fs');

try {
    const data = fs.readFileSync('./people.txt', 'utf8');
    const person = data.split('\n');
    for (let i = 0; i < person.length; i++) {
        const currentPerson = person[i].split(' ');
        const personInstance = new Person(currentPerson[0], currentPerson[1], currentPerson[2]);
        DATA_BASE.PEOPLE.push(personInstance);
    }
} catch (err) {
    console.error(err);
}


//create 3 Banks and push them to DATA_BASE
const uniCredit = new Bank('UniCredit', 'Mostar');
const bbi = new Bank('BBI', 'Tuzla');
const ziraatBank = new Bank('ZiraatBank', 'Sarajevo');

DATA_BASE.BANKS.push(uniCredit, bbi, ziraatBank);

//create 100 Accounts and distribute them to the banks
uniCredit.createWantedNumberOfAccounts(50);
bbi.createWantedNumberOfAccounts(30);
ziraatBank.createWantedNumberOfAccounts(20);



//this is a simulation if customers went to the bank to make a transaction
//using simulation method 1
simulateRandomTransactionsOnAllAcountsOfBank(uniCredit);

simulateRandomTransactionsOnAllAcountsOfBank(bbi);

simulateRandomTransactionsOnAllAcountsOfBank(ziraatBank);

//this is a simulation if customers were to use an ATM or App to make a transaction
//using simulation method 1
for (const account of DATA_BASE.BANKS[0].accounts) {
    simulateRandomTransactionsForAccount(account);
}

for (const account of DATA_BASE.BANKS[1].accounts) {
    simulateRandomTransactionsForAccount(account);
}

for (const account of DATA_BASE.BANKS[2].accounts) {
    simulateRandomTransactionsForAccount(account);
}

//this is a simulation if customers went to the bank to make a transaction
//using simulation method 2
simulateTransactionsOnAllAcountsOfBank(uniCredit);

simulateTransactionsOnAllAcountsOfBank(bbi);

simulateTransactionsOnAllAcountsOfBank(ziraatBank);


//this is a simulation if customers were to use an ATM or App to make a transaction
//using simulation method 2
for (const account of DATA_BASE.BANKS[0].accounts) {
    simulateTransactionsForAccount(account);
}

for (const account of DATA_BASE.BANKS[1].accounts) {
    simulateTransactionsForAccount(account);
}

for (const account of DATA_BASE.BANKS[2].accounts) {
    simulateTransactionsForAccount(account);
}



//account to test functions and methods on
const sampleAccount = uniCredit.accounts[14];

//print the account and its transactions
printAccountDetails(sampleAccount, uniCredit);

//delete account
uniCredit.deleteAccount(sampleAccount);

//print again to test if it's deleted
printAccountDetails(sampleAccount, uniCredit);



//write the database to a json file
fs.writeFile("OUTPUT.json", JSON.stringify(DATA_BASE), function (err) {
    if (err) throw err;
});