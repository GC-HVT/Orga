export function chargerGroupes() {
  const contenu = document.getElementById('contenu');
  contenu.textContent = "Les groupes sont en cours de chargement...";

  // Simulation : ici tu pourras mettre ton vrai code (API, etc.)
  setTimeout(() => {
    contenu.textContent = "Groupes chargés : Groupe A, Groupe B, Groupe C.";
  }, 1000);
}
