#!/usr/bin/env python3
"""Film one letter's 6 word videos: stills → i2v → encode → posters → tts → speech-map.

  python3 scripts/ship-letter-videos.py L
"""
from __future__ import annotations

import json
import subprocess
import sys
from hashlib import sha1
from pathlib import Path

ROOT = Path("/workspace")
STYLE = (
    "Cute 3D vinyl toy kids illustration. Wholesome, friendly, not scary. "
    "Portrait. Closed-mouth smile. Not talking. "
)
# I2V loves to lip-flap any face. Overlay narration is off-screen — mouths stay
# shut unless the gag itself is eating, yawning, or blowing. Keep I2V foley;
# the player mixes it under the teacher voice.
MOUTH = (
    " Mouth closed. Not talking. No lip-sync. No mouthing words. "
    "Action is in the hands and body, not the lips. "
)
FOLEY = (
    " Cartoon foley and ambient sound matching the action. "
    "No speech, no singing, no narrator. "
)
SILENT = MOUTH  # mouths only — not a mute flag

NO_FACE = "Food has NO face, NO eyes. "

PACKS: dict[str, list[dict]] = {
    "L": [
        {"slug": "lion", "word": "Lion", "sentence": "The lion leaps.",
         "still": "Friendly round cartoon lion mid-leap, smiling, no snarl, no big teeth. Savanna.",
         "motion": "The friendly lion LEAPS. Not scary. Camera locked. Simple kids animation, no morphing."},
        {"slug": "leaf", "word": "Leaf", "sentence": "The leaf twirls.",
         "still": "A single green leaf twirling in the air, forest. ONLY a leaf, no person, no baby, no face.",
         "motion": "The leaf TWIRLS. It stays a leaf the entire time. No morphing into a person. Camera locked. Simple kids animation, no morphing."},
        {"slug": "lemon", "word": "Lemon", "sentence": "Lily squeezes a lemon.",
         "still": "Cartoon girl about 5 squeezing a yellow lemon into a bowl. Lemon is food, no face.",
         "motion": "The girl SQUEEZES the lemon. Lemon stays food, no face. Camera locked. Simple kids animation, no morphing."},
        {"slug": "lamp", "word": "Lamp", "sentence": "Lily lights the lamp.",
         "still": "Cartoon girl about 5 reaching to turn on a cozy table lamp. Lamp is off/dim.",
         "motion": "The girl LIGHTS the lamp. FIRST dim. LAST glowing. Camera locked. Simple kids animation, no morphing."},
        {"slug": "lollipop", "word": "Lollipop", "sentence": "Lily unwraps a lollipop.",
         "still": "Cartoon girl about 5 unwrapping a SMALL fist-sized swirl lollipop, smaller than her head. Candy is food, no face. Wrapper half on.",
         "motion": "The girl UNWRAPS the small lollipop. Candy stays small, never grows, no face. Camera locked. Simple kids animation, no morphing."},
        {"slug": "ladder", "word": "Ladder", "sentence": "Leo goes up the ladder.",
         "still": "Cartoon boy about 5 climbing a wooden ladder, a few rungs up, smiling.",
         "motion": "The boy GOES UP the ladder. Camera locked. Simple kids animation, no morphing."},
    ],
    "M": [
        {"slug": "moon", "word": "Moon", "sentence": "Mia smiles at the moon.",
         "still": "Cartoon girl about 5 looking up smiling at a big friendly moon in the night sky.",
         "motion": "The girl SMILES at the moon. Camera locked. Simple kids animation, no morphing."},
        {"slug": "monkey", "word": "Monkey", "sentence": "The monkey hangs by its tail.",
         "still": "Cute cartoon monkey hanging from a jungle branch by ONE tail from rump up to the branch. No extra tail. Friendly.",
         "motion": "The monkey HANGS by its one tail and swings a little. No extra tail. Camera locked. Simple kids animation, no morphing."},
        {"slug": "mouse", "word": "Mouse", "sentence": "The mouse nibbles cheese.",
         "still": "Tiny cute mouse nibbling a wedge of yellow cheese. Cheese is food, no face. Not scary.",
         "motion": "The mouse NIBBLES the cheese. Cheese has no face. Camera locked. Simple kids animation, no morphing."},
        {"slug": "mountain", "word": "Mountain", "sentence": "Mia hikes up the mountain.",
         "still": "Cartoon girl about 5 hiking up a sunny mountain trail with a small backpack.",
         "motion": "The girl HIKES up the mountain. Camera locked. Simple kids animation, no morphing."},
        {"slug": "milk", "word": "Milk", "sentence": "Mia sips milk.",
         "still": "Cartoon girl about 5 sipping milk from a plain glass. Glass has no face.",
         "motion": "The girl SIPS the milk. Glass has no face. Camera locked. Simple kids animation, no morphing."},
        {"slug": "mushroom", "word": "Mushroom", "sentence": "A mushroom pops up.",
         "still": "A cute red mushroom with white spots just starting to pop out of mossy ground. Not a face.",
         "motion": "The mushroom POPS UP from the ground. FIRST small. LAST taller. No face. Camera locked. Simple kids animation, no morphing."},
    ],
    "N": [
        {"slug": "nest", "word": "Nest", "sentence": "A bird brings twigs to the nest.",
         "still": "Cute bird carrying a twig to a nest in a tree. Friendly, daylight.",
         "motion": "The bird BRINGS twigs to the nest. Camera locked. Simple kids animation, no morphing."},
        {"slug": "night", "word": "Night", "sentence": "Nina snuggles at night.",
         "still": "Cartoon girl about 5 snuggling under a blanket in bed, starry night window.",
         "motion": "The girl SNUGGLES at night. Camera locked. Simple kids animation, no morphing."},
        {"slug": "nose", "word": "Nose", "sentence": "Nina wrinkles her nose.",
         "still": "Close friendly cartoon girl about 5 wrinkling her nose, playful, not gross.",
         "motion": "The girl WRINKLES her nose. Camera locked. Simple kids animation, no morphing."},
        {"slug": "notebook", "word": "Notebook", "sentence": "Nina writes in a notebook.",
         "still": "Cartoon girl about 5 writing in an open notebook with a crayon.",
         "motion": "The girl WRITES in the notebook. Camera locked. Simple kids animation, no morphing."},
        {"slug": "noodle", "word": "Noodles", "sentence": "Nina slurps noodles.",
         "still": "Cartoon girl about 5 slurping noodles from a bowl. Noodles are food, no face.",
         "motion": "The girl SLURPS noodles. Food has no face. Camera locked. Simple kids animation, no morphing."},
        {"slug": "net", "word": "Net", "sentence": "Nina catches with a net.",
         "still": "Cartoon girl about 5 holding a small net, catching a bubble or butterfly, beach or yard.",
         "motion": "The girl CATCHES with the net. Camera locked. Simple kids animation, no morphing."},
    ],
    "O": [
        {"slug": "orange", "word": "Orange", "sentence": "Otto peels an orange.",
         "still": "Cartoon boy about 5 just starting to peel an orange. Closed-mouth smile. Orange is food, no face. One small peel corner lifted.",
         "motion": "The boy PEELS the orange one way. Peel comes off and STAYS off. No reverse, orange does not become whole again. Food has no face. FIRST mostly whole. LAST more peeled."},
        {"slug": "owl", "word": "Owl", "sentence": "The owl hoots.",
         "still": "Friendly round owl with beak open mid-hoot on a branch at dusk. Not scary.",
         "motion": "The owl HOOTS, beak opening. Not scary. Camera locked. Simple kids animation, no morphing."},
        {"slug": "ocean", "word": "Ocean", "sentence": "Otto splashes in the ocean.",
         "still": "Cartoon boy about 5 splashing in shallow ocean waves, sunny beach.",
         "motion": "The boy SPLASHES in the ocean. Camera locked. Simple kids animation, no morphing."},
        {"slug": "octopus", "word": "Octopus", "sentence": "The octopus juggles.",
         "still": "Friendly cute octopus juggling three beach balls underwater. Not scary.",
         "motion": "The octopus JUGGLES the entire time. Not scary. Camera locked. Simple kids animation, no morphing."},
        {"slug": "oven", "word": "Oven", "sentence": "Otto peeks in the oven.",
         "still": "Cartoon boy about 5 peeking into an open oven, warm glow, cookies inside. Safe, not burning.",
         "motion": "The boy PEEKS in the oven. Safe, not burning. Camera locked. Simple kids animation, no morphing."},
        {"slug": "ostrich", "word": "Ostrich", "sentence": "The ostrich flaps.",
         "still": "Friendly cartoon ostrich flapping small wings. Not scary.",
         "motion": "The ostrich FLAPS its wings the entire time. Camera locked. Simple kids animation, no morphing."},
    ],
    "P": [
        {"slug": "pizza", "word": "Pizza", "sentence": "Pip spins a pizza.",
         "still": "Cartoon boy about 5 spinning a pizza dough disc in the air. Pizza is food, no face.",
         "motion": "The boy SPINS the pizza dough. Food has no face. Camera locked. Simple kids animation, no morphing."},
        {"slug": "penguin", "word": "Penguin", "sentence": "The penguin slides on the ice.",
         "still": "Cute penguin sliding on its belly on bright ice. Friendly.",
         "motion": "The penguin SLIDES on the ice the entire time. Camera locked. Simple kids animation, no morphing."},
        {"slug": "pig", "word": "Pig", "sentence": "The pig rolls in mud.",
         "still": "Cute pink pig rolling in a small mud puddle, happy. Not dirty-scary.",
         "motion": "The pig ROLLS in mud. Camera locked. Simple kids animation, no morphing."},
        {"slug": "pencil", "word": "Pencil", "sentence": "Pip sharpens a pencil.",
         "still": "Cartoon boy about 5 turning a pencil in a handheld sharpener. Shavings.",
         "motion": "The boy SHARPENS the pencil. Camera locked. Simple kids animation, no morphing."},
        {"slug": "piano", "word": "Piano", "sentence": "Pip taps the piano keys.",
         "still": "Cartoon boy about 5 tapping keys on a small colorful piano.",
         "motion": "The boy TAPS the piano keys the entire time. Camera locked. Simple kids animation, no morphing."},
        {"slug": "puppy", "word": "Puppy", "sentence": "The puppy wags its tail.",
         "still": "Tiny cute puppy wagging its tail, happy, not scary.",
         "motion": "The puppy WAGS its tail the entire time. Camera locked. Simple kids animation, no morphing."},
    ],
    "Q": [
        {"slug": "queen", "word": "Queen", "sentence": "The queen twirls.",
         "still": "Friendly cartoon queen in a simple crown twirling her dress, smiling.",
         "motion": "The queen TWIRLS. Camera locked. Simple kids animation, no morphing."},
        {"slug": "quilt", "word": "Quilt", "sentence": "Quinn snuggles in a quilt.",
         "still": "Cartoon child about 5 snuggling under a colorful patchwork quilt.",
         "motion": "The child SNUGGLES in the quilt. Camera locked. Simple kids animation, no morphing."},
        {"slug": "question", "word": "Question", "sentence": "Quinn asks a question.",
         "still": "Cartoon child about 5 raising a hand, asking a question, a small ? in the air.",
         "motion": "The child ASKS a question, mouth moving, ? bounces. Camera locked. Simple kids animation, no morphing."},
        {"slug": "quiet", "word": "Quiet", "sentence": "Quinn tiptoes.",
         "still": "Cartoon child about 5 tiptoeing with a finger to lips, shh, playful.",
         "motion": "The child TIPTOES quietly. Camera locked. Simple kids animation, no morphing."},
        {"slug": "quack", "word": "Quack", "sentence": "A duck quacks.",
         "still": "Friendly yellow duck with beak open mid-quack by a pond. Not scary.",
         "motion": "The duck QUACKS, beak opening. Camera locked. Simple kids animation, no morphing."},
        {"slug": "quarter", "word": "Quarter", "sentence": "Quinn flips a quarter.",
         "still": "Cartoon child about 5 flipping a shiny quarter in the air.",
         "motion": "The child FLIPS the quarter. Coin spins. Camera locked. Simple kids animation, no morphing."},
    ],
    "R": [
        {"slug": "rainbow", "word": "Rainbow", "sentence": "Rita points at a rainbow.",
         "still": "Cartoon girl about 5 pointing up at a bright rainbow after rain.",
         "motion": "The girl POINTS at the rainbow. Camera locked. Simple kids animation, no morphing."},
        {"slug": "robot", "word": "Robot", "sentence": "The robot marches.",
         "still": "Cute friendly toy robot marching. Not scary.",
         "motion": "The robot MARCHES the entire time. Camera locked. Simple kids animation, no morphing."},
        {"slug": "rocket", "word": "Rocket", "sentence": "The rocket blasts off.",
         "still": "A toy rocket on a launch pad just starting to lift, small friendly flame.",
         "motion": "The rocket BLASTS OFF. FIRST on pad. LAST rising. Camera locked. Simple kids animation, no morphing."},
        {"slug": "rabbit", "word": "Rabbit", "sentence": "The rabbit munches a carrot.",
         "still": "Cute rabbit munching an orange carrot. Carrot is food, no face. Not scary.",
         "motion": "The rabbit MUNCHES the carrot. Food has no face. Camera locked. Simple kids animation, no morphing."},
        {"slug": "rose", "word": "Rose", "sentence": "Rita smells a rose.",
         "still": "Cartoon girl about 5 smelling a pink rose, eyes closed happy.",
         "motion": "The girl SMELLS the rose. Camera locked. Simple kids animation, no morphing."},
        {"slug": "rain", "word": "Rain", "sentence": "Rain drips on Rita.",
         "still": "Cartoon girl about 5 in a raincoat, raindrops dripping on her, happy.",
         "motion": "Rain DRIPS on the girl. Drops keep falling. Camera locked. Simple kids animation, no morphing."},
    ],
    "S": [
        {"slug": "sun", "word": "Sun", "sentence": "The sun rises.",
         "still": "A round yellow toy sun with a tiny friendly smile, just peeking over green hills at dawn. Soft pink sky. Simple toy, not a person.",
         "motion": "The yellow toy sun slowly goes up over the green hills. Camera locked. Simple kids animation, no morphing. Wholesome."},
        {"slug": "star", "word": "Star", "sentence": "Sam spots a star.",
         "still": "Cartoon boy about 5 pointing at a bright star in the night sky.",
         "motion": "The boy SPOTS the star, pointing. Camera locked. Simple kids animation, no morphing."},
        {"slug": "snake", "word": "Snake", "sentence": "The snake slithers.",
         "still": "Friendly round cartoon snake slithering on grass, smiling, no fangs. Not creepy.",
         "motion": "The snake SLITHERS. Not creepy, no fangs. Camera locked. Simple kids animation, no morphing."},
        {"slug": "ship", "word": "Ship", "sentence": "Sam steers the ship.",
         "still": "Cartoon boy about 5 at a ship wheel steering a toy ship on blue water.",
         "motion": "The boy STEERS the ship. Wheel turns. Camera locked. Simple kids animation, no morphing."},
        {"slug": "smile", "word": "Smile", "sentence": "Sam smiles.",
         "still": "Close friendly cartoon boy about 5 with a big genuine smile.",
         "motion": "The boy SMILES bigger. Camera locked. Simple kids animation, no morphing."},
        {"slug": "sock", "word": "Sock", "sentence": "Sam tosses a sock.",
         "still": "Cartoon boy about 5 tossing a colorful sock into the air, playful.",
         "motion": "The boy TOSSES the sock. Camera locked. Simple kids animation, no morphing."},
    ],
    "T": [
        {"slug": "tree", "word": "Tree", "sentence": "Tess hugs a tree.",
         "still": "Cartoon girl about 5 hugging a friendly tree trunk, smiling.",
         "motion": "The girl HUGS the tree. Camera locked. Simple kids animation, no morphing."},
        {"slug": "tiger", "word": "Tiger", "sentence": "The tiger yawns.",
         "still": "Friendly chubby cartoon tiger yawning, no snarl, tiny teeth ok. Not scary.",
         "motion": "The tiger YAWNS. Not scary. Camera locked. Simple kids animation, no morphing."},
        {"slug": "train", "word": "Train", "sentence": "The train toots.",
         "still": "Cute toy train with a puff of steam, tooting. Colorful.",
         "motion": "The train TOOTS, steam puffs. Camera locked. Simple kids animation, no morphing."},
        {"slug": "turtle", "word": "Turtle", "sentence": "The turtle tucks in.",
         "still": "Cute turtle starting to tuck its head into its shell. Friendly.",
         "motion": "The turtle TUCKS IN. FIRST head out. LAST head in shell. Camera locked. Simple kids animation, no morphing."},
        {"slug": "tomato", "word": "Tomato", "sentence": "Tess picks a tomato.",
         "still": "Cartoon girl about 5 picking a red tomato from a vine. Tomato is food, no face.",
         "motion": "The girl PICKS the tomato. Food has no face. Camera locked. Simple kids animation, no morphing."},
        {"slug": "tooth", "word": "Tooth", "sentence": "Tess wiggles a tooth.",
         "still": "Cartoon girl about 5 wiggling a loose front tooth, playful, not gory.",
         "motion": "The girl WIGGLES a tooth. Playful, not gory. Camera locked. Simple kids animation, no morphing."},
    ],
    "U": [
        {"slug": "umbrella", "word": "Umbrella", "sentence": "Uma opens an umbrella.",
         "still": "Cartoon girl about 5 opening a colorful umbrella. Umbrella half open.",
         "motion": "The girl OPENS the umbrella. FIRST closed. LAST open. Camera locked. Simple kids animation, no morphing."},
        {"slug": "unicorn", "word": "Unicorn", "sentence": "The unicorn prances.",
         "still": "Cute friendly unicorn prancing, pastel mane. Not scary.",
         "motion": "The unicorn PRANCES the entire time. Camera locked. Simple kids animation, no morphing."},
        {"slug": "under", "word": "Under", "sentence": "Uma crawls under the table.",
         "still": "Cartoon girl about 5 crawling under a wooden table, playful.",
         "motion": "The girl CRAWLS under the table. Camera locked. Simple kids animation, no morphing."},
        {"slug": "uniform", "word": "Uniform", "sentence": "Uma buttons her uniform.",
         "still": "Cartoon girl about 5 buttoning a simple school uniform shirt.",
         "motion": "The girl BUTTONS her uniform. Camera locked. Simple kids animation, no morphing."},
        {"slug": "up", "word": "Up", "sentence": "Uma jumps up.",
         "still": "Cartoon girl about 5 jumping straight up, arms up, happy.",
         "motion": "The girl JUMPS UP again and again. Camera locked. Simple kids animation, no morphing."},
        {"slug": "ukulele", "word": "Ukulele", "sentence": "Uma plucks the ukulele.",
         "still": "Cartoon girl about 5 plucking a small ukulele.",
         "motion": "The girl PLUCKS the ukulele. Camera locked. Simple kids animation, no morphing."},
    ],
    "V": [
        {"slug": "violin", "word": "Violin", "sentence": "Vin bows the violin.",
         "still": "Cartoon boy about 5 bowing a small violin.",
         "motion": "The boy BOWS the violin, bow moving. Camera locked. Simple kids animation, no morphing."},
        {"slug": "volcano", "word": "Volcano", "sentence": "The volcano puffs smoke.",
         "still": "A small cute volcano puffing a tiny friendly smoke cloud. Not scary, no lava explosion.",
         "motion": "The volcano PUFFS smoke. Small, not scary. Camera locked. Simple kids animation, no morphing."},
        {"slug": "van", "word": "Van", "sentence": "Vin's van beeps.",
         "still": "A friendly toy van, cartoon boy waving from the window. Not a movie race car.",
         "motion": "The van BEEPS, lights blink. Camera locked. Simple kids animation, no morphing."},
        {"slug": "vegetable", "word": "Vegetable", "sentence": "Vin washes vegetables.",
         "still": "Cartoon boy about 5 washing carrots and broccoli in a sink. Vegetables are food, no faces.",
         "motion": "The boy WASHES vegetables. Food has no faces. Camera locked. Simple kids animation, no morphing."},
        {"slug": "vest", "word": "Vest", "sentence": "Vin buttons a vest.",
         "still": "Cartoon boy about 5 buttoning a cozy vest.",
         "motion": "The boy BUTTONS the vest. Camera locked. Simple kids animation, no morphing."},
        {"slug": "vacuum", "word": "Vacuum", "sentence": "Vin vacuums.",
         "still": "Cartoon boy about 5 pushing a toy vacuum on a rug.",
         "motion": "The boy VACUUMS, pushing the vacuum. Camera locked. Simple kids animation, no morphing."},
    ],
    "W": [
        {"slug": "whale", "word": "Whale", "sentence": "The whale blows a spray.",
         "still": "Friendly cartoon whale blowing a water spray from its spout. Ocean. Not scary.",
         "motion": "The whale BLOWS a spray the entire time. Camera locked. Simple kids animation, no morphing."},
        {"slug": "water", "word": "Water", "sentence": "Wes waters a plant.",
         "still": "Cartoon boy about 5 watering a potted plant with a small watering can.",
         "motion": "The boy WATERS the plant. Water pours. Camera locked. Simple kids animation, no morphing."},
        {"slug": "window", "word": "Window", "sentence": "Wes peeks out the window.",
         "still": "Cartoon boy about 5 peeking out an open window, smiling.",
         "motion": "The boy PEEKS out the window. Camera locked. Simple kids animation, no morphing."},
        {"slug": "watch", "word": "Watch", "sentence": "Wes winds a watch.",
         "still": "Cartoon boy about 5 winding a chunky toy watch.",
         "motion": "The boy WINDS the watch. Camera locked. Simple kids animation, no morphing."},
        {"slug": "worm", "word": "Worm", "sentence": "The worm wiggles.",
         "still": "Cute friendly worm wiggling on dirt. Not creepy.",
         "motion": "The worm WIGGLES the entire time. Not creepy. Camera locked. Simple kids animation, no morphing."},
        {"slug": "wagon", "word": "Wagon", "sentence": "Wes pulls a wagon.",
         "still": "Cartoon boy about 5 pulling a red wagon with a stuffed toy in it.",
         "motion": "The boy PULLS the wagon. Camera locked. Simple kids animation, no morphing."},
    ],
    "X": [
        {"slug": "xray", "word": "X-ray", "sentence": "Max sees an x-ray.",
         "still": "Cartoon boy about 5 looking at a friendly x-ray of a smiling cartoon skeleton on a light box. Not scary, not gory.",
         "motion": "The boy LOOKS at the x-ray. Not scary. Camera locked. Simple kids animation, no morphing."},
        {"slug": "xylophone", "word": "Xylophone", "sentence": "Max taps the xylophone.",
         "still": "Cartoon boy about 5 tapping a colorful xylophone with mallets.",
         "motion": "The boy TAPS the xylophone. Camera locked. Simple kids animation, no morphing."},
        {"slug": "box", "word": "Box", "sentence": "Max stacks boxes.",
         "still": "Cartoon boy about 5 stacking three colorful gift boxes.",
         "motion": "The boy STACKS boxes. Camera locked. Simple kids animation, no morphing."},
        {"slug": "fox-x", "word": "Fox", "sentence": "Max spots a fox.",
         "still": "Cartoon boy about 5 spotting a cute fox in the woods. Fox is friendly, not scary.",
         "motion": "The boy SPOTS the fox. Fox is friendly. Camera locked. Simple kids animation, no morphing."},
        {"slug": "six", "word": "Six", "sentence": "Max counts to six.",
         "still": "Cartoon boy about 5 holding up six fingers, or six toy blocks numbered 1-6.",
         "motion": "The boy COUNTS to six, showing six. Camera locked. Simple kids animation, no morphing."},
        {"slug": "mix", "word": "Mix", "sentence": "Max mixes pancake batter.",
         "still": "Cartoon boy about 5 mixing pancake batter in a bowl. Batter is food, no face.",
         "motion": "The boy MIXES pancake batter. Food has no face. Camera locked. Simple kids animation, no morphing."},
    ],
    "Y": [
        {"slug": "yoyo", "word": "Yo-yo", "sentence": "The yo-yo goes down and up.",
         "still": "A colorful yo-yo on a string going down from a child's hand.",
         "motion": "The yo-yo GOES DOWN AND UP the entire time. Camera locked. Simple kids animation, no morphing."},
        {"slug": "yellow", "word": "Yellow", "sentence": "Yasmin paints with yellow.",
         "still": "Cartoon girl about 5 painting a big yellow sun with yellow paint. Paint has no face.",
         "motion": "The girl PAINTS with yellow. Camera locked. Simple kids animation, no morphing."},
        {"slug": "yak", "word": "Yak", "sentence": "The yak yawns.",
         "still": "Friendly shaggy cartoon yak yawning. Not scary.",
         "motion": "The yak YAWNS. Camera locked. Simple kids animation, no morphing."},
        {"slug": "yarn", "word": "Yarn", "sentence": "Yasmin winds yarn.",
         "still": "Cartoon girl about 5 winding a ball of colorful yarn.",
         "motion": "The girl WINDS yarn. Camera locked. Simple kids animation, no morphing."},
        {"slug": "yacht", "word": "Yacht", "sentence": "Yasmin waves from a yacht.",
         "still": "Cartoon girl about 5 waving from the deck of a small white yacht on blue water.",
         "motion": "The girl WAVES from the yacht. Camera locked. Simple kids animation, no morphing."},
        {"slug": "yogurt", "word": "Yogurt", "sentence": "Yasmin spoons yogurt.",
         "still": "Cartoon girl about 5 spooning yogurt from a cup. Yogurt is food, no face.",
         "motion": "The girl SPOONS yogurt. Food has no face. Camera locked. Simple kids animation, no morphing."},
    ],
    "Z": [
        {"slug": "zebra", "word": "Zebra", "sentence": "The zebra zigzags.",
         "still": "Friendly cartoon zebra zig-zagging on a savanna path. Not scary.",
         "motion": "The zebra ZIGZAGS. Camera locked. Simple kids animation, no morphing."},
        {"slug": "zoo", "word": "Zoo", "sentence": "Zed visits the zoo.",
         "still": "Cartoon boy about 5 waving at friendly zoo animals behind a low fence. Happy zoo.",
         "motion": "The boy VISITS the zoo, waving. Camera locked. Simple kids animation, no morphing."},
        {"slug": "zipper", "word": "Zipper", "sentence": "Zed zips the zipper.",
         "still": "Cartoon boy about 5 zipping a backpack zipper. Half zipped.",
         "motion": "The boy ZIPS the zipper. FIRST open. LAST closed. Camera locked. Simple kids animation, no morphing."},
        {"slug": "zero", "word": "Zero", "sentence": "Zed writes a zero.",
         "still": "Cartoon boy about 5 writing a big 0 on paper with a crayon.",
         "motion": "The boy WRITES a zero. Camera locked. Simple kids animation, no morphing."},
        {"slug": "zigzag", "word": "Zigzag", "sentence": "Zed runs a zigzag.",
         "still": "Cartoon boy about 5 running a zigzag path on grass.",
         "motion": "The boy RUNS a zigzag. Camera locked. Simple kids animation, no morphing."},
        {"slug": "zucchini", "word": "Zucchini", "sentence": "Zed washes a zucchini.",
         "still": "Cartoon boy about 5 washing a green zucchini in a sink. Zucchini is food, no face.",
         "motion": "The boy WASHES the zucchini. Food has no face. Camera locked. Simple kids animation, no morphing."},
    ],
}


