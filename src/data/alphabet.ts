import { assetUrl } from "@/lib/assets";
import { isBuddyWordPoster, sceneKey, hasSceneFill } from "@/data/art-roles";
import { APP_VERSION } from "@/lib/version";

export type WordEntry = {
  word: string;
  slug: string;
  hint: string;
};

export type CaseKind = "upper" | "lower";

export type LetterEntry = {
  letter: string;
  name: string;
  /** Soft pastel used for letter tiles & accents */
  hue: string;
  /** Deeper accent for first-letter highlights */
  accent: string;
  sound: string;
  soundCue: string;
  funFact: string;
  words: [WordEntry, WordEntry, WordEntry, WordEntry, WordEntry, WordEntry];
  rhyme: string;
  animal: string;
};

export const LETTERS: LetterEntry[] = [
  {
    letter: "A",
    name: "ay",
    hue: "#FF6B6B",
    accent: "#E03131",
    sound: "/ă/",
    soundCue: "A says ah, like apple!",
    funFact: "A is the very first letter — and one of the oldest letters ever written!",
    words: [
      { word: "Apple", slug: "apple", hint: "Crunchy red fruit" },
      { word: "Ant", slug: "ant", hint: "Tiny hard worker" },
      { word: "Airplane", slug: "airplane", hint: "Flies high in the sky" },
      { word: "Alligator", slug: "alligator", hint: "Big smile, sharp teeth" },
      { word: "Astronaut", slug: "astronaut", hint: "Explores outer space" },
      { word: "Anchor", slug: "anchor", hint: "Holds a boat still" },
    ],
    rhyme: "A is for apple, round and sweet — a perfect after-playtime treat!",
    animal: "Alligator",
  },
  {
    letter: "B",
    name: "bee",
    hue: "#4DABF7",
    accent: "#1971C2",
    sound: "/b/",
    soundCue: "B says buh, like ball!",
    funFact: "The letter B started as a drawing of a house in ancient picture writing!",
    words: [
      { word: "Ball", slug: "ball", hint: "Bounce bounce bounce" },
      { word: "Bear", slug: "bear", hint: "Soft and cuddly" },
      { word: "Butterfly", slug: "butterfly", hint: "Fluttery wings" },
      { word: "Banana", slug: "banana", hint: "Yellow and peelable" },
      { word: "Boat", slug: "boat", hint: "Sails on water" },
      { word: "Bird", slug: "bird", hint: "Flies and sings" },
    ],
    rhyme: "B is for bear, so soft and round — the friendliest animal in town!",
    animal: "Bear",
  },
  {
    letter: "C",
    name: "see",
    hue: "#FF922B",
    accent: "#E8590C",
    sound: "/k/",
    soundCue: "C says kuh, like cat!",
    funFact: "C can sound like K (cat) or S (city) — a letter with two voices!",
    words: [
      { word: "Cat", slug: "cat", hint: "Purrs and naps" },
      { word: "Cake", slug: "cake", hint: "Birthday treat" },
      { word: "Car", slug: "car", hint: "Vroom on the road" },
      { word: "Cloud", slug: "cloud", hint: "Fluffy sky pillow" },
      { word: "Cookie", slug: "cookie", hint: "Sweet and crumbly" },
      { word: "Cup", slug: "cup", hint: "Holds a yummy drink" },
    ],
    rhyme: "C is for cat, with whiskers neat — curling up on a sunny seat!",
    animal: "Cat",
  },
  {
    letter: "D",
    name: "dee",
    hue: "#69DB7C",
    accent: "#2F9E44",
    sound: "/d/",
    soundCue: "D says duh, like dog!",
    funFact: "Dogs can learn over 100 words — just like you are learning letters!",
    words: [
      { word: "Dog", slug: "dog", hint: "Best friend forever" },
      { word: "Duck", slug: "duck", hint: "Quack quack!" },
      { word: "Dinosaur", slug: "dinosaur", hint: "Roar from long ago" },
      { word: "Donut", slug: "donut", hint: "Round with a hole" },
      { word: "Drum", slug: "drum", hint: "Boom boom beat" },
      { word: "Door", slug: "door", hint: "Opens to a room" },
    ],
    rhyme: "D is for dog, who loves to play — chasing balls all day!",
    animal: "Dog",
  },
  {
    letter: "E",
    name: "ee",
    hue: "#9775FA",
    accent: "#7048E8",
    sound: "/ĕ/",
    soundCue: "E says eh, like egg!",
    funFact: "E is the most-used letter in English books and stories!",
    words: [
      { word: "Elephant", slug: "elephant", hint: "Biggest land animal" },
      { word: "Egg", slug: "egg", hint: "Breakfast oval" },
      { word: "Eagle", slug: "eagle", hint: "Soars above mountains" },
      { word: "Earth", slug: "earth", hint: "Our blue-green home" },
      { word: "Elbow", slug: "elbow", hint: "The bend in your arm" },
      { word: "Elf", slug: "elf", hint: "A tiny magical helper" },
    ],
    rhyme: "E is for elephant, big and gray — swinging its trunk every day!",
    animal: "Elephant",
  },
  {
    letter: "F",
    name: "eff",
    hue: "#FFA8A8",
    accent: "#FA5252",
    sound: "/f/",
    soundCue: "F says fff, like fish!",
    funFact: "Fish have been swimming in Earth's waters for over 500 million years!",
    words: [
      { word: "Fish", slug: "fish", hint: "Swims with fins" },
      { word: "Frog", slug: "frog", hint: "Hops and ribbits" },
      { word: "Flower", slug: "flower", hint: "Blooms in gardens" },
      { word: "Firetruck", slug: "firetruck", hint: "Red and loud" },
      { word: "Fox", slug: "fox", hint: "Clever and quick" },
      { word: "Fairy", slug: "fairy", hint: "Tiny magic friend" },
    ],
    rhyme: "F is for frog, who hops so high — from lily pad up to the sky!",
    animal: "Fox",
  },
  {
    letter: "G",
    name: "jee",
    hue: "#63E6BE",
    accent: "#0CA678",
    sound: "/g/",
    soundCue: "G says guh, like grapes!",
    funFact: "Giraffes are the tallest animals on Earth — their necks can be 6 feet long!",
    words: [
      { word: "Giraffe", slug: "giraffe", hint: "Super tall neck" },
      { word: "Grapes", slug: "grapes", hint: "Little purple bunches" },
      { word: "Guitar", slug: "guitar", hint: "Strum strummy music" },
      { word: "Garden", slug: "garden", hint: "Where plants grow" },
      { word: "Gift", slug: "gift", hint: "Wrapped with a bow" },
      { word: "Goat", slug: "goat", hint: "Climbs and bleats" },
    ],
    rhyme: "G is for giraffe, so tall and kind — leaves of the trees are easy to find!",
    animal: "Giraffe",
  },
  {
    letter: "H",
    name: "aitch",
    hue: "#FFD43B",
    accent: "#F59F00",
    sound: "/h/",
    soundCue: "H says huh, like hat!",
    funFact: "Your heart is about the size of your fist and beats all day and night!",
    words: [
      { word: "Hat", slug: "hat", hint: "Sits on your head" },
      { word: "House", slug: "house", hint: "Home sweet home" },
      { word: "Horse", slug: "horse", hint: "Gallops and neighs" },
      { word: "Heart", slug: "heart", hint: "Shows you care" },
      { word: "Honey", slug: "honey", hint: "Sweet from bees" },
      { word: "Helicopter", slug: "helicopter", hint: "Spins up into the sky" },
    ],
    rhyme: "H is for horse, who loves to run — under the warm and golden sun!",
    animal: "Horse",
  },
  {
    letter: "I",
    name: "eye",
    hue: "#74C0FC",
    accent: "#1C7ED6",
    sound: "/ĭ/",
    soundCue: "I says ih, like igloo!",
    funFact: "Igloos are made of snow bricks that keep the inside surprisingly warm!",
    words: [
      { word: "Ice cream", slug: "ice-cream", hint: "Cold and creamy" },
      { word: "Igloo", slug: "igloo", hint: "Snow house" },
      { word: "Island", slug: "island", hint: "Land in the sea" },
      { word: "Insect", slug: "insect", hint: "Six little legs" },
      { word: "Iron", slug: "iron", hint: "Presses clothes flat" },
      { word: "Iguana", slug: "iguana", hint: "A scaly green lizard" },
    ],
    rhyme: "I is for ice cream, cold and sweet — the yummiest summer treat!",
    animal: "Iguana",
  },
  {
    letter: "J",
    name: "jay",
    hue: "#B197FC",
    accent: "#7950F2",
    sound: "/j/",
    soundCue: "J says juh, like juice!",
    funFact: "Jellyfish have been floating in the ocean for longer than dinosaurs lived!",
    words: [
      { word: "Juice", slug: "juice", hint: "Fruity and sippy" },
      { word: "Jellyfish", slug: "jellyfish", hint: "Wibbly sea friend" },
      { word: "Jacket", slug: "jacket", hint: "Keeps you warm" },
      { word: "Jam", slug: "jam", hint: "Toast topper" },
      { word: "Jungle", slug: "jungle", hint: "Wild green forest" },
      { word: "Jet", slug: "jet", hint: "Super-fast airplane" },
    ],
    rhyme: "J is for juice, so bright and sweet — orange, apple, a morning treat!",
    animal: "Jaguar",
  },
  {
    letter: "K",
    name: "kay",
    hue: "#FF8787",
    accent: "#FA5252",
    sound: "/k/",
    soundCue: "K says kuh, like kite!",
    funFact: "Kangaroos can hop faster than most people can run — over 30 miles an hour!",
    words: [
      { word: "Kite", slug: "kite", hint: "Dances in the wind" },
      { word: "Kangaroo", slug: "kangaroo", hint: "Hops with a pouch" },
      { word: "Key", slug: "key", hint: "Opens the door" },
      { word: "King", slug: "king", hint: "Wears a crown" },
      { word: "Kitchen", slug: "kitchen", hint: "Where meals are made" },
      { word: "Kitten", slug: "kitten", hint: "Soft baby cat" },
    ],
    rhyme: "K is for kite, up in the blue — dancing and twirling just for you!",
    animal: "Kangaroo",
  },
  {
    letter: "L",
    name: "ell",
    hue: "#8CE99A",
    accent: "#37B24D",
    sound: "/l/",
    soundCue: "L says lll, like lion!",
    funFact: "A lion's roar can be heard from 5 miles away!",
    words: [
      { word: "Lion", slug: "lion", hint: "King of the jungle" },
      { word: "Leaf", slug: "leaf", hint: "Green tree confetti" },
      { word: "Lemon", slug: "lemon", hint: "Zesty and yellow" },
      { word: "Lamp", slug: "lamp", hint: "Glows at night" },
      { word: "Lollipop", slug: "lollipop", hint: "Sweet on a stick" },
      { word: "Ladder", slug: "ladder", hint: "Climb up, step by step" },
    ],
    rhyme: "L is for lion, with a golden mane — the bravest roar on the plain!",
    animal: "Lion",
  },
  {
    letter: "M",
    name: "em",
    hue: "#66D9E8",
    accent: "#1098AD",
    sound: "/m/",
    soundCue: "M says mmm, like moon!",
    funFact: "The Moon is about 238,000 miles from Earth — that's a very long hop!",
    words: [
      { word: "Moon", slug: "moon", hint: "Glows at night" },
      { word: "Monkey", slug: "monkey", hint: "Swings in trees" },
      { word: "Mouse", slug: "mouse", hint: "Tiny and quiet" },
      { word: "Mountain", slug: "mountain", hint: "Tall and rocky" },
      { word: "Milk", slug: "milk", hint: "White and healthy" },
      { word: "Mushroom", slug: "mushroom", hint: "Umbrella in the forest" },
    ],
    rhyme: "M is for moon, so silver and bright — lighting up the quiet night!",
    animal: "Monkey",
  },
  {
    letter: "N",
    name: "en",
    hue: "#FFA94D",
    accent: "#F76707",
    sound: "/n/",
    soundCue: "N says nnn, like nest!",
    funFact: "Birds build nests using twigs, grass, mud, and even soft feathers!",
    words: [
      { word: "Nest", slug: "nest", hint: "Bird's cozy home" },
      { word: "Night", slug: "night", hint: "Stars come out" },
      { word: "Nose", slug: "nose", hint: "Sniff sniff" },
      { word: "Notebook", slug: "notebook", hint: "For doodles and words" },
      { word: "Noodles", slug: "noodle", hint: "Twisty pasta" },
      { word: "Net", slug: "net", hint: "Catches balls and fish" },
    ],
    rhyme: "N is for nest, high in a tree — a soft little home for a bird family!",
    animal: "Newt",
  },
  {
    letter: "O",
    name: "oh",
    hue: "#FF6B6B",
    accent: "#F03E3E",
    sound: "/ŏ/",
    soundCue: "O says ah, like octopus!",
    funFact: "Octopuses have three hearts and blue blood — super ocean superheroes!",
    words: [
      { word: "Orange", slug: "orange", hint: "Juicy citrus fruit" },
      { word: "Owl", slug: "owl", hint: "Hoo hoo at night" },
      { word: "Ocean", slug: "ocean", hint: "Big blue water" },
      { word: "Octopus", slug: "octopus", hint: "Eight clever arms" },
      { word: "Oven", slug: "oven", hint: "Bakes warm treats" },
      { word: "Ostrich", slug: "ostrich", hint: "A very tall bird" },
    ],
    rhyme: "O is for owl, so wise and deep — watching the forest while children sleep!",
    animal: "Owl",
  },
  {
    letter: "P",
    name: "pee",
    hue: "#DA77F2",
    accent: "#9C36B5",
    sound: "/p/",
    soundCue: "P says puh, like pizza!",
    funFact: "Penguins can't fly in the air — but they fly through water like rockets!",
    words: [
      { word: "Pizza", slug: "pizza", hint: "Cheesy triangle slices" },
      { word: "Penguin", slug: "penguin", hint: "Waddles on ice" },
      { word: "Pig", slug: "pig", hint: "Oink oink muddy" },
      { word: "Pencil", slug: "pencil", hint: "Writes and erases" },
      { word: "Piano", slug: "piano", hint: "Black and white keys" },
      { word: "Puppy", slug: "puppy", hint: "Playful baby dog" },
    ],
    rhyme: "P is for penguin, dressed in a suit — sliding on ice is its favorite route!",
    animal: "Penguin",
  },
  {
    letter: "Q",
    name: "cue",
    hue: "#748FFC",
    accent: "#4263EB",
    sound: "/kw/",
    soundCue: "Q says kwuh, like queen!",
    funFact: "Q almost always brings its best friend U along — like in queen and quiet!",
    words: [
      { word: "Queen", slug: "queen", hint: "Royal and kind" },
      { word: "Quilt", slug: "quilt", hint: "Cozy patchwork" },
      { word: "Question", slug: "question", hint: "Curious asking" },
      { word: "Quiet", slug: "quiet", hint: "Soft and still" },
      { word: "Quack", slug: "quack", hint: "Duck's happy sound" },
      { word: "Quarter", slug: "quarter", hint: "A shiny coin" },
    ],
    rhyme: "Q is for queen, with a sparkling crown — waving hello all over town!",
    animal: "Quail",
  },
  {
    letter: "R",
    name: "ar",
    hue: "#FF8787",
    accent: "#E03131",
    sound: "/r/",
    soundCue: "R says rrr, like robot!",
    funFact: "Rainbows appear when sunlight shines through raindrops at just the right angle!",
    words: [
      { word: "Rainbow", slug: "rainbow", hint: "Colors in the sky" },
      { word: "Robot", slug: "robot", hint: "Beep boop friend" },
      { word: "Rocket", slug: "rocket", hint: "Blasts into space" },
      { word: "Rabbit", slug: "rabbit", hint: "Hop hop ears" },
      { word: "Rose", slug: "rose", hint: "Pretty garden flower" },
      { word: "Rain", slug: "rain", hint: "Drops from the clouds" },
    ],
    rhyme: "R is for rocket, ready to go — 3, 2, 1… blast off, ho ho!",
    animal: "Rabbit",
  },
  {
    letter: "S",
    name: "ess",
    hue: "#FFD43B",
    accent: "#FAB005",
    sound: "/s/",
    soundCue: "S says sss, like sun!",
    funFact: "The Sun is so big that a million Earths could fit inside it!",
    words: [
      { word: "Sun", slug: "sun", hint: "Bright daytime star" },
      { word: "Star", slug: "star", hint: "Twinkles at night" },
      { word: "Snake", slug: "snake", hint: "Slithers and hisses" },
      { word: "Ship", slug: "ship", hint: "Sails the seas" },
      { word: "Smile", slug: "smile", hint: "Happy face" },
      { word: "Sock", slug: "sock", hint: "Keeps your toes cozy" },
    ],
    rhyme: "S is for sun, so warm and bright — filling the morning with golden light!",
    animal: "Snake",
  },
  {
    letter: "T",
    name: "tee",
    hue: "#69DB7C",
    accent: "#40C057",
    sound: "/t/",
    soundCue: "T says tuh, like tree!",
    funFact: "Some trees live for thousands of years — older than castles and kings!",
    words: [
      { word: "Tree", slug: "tree", hint: "Tall with leaves" },
      { word: "Tiger", slug: "tiger", hint: "Stripy and strong" },
      { word: "Train", slug: "train", hint: "Choo-choo tracks" },
      { word: "Turtle", slug: "turtle", hint: "Slow with a shell" },
      { word: "Tomato", slug: "tomato", hint: "Red garden fruit" },
      { word: "Tooth", slug: "tooth", hint: "Helps you chew" },
    ],
    rhyme: "T is for tiger, with stripes so bold — a story of courage retold!",
    animal: "Tiger",
  },
  {
    letter: "U",
    name: "you",
    hue: "#91A7FF",
    accent: "#5C7CFA",
    sound: "/ŭ/",
    soundCue: "U says uh, like umbrella!",
    funFact: "Unicorns are mythical — but narwhals have a real spiral tusk that looks magical!",
    words: [
      { word: "Umbrella", slug: "umbrella", hint: "Rainy day helper" },
      { word: "Unicorn", slug: "unicorn", hint: "Magical one-horn" },
      { word: "Under", slug: "under", hint: "Below something" },
      { word: "Uniform", slug: "uniform", hint: "Team matching clothes" },
      { word: "Up", slug: "up", hint: "Toward the sky" },
      { word: "Ukulele", slug: "ukulele", hint: "A small happy guitar" },
    ],
    rhyme: "U is for umbrella, open and wide — keeping you dry when you play outside!",
    animal: "Unicorn",
  },
  {
    letter: "V",
    name: "vee",
    hue: "#E599F7",
    accent: "#CC5DE8",
    sound: "/v/",
    soundCue: "V says vvv, like van!",
    funFact: "Violins make music with four strings and a bow — tiny but mighty!",
    words: [
      { word: "Violin", slug: "violin", hint: "String instrument" },
      { word: "Volcano", slug: "volcano", hint: "Mountain that erupts" },
      { word: "Van", slug: "van", hint: "Big family car" },
      { word: "Vegetable", slug: "vegetable", hint: "Healthy garden food" },
      { word: "Vest", slug: "vest", hint: "Sleeveless jacket" },
      { word: "Vacuum", slug: "vacuum", hint: "Cleans the floor" },
    ],
    rhyme: "V is for violin, singing so sweet — making music with dancing feet!",
    animal: "Vulture",
  },
  {
    letter: "W",
    name: "double-you",
    hue: "#4DABF7",
    accent: "#228BE6",
    sound: "/w/",
    soundCue: "W says wuh, like whale!",
    funFact: "Blue whales are the largest animals that have ever lived on Earth!",
    words: [
      { word: "Whale", slug: "whale", hint: "Giant ocean singer" },
      { word: "Water", slug: "water", hint: "Splash and sip" },
      { word: "Window", slug: "window", hint: "Looks outside" },
      { word: "Watch", slug: "watch", hint: "Tells the time" },
      { word: "Worm", slug: "worm", hint: "Wiggles in soil" },
      { word: "Wagon", slug: "wagon", hint: "Pull it with friends" },
    ],
    rhyme: "W is for whale, singing deep blue songs — the ocean is where a whale belongs!",
    animal: "Whale",
  },
  {
    letter: "X",
    name: "ex",
    hue: "#FFA8A8",
    accent: "#FF6B6B",
    sound: "/ks/",
    soundCue: "X says ks, like in box — and x-ray!",
    funFact: "X-rays help doctors see bones inside your body — like magic vision!",
    words: [
      { word: "X-ray", slug: "xray", hint: "Sees inside bones" },
      { word: "Xylophone", slug: "xylophone", hint: "Colorful music bars" },
      { word: "Box", slug: "box", hint: "Ends with X!" },
      { word: "Fox", slug: "fox-x", hint: "Also ends with X" },
      { word: "Six", slug: "six", hint: "The number 6" },
      { word: "Mix", slug: "mix", hint: "Stir it all together" },
    ],
    rhyme: "X is for xylophone, ding ding ding — colorful bars that love to sing!",
    animal: "X-ray fish",
  },
  {
    letter: "Y",
    name: "why",
    hue: "#FFE066",
    accent: "#FAB005",
    sound: "/y/",
    soundCue: "Y says yuh, like yo-yo!",
    funFact: "Yaks live high in cold mountains and have super thick, warm fur!",
    words: [
      { word: "Yo-yo", slug: "yoyo", hint: "Up and down toy" },
      { word: "Yellow", slug: "yellow", hint: "Sunny bright color" },
      { word: "Yak", slug: "yak", hint: "Shaggy mountain friend" },
      { word: "Yarn", slug: "yarn", hint: "Soft for knitting" },
      { word: "Yacht", slug: "yacht", hint: "Fancy sailboat" },
      { word: "Yogurt", slug: "yogurt", hint: "Creamy spoon snack" },
    ],
    rhyme: "Y is for yo-yo, spinning around — up and down without a sound!",
    animal: "Yak",
  },
  {
    letter: "Z",
    name: "zee",
    hue: "#63E6BE",
    accent: "#12B886",
    sound: "/z/",
    soundCue: "Z says zzz, like zebra!",
    funFact: "No two zebras have the exact same stripe pattern — just like fingerprints!",
    words: [
      { word: "Zebra", slug: "zebra", hint: "Stripy horse cousin" },
      { word: "Zoo", slug: "zoo", hint: "Animals to visit" },
      { word: "Zipper", slug: "zipper", hint: "Zips clothes closed" },
      { word: "Zero", slug: "zero", hint: "The number 0" },
      { word: "Zigzag", slug: "zigzag", hint: "Back and forth path" },
      { word: "Zucchini", slug: "zucchini", hint: "A green garden veggie" },
    ],
    rhyme: "Z is for zebra, with stripes black and white — a walking puzzle, pure delight!",
    animal: "Zebra",
  },
];

