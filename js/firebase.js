// Your web app's Firebase configuration
const firebaseConfig = {
  databaseURL: "https://spider-shooter-game-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();


// ajoute les donnees dans la base de donnees
function sendFirebasePosition(playerId, x, y, r) {
    var listRef = database.ref('players/p' + playerId.toString());
    listRef.set({
        x: x,
        y: y,
        r: r
    })
}

// lire les donnees
function getFirebasePlayers() {
    var listRef = database.ref('players');
    var result = null;
    listRef.get().then((snapshot) => {
    if (snapshot.exists()) {
        result = snapshot.val();
    } else {
        console.log("No data available");
    }
    }).catch((error) => {
        console.error(error);
    });
    return result;
}