# OVO JE JEDAN ZADATAK I  RADITE SVE U ISTOM FAJLU

NOTE: Za bilo koji objekat ukoliko vidite potrebu da dodate neki novi property ili
metodu, slobodno to uradite.

## 1. Kreirati funkciju koja kreira Bank objekat. Bank objekat ima sljedece properties:

○ ID → number

○ name → string

○ location → string

○ accounts → array

○ transactions → array

○ createAccount → function

○ deleteAccount → function

○ deposit → function

○ withdraw → function

○ checkBalance → function

RESTRIKCIJE:

○ Svaka uplata, isplata i provjera stanja se mora pratiti.

## 2. Napisati funkciju koja nam kreira Person objekat. Person ima sljedece properties:

○ ID → number

○ firstName → string

○ lastName → string

○ JMBG → string

RESTRIKCIJE:

○ Za imena koristiti imena iz ovog fajla: employees.txt

## 3. Napisati funkciju koja kreira Account objekat. Account ima sljedece properties:

○ ID → number

○ owner → number

○ bank → number

○ balance → number

○ deposit → function

○ withdraw → function

## 4. Napisati funkciju koja kreira Transaction objekat. Transaction ima sljedece properties:

○ ID → number

○ type → string

○ account → number

○ person → number

○ amount → number

RESTRIKCIJE:

○ Type moze biti jedna od 3 opcije: DEPOSIT, WITHDRAW i BALANCE_CHECK.

## 5. Kreirati globalni objekat koji ce nam igrati ulogu baze podataka.

## TESTIRANJE APLIKACIJE

1. Kreirati 3 Bank objekata.
2. Kreirati 100 Person objekata.
3. Kreirati 100 Account objekata, s tim da ih mozete rasporediti po Bank-ama
kako god zelite.
4. Izvrsiti najmanje po 10 transakcija nad svakim Account-om. S tim da morate
iskoristiti sve 3 tipa transakcije.
5. Napisati funkciju koja ispisuje odredjeni Account iz neke banke, i ispisuje sve
njegove transakcije i to na nacin da su informacije jasno prezentovane.
6. Svaki unos u ovom dijelu testiranja aplikacije tretirati kao da korisnik unosi
podatke. Imajte na umu da cu vam pokusati slomiti aplikaciju. :)
