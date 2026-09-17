import type { LetterEntry, WordEntry } from "./alphabet";

/** How actors move on the story stage for this beat. */
export type StoryAction =
  | "find"
  | "fly"
  | "bounce"
  | "share"
  | "wave"
  | "zoom"
  | "climb"
  | "splash"
  | "dance"
  | "celebrate";

/** Backdrop mood for the stage. */
export type StoryScene =
  | "sky"
  | "beach"
  | "garden"
  | "kitchen"
  | "night"
  | "ocean"
  | "home"
  | "space"
  | "party"
  | "forest";

export type StoryBeat = {
  /** Exact spoken line (must match speech-map / neural clips). */
  text: string;
  action: StoryAction;
  scene: StoryScene;
  /** Word slugs that star in this beat (in stage order). */
  cast: string[];
};

/**
 * Structured story theater: spoken lines match pre-generated neural audio,
 * plus scene + action + cast so words act out each moment on stage.
 */
const STORY_BEATS: Record<string, StoryBeat[]> = {
  A: [
    {
      text: "An ant found a shiny apple by an anchor.",
      action: "find",
      scene: "beach",
      cast: ["ant", "apple", "anchor"],
    },
    {
      text: "An airplane flew over an alligator, and an astronaut waved hello.",
      action: "fly",
      scene: "sky",
      cast: ["airplane", "alligator", "astronaut"],
    },
    {
      text: "The airplane landed by the anchor. The astronaut shared the apple with the ant, and the alligator waved goodbye.",
      action: "share",
      scene: "beach",
      cast: ["airplane", "anchor", "astronaut", "apple", "ant", "alligator"],
    },
  ],
  B: [
    {
      text: "A bear bounced a ball beside a banana boat.",
      action: "bounce",
      scene: "ocean",
      cast: ["bear", "ball", "banana", "boat"],
    },
    {
      text: "A bird and a butterfly flew over and grabbed the ball.",
      action: "fly",
      scene: "ocean",
      cast: ["bird", "butterfly", "ball"],
    },
    {
      text: "The bird dropped the ball in the boat. The bear peeled a banana, and they all sat together.",
      action: "share",
      scene: "ocean",
      cast: ["bird", "ball", "boat", "bear", "banana", "butterfly"],
    },
  ],
  C: [
    {
      text: "A cat baked a cake.",
      action: "share",
      scene: "kitchen",
      cast: ["cat", "cake"],
    },
    {
      text: "The cat drove the car under a cloud.",
      action: "zoom",
      scene: "sky",
      cast: ["cat", "car", "cloud"],
    },
    {
      text: "The cat dunked a cookie in a cup.",
      action: "share",
      scene: "kitchen",
      cast: ["cat", "cookie", "cup"],
    },
  ],
  D: [
    {
      text: "A dog knocked on the door.",
      action: "wave",
      scene: "home",
      cast: ["dog", "door"],
    },
    {
      text: "A duck brought a donut.",
      action: "share",
      scene: "home",
      cast: ["duck", "donut"],
    },
    {
      text: "The dinosaur played the drum.",
      action: "dance",
      scene: "home",
      cast: ["dinosaur", "drum"],
    },
  ],
  E: [
    {
      text: "An elf found an egg.",
      action: "find",
      scene: "forest",
      cast: ["elf", "egg"],
    },
    {
      text: "An elephant kept the egg safe.",
      action: "share",
      scene: "garden",
      cast: ["elephant", "egg"],
    },
    {
      text: "A baby eagle hatched from the egg.",
      action: "find",
      scene: "garden",
      cast: ["eagle", "egg"],
    },
  ],
  F: [
    {
      text: "A frog hopped to a flower.",
      action: "bounce",
      scene: "garden",
      cast: ["frog", "flower"],
    },
    {
      text: "A fish splashed near the ferry.",
      action: "splash",
      scene: "ocean",
      cast: ["fish"],
    },
    {
      text: "A fox sat by the flower.",
      action: "wave",
      scene: "garden",
      cast: ["fox", "flower"],
    },
  ],
  G: [
    {
      text: "A giraffe in the garden plucked grapes.",
      action: "find",
      scene: "garden",
      cast: ["giraffe", "garden", "grapes"],
    },
    {
      text: "A gift sat under a guitar while a goat munched nearby.",
      action: "share",
      scene: "home",
      cast: ["gift", "guitar", "goat"],
    },
    {
      text: "“Gorgeous!” giggled the giraffe.",
      action: "wave",
      scene: "party",
      cast: ["giraffe", "goat", "grapes"],
    },
  ],
  H: [
    {
      text: "A horse wore a happy hat near a house.",
      action: "wave",
      scene: "home",
      cast: ["horse", "hat", "house"],
    },
    {
      text: "A heart of honey made everyone smile as a helicopter whirred past.",
      action: "fly",
      scene: "sky",
      cast: ["heart", "honey", "helicopter"],
    },
    {
      text: "Hooray!",
      action: "celebrate",
      scene: "party",
      cast: ["hat", "house", "horse", "heart", "honey", "helicopter"],
    },
  ],
  I: [
    {
      text: "Ice cream melted by an igloo on an island.",
      action: "find",
      scene: "beach",
      cast: ["ice-cream", "igloo", "island"],
    },
    {
      text: "An insect hummed while an iron pressed a flag, and an iguana lounged in the sun.",
      action: "wave",
      scene: "garden",
      cast: ["insect", "iron", "iguana"],
    },
    {
      text: "Incredible!",
      action: "celebrate",
      scene: "party",
      cast: ["ice-cream", "igloo", "island", "insect", "iron", "iguana"],
    },
  ],
  J: [
    {
      text: "Juice dripped on a jacket in the jungle.",
      action: "splash",
      scene: "forest",
      cast: ["juice", "jacket", "jungle"],
    },
    {
      text: "A jellyfish jiggled, jam tasted sweet, and a jet streaked across the sky.",
      action: "bounce",
      scene: "ocean",
      cast: ["jellyfish", "jam", "jet"],
    },
    {
      text: "Joyful jump!",
      action: "celebrate",
      scene: "party",
      cast: ["juice", "jellyfish", "jacket", "jam", "jungle", "jet"],
    },
  ],
  K: [
    {
      text: "A kangaroo flew a kite with a key on a string.",
      action: "fly",
      scene: "sky",
      cast: ["kangaroo", "kite", "key"],
    },
    {
      text: "The king danced in the kitchen with a tiny kitten.",
      action: "dance",
      scene: "kitchen",
      cast: ["king", "kitchen", "kitten"],
    },
    {
      text: "Keep kicking, K!",
      action: "celebrate",
      scene: "party",
      cast: ["kite", "kangaroo", "key", "king", "kitchen", "kitten"],
    },
  ],
  L: [
    {
      text: "A lion under a leaf licked a lemon lollipop by a lamp, then climbed a ladder of light.",
      action: "climb",
      scene: "forest",
      cast: ["lion", "leaf", "lemon", "lollipop", "lamp", "ladder"],
    },
    {
      text: "Lovely!",
      action: "celebrate",
      scene: "party",
      cast: ["lion", "leaf", "lemon", "lamp", "lollipop", "ladder"],
    },
  ],
  M: [
    {
      text: "A monkey and a mouse climbed a mountain under the moon, sipping milk and spotting a mushroom.",
      action: "climb",
      scene: "night",
      cast: ["monkey", "mouse", "mountain", "moon", "milk", "mushroom"],
    },
    {
      text: "Magical!",
      action: "celebrate",
      scene: "party",
      cast: ["moon", "monkey", "mouse", "mountain", "milk", "mushroom"],
    },
  ],
  N: [
    {
      text: "At night, a nose sniffed a nest.",
      action: "find",
      scene: "night",
      cast: ["nose", "nest"],
    },
    {
      text: "A notebook held noodle doodles next to a net.",
      action: "share",
      scene: "home",
      cast: ["notebook", "noodle", "net"],
    },
    {
      text: "Nice and neat!",
      action: "celebrate",
      scene: "party",
      cast: ["nest", "night", "nose", "notebook", "noodle", "net"],
    },
  ],
  O: [
    {
      text: "An owl watched the ocean.",
      action: "wave",
      scene: "ocean",
      cast: ["owl", "ocean"],
    },
    {
      text: "An octopus hugged an orange near a warm oven while an ostrich raced by.",
      action: "zoom",
      scene: "kitchen",
      cast: ["octopus", "orange", "oven", "ostrich"],
    },
    {
      text: "Oh my!",
      action: "celebrate",
      scene: "party",
      cast: ["orange", "owl", "ocean", "octopus", "oven", "ostrich"],
    },
  ],
  P: [
    {
      text: "A penguin played piano while a pig ate pizza.",
      action: "dance",
      scene: "home",
      cast: ["penguin", "piano", "pig", "pizza"],
    },
    {
      text: "A pencil drew a puppy.",
      action: "find",
      scene: "garden",
      cast: ["pencil", "puppy"],
    },
    {
      text: "Perfect!",
      action: "celebrate",
      scene: "party",
      cast: ["pizza", "penguin", "pig", "pencil", "piano", "puppy"],
    },
  ],
  Q: [
    {
      text: "The queen quilted quietly.",
      action: "wave",
      scene: "home",
      cast: ["queen", "quilt"],
    },
    {
      text: "“Question?” she asked.",
      action: "wave",
      scene: "home",
      cast: ["question", "queen"],
    },
    {
      text: "A duck said quack and found a quarter.",
      action: "find",
      scene: "garden",
      cast: ["quack", "quarter"],
    },
    {
      text: "Quite quirky!",
      action: "celebrate",
      scene: "party",
      cast: ["queen", "quilt", "question", "quiet", "quack", "quarter"],
    },
  ],
  R: [
    {
      text: "A rabbit rode a rocket over a rainbow.",
      action: "fly",
      scene: "space",
      cast: ["rabbit", "rocket", "rainbow"],
    },
    {
      text: "A robot smelled a rose in the soft rain.",
      action: "find",
      scene: "garden",
      cast: ["robot", "rose", "rain"],
    },
    {
      text: "Ready, set, roar!",
      action: "celebrate",
      scene: "party",
      cast: ["rainbow", "robot", "rocket", "rabbit", "rose", "rain"],
    },
  ],
  S: [
    {
      text: "The sun and a star smiled on a snake on a ship.",
      action: "wave",
      scene: "ocean",
      cast: ["sun", "star", "snake", "ship"],
    },
    {
      text: "Everyone shared a smile and a cozy sock.",
      action: "share",
      scene: "home",
      cast: ["smile", "sock"],
    },
    {
      text: "Super!",
      action: "celebrate",
      scene: "party",
      cast: ["sun", "star", "snake", "ship", "smile", "sock"],
    },
  ],
  T: [
    {
      text: "A tiger sat in a tree by a train.",
      action: "wave",
      scene: "forest",
      cast: ["tiger", "tree", "train"],
    },
    {
      text: "A turtle nibbled a tomato and found a shiny tooth.",
      action: "find",
      scene: "garden",
      cast: ["turtle", "tomato", "tooth"],
    },
    {
      text: "Terrific!",
      action: "celebrate",
      scene: "party",
      cast: ["tree", "tiger", "train", "turtle", "tomato", "tooth"],
    },
  ],
  U: [
    {
      text: "Under an umbrella, a unicorn put on a uniform, looked up, and strummed a ukulele.",
      action: "dance",
      scene: "sky",
      cast: ["umbrella", "unicorn", "uniform", "up", "ukulele"],
    },
    {
      text: "Unbelievable!",
      action: "celebrate",
      scene: "party",
      cast: ["umbrella", "unicorn", "under", "uniform", "up", "ukulele"],
    },
  ],
  V: [
    {
      text: "A van carried a violin past a volcano full of vegetables.",
      action: "zoom",
      scene: "garden",
      cast: ["van", "violin", "volcano", "vegetable"],
    },
    {
      text: "Someone wore a vest and pushed a vacuum.",
      action: "dance",
      scene: "home",
      cast: ["vest", "vacuum"],
    },
    {
      text: "Vivacious!",
      action: "celebrate",
      scene: "party",
      cast: ["violin", "volcano", "van", "vegetable", "vest", "vacuum"],
    },
  ],
  W: [
    {
      text: "A whale watched water through a window.",
      action: "wave",
      scene: "ocean",
      cast: ["whale", "water", "window"],
    },
    {
      text: "A worm checked a watch from a red wagon.",
      action: "zoom",
      scene: "garden",
      cast: ["worm", "watch", "wagon"],
    },
    {
      text: "Wonderful!",
      action: "celebrate",
      scene: "party",
      cast: ["whale", "water", "window", "watch", "worm", "wagon"],
    },
  ],
  X: [
    {
      text: "An x-ray showed a xylophone in a box.",
      action: "find",
      scene: "home",
      cast: ["xray", "xylophone", "box"],
    },
    {
      text: "A fox counted to six and began to mix.",
      action: "dance",
      scene: "kitchen",
      cast: ["fox-x", "six", "mix"],
    },
    {
      text: "Extra exciting!",
      action: "celebrate",
      scene: "party",
      cast: ["xray", "xylophone", "box", "fox-x", "six", "mix"],
    },
  ],
  Y: [
    {
      text: "A yak bounced a yo-yo with yellow yarn on a yacht, then spooned yogurt.",
      action: "bounce",
      scene: "ocean",
      cast: ["yak", "yoyo", "yellow", "yarn", "yacht", "yogurt"],
    },
    {
      text: "Yes, yes, yes!",
      action: "celebrate",
      scene: "party",
      cast: ["yoyo", "yellow", "yak", "yarn", "yacht", "yogurt"],
    },
  ],
  Z: [
    {
      text: "A zebra zipped to the zoo.",
      action: "zoom",
      scene: "garden",
      cast: ["zebra", "zoo"],
    },
    {
      text: "Zero worries — just a zigzag path past a zucchini patch.",
      action: "bounce",
      scene: "garden",
      cast: ["zero", "zigzag", "zucchini", "zebra"],
    },
    {
      text: "Zany and fun!",
      action: "celebrate",
      scene: "party",
      cast: ["zebra", "zoo", "zipper", "zero", "zigzag", "zucchini"],
    },
  ],
};

