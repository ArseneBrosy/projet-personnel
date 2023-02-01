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
    listRef.set({
        x: x,
        y: y,
        r: r
    });
}

function deletePlayers() {
    var listRef = database.ref('players');
    listRef.remove();
}