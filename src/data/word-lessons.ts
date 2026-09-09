/**
 * Short video lessons for words.
 *
 * RULE: sentence must describe what is ON SCREEN in that word's video
 * (scene + action). Write sentence + scene together.
 * Word-card thumbnail MUST be frame 1 of that word's video (not the end).
 * Action must KEEP GOING through the sentence — do not freeze after a
 * 2-second gag. Unlock only after full lesson finishes.
 */

export type WordLesson = {
  letter: string;
  slug: string;
  video: string;
  word: string;
  sentence: string;
  music?: string;
  sfxPop?: string;
  sfxSparkle?: string;
  sfxSuccess?: string;
  durationSec?: number;
  /** Walk cycles can loop. Landings should not, so the last frame stays put. */
  loopVideo?: boolean;
};

const SFX = {
  music: "audio/sfx/happy-bed.mp3",
  sfxPop: "audio/sfx/pop.mp3",
  sfxSparkle: "audio/sfx/sparkle.mp3",
  sfxSuccess: "audio/sfx/success.mp3",
} as const;

function lesson(
  letter: string,
  slug: string,
  word: string,
  sentence: string,
): WordLesson {
  return {
    letter,
    slug,
    video: `videos/${letter.toLowerCase()}-${slug}.mp4`,
    word,
    sentence,
    ...SFX,
    durationSec: 6,
  };
}

