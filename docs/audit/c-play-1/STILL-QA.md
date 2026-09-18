# Still QA — Big C Friends

**Still:** `docs/audit/c-play-1/00-source-still.jpg`  
**Issue:** #6 · **v0.335**

## Paths opened (required)

```
Letter/Meet: docs/audit/c-play-1/meet-c-01.jpg
Cat:         public/posters/c-cat.webp
Cake:        public/posters/c-cake.webp
Car:         public/posters/c-car.webp
```

Trio = `wordsForCase` first-3: Cat / Cake / Car.

## Verdict: **FAIL (product-art look-lock — cake + car)**

| Check | Gate |
|---|---|
| Street location (not empty grass) | PASS |
| Cat = sleeping orange tabby vs poster | **PASS** family |
| Cake: still pink/white sprinkle sidewalk cake vs poster chocolate oven cake (+ hearts) | **FAIL** look-lock |
| Car: still orange toy vs poster **sky-blue** Beetle / headlight eyes | **FAIL** look-lock |
| C arms vs Meet | soft only |

Do **not** I2V. Rebuild via I2I/edit from `c-cake.webp` + `c-car.webp` (keep cat/street/C if they stay). One confirmed path next time.