export function getLetter(letter: string): LetterEntry | undefined {
  return LETTERS.find((l) => l.letter.toLowerCase() === letter.toLowerCase());
}

/** First 3 words = Big; last 3 = little. */
export function wordsForCase(entry: LetterEntry, kind: CaseKind): WordEntry[] {
  return kind === "upper" ? entry.words.slice(0, 3) : entry.words.slice(3, 6);
}

export function displayGlyph(letter: string, kind: CaseKind): string {
  return kind === "upper" ? letter.toUpperCase() : letter.toLowerCase();
}

export function caseTitle(letter: string, kind: CaseKind): string {
  const g = displayGlyph(letter, kind);
  return kind === "upper" ? `Big ${g}` : `little ${g}`;
}

export function displayWord(word: string, kind: CaseKind): string {
  return kind === "upper" ? word : word.toLowerCase();
}

/** Scene art for “what is this word?” (games + word grid). */
export function posterPath(letter: string, slug: string): string {
  const key = sceneKey(letter, slug);
  const v = `?v=${APP_VERSION}`;
  if (hasSceneFill(letter, slug)) {
    return assetUrl(`posters-scene/${key}.webp`) + v;
  }
  return assetUrl(`posters/${key}.webp`) + v;
}

/** Original poster file — A–Q scenes, R–Z letter-buddies. Never deleted. */
export function wordBuddyPath(letter: string, slug: string): string {
  return `${assetUrl(`posters/${sceneKey(letter, slug)}.webp`)}?v=${APP_VERSION}`;
}

