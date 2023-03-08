// Your web app's Firebase configuration
const firebaseConfig = {
  databaseURL: "https://spider-shooter-game-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();


// ajoute les donnees dans la base de donnees
function sendFirebasePosition(name, x, y, r) {
    var listRef = database.ref('players/' + name);
    listRef.update({
        x: x,
        y: y,
        r: r
    });
}

function hitPlayer(name, pv, _killer) {
    var listRef = database.ref('players/' + name);
    var _life = 0;
    listRef.get().then((snapshot) => {
        if (snapshot.exists() && snapshot.val().life != null) {
            _life = snapshot.val().life;
        }
    }).then(() => {
        listRef.set({
            life: _life + pv,
            killer: _killer
        })
    });
}

function sendFirebaseBullets(name, bullets) {
    var listRef = database.ref('players-bullets/' + name);
    listRef.set(Object.assign(bullets));
}

function deletePlayers() {
    var listRef = database.ref('players');
    listRef.remove();
    var listRef = database.ref('players-bullets');
    listRef.remove();
}