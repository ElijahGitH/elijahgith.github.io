let selected_pokemon = null;
let team_list = [];

document.addEventListener("DOMContentLoaded", () => {
  const find_btn = document.getElementById("findBtn");
  const add_btn = document.getElementById("addBtn");

  if (find_btn) find_btn.addEventListener("click", find_pokemon);
  if (add_btn) add_btn.addEventListener("click", add_pokemon_to_team);

  update_add_button_state();
});

function make_cache_key(query) {
  return "poke_cache_" + String(query).toLowerCase();
}

async function fetch_pokemon(query) {
  const key = make_cache_key(query);
  const cached = localStorage.getItem(key);

  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      localStorage.removeItem(key);
    }
  }

  const url = "https://pokeapi.co/api/v2/pokemon/" + String(query).toLowerCase();
  const res = await fetch(url);

  if (!res.ok) return null;

  const data = await res.json();
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

async function find_pokemon() {
  const input = document.getElementById("searchInput");
  const query = input ? input.value.trim() : "";
  if (!query) return;

  const data = await fetch_pokemon(query);
  if (!data) return;

  selected_pokemon = data;

  const img = document.getElementById("pokeImg");
  const sprite = data.sprites?.front_default;
  const artwork = data.sprites?.other?.["official-artwork"]?.front_default;

  if (img) {
    img.src = sprite || artwork || "";
    img.alt = data.name || "";
  }

  const audio = document.getElementById("pokeAudio");
  const cry_url = data.cries?.latest || data.cries?.legacy || "";

  if (audio) {
    audio.src = cry_url;
    if (cry_url) audio.load();
  }

  const move_names = (data.moves || []).map((m) => m.move.name);

  populate_move_dropdown("m1", move_names);
  populate_move_dropdown("m2", move_names);
  populate_move_dropdown("m3", move_names);
  populate_move_dropdown("m4", move_names);

  update_add_button_state();
}

function populate_move_dropdown(select_id, move_names) {
  const select = document.getElementById(select_id);
  if (!select) return;

  select.innerHTML = "";
  move_names.forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
}

function add_pokemon_to_team() {
  if (!selected_pokemon) return;
  if (team_list.length >= 6) return;

  const chosen_moves = [
    document.getElementById("m1")?.value || "",
    document.getElementById("m2")?.value || "",
    document.getElementById("m3")?.value || "",
    document.getElementById("m4")?.value || ""
  ];

  const team_entry = {
    name: selected_pokemon.name,
    img: document.getElementById("pokeImg")?.src || "",
    moves: chosen_moves
  };

  team_list.push(team_entry);
  render_team();
  update_add_button_state();
}

function render_team() {
  const team_area = document.getElementById("teamArea");
  if (!team_area) return;

  if (team_list.length === 0) {
    team_area.innerHTML = "";
    return;
  }
// had to look this up below for table class just to get the right alignmenet
  let html = `<table class="teamTable">`;

  team_list.forEach((p) => {
    html += `
      <tr>
        <td style="width:140px; text-align:center;">
          <img class="teamImg" src="${p.img}" alt="${p.name}">
        </td>
        <td>
          <ul>
            <li>${p.moves[0] || ""}</li>
            <li>${p.moves[2] || ""}</li>
            <li>${p.moves[1] || ""}</li>
            <li>${p.moves[3] || ""}</li>
          </ul>
        </td>
      </tr>
    `;
  });

  html += `</table>`;
  team_area.innerHTML = html;
}

function update_add_button_state() {
  const add_btn = document.getElementById("addBtn");
  if (!add_btn) return;

  add_btn.disabled = team_list.length >= 6;
}