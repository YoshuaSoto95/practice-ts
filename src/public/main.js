async function loadSoldiers() {
  const root = document.getElementById("soldiers");
  if (!root) return;

  try {
    const res = await fetch("/api/soldiers");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    root.innerHTML = data
      .map(
        (s) => `
      <article class="card">
        <h3>#${s.id} — ${s.name}</h3>
        <p><span class="badge">Rank:</span> ${s.rank}</p>
        <p><span class="badge">Chapter:</span> ${s.chapter}</p>
      </article>
    `
      )
      .join("");
  } catch (err) {
    root.innerHTML = `<p>Error loading soldiers: ${err.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", loadSoldiers);