/** Lessons that require watching the video to unlock. */
export const WORD_LESSONS: Record<string, WordLesson> = {
  // --- Letter A ---
  "a-apple": { ...lesson("A", "apple", "Apple", "The red apple lands on the table."), durationSec: 10, loopVideo: false },
  "a-ant": { ...lesson("A", "ant", "Ant", "The ant walks on the picnic blanket."), durationSec: 10, loopVideo: true },
  "a-airplane": { ...lesson("A", "airplane", "Airplane", "The airplane flies through the clouds."), durationSec: 10, loopVideo: true },
  "a-alligator": { ...lesson("A", "alligator", "Alligator", "The alligator smiles by the water."), durationSec: 10, loopVideo: true },
  "a-astronaut": { ...lesson("A", "astronaut", "Astronaut", "The astronaut waves in outer space."), durationSec: 10, loopVideo: true },
  "a-anchor": { ...lesson("A", "anchor", "Anchor", "The anchor drops into the blue water."), durationSec: 10, loopVideo: false },
  // --- Letter B ---
  "b-ball": { ...lesson("B", "ball", "Ball", "The ball bounces at the playground."), durationSec: 10, loopVideo: true },
  "b-bear": { ...lesson("B", "bear", "Bear", "The bear sits in the green forest."), durationSec: 10, loopVideo: true },
  "b-butterfly": { ...lesson("B", "butterfly", "Butterfly", "The butterfly flies over the flowers."), durationSec: 10, loopVideo: true },
  "b-banana": { ...lesson("B", "banana", "Banana", "The banana rests on the kitchen table."), durationSec: 10, loopVideo: false },
  "b-boat": { ...lesson("B", "boat", "Boat", "The boat sails on the blue water."), durationSec: 10, loopVideo: true },
  "b-bird": { ...lesson("B", "bird", "Bird", "The bird flies up in the sky."), durationSec: 10, loopVideo: true },
  // --- Letter C ---
  "c-cat": { ...lesson("C", "cat", "Cat", "The cat naps by the sunny window."), durationSec: 10, loopVideo: true },
  "c-cake": { ...lesson("C", "cake", "Cake", "The cake comes out of the oven."), durationSec: 10, loopVideo: false },
  "c-car": { ...lesson("C", "car", "Car", "The car drives down the road."), durationSec: 10, loopVideo: true },
  "c-cloud": { ...lesson("C", "cloud", "Cloud", "The soft cloud floats in the sky."), durationSec: 10, loopVideo: true },
  "c-cookie": { ...lesson("C", "cookie", "Cookie", "A boy eats a cookie and drops crumbs."), durationSec: 10, loopVideo: true },
  "c-cup": { ...lesson("C", "cup", "Cup", "They pour milk in the cup."), durationSec: 10, loopVideo: false },
  // --- Letter D ---
  "d-dog": { ...lesson("D", "dog", "Dog", "The dog plays in the sunny yard."), durationSec: 10, loopVideo: true },
  "d-duck": { ...lesson("D", "duck", "Duck", "The duck swims in the little pond."), durationSec: 10, loopVideo: true },
  "d-dinosaur": { ...lesson("D", "dinosaur", "Dinosaur", "The dinosaur stomps in the jungle."), durationSec: 10, loopVideo: true },
  "d-donut": { ...lesson("D", "donut", "Donut", "They put sprinkles on the donut."), durationSec: 10, loopVideo: false },
  "d-drum": { ...lesson("D", "drum", "Drum", "The drum goes boom on the stage."), durationSec: 10, loopVideo: true },
  "d-door": { ...lesson("D", "door", "Door", "A kid opens the door."), durationSec: 10, loopVideo: false },
  // --- Letter E ---
  "e-elephant": lesson("E", "elephant", "Elephant", "The elephant walks on the savanna."),
  "e-egg": lesson("E", "egg", "Egg", "The egg rests in the soft nest."),
  "e-eagle": lesson("E", "eagle", "Eagle", "The eagle soars high in the sky."),
  "e-earth": lesson("E", "earth", "Earth", "The Earth spins in outer space."),
  "e-envelope": lesson("E", "envelope", "Envelope", "The envelope waits on the desk."),
  "e-elf": lesson("E", "elf", "Elf", "The elf smiles in the magic forest."),
  // --- Letter F ---
  "f-fish": lesson("F", "fish", "Fish", "The fish swims in the blue ocean."),
  "f-frog": lesson("F", "frog", "Frog", "The frog hops by the pond."),
  "f-flower": lesson("F", "flower", "Flower", "The flower blooms in the garden."),
  "f-firetruck": lesson("F", "firetruck", "Firetruck", "The firetruck races down the road."),
  "f-fox": lesson("F", "fox", "Fox", "The fox peeks from the forest."),
  "f-fairy": lesson("F", "fairy", "Fairy", "The fairy sparkles in the garden."),
  // --- Letter G ---
  "g-giraffe": lesson("G", "giraffe", "Giraffe", "The giraffe stands tall on the savanna."),
  "g-grapes": lesson("G", "grapes", "Grapes", "The grapes hang in the sunny garden."),
  "g-guitar": lesson("G", "guitar", "Guitar", "The guitar is ready on the stage."),
  "g-garden": lesson("G", "garden", "Garden", "The garden is full of green plants."),
  "g-gift": lesson("G", "gift", "Gift", "The gift sits under the party table."),
  "g-goat": lesson("G", "goat", "Goat", "The goat climbs on the farm hill."),
  // --- Letter H ---
  "h-hat": lesson("H", "hat", "Hat", "The hat rests on the cozy chair."),
  "h-house": lesson("H", "house", "House", "The house stands in the sunny yard."),
  "h-horse": lesson("H", "horse", "Horse", "The horse runs in the green field."),
  "h-heart": lesson("H", "heart", "Heart", "The heart floats by the bright window."),
  "h-honey": lesson("H", "honey", "Honey", "The honey jar sits on the kitchen table."),
  "h-helicopter": lesson("H", "helicopter", "Helicopter", "The helicopter flies through the clouds."),
  // --- Letter I ---
  "i-ice-cream": lesson("I", "ice-cream", "Ice cream", "The ice cream cools on the summer table."),
  "i-igloo": lesson("I", "igloo", "Igloo", "The igloo sits in the soft snow."),
  "i-island": lesson("I", "island", "Island", "The island rests in the blue ocean."),
  "i-insect": lesson("I", "insect", "Insect", "The insect crawls on a green leaf."),
  "i-iron": lesson("I", "iron", "Iron", "The iron waits on the laundry table."),
  "i-iguana": lesson("I", "iguana", "Iguana", "The iguana sits on a warm rock."),
  // --- Letter J ---
  "j-juice": lesson("J", "juice", "Juice", "The juice cup sits on the kitchen table."),
  "j-jellyfish": lesson("J", "jellyfish", "Jellyfish", "The jellyfish floats in the ocean."),
  "j-jacket": lesson("J", "jacket", "Jacket", "The jacket hangs by the front door."),
  "j-jam": lesson("J", "jam", "Jam", "The jam jar rests on the breakfast table."),
  "j-jungle": lesson("J", "jungle", "Jungle", "The jungle is full of green leaves."),
  "j-jet": lesson("J", "jet", "Jet", "The jet zooms through the sky."),
  // --- Letter K ---
  "k-kite": lesson("K", "kite", "Kite", "The kite flies high in the sky."),
  "k-kangaroo": lesson("K", "kangaroo", "Kangaroo", "The kangaroo hops on the savanna."),
  "k-key": lesson("K", "key", "Key", "The key waits by the bright door."),
  "k-king": lesson("K", "king", "King", "The king stands in the royal castle."),
  "k-kitchen": lesson("K", "kitchen", "Kitchen", "The kitchen is warm and ready."),
  "k-kitten": lesson("K", "kitten", "Kitten", "The kitten naps by the sunny window."),
  // --- Letter L ---
  "l-lion": lesson("L", "lion", "Lion", "The lion roars on the savanna."),
  "l-leaf": lesson("L", "leaf", "Leaf", "The leaf falls in the forest."),
  "l-lemon": lesson("L", "lemon", "Lemon", "The lemon sits on the kitchen table."),
  "l-lamp": lesson("L", "lamp", "Lamp", "The lamp glows in the cozy room."),
  "l-lollipop": lesson("L", "lollipop", "Lollipop", "The lollipop shines at the party."),
  "l-ladder": lesson("L", "ladder", "Ladder", "The ladder leans by the bright house."),
  // --- Letter M ---
  "m-moon": lesson("M", "moon", "Moon", "The moon shines in the night sky."),
  "m-monkey": lesson("M", "monkey", "Monkey", "The monkey swings in the jungle."),
  "m-mouse": lesson("M", "mouse", "Mouse", "The mouse peeks in the cozy kitchen."),
  "m-mountain": lesson("M", "mountain", "Mountain", "The mountain stands under the sky."),
  "m-milk": lesson("M", "milk", "Milk", "The milk glass sits on the table."),
  "m-mushroom": lesson("M", "mushroom", "Mushroom", "The mushroom grows in the forest."),
  // --- Letter N ---
  "n-nest": lesson("N", "nest", "Nest", "The nest sits high in the tree."),
  "n-night": lesson("N", "night", "Night", "The night is full of soft stars."),
  "n-nose": lesson("N", "nose", "Nose", "The nose is ready for a big sniff."),
  "n-notebook": lesson("N", "notebook", "Notebook", "The notebook rests on the school desk."),
  "n-noodle": lesson("N", "noodle", "Noodle", "The noodles steam in the kitchen bowl."),
  "n-net": lesson("N", "net", "Net", "The net waits by the blue ocean."),
  // --- Letter O ---
  "o-orange": lesson("O", "orange", "Orange", "The orange rolls on the kitchen table."),
  "o-owl": lesson("O", "owl", "Owl", "The owl watches from the night tree."),
  "o-ocean": lesson("O", "ocean", "Ocean", "The ocean waves under the sky."),
  "o-octopus": lesson("O", "octopus", "Octopus", "The octopus swims in the deep ocean."),
  "o-oven": lesson("O", "oven", "Oven", "The oven glows in the warm kitchen."),
  "o-ostrich": lesson("O", "ostrich", "Ostrich", "The ostrich runs on the savanna."),
  // --- Letter P ---
  "p-pizza": lesson("P", "pizza", "Pizza", "The pizza is ready on the kitchen table."),
  "p-penguin": lesson("P", "penguin", "Penguin", "The penguin slides on the ice."),
  "p-pig": lesson("P", "pig", "Pig", "The pig plays in the farm yard."),
  "p-pencil": lesson("P", "pencil", "Pencil", "The pencil waits on the school desk."),
  "p-piano": lesson("P", "piano", "Piano", "The piano is ready on the stage."),
  "p-puppy": lesson("P", "puppy", "Puppy", "The puppy plays in the sunny yard."),
  // --- Letter Q ---
  "q-queen": lesson("Q", "queen", "Queen", "The queen smiles in the castle."),
  "q-quilt": lesson("Q", "quilt", "Quilt", "The quilt covers the cozy bed."),
  "q-question": lesson("Q", "question", "Question", "The question mark floats by the desk."),
  "q-quiet": lesson("Q", "quiet", "Quiet", "Everything is quiet in the soft room."),
  "q-quack": lesson("Q", "quack", "Quack", "The duck goes quack by the pond."),
  "q-quarter": lesson("Q", "quarter", "Quarter", "The shiny quarter sits on the table."),
  // --- Letter R ---
  "r-rainbow": lesson("R", "rainbow", "Rainbow", "The rainbow arcs across the sky."),
  "r-robot": lesson("R", "robot", "Robot", "The robot waves in the playroom."),
  "r-rocket": lesson("R", "rocket", "Rocket", "The rocket blasts into outer space."),
  "r-rabbit": lesson("R", "rabbit", "Rabbit", "The rabbit hops in the garden."),
  "r-rose": lesson("R", "rose", "Rose", "The rose blooms in the garden."),
  "r-rain": lesson("R", "rain", "Rain", "The rain falls from the gray sky."),
  // --- Letter S ---
  "s-sun": lesson("S", "sun", "Sun", "The sun shines in the blue sky."),
  "s-star": lesson("S", "star", "Star", "The star twinkles in the night sky."),
  "s-snake": lesson("S", "snake", "Snake", "The snake slides in the jungle."),
  "s-ship": lesson("S", "ship", "Ship", "The ship sails on the blue ocean."),
  "s-smile": lesson("S", "smile", "Smile", "A big smile lights up the room."),
  "s-sock": lesson("S", "sock", "Sock", "The sock rests by the cozy bed."),
  // --- Letter T ---
  "t-tree": lesson("T", "tree", "Tree", "The tree grows in the green forest."),
  "t-tiger": lesson("T", "tiger", "Tiger", "The tiger prowls in the jungle."),
  "t-train": lesson("T", "train", "Train", "The train rolls down the track."),
  "t-turtle": lesson("T", "turtle", "Turtle", "The turtle walks by the pond."),
  "t-tomato": lesson("T", "tomato", "Tomato", "The tomato sits in the garden."),
  "t-tooth": lesson("T", "tooth", "Tooth", "The tooth sparkles in the bright room."),
  // --- Letter U ---
  "u-umbrella": lesson("U", "umbrella", "Umbrella", "The umbrella opens in the rain."),
  "u-unicorn": lesson("U", "unicorn", "Unicorn", "The unicorn sparkles in the magic forest."),
  "u-under": lesson("U", "under", "Under", "The toy is under the cozy table."),
  "u-uniform": lesson("U", "uniform", "Uniform", "The uniform hangs by the door."),
  "u-up": lesson("U", "up", "Up", "The balloon floats up in the sky."),
  "u-ukulele": lesson("U", "ukulele", "Ukulele", "The ukulele is ready on the stage."),
  // --- Letter V ---
  "v-violin": lesson("V", "violin", "Violin", "The violin plays on the stage."),
  "v-volcano": lesson("V", "volcano", "Volcano", "The volcano stands under the sky."),
  "v-van": lesson("V", "van", "Van", "The van drives down the road."),
  "v-vegetable": lesson("V", "vegetable", "Vegetable", "The vegetables sit in the kitchen."),
  "v-vest": lesson("V", "vest", "Vest", "The vest hangs by the sunny window."),
  "v-vacuum": lesson("V", "vacuum", "Vacuum", "The vacuum is ready in the room."),
  // --- Letter W ---
  "w-whale": lesson("W", "whale", "Whale", "The whale swims in the big ocean."),
  "w-water": lesson("W", "water", "Water", "The water sparkles in the pond."),
  "w-window": lesson("W", "window", "Window", "The window looks out at the yard."),
  "w-watch": lesson("W", "watch", "Watch", "The watch rests on the cozy table."),
  "w-worm": lesson("W", "worm", "Worm", "The worm wiggles in the garden dirt."),
  "w-wagon": lesson("W", "wagon", "Wagon", "The wagon rolls in the sunny yard."),
  // --- Letter X ---
  "x-xray": lesson("X", "xray", "X-ray", "The x-ray glows in the bright room."),
  "x-xylophone": lesson("X", "xylophone", "Xylophone", "The xylophone is ready on the stage."),
  "x-box": lesson("X", "box", "Box", "The box sits on the cozy floor."),
  "x-fox-x": lesson("X", "fox-x", "Fox", "The fox peeks from the forest."),
  "x-six": lesson("X", "six", "Six", "Six stars shine in the night sky."),
  "x-mix": lesson("X", "mix", "Mix", "We mix colors on the art table."),
  // --- Letter Y ---
  "y-yoyo": lesson("Y", "yoyo", "Yo-yo", "The yo-yo spins in the playroom."),
  "y-yellow": lesson("Y", "yellow", "Yellow", "Yellow paint shines on the art table."),
  "y-yak": lesson("Y", "yak", "Yak", "The yak stands on the mountain."),
  "y-yarn": lesson("Y", "yarn", "Yarn", "The yarn ball rests on the cozy chair."),
  "y-yacht": lesson("Y", "yacht", "Yacht", "The yacht sails on the blue ocean."),
  "y-yogurt": lesson("Y", "yogurt", "Yogurt", "The yogurt cup sits on the table."),
  // --- Letter Z ---
  "z-zebra": lesson("Z", "zebra", "Zebra", "The zebra runs on the savanna."),
  "z-zoo": lesson("Z", "zoo", "Zoo", "Friends visit the happy zoo."),
  "z-zipper": lesson("Z", "zipper", "Zipper", "The zipper closes on the jacket."),
  "z-zero": lesson("Z", "zero", "Zero", "Zero balloons float in the room."),
  "z-zigzag": lesson("Z", "zigzag", "Zigzag", "The zigzag path runs through the garden."),
  "z-zucchini": lesson("Z", "zucchini", "Zucchini", "The zucchini grows in the garden."),
};

export function wordLessonKey(letter: string, slug: string) {
  return `${letter.toLowerCase()}-${slug}`;
}

export function getWordLesson(letter: string, slug: string): WordLesson | null {
  return WORD_LESSONS[wordLessonKey(letter, slug)] ?? null;
}

export function wordRequiresVideo(letter: string, slug: string): boolean {
  return getWordLesson(letter, slug) != null;
}

export function allWordLessonPhrases(): string[] {
  const out = new Set<string>();
  for (const lesson of Object.values(WORD_LESSONS)) {
    out.add(lesson.word);
    out.add(lesson.sentence);
    out.add("Great job!");
    out.add(`${lesson.word}. ${lesson.word}. ${lesson.word}. ${lesson.sentence}`);
  }
  return [...out];
}
