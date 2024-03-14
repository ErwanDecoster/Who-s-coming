export default function (stateId: number) {
  if (stateId) {
    const statesName = ['Non envoyée', 'Envoyée', 'Acceptée', 'Decliné', 'Demande en attente', 'Demande refusé', 'supprimé']
    return statesName[stateId - 1];
  }
}