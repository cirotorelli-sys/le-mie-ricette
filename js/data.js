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
    catch (e) { return [...ricetteAllDefault]; }
  }
  return [...ricetteAllDefault];
}

function saveRicette(ricette) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ricette));
}

// Merge default + extra recipes
const ricetteExtra = [
  { id:4,titolo:'Bruschetta al Pomodoro',categoria:'antipasto',desc:'Il classico antipasto italiano: pane tostato, pomodoro fresco, aglio e basilico.',origine:'Lazio',difficolta:'facile',tags:['veloce','estivo','vegetariano'],note:'Usare pane casereccio o pugliese per un risultato migliore.',porzioni:4,rating:5,ingredienti:[{nome:'Pane casereccio',qty:8,um:'fetta'},{nome:'Pomodori maturi',qty:400,um:'g'},{nome:'Aglio',qty:2,um:'spicchio'},{nome:'Basilico fresco',qty:10,um:'foglia'},{nome:'Olio EVO',qty:4,um:'cucchiaio'},{nome:'Sale',qty:1,um:'pizzico'}],fasi:[{desc:'Tagliare i pomodori a cubetti, condire con sale e olio e lasciar riposare 10 minuti.',cottura:0,riposo:10,tipo:'preparazione'},{desc:'Tostare le fette di pane sulla griglia o nel forno fino a doratura.',cottura:5,riposo:0,tipo:'cottura'},{desc:'Strofinare con aglio, versare il pomodoro e guarnire con basilico.',cottura:0,riposo:0,tipo:'impiattamento'}]},
  { id:5,titolo:'Caprese Classica',categoria:'antipasto',desc:'Mozzarella di bufala, pomodori e basilico. Semplice, fresco e irresistibile.',origine:'Campania',difficolta:'facile',tags:['estivo','senza cottura','vegetariano'],note:'La qualità degli ingredienti fa tutto: mozzarella di bufala DOP e pomodori maturi.',porzioni:4,rating:5,ingredienti:[{nome:'Mozzarella di bufala',qty:500,um:'g'},{nome:'Pomodori cuore di bue',qty:4,um:'pz'},{nome:'Basilico fresco',qty:15,um:'foglia'},{nome:'Olio EVO',qty:3,um:'cucchiaio'},{nome:'Sale e pepe',qty:1,um:'pizzico'}],fasi:[{desc:'Affettare i pomodori e la mozzarella a fette spesse circa 1 cm.',cottura:0,riposo:0,tipo:'preparazione'},{desc:'Disporre alternando fette di pomodoro e mozzarella su un piatto da portata.',cottura:0,riposo:0,tipo:'impiattamento'},{desc:'Condire con olio EVO, sale, pepe e decorare con foglie di basilico fresco.',cottura:0,riposo:0,tipo:'impiattamento'}]},
  { id:6,titolo:'Supplì al Telefono',categoria:'antipasto',desc:'Le iconiche crocchette di riso romane ripiene di mozzarella filante e ragù.',origine:'Roma',difficolta:'difficile',tags:['fritto','romano','street food'],note:'Il nome "al telefono" viene dal filo di mozzarella che si forma aprendoli.',porzioni:6,rating:5,ingredienti:[{nome:'Riso Carnaroli',qty:400,um:'g'},{nome:'Ragù di carne',qty:300,um:'g'},{nome:'Mozzarella',qty:200,um:'g'},{nome:'Uova',qty:3,um:'pz'},{nome:'Pangrattato',qty:200,um:'g'},{nome:'Parmigiano',qty:80,um:'g'},{nome:'Olio per friggere',qty:500,um:'ml'}],fasi:[{desc:'Cuocere il riso nel ragù aggiungendo brodo come un risotto. Mantecare con parmigiano e lasciare raffreddare.',cottura:20,riposo:60,tipo:'cottura'},{desc:'Formare delle crocchette ovali inserendo al centro un cubetto di mozzarella.',cottura:0,riposo:0,tipo:'assemblaggio'},{desc:'Passare nell\'uovo sbattuto e poi nel pangrattato.',cottura:0,riposo:0,tipo:'preparazione'},{desc:'Friggere in olio profondo a 175°C fino a doratura.',cottura:6,riposo:0,tipo:'cottura'}]},
  { id:7,titolo:'Amatriciana',categoria:'primo',desc:'Pasta con guanciale croccante, pomodoro San Marzano e pecorino romano.',origine:'Amatrice (Rieti)',difficolta:'facile',tags:['tradizionale','romano'],note:'Rigorosamente senza cipolla! Il formato originale è i bucatini.',porzioni:4,rating:5,ingredienti:[{nome:'Bucatini',qty:400,um:'g'},{nome:'Guanciale',qty:200,um:'g'},{nome:'Pomodori San Marzano',qty:400,um:'g'},{nome:'Pecorino romano',qty:80,um:'g'},{nome:'Vino bianco secco',qty:50,um:'ml'},{nome:'Peperoncino',qty:1,um:'pz'}],fasi:[{desc:'Rosolare il guanciale a listarelle con il peperoncino senza olio. Sfumare con vino bianco.',cottura:8,riposo:0,tipo:'cottura'},{desc:'Aggiungere i pomodori San Marzano schiacciati e cuocere il sugo a fuoco medio.',cottura:15,riposo:0,tipo:'cottura'},{desc:'Cuocere i bucatini in acqua salata e scolarli al dente.',cottura:12,riposo:0,tipo:'cottura'},{desc:'Mantecare nel sugo con pecorino grattugiato e acqua di cottura.',cottura:2,riposo:0,tipo:'mantecatura'}]},
  { id:8,titolo:'Risotto alla Milanese',categoria:'primo',desc:'Il celebre risotto giallo con zafferano, simbolo della cucina milanese.',origine:'Milano',difficolta:'medio',tags:['classico','elegante','milanese'],note:'Lo zafferano va sciolto in poco brodo caldo prima di aggiungerlo.',porzioni:4,rating:4,ingredienti:[{nome:'Riso Carnaroli',qty:320,um:'g'},{nome:'Brodo di carne',qty:1.2,um:'l'},{nome:'Zafferano',qty:1,um:'pizzico'},{nome:'Cipolla',qty:1,um:'pz'},{nome:'Vino bianco secco',qty:100,um:'ml'},{nome:'Burro',qty:80,um:'g'},{nome:'Parmigiano',qty:80,um:'g'}],fasi:[{desc:'Sciogliere lo zafferano in una tazzina di brodo caldo e tenere da parte.',cottura:0,riposo:5,tipo:'preparazione'},{desc:'Soffriggere la cipolla tritata in metà burro fino a renderla trasparente.',cottura:5,riposo:0,tipo:'cottura'},{desc:'Tostare il riso, sfumare con vino bianco e aggiungere brodo un mestolo alla volta. A metà cottura unire lo zafferano.',cottura:18,riposo:0,tipo:'cottura'},{desc:'Mantecare con il burro rimasto e il parmigiano. Riposare 2 minuti.',cottura:0,riposo:2,tipo:'mantecatura'}]},
  { id:9,titolo:'Lasagne al Ragù',categoria:'primo',desc:'Le lasagne della domenica: sfoglia all\'uovo, ragù bolognese, besciamella e parmigiano.',origine:'Bologna',difficolta:'difficile',tags:['domenicale','forno','bolognese'],note:'Prepara il ragù il giorno prima per un sapore più intenso.',porzioni:6,rating:5,ingredienti:[{nome:'Sfoglia per lasagne',qty:400,um:'g'},{nome:'Carne macinata mista',qty:500,um:'g'},{nome:'Passata di pomodoro',qty:500,um:'ml'},{nome:'Latte intero',qty:500,um:'ml'},{nome:'Burro',qty:50,um:'g'},{nome:'Farina 00',qty:50,um:'g'},{nome:'Parmigiano',qty:150,um:'g'},{nome:'Cipolla',qty:1,um:'pz'},{nome:'Carota',qty:1,um:'pz'},{nome:'Sedano',qty:1,um:'rametto'},{nome:'Vino rosso',qty:100,um:'ml'}],fasi:[{desc:'Soffriggere cipolla, carota e sedano. Rosolare la carne, sfumare con vino rosso e aggiungere passata. Cuocere a fuoco lento.',cottura:90,riposo:0,tipo:'cottura'},{desc:'Preparare la besciamella sciogliendo burro, aggiungendo farina e poi latte caldo a filo, mescolando fino ad addensare.',cottura:10,riposo:0,tipo:'cottura'},{desc:'Alternare in teglia strati di sfoglia, ragù, besciamella e parmigiano. Finire con besciamella e parmigiano.',cottura:0,riposo:0,tipo:'assemblaggio'},{desc:'Cuocere in forno a 180°C coperto 30 min, poi scoperto 15 min fino a gratinatura.',cottura:45,riposo:10,tipo:'cottura'}]},
  { id:10,titolo:'Cacio e Pepe',categoria:'primo',desc:'Tre ingredienti, tecnica precisa. La pasta romana più difficile da fare bene.',origine:'Roma',difficolta:'medio',tags:['romano','veloce','tradizionale'],note:'Il segreto è la temperatura: fuori dal fuoco per amalgamare il formaggio.',porzioni:4,rating:5,ingredienti:[{nome:'Tonnarelli o spaghetti',qty:400,um:'g'},{nome:'Pecorino romano',qty:150,um:'g'},{nome:'Pepe nero in grani',qty:2,um:'cucchiaino'}],fasi:[{desc:'Tostare il pepe in grani in padella, poi pestarlo grossolanamente nel mortaio.',cottura:2,riposo:0,tipo:'preparazione'},{desc:'Cuocere la pasta in poca acqua salata. Grattugiare finemente il pecorino.',cottura:10,riposo:0,tipo:'cottura'},{desc:'In padella tostare il pepe con acqua di cottura. Scolare la pasta al dente e versarla in padella.',cottura:2,riposo:0,tipo:'mantecatura'},{desc:'Fuori dal fuoco aggiungere il pecorino mescolando energicamente con acqua di cottura fino a formare una crema liscia.',cottura:0,riposo:0,tipo:'mantecatura'}]},
  { id:11,titolo:'Ossobuco alla Milanese',categoria:'secondo',desc:'Stinco di vitello brasato con gremolata di limone, aglio e prezzemolo.',origine:'Milano',difficolta:'medio',tags:['invernale','brasato','milanese'],note:'Ottimo con il risotto alla milanese per il piatto completo.',porzioni:4,rating:5,ingredienti:[{nome:'Ossobuco di vitello',qty:4,um:'pz'},{nome:'Cipolla',qty:1,um:'pz'},{nome:'Carota',qty:1,um:'pz'},{nome:'Sedano',qty:1,um:'rametto'},{nome:'Vino bianco secco',qty:200,um:'ml'},{nome:'Brodo di carne',qty:300,um:'ml'},{nome:'Farina 00',qty:50,um:'g'},{nome:'Aglio',qty:1,um:'spicchio'},{nome:'Prezzemolo',qty:1,um:'rametto'},{nome:'Limone (scorza)',qty:1,um:'pz'}],fasi:[{desc:'Infarinare gli ossibuchi e rosolarli in olio e burro da entrambi i lati. Riservare.',cottura:10,riposo:0,tipo:'cottura'},{desc:'Soffriggere cipolla, carota e sedano. Rimettere gli ossibuchi, sfumare con vino bianco.',cottura:5,riposo:0,tipo:'cottura'},{desc:'Aggiungere il brodo e cuocere a fuoco lento con coperchio.',cottura:75,riposo:0,tipo:'cottura'},{desc:'Preparare la gremolata tritando aglio, prezzemolo e scorza di limone. Cospargere prima di servire.',cottura:0,riposo:0,tipo:'impiattamento'}]},
  { id:12,titolo:'Saltimbocca alla Romana',categoria:'secondo',desc:'Fettine di vitello con prosciutto crudo e salvia, cotte nel burro e vino bianco.',origine:'Roma',difficolta:'facile',tags:['veloce','romano','elegante'],note:'Il nome significa "salta in bocca" — irresistibili!',porzioni:4,rating:4,ingredienti:[{nome:'Fettine di vitello',qty:8,um:'pz'},{nome:'Prosciutto crudo',qty:8,um:'fetta'},{nome:'Salvia fresca',qty:8,um:'foglia'},{nome:'Burro',qty:60,um:'g'},{nome:'Vino bianco secco',qty:100,um:'ml'},{nome:'Farina 00',qty:30,um:'g'}],fasi:[{desc:'Battere le fettine, posizionare su ognuna una fetta di prosciutto e una foglia di salvia. Fissare con uno stuzzicadenti.',cottura:0,riposo:0,tipo:'preparazione'},{desc:'Infarinare leggermente dal lato della carne.',cottura:0,riposo:0,tipo:'preparazione'},{desc:'Sciogliere il burro e cuocere prima dal lato del prosciutto poi dall\'altro. Sfumare con vino bianco.',cottura:8,riposo:0,tipo:'cottura'},{desc:'Servire subito con il fondo di cottura.',cottura:0,riposo:0,tipo:'impiattamento'}]},
  { id:13,titolo:'Branzino al Forno con Patate',categoria:'secondo',desc:'Pesce fresco al forno con patate, olive, capperi e pomodorini.',origine:'Mediterranea',difficolta:'facile',tags:['pesce','forno','leggero'],note:'Il branzino è pronto quando la carne si stacca facilmente dalla lisca.',porzioni:4,rating:4,ingredienti:[{nome:'Branzino intero',qty:2,um:'pz'},{nome:'Patate',qty:600,um:'g'},{nome:'Pomodorini',qty:200,um:'g'},{nome:'Olive nere',qty:60,um:'g'},{nome:'Capperi',qty:20,um:'g'},{nome:'Aglio',qty:3,um:'spicchio'},{nome:'Prezzemolo',qty:1,um:'rametto'},{nome:'Olio EVO',qty:4,um:'cucchiaio'}],fasi:[{desc:'Affettare le patate sottili e cuocerle in forno a 200°C con olio e aglio per 15 minuti.',cottura:15,riposo:0,tipo:'cottura'},{desc:'Pulire il branzino, salare e pepare dentro e fuori. Inserire prezzemolo e aglio nella pancia.',cottura:0,riposo:0,tipo:'preparazione'},{desc:'Adagiare il branzino sulle patate, aggiungere pomodorini, olive e capperi. Irrorare con olio.',cottura:0,riposo:0,tipo:'assemblaggio'},{desc:'Cuocere in forno a 200°C. Riposare 5 minuti prima di servire.',cottura:25,riposo:5,tipo:'cottura'}]},
  { id:14,titolo:'Parmigiana di Melanzane',categoria:'contorno',desc:'Melanzane fritte a strati con sugo, mozzarella e parmigiano. Un capolavoro del Sud.',origine:'Sicilia / Campania',difficolta:'medio',tags:['estivo','vegetariano','forno'],note:'Preparare il giorno prima — riscaldata è ancora più buona!',porzioni:6,rating:5,ingredienti:[{nome:'Melanzane',qty:1.2,um:'kg'},{nome:'Passata di pomodoro',qty:600,um:'ml'},{nome:'Mozzarella',qty:300,um:'g'},{nome:'Parmigiano',qty:100,um:'g'},{nome:'Basilico fresco',qty:15,um:'foglia'},{nome:'Aglio',qty:2,um:'spicchio'},{nome:'Olio per friggere',qty:400,um:'ml'}],fasi:[{desc:'Affettare le melanzane a 5mm, salarle e lasciarle spurgare 30 minuti. Asciugarle bene.',cottura:0,riposo:30,tipo:'preparazione'},{desc:'Friggere le melanzane in olio caldo fino a doratura.',cottura:20,riposo:0,tipo:'cottura'},{desc:'Preparare un sugo semplice con aglio e passata, cuocere 15 minuti con basilico.',cottura:15,riposo:0,tipo:'cottura'},{desc:'Alternare strati di melanzane, sugo, mozzarella e parmigiano. Finire con sugo e parmigiano.',cottura:0,riposo:0,tipo:'assemblaggio'},{desc:'Cuocere in forno a 180°C. Riposare almeno 20 minuti prima di servire.',cottura:30,riposo:20,tipo:'cottura'}]},
  { id:15,titolo:'Patate al Forno Croccanti',categoria:'contorno',desc:'Patate dorate e croccanti fuori, morbide dentro.',origine:'Italiana',difficolta:'facile',tags:['veloce','forno','vegetariano'],note:'Il segreto: asciugare bene le patate e non sovraffollare la teglia.',porzioni:4,rating:4,ingredienti:[{nome:'Patate a pasta gialla',qty:800,um:'g'},{nome:'Rosmarino',qty:2,um:'rametto'},{nome:'Aglio',qty:3,um:'spicchio'},{nome:'Olio EVO',qty:4,um:'cucchiaio'},{nome:'Sale e pepe',qty:1,um:'pizzico'}],fasi:[{desc:'Tagliare le patate a spicchi. Lessarle in acqua salata 5 minuti, scolare e asciugare bene.',cottura:5,riposo:5,tipo:'preparazione'},{desc:'Condire con olio, sale, pepe, rosmarino e aglio. Disporre in teglia senza sovrapporle.',cottura:0,riposo:0,tipo:'preparazione'},{desc:'Cuocere in forno a 220°C girandole a metà cottura.',cottura:40,riposo:0,tipo:'cottura'}]},
  { id:16,titolo:'Peperonata',categoria:'contorno',desc:'Peperoni colorati in umido con pomodoro e cipolla. Ottima calda o fredda.',origine:'Italiana',difficolta:'facile',tags:['estivo','vegetariano','colorato'],note:'Ottima anche come condimento per la pasta o su crostini.',porzioni:4,rating:4,ingredienti:[{nome:'Peperoni misti',qty:800,um:'g'},{nome:'Cipolla rossa',qty:2,um:'pz'},{nome:'Pomodori pelati',qty:300,um:'g'},{nome:'Aglio',qty:2,um:'spicchio'},{nome:'Basilico',qty:8,um:'foglia'},{nome:'Olio EVO',qty:3,um:'cucchiaio'}],fasi:[{desc:'Lavare e tagliare i peperoni a strisce eliminando semi e filamenti.',cottura:0,riposo:0,tipo:'preparazione'},{desc:'Soffriggere aglio e cipolla affettata nell\'olio.',cottura:5,riposo:0,tipo:'cottura'},{desc:'Aggiungere i peperoni e cuocere a fuoco medio 10 minuti.',cottura:10,riposo:0,tipo:'cottura'},{desc:'Unire i pomodori pelati e cuocere a fuoco basso fino a quando i peperoni sono morbidi. Aggiungere basilico.',cottura:25,riposo:0,tipo:'cottura'}]},
  { id:17,titolo:'Panna Cotta',categoria:'dolce',desc:'Dolce al cucchiaio cremoso e delicato, con coulis di frutti di bosco.',origine:'Piemonte',difficolta:'facile',tags:['senza forno','elegante','da preparare prima'],note:'Preparare almeno 4 ore prima. La colla di pesce deve essere ben ammollata.',porzioni:6,rating:4,ingredienti:[{nome:'Panna fresca',qty:500,um:'ml'},{nome:'Latte intero',qty:100,um:'ml'},{nome:'Zucchero',qty:60,um:'g'},{nome:'Colla di pesce',qty:8,um:'g'},{nome:'Vaniglia (baccello)',qty:1,um:'pz'},{nome:'Frutti di bosco misti',qty:200,um:'g'},{nome:'Zucchero a velo',qty:30,um:'g'}],fasi:[{desc:'Ammollare la colla di pesce in acqua fredda per 10 minuti.',cottura:0,riposo:10,tipo:'preparazione'},{desc:'Scaldare panna, latte, zucchero e vaniglia fino quasi ad ebollizione.',cottura:5,riposo:0,tipo:'cottura'},{desc:'Sciogliere la colla di pesce nel composto caldo. Filtrare e versare negli stampini.',cottura:0,riposo:0,tipo:'assemblaggio'},{desc:'Riporre in frigorifero fino a solidificazione completa.',cottura:0,riposo:240,tipo:'riposo'},{desc:'Sformare e servire con coulis di frutti di bosco frullati con zucchero a velo.',cottura:0,riposo:0,tipo:'impiattamento'}]},
  { id:18,titolo:'Torta della Nonna',categoria:'dolce',desc:'Frolla friabile con crema pasticcera alla vaniglia e pinoli tostati.',origine:'Toscana',difficolta:'medio',tags:['forno','classico','domenicale'],note:'La crema deve essere ben fredda prima di assemblare la torta.',porzioni:8,rating:5,ingredienti:[{nome:'Farina 00',qty:300,um:'g'},{nome:'Burro',qty:150,um:'g'},{nome:'Zucchero',qty:100,um:'g'},{nome:'Uova',qty:3,um:'pz'},{nome:'Latte intero',qty:500,um:'ml'},{nome:'Amido di mais',qty:40,um:'g'},{nome:'Vaniglia',qty:1,um:'pz'},{nome:'Pinoli',qty:60,um:'g'},{nome:'Zucchero a velo',qty:20,um:'g'}],fasi:[{desc:'Preparare la frolla: sabbiare farina e burro freddo, aggiungere zucchero e uova. Riposare in frigo.',cottura:0,riposo:30,tipo:'preparazione'},{desc:'Preparare la crema pasticcera: scaldare latte con vaniglia, sbattere tuorli con zucchero e amido, aggiungere latte caldo e cuocere fino ad addensare.',cottura:10,riposo:30,tipo:'cottura'},{desc:'Stendere metà frolla nella teglia, versare la crema fredda e coprire con l\'altra metà.',cottura:0,riposo:0,tipo:'assemblaggio'},{desc:'Cospargere di pinoli e cuocere in forno a 175°C.',cottura:35,riposo:0,tipo:'cottura'},{desc:'Lasciare raffreddare e spolverare con zucchero a velo.',cottura:0,riposo:60,tipo:'riposo'}]},
  { id:19,titolo:'Cannoli Siciliani',categoria:'dolce',desc:'Il dolce siciliano per eccellenza: gusci croccanti ripieni di ricotta e canditi.',origine:'Sicilia',difficolta:'difficile',tags:['siciliano','fritto','tradizionale'],note:'Riempire i cannoli solo al momento di servire per mantenere il guscio croccante.',porzioni:12,rating:5,ingredienti:[{nome:'Farina 00',qty:250,um:'g'},{nome:'Strutto',qty:50,um:'g'},{nome:'Vino Marsala',qty:60,um:'ml'},{nome:'Zucchero',qty:30,um:'g'},{nome:'Ricotta di pecora',qty:500,um:'g'},{nome:'Zucchero a velo',qty:150,um:'g'},{nome:'Gocce di cioccolato',qty:80,um:'g'},{nome:'Canditi',qty:50,um:'g'},{nome:'Olio per friggere',qty:500,um:'ml'}],fasi:[{desc:'Impastare farina, strutto, zucchero e Marsala. Riposare in frigo avvolto nella pellicola.',cottura:0,riposo:60,tipo:'preparazione'},{desc:'Stendere sottile, ritagliare dischi, avvolgerli sui cannelli e friggere a 175°C fino a doratura.',cottura:4,riposo:0,tipo:'cottura'},{desc:'Sfilare i cannelli caldi e lasciare raffreddare i gusci.',cottura:0,riposo:20,tipo:'preparazione'},{desc:'Mescolare ricotta setacciata con zucchero a velo, gocce di cioccolato e canditi.',cottura:0,riposo:0,tipo:'preparazione'},{desc:'Con la sac à poche riempire i gusci appena prima di servire. Decorare con canditi.',cottura:0,riposo:0,tipo:'impiattamento'}]}
];

const ricetteAllDefault = [...ricetteDefault, ...ricetteExtra];
