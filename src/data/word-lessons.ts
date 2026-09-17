/**
 * Short video lessons for words.
 *
 * RULES (do not skip):
 * 1. Sentence = what is ON SCREEN (scene + action). Write sentence + clip together.
 * 2. If it still sounds like a kid would say it (never forced), pack that
 *    letter's sound 2–3 times in the sentence. A: apple/lands/table is fine
 *    if natural; "A happy apple angrily..." is not. Prefer a named subject
 *    (a boy, a kid, Ben, the puppy) over lazy "they + body part".
 * 3. Word-card thumbnail MUST be frame 1 of that word's video (not the end).
 * 4. Action must KEEP GOING through the sentence — do not freeze after a
 *    2-second gag. Unlock only after full lesson finishes.
 * 5. Snappy kid-cartoon, not creepy: fast beats (frog = ninja tongue, insta
 *    eat). Hatch = closed egg → poke → chick out. Fish fins are fins not
 *    hands. Clouds have no tails. One tail, two arms, two legs — extra
 *    ends = redo. Food has no face if it gets eaten. No
 *    movie-lookalikes. Friendly dinosaurs. Don't reuse the same action
 *    across words. An object stays that object — never morph into a person.
 *    Handheld props stay kid-scale, smaller than the child's head.
 *    No talking mouths — overlay narration is off-screen (word ×3, then
 *    sentence). Closed-mouth smile unless the gag is eating, yawning, or
 *    blowing. Remakes include native clip sound (foley / ambient / cartoon
 *    SFX). Do not bake the teacher voice or a song into the MP4. Toggle
 *    is exclusive: Narration = overlay, clip muted. Video sound = clip,
 *    no overlay. Set nativeAudio: true so the generic music bed stays
 *    off. Always generate remakes WITH sound in the MP4. Do not ffmpeg
 *    -an. Old silent clips keep the bed.
 *    State-change gags are one-way (peel stays off). No ping-pong.
 *    Locomotion must travel: the body changes place in the frame. No
 *    treadmill / running-in-place cycles. Travel clips do not loop.
 *    Before shipping a remake: look at start/mid/end frames
 *    (`python3 scripts/qa-word-frames.py VIDEO`). If anything is
 *    obviously wrong, redo. Do not write a new one-incident law.
 *    Letter-buddy face is on the front only; a turn shows a blank back.
 *    Full taste list: AGENTS.project.md.
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
  /**
   * Remake has diegetic clip audio. Skip the generic music bed and play
   * the MP4 unmuted under overlay narration.
   */
  nativeAudio?: boolean;
  /** TTS text when the on-screen word would be misread (Yo-yo → yo yo). */
  sayWord?: string;
  saySentence?: string;
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
  "e-elephant": { ...lesson("E", "elephant", "Elephant", "The elephant picks up a peanut."), durationSec: 10, loopVideo: true },
  "e-egg": { ...lesson("E", "egg", "Egg", "A chick pecks out of the egg."), durationSec: 10, loopVideo: false },
  "e-eagle": { ...lesson("E", "eagle", "Eagle", "The eagle sees the green trees."), durationSec: 10, loopVideo: true },
  "e-earth": { ...lesson("E", "earth", "Earth", "The Earth spins every day."), durationSec: 10, loopVideo: true },
  "e-elbow": { ...lesson("E", "elbow", "Elbow", "Ben bends his elbow."), durationSec: 10, loopVideo: true },
  "e-elf": { ...lesson("E", "elf", "Elf", "The elf helps a friend."), durationSec: 10, loopVideo: true },
  // --- Letter F ---
  "f-fish": { ...lesson("F", "fish", "Fish", "The fish flips its fin."), durationSec: 10, loopVideo: true },
  "f-frog": { ...lesson("F", "frog", "Frog", "The frog finds a fly."), durationSec: 10, loopVideo: true },
  "f-flower": { ...lesson("F", "flower", "Flower", "The flower faces the sun."), durationSec: 10, loopVideo: true },
  "f-firetruck": { ...lesson("F", "firetruck", "Firetruck", "The firetruck follows the fire."), durationSec: 10, loopVideo: true },
  "f-fox": { ...lesson("F", "fox", "Fox", "The fox finds a snack in the forest."), durationSec: 10, loopVideo: true },
  "f-fairy": { ...lesson("F", "fairy", "Fairy", "The fairy flies from the flower."), durationSec: 10, loopVideo: true },
  // --- Letter G ---
  "g-giraffe": { ...lesson("G", "giraffe", "Giraffe", "The giraffe grabs green leaves."), durationSec: 10, loopVideo: true },
  "g-grapes": { ...lesson("G", "grapes", "Grapes", "The grapes grow in the garden."), durationSec: 10, loopVideo: true },
  "g-guitar": { ...lesson("G", "guitar", "Guitar", "A girl plays the guitar."), durationSec: 10, loopVideo: true },
  "g-garden": { ...lesson("G", "garden", "Garden", "Green plants grow in the garden."), durationSec: 10, loopVideo: true },
  "g-gift": { ...lesson("G", "gift", "Gift", "A girl opens a green gift."), durationSec: 10, loopVideo: false },
  "g-goat": { ...lesson("G", "goat", "Goat", "The goat gobbles the grass."), durationSec: 10, loopVideo: true },
  // --- Letter H ---
  "h-hat": { ...lesson("H", "hat", "Hat", "Hugo puts on his hat."), durationSec: 10, loopVideo: false },
  "h-house": { ...lesson("H", "house", "House", "Hank hides in the house."), durationSec: 10, loopVideo: false },
  "h-horse": { ...lesson("H", "horse", "Horse", "The horse hurries up the hill."), durationSec: 10, loopVideo: false, nativeAudio: true },
  "h-heart": { ...lesson("H", "heart", "Heart", "Holly draws a heart."), durationSec: 10, loopVideo: false, nativeAudio: true },
  "h-honey": { ...lesson("H", "honey", "Honey", "Hank has honey on his toast."), durationSec: 10, loopVideo: true },
  "h-helicopter": { ...lesson("H", "helicopter", "Helicopter", "The helicopter hovers high."), durationSec: 10, loopVideo: true },
  // --- Letter I ---
  "i-ice-cream": { ...lesson("I", "ice-cream", "Ice cream", "Isla licks her ice cream."), durationSec: 10, loopVideo: true },
  "i-igloo": { ...lesson("I", "igloo", "Igloo", "Ivan builds an igloo."), durationSec: 10, loopVideo: false },
  "i-island": { ...lesson("I", "island", "Island", "Isla plays on the island."), durationSec: 10, loopVideo: true },
  "i-insect": { ...lesson("I", "insect", "Insect", "Ivy finds an insect."), durationSec: 10, loopVideo: false },
  "i-iron": { ...lesson("I", "iron", "Iron", "Ivan irons a shirt."), durationSec: 10, loopVideo: true },
  "i-iguana": { ...lesson("I", "iguana", "Iguana", "The iguana climbs the ivy."), durationSec: 10, loopVideo: true },
  // --- Letter J ---
  "j-juice": { ...lesson("J", "juice", "Juice", "Jack drinks juice."), durationSec: 10, loopVideo: true },
  "j-jellyfish": { ...lesson("J", "jellyfish", "Jellyfish", "The jellyfish jiggles."), durationSec: 10, loopVideo: true },
  "j-jacket": { ...lesson("J", "jacket", "Jacket", "Jack zips his jacket."), durationSec: 10, loopVideo: false },
  "j-jam": { ...lesson("J", "jam", "Jam", "Jill opens a jam jar."), durationSec: 10, loopVideo: false },
  "j-jungle": { ...lesson("J", "jungle", "Jungle", "Jack jumps in the jungle."), durationSec: 10, loopVideo: true },
  "j-jet": { ...lesson("J", "jet", "Jet", "The jet zooms by Jack."), durationSec: 10, loopVideo: true },
  // --- Letter K ---
  "k-kite": { ...lesson("K", "kite", "Kite", "Ken flies a kite."), durationSec: 10, loopVideo: true },
  "k-kangaroo": { ...lesson("K", "kangaroo", "Kangaroo", "The kangaroo hops with a joey."), durationSec: 10, loopVideo: true },
  "k-key": { ...lesson("K", "key", "Key", "Kim turns the key."), durationSec: 10, loopVideo: false },
  "k-king": { ...lesson("K", "king", "King", "The king puts on a crown."), durationSec: 10, loopVideo: false },
  "k-kitchen": { ...lesson("K", "kitchen", "Kitchen", "Kim cooks in the kitchen."), durationSec: 10, loopVideo: true },
  "k-kitten": { ...lesson("K", "kitten", "Kitten", "The kitten pounces."), durationSec: 10, loopVideo: true },
  // --- Letter L ---
  "l-lion": { ...lesson("L", "lion", "Lion", "The lion leaps."), durationSec: 10, loopVideo: true },
  "l-leaf": { ...lesson("L", "leaf", "Leaf", "The leaf twirls."), durationSec: 10, loopVideo: true },
  "l-lemon": { ...lesson("L", "lemon", "Lemon", "Lily squeezes a lemon."), durationSec: 10, loopVideo: true },
  "l-lamp": { ...lesson("L", "lamp", "Lamp", "Lily lights the lamp."), durationSec: 10, loopVideo: false },
  "l-lollipop": { ...lesson("L", "lollipop", "Lollipop", "Lily unwraps a lollipop."), durationSec: 10, loopVideo: false },
  "l-ladder": { ...lesson("L", "ladder", "Ladder", "Leo goes up the ladder."), durationSec: 10, loopVideo: false },
  // --- Letter M ---
  "m-moon": { ...lesson("M", "moon", "Moon", "Mia smiles at the moon."), durationSec: 10, loopVideo: true },
  "m-monkey": { ...lesson("M", "monkey", "Monkey", "The monkey hangs by its tail."), durationSec: 10, loopVideo: true },
  "m-mouse": { ...lesson("M", "mouse", "Mouse", "The mouse nibbles cheese."), durationSec: 10, loopVideo: true },
  "m-mountain": { ...lesson("M", "mountain", "Mountain", "Mia hikes up the mountain."), durationSec: 10, loopVideo: true },
  "m-milk": { ...lesson("M", "milk", "Milk", "Mia sips milk."), durationSec: 10, loopVideo: true },
  "m-mushroom": { ...lesson("M", "mushroom", "Mushroom", "A mushroom pops up."), durationSec: 10, loopVideo: false },
  // --- Letter N ---
  "n-nest": { ...lesson("N", "nest", "Nest", "A bird brings twigs to the nest."), durationSec: 10, loopVideo: true },
  "n-night": { ...lesson("N", "night", "Night", "Nina snuggles at night."), durationSec: 10, loopVideo: true },
  "n-nose": { ...lesson("N", "nose", "Nose", "Nina wrinkles her nose."), durationSec: 10, loopVideo: true },
  "n-notebook": { ...lesson("N", "notebook", "Notebook", "Nina writes in a notebook."), durationSec: 10, loopVideo: true },
  "n-noodle": { ...lesson("N", "noodle", "Noodles", "Nina slurps noodles."), durationSec: 10, loopVideo: true },
  "n-net": { ...lesson("N", "net", "Net", "Nina catches with a net."), durationSec: 10, loopVideo: true },
  // --- Letter O ---
  "o-orange": { ...lesson("O", "orange", "Orange", "Otto peels an orange."), durationSec: 10, loopVideo: false },
  "o-owl": { ...lesson("O", "owl", "Owl", "The owl hoots."), durationSec: 10, loopVideo: true },
  "o-ocean": { ...lesson("O", "ocean", "Ocean", "Otto splashes in the ocean."), durationSec: 10, loopVideo: true },
  "o-octopus": { ...lesson("O", "octopus", "Octopus", "The octopus juggles."), durationSec: 10, loopVideo: true },
  "o-oven": { ...lesson("O", "oven", "Oven", "Otto peeks in the oven."), durationSec: 10, loopVideo: false },
  "o-ostrich": { ...lesson("O", "ostrich", "Ostrich", "The ostrich flaps."), durationSec: 10, loopVideo: true },
  // --- Letter P ---
  "p-pizza": { ...lesson("P", "pizza", "Pizza", "Pip spins a pizza."), durationSec: 10, loopVideo: true },
  "p-penguin": { ...lesson("P", "penguin", "Penguin", "The penguin slides on the ice."), durationSec: 10, loopVideo: true },
  "p-pig": { ...lesson("P", "pig", "Pig", "The pig rolls in mud."), durationSec: 10, loopVideo: true },
  "p-pencil": { ...lesson("P", "pencil", "Pencil", "Pip sharpens a pencil."), durationSec: 10, loopVideo: true },
  "p-piano": { ...lesson("P", "piano", "Piano", "Pip taps the piano keys."), durationSec: 10, loopVideo: true },
  "p-puppy": { ...lesson("P", "puppy", "Puppy", "The puppy wags its tail."), durationSec: 10, loopVideo: true },
  // --- Letter Q ---
  "q-queen": { ...lesson("Q", "queen", "Queen", "The queen twirls."), durationSec: 10, loopVideo: true },
  "q-quilt": { ...lesson("Q", "quilt", "Quilt", "Quinn snuggles in a quilt."), durationSec: 10, loopVideo: true },
  "q-question": { ...lesson("Q", "question", "Question", "Quinn asks a question."), durationSec: 10, loopVideo: true },
  "q-quiet": { ...lesson("Q", "quiet", "Quiet", "Quinn tiptoes."), durationSec: 10, loopVideo: true },
  "q-quack": { ...lesson("Q", "quack", "Quack", "A duck quacks."), durationSec: 10, loopVideo: true },
  "q-quarter": { ...lesson("Q", "quarter", "Quarter", "Quinn flips a quarter."), durationSec: 10, loopVideo: true },
  // --- Letter R ---
  "r-rainbow": { ...lesson("R", "rainbow", "Rainbow", "Rita points at a rainbow."), durationSec: 10, loopVideo: true },
  "r-robot": { ...lesson("R", "robot", "Robot", "The robot marches."), durationSec: 10, loopVideo: true },
  "r-rocket": { ...lesson("R", "rocket", "Rocket", "The rocket blasts off."), durationSec: 10, loopVideo: false },
  "r-rabbit": { ...lesson("R", "rabbit", "Rabbit", "The rabbit munches a carrot."), durationSec: 10, loopVideo: true },
  "r-rose": { ...lesson("R", "rose", "Rose", "Rita smells a rose."), durationSec: 10, loopVideo: true },
  "r-rain": { ...lesson("R", "rain", "Rain", "Rain drips on Rita."), durationSec: 10, loopVideo: true },
  // --- Letter S ---
  "s-sun": { ...lesson("S", "sun", "Sun", "The sun rises."), durationSec: 10, loopVideo: false },
  "s-star": { ...lesson("S", "star", "Star", "Sam spots a star."), durationSec: 10, loopVideo: true },
  "s-snake": { ...lesson("S", "snake", "Snake", "The snake slithers."), durationSec: 10, loopVideo: true },
  "s-ship": { ...lesson("S", "ship", "Ship", "Sam steers the ship."), durationSec: 10, loopVideo: true },
  "s-smile": { ...lesson("S", "smile", "Smile", "Sam smiles."), durationSec: 10, loopVideo: true },
  "s-sock": { ...lesson("S", "sock", "Sock", "Sam tosses a sock."), durationSec: 10, loopVideo: true },
  // --- Letter T ---
  "t-tree": { ...lesson("T", "tree", "Tree", "Tess hugs a tree."), durationSec: 10, loopVideo: true },
  "t-tiger": { ...lesson("T", "tiger", "Tiger", "The tiger yawns."), durationSec: 10, loopVideo: true },
  "t-train": { ...lesson("T", "train", "Train", "The train toots."), durationSec: 10, loopVideo: true },
  "t-turtle": { ...lesson("T", "turtle", "Turtle", "The turtle tucks in."), durationSec: 10, loopVideo: false },
  "t-tomato": { ...lesson("T", "tomato", "Tomato", "Tess picks a tomato."), durationSec: 10, loopVideo: false },
  "t-tooth": { ...lesson("T", "tooth", "Tooth", "Tess wiggles a tooth."), durationSec: 10, loopVideo: true },
  // --- Letter U ---
  "u-umbrella": { ...lesson("U", "umbrella", "Umbrella", "Uma opens an umbrella."), durationSec: 10, loopVideo: false },
  "u-unicorn": { ...lesson("U", "unicorn", "Unicorn", "The unicorn prances."), durationSec: 10, loopVideo: true },
  "u-under": { ...lesson("U", "under", "Under", "Uma crawls under the table."), durationSec: 10, loopVideo: true },
  "u-uniform": { ...lesson("U", "uniform", "Uniform", "Uma buttons her uniform."), durationSec: 10, loopVideo: false },
  "u-up": { ...lesson("U", "up", "Up", "Uma jumps up."), durationSec: 10, loopVideo: true },
  "u-ukulele": { ...lesson("U", "ukulele", "Ukulele", "Uma plucks the ukulele."), durationSec: 10, loopVideo: true },
  // --- Letter V ---
  "v-violin": { ...lesson("V", "violin", "Violin", "Vin bows the violin."), durationSec: 10, loopVideo: true },
  "v-volcano": { ...lesson("V", "volcano", "Volcano", "The volcano puffs smoke."), durationSec: 10, loopVideo: true },
  "v-van": { ...lesson("V", "van", "Van", "Vin's van beeps."), durationSec: 10, loopVideo: true },
  "v-vegetable": { ...lesson("V", "vegetable", "Vegetable", "Vin washes vegetables."), durationSec: 10, loopVideo: true },
  "v-vest": { ...lesson("V", "vest", "Vest", "Vin buttons a vest."), durationSec: 10, loopVideo: false },
  "v-vacuum": { ...lesson("V", "vacuum", "Vacuum", "Vin vacuums."), durationSec: 10, loopVideo: true },
  // --- Letter W ---
  "w-whale": { ...lesson("W", "whale", "Whale", "The whale blows a spray."), durationSec: 10, loopVideo: true },
  "w-water": { ...lesson("W", "water", "Water", "Wes waters a plant."), durationSec: 10, loopVideo: true },
  "w-window": { ...lesson("W", "window", "Window", "Wes peeks out the window."), durationSec: 10, loopVideo: true },
  "w-watch": { ...lesson("W", "watch", "Watch", "Wes winds a watch."), durationSec: 10, loopVideo: true },
  "w-worm": { ...lesson("W", "worm", "Worm", "The worm wiggles."), durationSec: 10, loopVideo: true },
  "w-wagon": { ...lesson("W", "wagon", "Wagon", "Wes pulls a wagon."), durationSec: 10, loopVideo: true },
  // --- Letter X ---
  "x-xray": { ...lesson("X", "xray", "X-ray", "Max sees an x-ray."), durationSec: 10, loopVideo: true },
  "x-xylophone": { ...lesson("X", "xylophone", "Xylophone", "Max taps the xylophone."), durationSec: 10, loopVideo: true },
  "x-box": { ...lesson("X", "box", "Box", "Max stacks boxes."), durationSec: 10, loopVideo: true },
  "x-fox-x": { ...lesson("X", "fox-x", "Fox", "Max spots a fox."), durationSec: 10, loopVideo: true },
  "x-six": { ...lesson("X", "six", "Six", "Max counts to six."), durationSec: 10, loopVideo: true },
  "x-mix": { ...lesson("X", "mix", "Mix", "Max mixes pancake batter."), durationSec: 10, loopVideo: true },
  // --- Letter Y ---
  "y-yoyo": {
    ...lesson("Y", "yoyo", "Yo-yo", "The yo-yo goes down and up."),
    durationSec: 10,
    loopVideo: true,
    sayWord: "YO yo",
    saySentence: "The yo yo goes down and up.",
  },
  "y-yellow": { ...lesson("Y", "yellow", "Yellow", "Yasmin paints with yellow."), durationSec: 10, loopVideo: true },
  "y-yak": { ...lesson("Y", "yak", "Yak", "The yak yawns."), durationSec: 10, loopVideo: true },
  "y-yarn": { ...lesson("Y", "yarn", "Yarn", "Yasmin winds yarn."), durationSec: 10, loopVideo: true },
  "y-yacht": { ...lesson("Y", "yacht", "Yacht", "Yasmin waves from a yacht."), durationSec: 10, loopVideo: true },
  "y-yogurt": { ...lesson("Y", "yogurt", "Yogurt", "Yasmin spoons yogurt."), durationSec: 10, loopVideo: true },
  // --- Letter Z ---
  "z-zebra": { ...lesson("Z", "zebra", "Zebra", "The zebra zigzags."), durationSec: 10, loopVideo: true },
  "z-zoo": { ...lesson("Z", "zoo", "Zoo", "Zed visits the zoo."), durationSec: 10, loopVideo: true },
  "z-zipper": { ...lesson("Z", "zipper", "Zipper", "Zed zips the zipper."), durationSec: 6, loopVideo: false, nativeAudio: true },
  "z-zero": { ...lesson("Z", "zero", "Zero", "Zed writes a zero."), durationSec: 10, loopVideo: true },
  "z-zigzag": { ...lesson("Z", "zigzag", "Zigzag", "Zed runs a zigzag."), durationSec: 10, loopVideo: true },
  "z-zucchini": { ...lesson("Z", "zucchini", "Zucchini", "Zed washes a zucchini."), durationSec: 10, loopVideo: true },
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
    if (lesson.sayWord) out.add(lesson.sayWord);
    if (lesson.saySentence) out.add(lesson.saySentence);
    const w = lesson.sayWord ?? lesson.word;
    const s = lesson.saySentence ?? lesson.sentence;
    out.add("Great job!");
    out.add(`${w}. ${w}. ${w}. ${s}`);
  }
  return [...out];
}