function resolveCast(entry: LetterEntry, slugs: string[]): WordEntry[] {
  const bySlug = new Map(entry.words.map((w) => [w.slug, w]));
  const out: WordEntry[] = [];
  for (const s of slugs) {
    const w = bySlug.get(s);
    if (w) out.push(w);
  }
  return out.length ? out : entry.words.slice(0, 3);
}

export function getStoryBeats(entry: LetterEntry): Array<
  StoryBeat & { words: WordEntry[] }
> {
  const raw = STORY_BEATS[entry.letter];
  if (!raw) {
    const text = `Once upon a time, ${entry.words.map((w) => w.word).join(", ")} had a wonderful ${entry.letter} day together!`;
    return [
      {
        text,
        action: "celebrate",
        scene: "party",
        cast: entry.words.map((w) => w.slug),
        words: [...entry.words],
      },
    ];
  }
  return raw.map((b) => ({
    ...b,
    words: resolveCast(entry, b.cast),
  }));
}

/** Full story string (for speech map / collect-speech). */
export function getLetterStory(entry: LetterEntry): string {
  return getStoryBeats(entry)
    .map((b) => b.text)
    .join(" ");
}

/** Split story into short lines for display / sequential speak. */
export function storyLines(story: string): string[] {
  return story
    .split(/(?<=[.!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
