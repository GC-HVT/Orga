import { chargerGroupes, chargerMembres } from './moduleMembres.js';
import { initialiserOrganigramme, ajouterMembresAuDiagramme } from './moduleOrganigramme.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialiser l'organigramme GoJS
  initialiserOrganigramme();

  // Charger les groupes dans le menu déroulant
  await chargerGroupes();

  // Quand on clique sur "Charger les membres"
  document.getElementById('loadMembersBtn').addEventListener('click', async () => {
    const membres = await chargerMembres(); // Retourne la liste des membres
    if (Array.isArray(membres)) {
      ajouterMembresAuDiagramme(membres); // Ajout automatique au diagramme
    }
  });
});
