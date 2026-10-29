// Content of the For Sure site, created by scripts/seed.mjs.
// `refs` point to an image file name, a page name or "legal-notice".

export const site = { key: "forsure", title: "For Sure", languages: ["en", "fr"] };

export const images = [
  { file: "man-with-dog.jpg", title: "A man and his dog sitting in the grass" },
  { file: "classic-car.jpg", title: "The front of a classic car parked in a street" },
  { file: "cars-at-garage.jpg", title: "Two vintage cars parked in front of yellow garage doors" },
  { file: "van-on-road.jpg", title: "A camper van driving on a busy road" },
  { file: "canal-houses.jpg", title: "Colorful houses along a canal" },
  { file: "living-room.jpg", title: "A furnished room with framed pictures on the wall" },
  { file: "snowy-roofs.jpg", title: "Snow-covered roofs of an old town" },
  { file: "mountain-hiker.jpg", title: "A hiker looking at a mountain valley" },
  { file: "man-by-the-sea.jpg", title: "A man looking at the sea at sunset" },
  { file: "portrait-emma.jpg", title: "Portrait of Emma" },
  { file: "portrait-lea.jpg", title: "Portrait of Léa" },
  { file: "portrait-marc.jpg", title: "Portrait of Marc" },
];

export const pages = [
  { name: "car-insurance", title: { en: "Car insurance", fr: "Assurance auto" } },
  { name: "health-insurance", title: { en: "Health insurance", fr: "Assurance santé" } },
  { name: "home-insurance", title: { en: "Home insurance", fr: "Assurance habitation" } },
];

export const legalNotice = {
  name: "legal-notice",
  type: "jnt:bigText",
  i18n: {
    en: {
      text: "<p><small>For Sure Insurance SA is a fictional company. Cover is subject to the terms and exclusions of your policy. Read the policy documents before you sign.</small></p>",
    },
    fr: {
      text: "<p><small>For Sure Assurances SA est une entreprise fictive. Les garanties s'appliquent selon les conditions et exclusions de votre contrat. Lisez les documents contractuels avant de signer.</small></p>",
    },
  },
};

const area = (name, children) => ({ name, type: "jnt:contentList", children });

const hero = (name, { title, subtitle, image, cta }) => ({
  name,
  type: "forsure:hero",
  // `subtitle` and `ctaLink` are not translated: one value for all languages
  props: { subtitle, ctaLink: cta.link },
  i18n: {
    en: { "jcr:title": title.en, "ctaLabel": cta.label.en },
    fr: { "jcr:title": title.fr, "ctaLabel": cta.label.fr },
  },
  refs: { background: image },
});

const section = (name, { title, subtitle, layout }, children) => ({
  name,
  type: "forsure:section",
  props: { layout },
  i18n: {
    en: { sectionTitle: title.en, sectionSubtitle: subtitle?.en },
    fr: { sectionTitle: title.fr, sectionSubtitle: subtitle?.fr },
  },
  children,
});

const textCard = (name, { title, body, features }) => ({
  name,
  type: "forsure:textCard",
  i18n: {
    en: { "jcr:title": title.en, "body": body.en, ...(features && { features: features.en }) },
    fr: { "jcr:title": title.fr, "body": body.fr, ...(features && { features: features.fr }) },
  },
});

const imageWithCaption = (name, { image, caption }) => ({
  name,
  type: "forsure:imageWithCaption",
  i18n: {
    en: { imageAlt: caption.en, caption: caption.en },
    fr: { imageAlt: caption.fr, caption: caption.fr },
  },
  refs: { image },
});

const testimonial = (name, { quote, author, photo, product }) => ({
  name,
  type: "forsure:testimonial",
  // `quote` is not translated, and `photo` is: only the English photo is set
  props: { quote, name: author },
  refs: { photo: { en: photo }, product },
});

