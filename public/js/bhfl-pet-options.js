/* Because He First Loved · pet detail options for the "Who will we be caring for?" page.
   Breed / type lists feed a type-ahead dropdown (the client starts typing and matching
   options appear; they can still type anything not on the list). Ages feed a select. */

const PET_OPTIONS = {
  dogBreeds: [
    "Mixed Breed", "Affenpinscher", "Afghan Hound", "Airedale Terrier", "Akita", "Alaskan Klee Kai", "Alaskan Malamute",
    "American Bulldog", "American English Coonhound", "American Eskimo Dog", "American Foxhound", "American Hairless Terrier",
    "American Pit Bull Terrier", "American Staffordshire Terrier", "American Water Spaniel", "Anatolian Shepherd Dog",
    "Australian Cattle Dog", "Australian Kelpie", "Australian Labradoodle", "Australian Shepherd", "Australian Terrier",
    "Azawakh", "Barbet", "Basenji", "Basset Fauve de Bretagne", "Basset Hound", "Beagle", "Bearded Collie", "Beauceron",
    "Bedlington Terrier", "Belgian Laekenois", "Belgian Malinois", "Belgian Sheepdog", "Belgian Tervuren",
    "Bergamasco Sheepdog", "Berger Picard", "Bernedoodle", "Bernese Mountain Dog", "Bichon Frise", "Biewer Terrier",
    "Black and Tan Coonhound", "Black Russian Terrier", "Bloodhound", "Bluetick Coonhound", "Boerboel", "Bolognese",
    "Border Collie", "Border Terrier", "Borzoi", "Boston Terrier", "Bouvier des Flandres", "Boxer", "Boykin Spaniel",
    "Bracco Italiano", "Briard", "Brittany", "Brussels Griffon", "Bull Terrier", "Bulldog", "Bullmastiff",
    "Cairn Terrier", "Canaan Dog", "Cane Corso", "Cardigan Welsh Corgi", "Catahoula Leopard Dog", "Cavachon",
    "Cavalier King Charles Spaniel", "Cavapoo", "Cesky Terrier", "Chesapeake Bay Retriever", "Chihuahua",
    "Chinese Crested", "Chinese Shar-Pei", "Chinook", "Chiweenie", "Chow Chow", "Cirneco dell'Etna", "Clumber Spaniel",
    "Cockapoo", "Cocker Spaniel", "Collie", "Coton de Tulear", "Curly-Coated Retriever", "Dachshund", "Dalmatian",
    "Dandie Dinmont Terrier", "Doberman Pinscher", "Dogo Argentino", "Dogue de Bordeaux", "Dutch Shepherd",
    "English Cocker Spaniel", "English Foxhound", "English Setter", "English Springer Spaniel", "English Toy Spaniel",
    "Entlebucher Mountain Dog", "Field Spaniel", "Finnish Lapphund", "Finnish Spitz", "Flat-Coated Retriever",
    "French Bulldog", "German Pinscher", "German Shepherd Dog", "German Shorthaired Pointer", "German Wirehaired Pointer",
    "Giant Schnauzer", "Glen of Imaal Terrier", "Goldador", "Golden Retriever", "Goldendoodle", "Gordon Setter",
    "Great Dane", "Great Pyrenees", "Greater Swiss Mountain Dog", "Greyhound", "Harrier", "Havanese", "Ibizan Hound",
    "Icelandic Sheepdog", "Irish Red and White Setter", "Irish Setter", "Irish Terrier", "Irish Water Spaniel",
    "Irish Wolfhound", "Italian Greyhound", "Jack Russell Terrier", "Japanese Chin", "Japanese Spitz", "Keeshond",
    "Kerry Blue Terrier", "Komondor", "Kuvasz", "Labradoodle", "Labrador Retriever", "Lagotto Romagnolo",
    "Lakeland Terrier", "Lancashire Heeler", "Leonberger", "Lhasa Apso", "Lowchen", "Maltese", "Maltipoo",
    "Manchester Terrier", "Mastiff", "Miniature American Shepherd", "Miniature Bull Terrier", "Miniature Pinscher",
    "Miniature Schnauzer", "Morkie", "Mountain Cur", "Mudi", "Neapolitan Mastiff", "Newfoundland", "Norfolk Terrier",
    "Norwegian Buhund", "Norwegian Elkhound", "Norwegian Lundehund", "Norwich Terrier",
    "Nova Scotia Duck Tolling Retriever", "Old English Sheepdog", "Otterhound", "Papillon", "Parson Russell Terrier",
    "Pekingese", "Pembroke Welsh Corgi", "Peruvian Inca Orchid", "Petit Basset Griffon Vendeen", "Pharaoh Hound",
    "Plott Hound", "Pointer", "Polish Lowland Sheepdog", "Pomeranian", "Pomsky", "Poodle (Miniature)",
    "Poodle (Standard)", "Poodle (Toy)", "Portuguese Podengo Pequeno", "Portuguese Water Dog", "Pug", "Puggle", "Puli",
    "Pumi", "Pyrenean Shepherd", "Rat Terrier", "Redbone Coonhound", "Rhodesian Ridgeback", "Rottweiler",
    "Russell Terrier", "Russian Toy", "Saint Bernard", "Saluki", "Samoyed", "Schipperke", "Schnoodle",
    "Scottish Deerhound", "Scottish Terrier", "Sealyham Terrier", "Shetland Sheepdog", "Shiba Inu", "Shih Tzu",
    "Shih-Poo", "Siberian Husky", "Silky Terrier", "Skye Terrier", "Sloughi", "Smooth Fox Terrier",
    "Soft Coated Wheaten Terrier", "Spanish Water Dog", "Spinone Italiano", "Staffordshire Bull Terrier",
    "Standard Schnauzer", "Sussex Spaniel", "Swedish Vallhund", "Tibetan Mastiff", "Tibetan Spaniel", "Tibetan Terrier",
    "Toy Fox Terrier", "Treeing Walker Coonhound", "Vizsla", "Weimaraner", "Welsh Springer Spaniel", "Welsh Terrier",
    "West Highland White Terrier", "Whippet", "Wire Fox Terrier", "Wirehaired Pointing Griffon", "Xoloitzcuintli",
    "Yorkipoo", "Yorkshire Terrier"
  ],
  catBreeds: [
    "Domestic Shorthair", "Domestic Medium Hair", "Domestic Longhair", "Mixed Breed", "Abyssinian", "American Bobtail",
    "American Curl", "American Shorthair", "American Wirehair", "Balinese", "Bengal", "Birman", "Bombay",
    "British Longhair", "British Shorthair", "Burmese", "Burmilla", "Chartreux", "Cornish Rex", "Cymric", "Devon Rex",
    "Egyptian Mau", "European Burmese", "Exotic Shorthair", "Havana Brown", "Himalayan", "Japanese Bobtail", "Khao Manee",
    "Korat", "LaPerm", "Lykoi", "Maine Coon", "Manx", "Munchkin", "Nebelung", "Norwegian Forest Cat", "Ocicat",
    "Oriental Longhair", "Oriental Shorthair", "Persian", "Peterbald", "Pixiebob", "Ragamuffin", "Ragdoll",
    "Russian Blue", "Savannah", "Scottish Fold", "Selkirk Rex", "Siamese", "Siberian", "Singapura", "Snowshoe",
    "Somali", "Sphynx", "Thai", "Tonkinese", "Toyger", "Turkish Angora", "Turkish Van"
  ],
  smallAnimalTypes: [
    "Rabbit", "Guinea Pig", "Hamster", "Dwarf Hamster", "Gerbil", "Rat", "Mouse", "Ferret", "Chinchilla", "Degu",
    "Hedgehog", "Sugar Glider"
  ],
  birdTypes: [
    "Parakeet (Budgie)", "Cockatiel", "Lovebird", "Parrotlet", "Canary", "Finch", "Dove", "Conure", "Quaker Parrot",
    "Lorikeet", "Pionus Parrot", "Caique", "Senegal Parrot", "African Grey", "Amazon Parrot", "Eclectus", "Cockatoo",
    "Macaw"
  ],
  reptileTypes: [
    "Bearded Dragon", "Leopard Gecko", "Crested Gecko", "Gargoyle Gecko", "Ball Python", "Corn Snake", "King Snake",
    "Milk Snake", "Hognose Snake", "Boa Constrictor", "Blue-Tongued Skink", "Uromastyx", "Green Iguana", "Chameleon",
    "Russian Tortoise", "Sulcata Tortoise", "Red-Footed Tortoise", "Box Turtle", "Red-Eared Slider", "Axolotl",
    "Pacman Frog", "White's Tree Frog", "Fire-Bellied Toad", "Salamander or Newt"
  ],
  fishTypes: [
    "Goldfish", "Betta", "Tropical Community", "Guppies", "Tetras", "Cichlids", "Angelfish", "Shrimp", "Koi", "Saltwater",
    "Reef Tank", "Mixed Freshwater"
  ],
  // Ages offered in the dropdown, by kind. "Under 1 year" comes first, then whole years.
  ageMax: { largeDog: 20, smallDog: 20, cat: 20, small: 15, bird: 60, reptile: 50 }
};
function ageOptions(kind) {
  const max = PET_OPTIONS.ageMax[kind] || 20, out = ["Under 1 year"];
  for (let y = 1; y <= max; y++) out.push(`${y} year${y === 1 ? "" : "s"}`);
  return out;
}
function breedListFor(kind) {
  return { largeDog: "dogBreeds", smallDog: "dogBreeds", cat: "catBreeds", small: "smallAnimalTypes", bird: "birdTypes", reptile: "reptileTypes", fish: "fishTypes" }[kind];
}
if (typeof module !== "undefined") module.exports = { PET_OPTIONS, ageOptions, breedListFor };
