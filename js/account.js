var connectedAccount = "";
var fakeAccount = false;

//#region HTML ELEMENTS
var HTMLconnectionPassword = document.getElementById("password-connect");
var HTMLregisterPassword = document.getElementById("password-register");
var HTMLconfirmationPassword = document.getElementById("password-confirm");

var HTMLnameConnect = document.getElementById("name-connect");
var HTMLnameRegister = document.getElementById("name-register");

var HTMLerrorConnect = document.getElementById("error-connect");
var HTMLerrorRegister = document.getElementById("error-register");
//#endregion

// Conversion of an integer to 32bits
function hash(string) {
    //set variable hash as 0
    var hash = 0;
    // if the length of the string is 0, return 0
    if (string.length == 0) return hash;
    for (i = 0 ;i < string.length ; i++)
    {
        ch = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + ch;
        hash = hash & hash;
    }
    return hash;
}

// ajoute les donnees dans la base de donnees
function CreateFirebaseAccount() {
    var error = "";
    var name = HTMLnameRegister.value;
    var password = HTMLregisterPassword.value;

    if (HTMLregisterPassword.value != HTMLconfirmationPassword.value) {
        error = "les mots de passe ne correspondent pas"
    }
    if (password.length < 3) {
        error = "le mot de passe doit contenir au moins 3 caractères"
    }
    if (name.length < 3) {
        error = "le pseudo doit contenir au moins 3 caractères"
    }

    var listRef = database.ref('accounts/' + name);
    listRef.get().then((snapshot) => {
    if (snapshot.exists()) {
        error = "ce nom existe deja";
    } else if (error === "") {
        listRef.set({
            passHash: hash(password)
        }).then(() => {
            connectedAccount = name;
            localStorage.setItem("connectedAccount", name);
        });
    }
    }).then(() => {
        if (error != "") {
            HTMLerrorRegister.innerHTML = "Erreur: " + error + ".";
        } else {
            CloseMenus();
        }
    });
}

function CreateFakeAccount() {
    fakeAccount = true;
    connectedAccount = "player" + (parseInt(Math.random() * 100000)).toString();
    CloseMenus();
}

// ajoute les donnees dans la base de donnees
function ConnectToAccount() {
    var name = HTMLnameConnect.value;
    var password = HTMLconnectionPassword.value;

    var listRef = database.ref('accounts/'+name);
    var error = "";

    listRef.get().then((snapshot) => {
    if (snapshot.exists()) {
        if (snapshot.val().passHash === hash(password)) {
            connectedAccount = name;
            localStorage.setItem("connectedAccount", name);
        } else {
            error = "mot de passe incorrect";
        }
    } else {
        error = "ce compte n'existe pas";
    }
    }).then(() => {
        if (error != "") {
            HTMLerrorConnect.innerHTML = "Erreur: " + error + ".";
        } else {
            CloseMenus();
            deletePlayers();
        }
    });
}

/*//#region START
var listRef = database.ref('accounts/'+localStorage.getItem("connectedAccount"));
listRef.get().then((snapshot) => {
    if (snapshot.exists()) {
        connectedAccount = localStorage.getItem("connectedAccount");
        CloseMenus();
    }
    });
//#endregion*/