def run(cmd: list[str], **kw):
    p = subprocess.run(cmd, cwd=ROOT, **kw)
    if p.returncode != 0:
        raise SystemExit(f"FAIL {' '.join(cmd[:4])} rc={p.returncode}")


def t2i(prompt: str, out: Path):
    run(["python3", "scripts/imagine-api-t2i.py", STYLE + prompt, str(out), "--aspect", "2:3"])


def i2v(still: Path, prompt: str, out: Path):
    run([
        "python3", "scripts/imagine-api-i2v.py", str(still),
        prompt + MOUTH + FOLEY,
        str(out), "--duration", "10", "--resolution", "480p",
    ])


def encode(src: Path, dest: Path):
    """Scale to 540×720. Keep I2V foley when present; fall back to silent."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    vf = "scale=540:720:force_original_aspect_ratio=increase,crop=540:720,setsar=1"
    video = [
        "ffmpeg", "-y", "-i", str(src),
        "-vf", vf,
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-profile:v", "main",
        "-crf", "23", "-r", "24",
        "-movflags", "+faststart",
    ]
    with_audio = video[:-2] + [
        "-c:a", "aac", "-b:a", "96k", "-ac", "1", "-ar", "44100",
        "-movflags", "+faststart", str(dest),
    ]
    p = subprocess.run(with_audio, cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if p.returncode == 0:
        return
    run(video + ["-an", str(dest)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def patch_native_audio(letter: str, slug: str):
    """Mark this remake so the player skips the generic music bed."""
    p = ROOT / "src/data/word-lessons.ts"
    text = p.read_text()
    key = f'"{letter.lower()}-{slug}"'
    start = text.find(key)
    if start < 0:
        return
    end = text.find("},", start)
    if end < 0:
        return
    chunk = text[start:end]
    if "nativeAudio" in chunk:
        return
    p.write_text(text[:end] + " nativeAudio: true," + text[end:])


def poster(vid: Path, dest: Path):
    from PIL import Image
    tmp = Path("/tmp") / f"{dest.stem}-f1.jpg"
    run(["ffmpeg", "-y", "-i", str(vid), "-frames:v", "1", str(tmp)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    im = Image.open(tmp).convert("RGB").resize((640, 953), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "WEBP", quality=82, method=6)


def tts(combos: list[tuple[str, str]]):
    import os
    phrases = [s for _, s in combos] + [f"{w}. {w}. {w}. {s}" for w, s in combos]
    fem = [{"text": t, "out": f"public/audio/{sha1(t.encode()).hexdigest()[:16]}.mp3"} for t in phrases]
    bud = [{"text": t, "out": f"public/audio/buddy/{sha1(t.encode()).hexdigest()[:16]}.mp3"} for t in phrases]
    Path("/tmp/speech-pack-f.json").write_text(json.dumps(fem))
    Path("/tmp/speech-pack-b.json").write_text(json.dumps(bud))
    e = os.environ.copy()
    e["SPEECH_PHRASES"] = "/tmp/speech-pack-f.json"
    run(["python3", "scripts/generate-speech.py"], env=e)
    e["SPEECH_PHRASES"] = "/tmp/speech-pack-b.json"
    e["SPEECH_VOICE"] = "en-US-AndrewNeural"
    e["SPEECH_PITCH"] = "+28Hz"
    run(["python3", "scripts/generate-speech.py"], env=e)
    return {s: f"{sha1(s.encode()).hexdigest()[:16]}.mp3" for _, s in combos}


def patch_speech_map(mapping: dict[str, str]):
    p = ROOT / "src/data/speech-map.ts"
    text = p.read_text()
    if not text.rstrip().endswith("};"):
        raise SystemExit("speech-map.ts does not look like a TS object")
    # insert before closing };
    extra = "".join(f'  {json.dumps(k)}: {json.dumps(v)},\n' for k, v in mapping.items() if k not in text)
    if not extra:
        return
    idx = text.rstrip().rfind("};")
    p.write_text(text[:idx] + extra + text[idx:])


def archive(letter: str, slug: str):
    art = ROOT / "public/art-archive"
    (art / f"letter-posters-old-{letter}").mkdir(parents=True, exist_ok=True)
    vid = ROOT / f"public/videos/{letter.lower()}-{slug}.mp4"
    pos = ROOT / f"public/posters/{letter.lower()}-{slug}.webp"
    if vid.exists():
        dest = art / f"{letter.lower()}-{slug}-old-kenburns.mp4"
        if not dest.exists():
            dest.write_bytes(vid.read_bytes())
    if pos.exists():
        dest = art / f"letter-posters-old-{letter}" / pos.name
        if not dest.exists():
            dest.write_bytes(pos.read_bytes())


def main():
    if len(sys.argv) < 2:
        raise SystemExit("usage: ship-letter-videos.py LETTER")
    letter = sys.argv[1].upper()
    items = PACKS.get(letter)
    if not items:
        raise SystemExit(f"no pack for {letter}")
    still_dir = Path("/tmp/stills")
    still_dir.mkdir(parents=True, exist_ok=True)
    (ROOT / f"public/art-archive/word-stills-{letter.lower()}").mkdir(parents=True, exist_ok=True)
    (ROOT / "public/review/word-videos").mkdir(parents=True, exist_ok=True)

    for it in items:
        archive(letter, it["slug"])
        still = still_dir / f"{letter.lower()}-{it['slug']}.jpg"
        print("STILL", it["slug"], flush=True)
        t2i(it["still"], still)
        dest_still = ROOT / f"public/art-archive/word-stills-{letter.lower()}" / still.name
        dest_still.write_bytes(still.read_bytes())

    for it in items:
        still = still_dir / f"{letter.lower()}-{it['slug']}.jpg"
        raw = Path(f"/tmp/{letter.lower()}-{it['slug']}-api.mp4")
        print("I2V", it["slug"], flush=True)
        i2v(still, it["motion"], raw)
        vid = ROOT / f"public/videos/{letter.lower()}-{it['slug']}.mp4"
        print("ENC", it["slug"], flush=True)
        encode(raw, vid)
        patch_native_audio(letter, it["slug"])
        poster(vid, ROOT / f"public/posters/{letter.lower()}-{it['slug']}.webp")
        (ROOT / f"public/review/word-videos/{letter.lower()}-{it['slug']}-ship.mp4").write_bytes(vid.read_bytes())

    print("TTS", flush=True)
    mapping = tts([(it["word"], it["sentence"]) for it in items])
    patch_speech_map(mapping)
    print("DONE", letter, flush=True)


if __name__ == "__main__":
    main()
