//Membuat database : ligaperancis
var dbPromised = idb.open("ligaperancis", 1, function(upgradeDb) {
  if (!upgradeDb.objectStoreNames.contains("fav_teams")) {
    var teamOS = upgradeDb.createObjectStore("fav_teams",{
      keyPath : "id"
    });
    teamOS.createIndex("id", "id", { unique: true });
  }
});

//Fungsi untuk menambah team
function dbAddFavTeam(team) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("fav_teams", "readwrite");
      var store = tx.objectStore("fav_teams");
      console.log(team.id);
      store.put(team);
      return tx.complete;
    })
    .then(function() {
      console.log("Tim Favorit berhasil ditambahkan.");
    })
    .catch(function(){
      console.log("Tim Favorit gagal ditambahkan.");
    });
}

//Fungsi untuk menampilkan team favorit
function dbGetFavTeam(){
  dbPromised.then(function(db){
    var tx = db.transaction('fav_teams','readonly');
    var store = tx.objectStore('fav_teams');
    return store.getAll();
  }).then(function(teams){
    console.log(teams);
    var teamsHTML = "";
    teams.forEach(function(team){
      teamsHTML += `
          <div class="card vertical">
            <div class="card-content">
              <h5>${team.name}</h5>
              <h6>${team.venue}</h6>
              <a href="#" class="waves-effect waves-light btn orange darken-4"><i class="material-icons right">delete</i>delete</a>
            </div>
          </div>
      `
    });
    document.getElementById("fav_list").innerHTML = teamsHTML;

    const elms = document.getElementById("fav_list").getElementsByClassName("waves-effect waves-light btn");
    for (let i = 0; i < elms.length; i++) {
      elms[i].onclick = () => {
          dbDeleteFavTeam(teams[i].id);
          dbGetFavTeam();
          var toastHTML = `<span>${teams[i].name} telah dihapus dari favorit.`;
          M.toast({html: toastHTML});
      }
    }
  }) 
}

//Fungsi untuk menghapus tim favorit
function dbDeleteFavTeam(team) {
  dbPromised.then(function(db) {
    var tx = db.transaction('fav_teams', 'readwrite');
    var store = tx.objectStore('fav_teams');
    store.delete(team);
    return tx.complete;
  }).then(function() {
    console.log('Tim Favorit telah dihapus dari database');
  });
}