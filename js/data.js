// ===== DATI INIZIALI =====
const STORAGE_KEY = 'ricettario_v3';

const ricetteDefault = [
  {
    id: 1,
    titolo: 'Spaghetti alla Carbonara',
    categoria: 'primo',
    desc: 'Il classico romano: uova, guanciale, pecorino e pepe nero. Cremosa senza panna.',
    origine: 'Roma',
    difficolta: 'medio',
    tags: ['tradizionale', 'veloce'],
    note: 'Usare solo guanciale, non pancetta. La temperatura è fondamentale per non stracciare le uova.',
    porzioni: 4,
    rating: 5,
    ingredienti: [
      { nome: 'Spaghetti', qty: 400, um: 'g' },
      { nome: 'Guanciale', qty: 200, um: 'g' },
      { nome: 'Uova intere', qty: 2, um: 'pz' },
      { nome: 'Tuorli', qty: 4, um: 'pz' },
      { nome: 'Pecorino romano', qty: 100, um: 'g' },
      { nome: 'Pepe nero macinato', qty: 1, um: 'cucchiaino' }
    ],
    fasi: [
      { desc: 'Tagliare il guanciale a listarelle e rosolarlo in padella senza olio a fuoco medio fino a renderlo croccante.', cottura: 8, riposo: 0, tipo: 'cottura' },
      { desc: 'Cuocere gli spaghetti in abbondante acqua salata.', cottura: 10, riposo: 0, tipo: 'cottura' },
      { desc: 'Sbattere le uova con i tuorli, il pecorino grattugiato e abbondante pepe nero macinato fresco.', cottura: 0, riposo: 0, tipo: 'preparazione' },
      { desc: 'Scolare la pasta al dente conservando un mestolo di acqua di cottura. Mantecare fuori dal fuoco con il guanciale e il composto di uova, aggiungendo acqua a filo per ottenere una crema.', cottura: 2, riposo: 0, tipo: 'mantecatura' }
    ]
  },
  {
    id: 2,
    titolo: 'Tiramisù Classico',
    categoria: 'dolce',
    desc: 'Il dessert italiano per eccellenza: mascarpone, savoiardi, caffè e cacao.',
    origine: 'Veneto',
    difficolta: 'facile',
    tags: ['classico', 'senza cottura', 'da preparare prima'],
    note: 'Preparare almeno 4 ore prima del servizio, meglio il giorno prima.',
    porzioni: 6,
    rating: 5,
    ingredienti: [
      { nome: 'Mascarpone', qty: 500, um: 'g' },
      { nome: 'Uova', qty: 4, um: 'pz' },
      { nome: 'Zucchero', qty: 100, um: 'g' },
      { nome: 'Savoiardi', qty: 300, um: 'g' },
      { nome: 'Caffè espresso', qty: 300, um: 'ml' },
      { nome: 'Cacao amaro', qty: 30, um: 'g' }
    ],
    fasi: [
      { desc: 'Preparare il caffè e lasciarlo raffreddare completamente.', cottura: 0, riposo: 15, tipo: 'preparazione' },
      { desc: 'Montare i tuorli con lo zucchero fino ad ottenere un composto chiaro e spumoso.', cottura: 0, riposo: 0, tipo: 'preparazione' },
      { desc: 'Incorporare il mascarpone alla crema di tuorli, poi aggiungere delicatamente gli albumi montati a neve con movimenti dal basso verso l\'alto.', cottura: 0, riposo: 0, tipo: 'preparazione' },
      { desc: 'Inzuppare rapidamente i savoiardi nel caffè e disporli in uno strato uniforme nella teglia. Coprire con la crema al mascarpone, ripetere gli strati.', cottura: 0, riposo: 0, tipo: 'assemblaggio' },
      { desc: 'Spolverare con cacao amaro e riporre in frigorifero coperto con pellicola.', cottura: 0, riposo: 240, tipo: 'riposo' }
    ]
  },
  {
    id: 3,
    titolo: 'Pollo alla Cacciatora',
    categoria: 'secondo',
    desc: 'Pollo brasato con pomodoro, olive, capperi e vino bianco. Un classico della domenica.',
    origine: 'Toscana',
    difficolta: 'medio',
    tags: ['domenicale', 'invernale', 'brasato'],
    note: 'Con del pane casereccio per fare la scarpetta è ancora migliore.',
    porzioni: 4,
    rating: 4,
    ingredienti: [
      { nome: 'Pollo (pezzi)', qty: 1.2, um: 'kg' },
      { nome: 'Pomodori pelati', qty: 400, um: 'g' },
      { nome: 'Olive nere denocciolate', qty: 80, um: 'g' },
      { nome: 'Capperi sotto sale', qty: 30, um: 'g' },
      { nome: 'Vino bianco secco', qty: 150, um: 'ml' },
      { nome: 'Cipolla', qty: 1, um: 'pz' },
      { nome: 'Aglio', qty: 2, um: 'spicchio' },
      { nome: 'Rosmarino', qty: 1, um: 'rametto' },
      { nome: 'Olio EVO', qty: 3, um: 'cucchiaio' }
    ],
    fasi: [
      { desc: 'Rosolare i pezzi di pollo in olio extravergine con aglio schiacciato e rosmarino fino a doratura su tutti i lati. Salare e pepare.', cottura: 12, riposo: 0, tipo: 'cottura' },
      { desc: 'Aggiungere la cipolla tritata e lasciarla appassire, poi sfumare con il vino bianco e lasciarlo evaporare.', cottura: 4, riposo: 0, tipo: 'cottura' },
      { desc: 'Unire i pomodori pelati spezzettati, le olive e i capperi sciacquati. Mescolare bene.', cottura: 0, riposo: 0, tipo: 'assemblaggio' },
      { desc: 'Cuocere a fuoco basso con il coperchio, girando i pezzi di pollo ogni tanto.', cottura: 40, riposo: 0, tipo: 'cottura' },
      { desc: 'Togliere il coperchio e lasciare restringere il sugo se necessario. Riposare 5 minuti prima di servire.', cottura: 5, riposo: 5, tipo: 'riposo' }
    ]
  }
];

// ===== GESTIONE DATI =====
function loadRicette() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { return JSON.parse(saved); }
    catch (e) { return [...ricetteDefault]; }
  }
  return [...ricetteDefault];
}

function saveRicette(ricette) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ricette));
}
