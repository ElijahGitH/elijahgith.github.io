let currentPokemon = null;
let team = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("findBtn").addEventListener("click", findPokemon);
  document.getElementById("addBtn").addEventListener("click", addToTeam);
});

function cacheKey(q){
  return "poke_cache_" + q.toLowerCase();
}

async function getPokemon(q){
  const key = cacheKey(q);
  const saved = localStorage.getItem(key);
  if(saved) return JSON.parse(saved);

  const res = await fetch("https://pokeapi.co/api/v2/pokemon/" + q.toLowerCase());
  if(!res.ok) return null;

  const data = await res.json();
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

async function findPokemon(){
  const q = document.getElementById("searchInput").value.trim();
  if(q === "") return;

  const data = await getPokemon(q);
  if(!data) return;
  currentPokemon = data;

  const img = document.getElementById("pokeImg"); const sprite = data.sprites?.front_default;
   const art = data.sprites?.other?.["official-artwork"]?.front_default;
  img.src = sprite || art || ""; img.alt = data.name || "";

  const audio = document.getElementById("pokeAudio");
  const cry = data.cries?.latest || data.cries?.legacy || "";
  audio.src = cry;
  if(cry) audio.load();

  const moves = data.moves.map(m => m.move.name);

  fillSelect("m1", moves);
  fillSelect("m2", moves);
  fillSelect("m3", moves);
  fillSelect("m4", moves);

  filterNewPokemonAgainstTeamUI();
}

function fillSelect(id, moves){
  const sel = document.getElementById(id);
  sel.innerHTML = "";
  moves.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    sel.appendChild(opt);
  });
}

function addToTeam(){
  if(!currentPokemon) return;
  if(team.length >= 6) return;

  const chosen = [
    document.getElementById("m1").value,
    document.getElementById("m2").value,
    document.getElementById("m3").value,
    document.getElementById("m4").value
  ];

  const item = {
    name: currentPokemon.name,
    img: document.getElementById("pokeImg").src,
    moves: chosen
  };

  team.push(item);
  renderTeam();
}

function renderTeam(){
  const teamArea = document.getElementById("teamArea");
  if(team.length === 0){
    teamArea.innerHTML = "";
    return;
  }

  let html = `<table class="teamTable">`;
  team.forEach(p => {
    html += `
      <tr>
        <td style="width:140px; text-align:center;">
          <img class="teamImg" src="${p.img}" alt="${p.name}">
        </td>
        <td>
          <ul>
            <li>${p.moves[0]}</li>
            <li>${p.moves[2]}</li>
            <li>${p.moves[1]}</li>
            <li>${p.moves[3]}</li>
          </ul>
        </td>
      </tr>
    `;
  });
  html += `</table>`;

  teamArea.innerHTML = html;
}

function filterNewPokemonAgainstTeamUI(){
  const addBtn = document.getElementById("addBtn");
  addBtn.disabled = team.length >= 6;
}
