import { chargerGroupes, chargerMembres } from './membresModule.js';
import { initialiserOrganigramme, ajouterMembresAuDiagramme } from './moduleOrganigramme.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialiser l'organigramme GoJS
  initialiserOrganigramme();

  import { chargerGroupes } from './membresModule.js';

	chargerGroupes().then(groupes => {
	  console.log('Groupes chargés :', groupes);
	}).catch(error => {
	  console.error('Erreur chargement groupes :', error);
	});

	
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
