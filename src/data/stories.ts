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
      text: "A goat opened a gift.",
      action: "find",
      scene: "home",
      cast: ["goat", "gift"],
    },
    {
      text: "A guitar popped out.",
      action: "bounce",
      scene: "home",
      cast: ["guitar"],
    },
    {
      text: "A giraffe strummed the guitar.",
      action: "dance",
      scene: "home",
      cast: ["giraffe", "guitar"],
    },
  ],
  H: [
    {
      text: "A helicopter landed by the house.",
      action: "fly",
      scene: "home",
      cast: ["helicopter", "house"],
    },
    {
      text: "A horse put on a hat.",
      action: "wave",
      scene: "home",
      cast: ["horse", "hat"],
    },
    {
      text: "The horse ate honey.",
      action: "share",
      scene: "home",
      cast: ["horse", "honey"],
    },
  ],
  I: [
    {
      text: "An iguana carried ice cream on an island.",
      action: "find",
      scene: "beach",
      cast: ["iguana", "ice-cream", "island"],
    },
    {
      text: "The ice cream started melting.",
      action: "splash",
      scene: "beach",
      cast: ["ice-cream"],
    },
    {
      text: "The iguana ran into an igloo.",
      action: "zoom",
      scene: "beach",
      cast: ["iguana", "igloo"],
    },
  ],
  J: [
    {
      text: "A jaguar packed juice.",
      action: "share",
      scene: "home",
      cast: ["jaguar", "juice"],
    },
    {
      text: "The jaguar put on a jacket.",
      action: "wave",
      scene: "home",
      cast: ["jaguar", "jacket"],
    },
    {
      text: "The jaguar took the juice on a jet.",
      action: "fly",
      scene: "sky",
      cast: ["jaguar", "juice", "jet"],
    },
  ],
  K: [
    {
      text: "A kitten lost a key.",
      action: "find",
      scene: "kitchen",
      cast: ["kitten", "key"],
    },
    {
      text: "A kangaroo found the key.",
      action: "find",
      scene: "kitchen",
      cast: ["kangaroo", "key"],
    },
    {
      text: "The key opened the kitchen.",
      action: "share",
      scene: "kitchen",
      cast: ["key", "kitchen"],
    },
  ],
  L: [
    {
      text: "A lion bit a lemon.",
      action: "find",
      scene: "garden",
      cast: ["lion", "lemon"],
    },
    {
      text: "The lemon was sour.",
      action: "wave",
      scene: "garden",
      cast: ["lemon"],
    },
    {
      text: "The lion licked a lollipop.",
      action: "share",
      scene: "garden",
      cast: ["lion", "lollipop"],
    },
  ],
  M: [
    {
      text: "A mouse hid under a mushroom.",
      action: "find",
      scene: "forest",
      cast: ["mouse", "mushroom"],
    },
    {
      text: "A monkey squeezed under the mushroom.",
      action: "share",
      scene: "forest",
      cast: ["monkey", "mushroom"],
    },
    {
      text: "The monkey mixed the milkshake.",
      action: "share",
      scene: "forest",
      cast: ["monkey", "milk"],
    },
  ],
  N: [
    {
      text: "A newt sniffed a nest.",
      action: "find",
      scene: "forest",
      cast: ["newt", "nest"],
    },
    {
      text: "No one was in the nest.",
      action: "wave",
      scene: "forest",
      cast: ["nest"],
    },
    {
      text: "The newt nodded off in the nest.",
      action: "share",
      scene: "forest",
      cast: ["newt", "nest"],
    },
  ],
  O: [
    {
      text: "An owl picked an orange.",
      action: "find",
      scene: "ocean",
      cast: ["owl", "orange"],
    },
    {
      text: "The owl flew over the ocean.",
      action: "fly",
      scene: "ocean",
      cast: ["owl", "ocean"],
    },
    {
      text: "An octopus caught the orange.",
      action: "share",
      scene: "ocean",
      cast: ["octopus", "orange"],
    },
  ],
  P: [
    {
      text: "A pig made a pizza.",
      action: "share",
      scene: "kitchen",
      cast: ["pig", "pizza"],
    },
    {
      text: "The pig placed the pizza on the plate.",
      action: "share",
      scene: "kitchen",
      cast: ["pig", "pizza"],
    },
    {
      text: "The penguin ate the pizza.",
      action: "share",
      scene: "kitchen",
      cast: ["penguin", "pizza"],
    },
  ],
  Q: [
    {
      text: "The queen sewed a quilt.",
      action: "wave",
      scene: "home",
      cast: ["queen", "quilt"],
    },
    {
      text: "A quail shivered by the quilt.",
      action: "wave",
      scene: "home",
      cast: ["quail", "quilt"],
    },
    {
      text: "The queen tucked the quail in the quilt.",
      action: "share",
      scene: "home",
      cast: ["queen", "quail", "quilt"],
    },
  ],
  R: [
    {
      text: "A rabbit planted a rose.",
      action: "find",
      scene: "garden",
      cast: ["rabbit", "rose"],
    },
    {
      text: "Rain fell on the rose.",
      action: "splash",
      scene: "garden",
      cast: ["rain", "rose"],
    },
    {
      text: "The rabbit sniffed the rose.",
      action: "find",
      scene: "garden",
      cast: ["rabbit", "rose"],
    },
  ],
  S: [
    {
      text: "A snake found a soda.",
      action: "find",
      scene: "garden",
      cast: ["snake", "soda"],
    },
    {
      text: "The snake sipped the soda.",
      action: "share",
      scene: "garden",
      cast: ["snake", "soda"],
    },
    {
      text: "The silly snake smiled.",
      action: "wave",
      scene: "garden",
      cast: ["snake", "smile"],
    },
  ],
  T: [
    {
      text: "A tiger waited for a train.",
      action: "wave",
      scene: "forest",
      cast: ["tiger", "train"],
    },
    {
      text: "The tiger ran to the track.",
      action: "zoom",
      scene: "forest",
      cast: ["tiger", "track"],
    },
    {
      text: "The tiger boarded the train.",
      action: "zoom",
      scene: "forest",
      cast: ["tiger", "train"],
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
    if (w) {
      out.push(w);
      continue;
    }
    // Story actors that aren't on the letter word list (jaguar, newt, …)
    out.push({
      word: s
        .split("-")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" "),
      slug: s,
      hint: "",
    });
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