/** Letter mascot. Little a–c have their own stills; other letters fall back to Big. */
const LITTLE_HERO = new Set(["a", "b", "c"]);

export function letterHeroPath(letter: string, kind: CaseKind = "upper"): string {
  const l = letter.toLowerCase();
  const v = `?v=${APP_VERSION}`;
  if (kind === "lower" && LITTLE_HERO.has(l)) {
    return assetUrl(`letters/${l}-little.webp`) + v;
  }
  return assetUrl(`letters/${l}.webp`) + v;
}

/** 10s local bounce, or Imagine clip when we have one. */
const IMAGINE_BUDDY = new Set("abcdefghijklmnopqrstuvwxyz".split(""));
const LITTLE_MEET = new Set(["a"]);

export function letterBuddyVideoPath(letter: string, kind: CaseKind = "upper"): string {
  const l = letter.toLowerCase();
  if (kind === "lower" && LITTLE_MEET.has(l)) {
    return assetUrl(`videos/imagine/${l}-little.mp4`);
  }
  if (IMAGINE_BUDDY.has(l)) {
    return assetUrl(`videos/imagine/${l}.mp4`);
  }
  return assetUrl(`videos/buddies/${l}.mp4`);
}

export { isBuddyWordPoster } from "@/data/art-roles";