const faq = (items) => ({
  name: "faq",
  type: "forsure:faq",
  i18n: {
    en: { "jcr:title": "Frequently asked questions" },
    fr: { "jcr:title": "Questions fréquentes" },
  },
  children: items.map(([name, qEn, qFr, aEn, aFr]) => ({
    name,
    type: "forsure:faqItem",
    i18n: {
      en: { "jcr:title": qEn, "answer": `<p>${aEn}</p>` },
      fr: { "jcr:title": qFr, "answer": `<p>${aFr}</p>` },
    },
  })),
});

const legalNoticeReference = {
  name: "legal-notice",
  type: "jnt:contentReference",
  refs: { "j:node": "legal-notice" },
};

export const content = {
  "home": [
    area("header", [
      { name: "menu", type: "forsure:navMenu" },
      { name: "greeting", type: "forsure:userGreeting" },
    ]),
    area("main", [
      hero("hero", {
        title: {
          en: "Insurance that keeps its promises",
          fr: "Une assurance qui tient ses promesses",
        },
        subtitle:
          "Car, health and home cover in a few minutes, and real people to talk to when something goes wrong.",
        image: "man-with-dog.jpg",
        cta: {
          label: { en: "Find your cover", fr: "Trouver votre assurance" },
          link: "/en/sites/forsure/home/car-insurance.html",
        },
      }),
      {
        name: "products",
        type: "forsure:productGrid",
        i18n: {
          en: { "jcr:title": "Our insurance products" },
          fr: { "jcr:title": "Nos assurances" },
        },
      },
      {
        name: "testimonials",
        type: "forsure:testimonials",
        i18n: {
          en: { "jcr:title": "What our customers say" },
          fr: { "jcr:title": "Ce que disent nos clients" },
        },
        children: [
          testimonial("emma", {
            quote:
              "My car was towed and repaired within a week. I never had to chase anyone: they called me.",
            author: "Emma R.",
            photo: "portrait-emma.jpg",
            product: "car-insurance",
          }),
          testimonial("lea", {
            quote:
              "After the storm, an expert came the next day. The roof was fixed before winter.",
            author: "Léa M.",
            photo: "portrait-lea.jpg",
            product: "home-insurance",
          }),
          testimonial("marc", {
            quote: "I see my physiotherapist every week, and I'm reimbursed in two days.",
            author: "Marc D.",
            photo: "portrait-marc.jpg",
            product: "health-insurance",
          }),
        ],
      },
    ]),
    area("footer", [
      {
        name: "copyright",
        type: "jnt:bigText",
        i18n: {
          en: { text: "<p>© For Sure Insurance. All rights reserved.</p>" },
          fr: { text: "<p>© For Sure Assurances. Tous droits réservés.</p>" },
        },
      },
    ]),
  ],

  "home/car-insurance": [
    area("main", [
      hero("hero", {
        title: { en: "Car insurance", fr: "Assurance auto" },
        subtitle: "From third party to fully comprehensive, with 24/7 roadside assistance.",
        image: "classic-car.jpg",
        cta: {
          label: { en: "Get a quote", fr: "Obtenir un devis" },
          link: "https://forsure.example/quote?product=car",
        },
      }),
      section(
        "plans",
        {
          title: { en: "Choose your plan", fr: "Choisissez votre formule" },
          subtitle: {
            en: "Every plan includes legal assistance.",
            fr: "Chaque formule inclut la protection juridique.",
          },
          layout: "3cols",
        },
        [
          textCard("third-party", {
            title: { en: "Third party", fr: "Tiers" },
            body: {
              en: "<p>The legal minimum, at the lowest price.</p>",
              fr: "<p>Le minimum légal, au meilleur prix.</p>",
            },
            features: {
              en: ["Damage to others", "Legal assistance"],
              fr: ["Dommages causés aux tiers", "Protection juridique"],
            },
          }),
          textCard("third-party-plus", {
            title: { en: "Third party plus", fr: "Tiers étendu" },
            body: {
              en: "<p>Adds theft, fire and broken glass.</p>",
              fr: "<p>Ajoute le vol, l'incendie et le bris de glace.</p>",
            },
            features: {
              en: ["Everything in Third party", "Theft and fire", "Broken glass"],
              fr: ["Tout le contenu de Tiers", "Vol et incendie", "Bris de glace"],
            },
          }),
          textCard("comprehensive", {
            title: { en: "Comprehensive", fr: "Tous risques" },
            body: {
              en: "<p>Your car is covered, even when the accident is your fault.</p>",
              fr: "<p>Votre voiture est couverte, même si l'accident est de votre fait.</p>",
            },
            features: {
              en: ["Everything in Third party plus", "Damage to your car", "Replacement car"],
              fr: [
                "Tout le contenu de Tiers étendu",
                "Dommages à votre véhicule",
                "Véhicule de remplacement",
              ],
            },
          }),
        ],
      ),
      section(
        "assistance",
        {
          title: { en: "Help on the road", fr: "Une aide sur la route" },
          layout: "2cols",
        },
        [
          imageWithCaption("garage", {
            image: "cars-at-garage.jpg",
            caption: { en: "Over 2,000 partner garages", fr: "Plus de 2 000 garages partenaires" },
          }),
          textCard("roadside", {
            title: { en: "24/7 roadside assistance", fr: "Assistance 24 h/24" },
            body: {
              en: "<p>Breakdown, flat tyre or empty tank: call us and a tow truck is on its way, from the first kilometre.</p>",
              fr: "<p>Panne, crevaison ou réservoir vide : appelez-nous et une dépanneuse arrive, dès le premier kilomètre.</p>",
            },
          }),
        ],
      ),
      section(
        "travel",
        {
          title: { en: "Covered wherever you drive", fr: "Couvert partout où vous roulez" },
          layout: "3cols-alternate",
        },
        [
          imageWithCaption("van", {
            image: "van-on-road.jpg",
            caption: { en: "Covered in 40 countries", fr: "Couvert dans 40 pays" },
          }),
          textCard("abroad", {
            title: { en: "Abroad", fr: "À l'étranger" },
            body: {
              en: "<p>The same cover in all of Europe.</p>",
              fr: "<p>Les mêmes garanties dans toute l'Europe.</p>",
            },
          }),
          textCard("rental", {
            title: { en: "Rental cars", fr: "Voitures de location" },
            body: {
              en: "<p>Your excess is covered when you rent.</p>",
              fr: "<p>Votre franchise est couverte quand vous louez.</p>",
            },
          }),
          textCard("app", {
            title: { en: "Claims in the app", fr: "Déclarations dans l'appli" },
            body: {
              en: "<p>Take three photos, we handle the rest.</p>",
              fr: "<p>Prenez trois photos, nous nous occupons du reste.</p>",
            },
          }),
        ],
      ),
      faq([
        [
          "accident",
          "What do I do after an accident?",
          "Que faire après un accident ?",
          "Fill in the accident report with the other driver, take photos, then declare the claim in the app within five days.",
          "Remplissez le constat amiable avec l'autre conducteur, prenez des photos, puis déclarez le sinistre dans l'appli sous cinq jours.",
        ],
        [
          "young-driver",
          "Can a young driver use my car?",
          "Un jeune conducteur peut-il utiliser ma voiture ?",
          "Yes, add them to your contract: the excess is higher for drivers with less than three years of licence.",
          "Oui, ajoutez-le à votre contrat : la franchise est plus élevée pour les permis de moins de trois ans.",
        ],
        [
          "bonus",
          "How does the no-claims bonus work?",
          "Comment fonctionne le bonus ?",
          "Each year without an accident that is your fault lowers your premium by 5%, down to 50%.",
          "Chaque année sans accident responsable baisse votre prime de 5 %, jusqu'à 50 %.",
        ],
        [
          "electric",
          "Do you insure electric cars?",
          "Assurez-vous les voitures électriques ?",
          "Yes, including the battery and the charging cable, at no extra cost.",
          "Oui, y compris la batterie et le câble de recharge, sans surcoût.",
        ],
        [
          "sell",
          "What happens when I sell my car?",
          "Que se passe-t-il si je vends ma voiture ?",
          "Your contract ends the day after the sale, and we refund the remaining months.",
          "Votre contrat prend fin le lendemain de la vente, et nous remboursons les mois restants.",
        ],
        [
          "glass",
          "Is a broken windscreen covered?",
          "Un pare-brise cassé est-il couvert ?",
          "Yes, from the Third party plus plan, with no excess if you use a partner garage.",
          "Oui, dès la formule Tiers étendu, sans franchise dans un garage partenaire.",
        ],
      ]),
      testimonial("testimonial", {
        quote: "A deer jumped in front of my car at night. Two days later I had a replacement car.",
        author: "Emma R.",
        photo: "portrait-emma.jpg",
        product: "car-insurance",
      }),
      legalNoticeReference,
    ]),
  ],

  "home/health-insurance": [
    area("main", [
      hero("hero", {
        title: { en: "Health insurance", fr: "Assurance santé" },
        subtitle: "Doctors, dentists, glasses and hospital stays, reimbursed in 48 hours.",
        image: "mountain-hiker.jpg",
        cta: {
          label: { en: "Get a quote", fr: "Obtenir un devis" },
          link: "https://forsure.example/quote?product=health",
        },
      }),
      section(
        "cover",
        {
          title: { en: "What we cover", fr: "Ce que nous couvrons" },
          // A typo an editor can make: layout is a free text field
          layout: "2 cols",
        },
        [
          textCard("care", {
            title: { en: "Everyday care", fr: "Soins courants" },
            body: {
              en: "<p>GP, specialists, lab tests and pharmacy.</p>",
              fr: "<p>Généraliste, spécialistes, analyses et pharmacie.</p>",
            },
          }),
          textCard("hospital", {
            title: { en: "Hospital", fr: "Hospitalisation" },
            body: {
              en: "<p>A private room, and a bed for a parent next to a child.</p>",
              fr: "<p>Une chambre individuelle, et un lit pour un parent près d'un enfant.</p>",
            },
          }),
          textCard("optical", {
            title: { en: "Optical and dental", fr: "Optique et dentaire" },
            body: {
              en: "<p>One pair of glasses a year, implants and orthodontics.</p>",
              fr: "<p>Une paire de lunettes par an, implants et orthodontie.</p>",
            },
          }),
          textCard("wellbeing", {
            title: { en: "Well-being", fr: "Bien-être" },
            body: {
              en: "<p>Osteopathy, physiotherapy and psychologists.</p>",
              fr: "<p>Ostéopathie, kinésithérapie et psychologues.</p>",
            },
          }),
        ],
      ),
      section(
        "mind",
        {
          title: { en: "Your mind matters too", fr: "Votre santé mentale compte aussi" },
          layout: "2cols-alternate",
        },
        [
          imageWithCaption("sea", {
            image: "man-by-the-sea.jpg",
            caption: {
              en: "Ten sessions with a psychologist each year",
              fr: "Dix séances chez un psychologue chaque année",
            },
          }),
          textCard("hotline", {
            title: { en: "A hotline, day and night", fr: "Une ligne d'écoute, jour et nuit" },
            body: {
              en: "<p>Talk to a professional, anonymously.</p>",
              fr: "<p>Parlez à un professionnel, anonymement.</p>",
            },
          }),
          textCard("coaching", {
            title: { en: "Sleep and stress coaching", fr: "Coaching sommeil et stress" },
            body: {
              en: "<p>Six weeks of guided programs in the app.</p>",
              fr: "<p>Six semaines de programmes guidés dans l'appli.</p>",
            },
          }),
          textCard("second-opinion", {
            title: { en: "Second medical opinion", fr: "Second avis médical" },
            body: {
              en: "<p>A specialist reviews your diagnosis within a week.</p>",
              fr: "<p>Un spécialiste revoit votre diagnostic sous une semaine.</p>",
            },
          }),
        ],
      ),
      section(
        "family",
        {
          title: { en: "For the whole family", fr: "Pour toute la famille" },
          layout: "1col",
        },
        [
          textCard("children", {
            title: {
              en: "Children are free from the third one",
              fr: "Gratuit dès le troisième enfant",
            },
            body: {
              en: "<p>Add your partner and children to the same contract.</p>",
              fr: "<p>Ajoutez votre conjoint et vos enfants au même contrat.</p>",
            },
          }),
        ],
      ),
      {
        name: "faq",
        type: "forsure:faq",
        i18n: {
          en: { "jcr:title": "Frequently asked questions" },
          fr: { "jcr:title": "Questions fréquentes" },
        },
        children: [
          [
            "waiting",
            "Is there a waiting period?",
            "Y a-t-il un délai de carence ?",
            "No waiting period for everyday care. Three months for dental implants.",
            "Aucun délai pour les soins courants. Trois mois pour les implants dentaires.",
          ],
          [
            "abroad",
            "Am I covered abroad?",
            "Suis-je couvert à l'étranger ?",
            "Yes, worldwide for trips under 90 days.",
            "Oui, dans le monde entier pour les séjours de moins de 90 jours.",
          ],
          [
            "reimbursed",
            "How fast am I reimbursed?",
            "En combien de temps suis-je remboursé ?",
            "Within 48 hours after we receive the invoice.",
            "Sous 48 heures après réception de la facture.",
          ],
          [
            "cancel",
            "Can I cancel at any time?",
            "Puis-je résilier à tout moment ?",
            "Yes, after the first year, with one month notice.",
            "Oui, après la première année, avec un mois de préavis.",
          ],
        ].map(([name, qEn, qFr, aEn, aFr]) => ({
          name,
          type: "forsure:faqItem",
          i18n: {
            en: { "jcr:title": qEn, "answer": `<p>${aEn}</p>` },
            fr: { "jcr:title": qFr, "answer": `<p>${aFr}</p>` },
          },
        })),
      },
      testimonial("testimonial", {
        quote: "My daughter needed braces. The orthodontist was paid directly, nothing to advance.",
        author: "Marc D.",
        photo: "portrait-marc.jpg",
        product: "health-insurance",
      }),
      legalNoticeReference,
    ]),
  ],

  "home/home-insurance": [
    area("main", [
      hero("hero", {
        title: { en: "Home insurance", fr: "Assurance habitation" },
        subtitle: "Tenant or owner, protect your home and everything in it.",
        image: "canal-houses.jpg",
        cta: {
          label: { en: "Get a quote", fr: "Obtenir un devis" },
          link: "https://forsure.example/quote?product=home",
        },
      }),
      section(
        "cover",
        {
          title: { en: "Your home, fully covered", fr: "Votre logement, entièrement couvert" },
          layout: "2cols",
        },
        [
          imageWithCaption("contents", {
            image: "living-room.jpg",
            caption: {
              en: "Furniture, electronics and valuables",
              fr: "Meubles, électronique et objets de valeur",
            },
          }),
          textCard("damage", {
            title: { en: "Damage to your home", fr: "Dommages au logement" },
            body: {
              en: "<p>Water leaks, fire, storms and break-ins.</p>",
              fr: "<p>Dégâts des eaux, incendie, tempêtes et cambriolages.</p>",
            },
            features: {
              en: ["Water damage", "Fire and explosion", "Storm and hail", "Burglary"],
              fr: ["Dégâts des eaux", "Incendie et explosion", "Tempête et grêle", "Cambriolage"],
            },
          }),
        ],
      ),
      section(
        "weather",
        {
          title: { en: "Ready for any weather", fr: "Prêt pour tous les temps" },
          layout: "3cols-alternate",
        },
        [
          imageWithCaption("roofs", {
            image: "snowy-roofs.jpg",
            caption: {
              en: "An expert visits within 48 hours",
              fr: "Un expert passe sous 48 heures",
            },
          }),
          textCard("emergency", {
            title: { en: "Emergency repairs", fr: "Réparations d'urgence" },
            body: {
              en: "<p>A plumber or a locksmith, day and night.</p>",
              fr: "<p>Un plombier ou un serrurier, jour et nuit.</p>",
            },
          }),
          textCard("rehousing", {
            title: { en: "Rehousing", fr: "Relogement" },
            body: {
              en: "<p>A hotel while your home is repaired.</p>",
              fr: "<p>Un hôtel pendant les réparations.</p>",
            },
          }),
          textCard("liability", {
            title: { en: "Civil liability", fr: "Responsabilité civile" },
            body: {
              en: "<p>Your whole family is covered for damage to others.</p>",
              fr: "<p>Toute votre famille est couverte pour les dommages causés aux autres.</p>",
            },
          }),
        ],
      ),
      section(
        "extras",
        {
          title: { en: "Options", fr: "Options" },
          subtitle: {
            en: "Add them when you need them.",
            fr: "Ajoutez-les quand vous en avez besoin.",
          },
          layout: "3cols",
        },
        [
          textCard("garden", {
            title: { en: "Garden and pool", fr: "Jardin et piscine" },
            body: {
              en: "<p>Trees, fences and pool equipment.</p>",
              fr: "<p>Arbres, clôtures et équipements de piscine.</p>",
            },
          }),
          textCard("student", {
            title: { en: "Student room", fr: "Logement étudiant" },
            body: {
              en: "<p>Your children's room, at half price.</p>",
              fr: "<p>Le logement de vos enfants, à moitié prix.</p>",
            },
          }),
          textCard("valuables", {
            title: { en: "Valuables", fr: "Objets de valeur" },
            body: {
              en: "<p>Jewellery and art, at their appraised value.</p>",
              fr: "<p>Bijoux et œuvres d'art, à leur valeur d'expertise.</p>",
            },
          }),
        ],
      ),
      faq([
        [
          "tenant",
          "Is home insurance mandatory for tenants?",
          "L'assurance habitation est-elle obligatoire pour un locataire ?",
          "Yes, your landlord can ask for a certificate every year: download it from the app.",
          "Oui, votre propriétaire peut demander une attestation chaque année : téléchargez-la dans l'appli.",
        ],
        [
          "burglary",
          "What do I do after a burglary?",
          "Que faire après un cambriolage ?",
          "File a complaint with the police within 24 hours, then declare the claim with the list of stolen items.",
          "Portez plainte sous 24 heures, puis déclarez le sinistre avec la liste des objets volés.",
        ],
        [
          "move",
          "I'm moving: what happens to my contract?",
          "Je déménage : que devient mon contrat ?",
          "Give us your new address: we move your contract with you and adjust the premium.",
          "Donnez-nous votre nouvelle adresse : votre contrat vous suit et la prime est ajustée.",
        ],
        [
          "roommates",
          "Can roommates share one contract?",
          "Des colocataires peuvent-ils partager un contrat ?",
          "Yes, every roommate can be named on the same contract.",
          "Oui, chaque colocataire peut être nommé sur le même contrat.",
        ],
        [
          "remote-work",
          "Is my work equipment covered at home?",
          "Mon matériel professionnel est-il couvert chez moi ?",
          "Your own laptop and screen are covered up to 3,000 euros.",
          "Votre ordinateur et votre écran personnels sont couverts jusqu'à 3 000 euros.",
        ],
        [
          "water-leak",
          "A leak damaged my neighbour's flat. Who pays?",
          "Une fuite a abîmé l'appartement de mon voisin. Qui paie ?",
          "Your civil liability covers the damage to your neighbour.",
          "Votre responsabilité civile couvre les dommages chez votre voisin.",
        ],
      ]),
      testimonial("testimonial", {
        quote: "A pipe burst while we were on holiday. The plumber was there before we got home.",
        author: "Léa M.",
        photo: "portrait-lea.jpg",
        product: "home-insurance",
      }),
      legalNoticeReference,
    ]),
  ],
};
