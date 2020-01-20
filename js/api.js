var competitionUrl = "https://api.football-data.org/v2/competitions/2002/"; //2002 adalah endpoint untuk liga jerman
var timUrl = "https://api.football-data.org/v2/teams/"

const fetchAPI = url => {
  return fetch(url, {
    headers: {
      'X-Auth-Token': "26859f7558404171bd8fb9484c7a4cb8"
    }
  });
};

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}
// Blok kode untuk melakukan request data json

function getStandings() {
  fetchAPI(competitionUrl + "standings" )
    .then(status)
    .then(json)
    .then(function(data) {
      var teams = [];
      var tableRef = document.getElementById('klasemen').getElementsByTagName('tbody')[0];
      data.standings.forEach(function(season) {
        if(season.type == "TOTAL"){
          season.table.forEach(function(standing){
            var baris = ""
            var logo_tim = standing.team.crestUrl.replace(/^http:\/\//i, 'https://')
            baris += `
                  <tr>
                    <td class="center-align">${standing.position}</td>
                    <td class="center-align">
                      <img src="${logo_tim}" class="team-badge" alt="Logo ${standing.team.name}">
                    </td>
                    <td>
                      <a href="tim.html?id=${standing.team.id}">${standing.team.name}</a>
                    </td>
                    <td class="center-align">${standing.points}</td>
                    <td class="center-align">${standing.playedGames}</td>
                    <td class="center-align">${standing.won}</td>
                    <td class="center-align">${standing.lost}</td>
                    <td class="center-align">${standing.draw}</td>
                    <td class="center-align">${standing.goalsFor}</td>
                    <td class="center-align">${standing.goalsAgainst}</td>
                    <td class="center-align">${standing.goalDifference}</td>
                  </tr>
                `;

            var tableHTML = document.getElementById("teams_list").innerHTML + baris;
            document.getElementById("teams_list").innerHTML = tableHTML;

            var team = {
                        id: standing.team.id,
                        name: standing.team.name,
                        badge: standing.team.crestUrl
                      }
            teams.push(team);

          })
        }
      });
      document.getElementById("last_updated").innerHTML = "Terakhir diperbarui:  " +  data.competition.lastUpdated;
    })
    .catch(error);
}

function getTeamById() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  fetchAPI( timUrl + idParam )
    .then(status)
    .then(json)
    .then(function(data) {
      var teamHTML = '';
      var logo_tim = data.crestUrl.replace(/^http:\/\//i, 'https://');
      teamHTML = `
            <h4>${data.tla} - ${data.name}</h4>
              <img src="${logo_tim}" class="team-logo">
            <p>
              <strong>Nama Pendek: </strong><br>${data.shortName}
            </p>
            <p>
              <strong>Berdiri sejak: </strong><br>${data.founded}
            </p>
            <p>
              <strong>Negara: </strong><br>${data.area.name}
            </p>
            <p>
              <strong>Alamat: </strong><br>${data.address}
            </p>
            <p>
              <strong>Warna Klub: </strong><br>${data.clubColors}
            </p>
            <p>
              <strong>Stadion Kebanggaan: </strong><br>${data.venue}
            </p>
            <p>
            <strong>Contact: </strong><br>
              Phone: ${data.phone}<br>
              Email: ${data.email}<br>
            </p>
            <p>
              <strong>Website: </strong><br>
              <a href="${data.website}" target="_blank">${data.website}</a>
            </p>
          `
      // console.log(data)
      var playerHTML = '<h4 class="center-align">Pemain</h4>';
      data.squad.forEach(function(player){
        playerHTML += `
            <div class="card vertical">
              <div class="card-content">
                <h5>${player.shirtNumber}</h5>
                <h6>${player.name}</h6>
                <p><strong>${player.position}</strong></p>
                <p>Tanggal Lahir: ${player.countryOfBirth}, ${player.dateOfBirth.substring(0,10)}</p>
                <p>Kebangsaan: ${player.nationality}</p>
                <p>Peran: ${player.role}</p>
              </div>
            </div>
          `
      });
      document.getElementById("profil_tim").innerHTML = teamHTML;
      document.getElementById("pemain").innerHTML = playerHTML;

      var save = document.getElementById("save");
      save.onclick = function() {
        console.log("Tombol save di klik.");
        var team = {
                      id : data.id,
                      name : data.name,
                      area : data.area.name,
                      venue : data.venue,
        }
        dbAddFavTeam(team);
        var toastHTML = `<span>${team.name} telah ditambahkan ke dalam favorit.`;
        M.toast({html: toastHTML});
      };
  })
    .catch(error);
}