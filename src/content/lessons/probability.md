*Bangla + English mixed notes.* — **58 min | 7 Units**

## Roadmap

1. 8-1 Intro to Probability
2. 8-2 General Formula of Probability
3. 8-3 Probability Tree
4. 8-4 Complement of Probability
5. 8-5 Sum of Probability
6. 8-6 Conditional Probability
7. 8-7 Formula of Conditional Probability

### 🎯 Module Goal

Probability হলো কোনো event ঘটার **chance/likelihood** measure করার mathematical way।

**Probability basics → General formula → Probability Tree → Complement → Sum Rule → Conditional Probability → Conditional Probability Formula**

---

## 8-1 — Intro to Probability

### Probability কী?

সহজভাবে:

> **Probability = কোনো ঘটনা ঘটার chance কতটুকু।**

Example: একটা coin toss করলে দুইটা possible outcome:

```text
Head
Tail
```

Fair coin হলে:

```text
P(Head) = 1/2 = 0.5 = 50%
```

অর্থাৎ Head আসার chance = **50%**।

### Probability-এর range

Probability সবসময়:

**0 ≤ P(A) ≤ 1**

```text
0               0.5               1
|----------------|----------------|
Impossible      50%           Certain
```

#### Probability = 0

Event ঘটবে না।

Example: একটা normal dice-এ 7 আসার probability = 0।

#### Probability = 1

Event অবশ্যই ঘটবে।

Example: Normal dice roll করলে 1 থেকে 6-এর মধ্যে একটি number আসবে।

#### Probability = 0.5

50% chance।

### Outcome এবং Event

#### Outcome

একটি possible result।

Dice:

```text
1, 2, 3, 4, 5, 6
```

প্রতিটি একটি outcome।

#### Event

এক বা একাধিক outcome-এর group।

Example: **Even number আসা**

```text
Event = {2, 4, 6}
```

---

## 8-2 — General Formula of Probability

যদি সব outcome equally likely হয়:

**P(Event) = Favorable Outcomes / Total Possible Outcomes**

### Example: Dice

Question:

> একটা dice roll করলে 6 আসার probability কত?

```text
Favorable outcome = {6}            → 1
Total outcomes    = {1,2,3,4,5,6}  → 6

P(6) = 1/6
```

### Another Example

Question:

> Dice-এ even number আসার probability কত?

```text
Favorable = {2, 4, 6}  → 3
Total                  → 6

P(Even) = 3/6 = 1/2
```

অর্থাৎ **50%**।

### Probability percentage-এ

```text
0.25 = 25%
0.5  = 50%
0.75 = 75%
1    = 100%
```

---

## 8-3 — Probability Tree

Probability Tree হলো sequential events visualize করার diagram।

ধরো একটা coin **দুইবার** toss করি।

প্রথম toss:

```text
        Start
       /     \
      H       T
```

দ্বিতীয় toss:

```text
            Start
          /       \
         H         T
        / \       / \
       H   T     H   T
```

Possible outcomes:

```text
HH
HT
TH
TT
```

Total = 4 outcomes।

### Tree কেন useful?

যখন event একটার পর আরেকটা ঘটে, tree দিয়ে পুরো possible path দেখা সহজ।

```text
First event
     ↓
Second event
     ↓
Final outcome
```

### Probability multiply

Fair coin হলে প্রতিটি branch-এর probability = `1/2`।

একটা path-এর probability = path-এর সব branch-এর probability **গুণ** করা।

```text
P(HH) = 1/2 × 1/2 = 1/4
```

অর্থাৎ **25%**।

---

## 8-4 — Complement of Probability

Complement মানে:

> **Event না ঘটার probability।**

যদি event হয়:

```text
A  = Rain হবে
```

তাহলে complement:

```text
Aᶜ = Rain হবে না
```

Formula:

**P(Aᶜ) = 1 − P(A)**

### Example

```text
P(Rain)    = 0.3
P(No Rain) = 1 − 0.3 = 0.7
```

অর্থাৎ **70%**।

### Important relationship

```text
Event + Complement = 100%
```

অথবা:

**P(A) + P(Aᶜ) = 1**

---

## 8-5 — Sum of Probability

দুইটি event-এর মধ্যে **A অথবা B** ঘটার probability বের করতে sum rule ব্যবহার করা হয়।

Basic case-এ যদি A এবং B mutually exclusive হয়:

**P(A or B) = P(A) + P(B)**

### Mutually Exclusive কী?

দুইটা event একই সাথে ঘটতে পারে না।

Dice example:

```text
A = 2 আসবে
B = 5 আসবে
```

একটা dice একবার roll করলে একই সাথে 2 এবং 5 আসতে পারে না।

তাই:

```text
P(2 or 5) = P(2) + P(5)
          = 1/6 + 1/6
          = 2/6
          = 1/3
```

### Overlap থাকলে

যদি A এবং B একই outcome share করে, শুধু যোগ করলে shared part দুইবার count হবে।

তখন:

**P(A ∪ B) = P(A) + P(B) − P(A ∩ B)**

সহজভাবে:

```text
A + B − overlap
```

### মনে রাখো

**OR → Sum-এর idea**

কিন্তু overlap থাকলে overlap একবার বাদ দিতে হয়।

---

## 8-6 — Conditional Probability

এটা খুব important।

Conditional probability মানে:

> **একটা condition already জানা আছে — এই condition-এর উপর ভিত্তি করে অন্য event-এর probability কত?**

Notation:

**P(A|B)**

পড়বে:

> **Probability of A given B**

মানে:

> B ঘটেছে জানা আছে, এখন A ঘটার probability কত?

### Simple Example

একটা class-এ:

```text
10 জন ছেলে
10 জন মেয়ে
Total = 20
```

ধরো আমরা জানলাম selected student একজন **মেয়ে**।

এখন প্রশ্ন:

> Student-এর favourite subject Math হওয়ার probability কত?

এখন পুরো 20 জনের মধ্যে search করছি না — শুধু মেয়েদের group-এর মধ্যে search করছি।

এটাই conditional probability-এর intuition।

### Another simple example

একটা bag-এ:

```text
3 Red
2 Blue
Total = 5
```

প্রথমে একটা Red বের হয়ে গেল এবং **ফেরত রাখা হলো না**।

এখন:

```text
Remaining:
2 Red
2 Blue
```

যদি condition হয়:

> প্রথমে Red বের হয়েছে

তাহলে দ্বিতীয়বার Red পাওয়ার probability:

```text
2/4 = 1/2
```

Condition জানার কারণে আমাদের possible outcomes-এর group পরিবর্তন হয়েছে।

---

## 8-7 — Formula of Conditional Probability

Conditional probability-এর formula:

**P(A|B) = P(A ∩ B) / P(B)**

যেখানে:

- `P(A|B)` = B জানা থাকলে A-এর probability
- `P(A ∩ B)` = A এবং B দুটোই ঘটার probability
- `P(B)` = B ঘটার probability

### Formula intuition

`P(A|B)`-তে আমরা B-এর condition-এর মধ্যে A খুঁজছি।

তাই:

```text
A এবং B দুটোই
----------------
       B
```

অর্থাৎ:

**P(A|B) = P(A and B) / P(B)**

### Example

```text
P(A ∩ B) = 0.2
P(B)     = 0.5

P(A|B)   = 0.2 / 0.5
         = 0.4
```

অর্থাৎ **40%**।

---

## Module 08 Mental Model

```text
Probability
    ↓
কোনো event-এর chance
    ↓
General Formula
    ↓
Favorable / Total
    ↓
Multiple steps হলে
Probability Tree
    ↓
Event না ঘটলে
Complement
    ↓
A OR B হলে
Sum Rule
    ↓
একটা condition জানা থাকলে
Conditional Probability
    ↓
P(A|B)
    ↓
P(A∩B) / P(B)
```

---

## ML Connection

Probability ML-এ অনেক গুরুত্বপূর্ণ।

Examples:

- Classification probability
- Spam detection
- Medical prediction
- Recommendation
- Bayesian methods
- Uncertainty estimation

ধরো model বলল:

```text
Spam     = 0.92
Not Spam = 0.08
```

মানে model-এর estimated probability:

> Email spam হওয়ার chance = **92%**

লক্ষ্য করো: `0.92 + 0.08 = 1` — Spam আর Not Spam একে অপরের **complement**।

---

## Common Confusions

### Probability কি সবসময় percentage?

না। Probability `0 থেকে 1` scale-এ থাকতে পারে।

```text
0.5 = 50%
```

### Complement কী?

Event না ঘটার probability।

### OR মানে কী?

A অথবা B।

### Conditional probability কী?

একটা condition already জানা থাকলে probability।

### `P(A|B)`-এর মানে কী?

> **B জানা আছে, তখন A-এর probability।**

---

## Quick Practice

### Q1

Fair dice-এ `4` আসার probability কত?

### Q2

Dice-এ even number আসার probability কত?

### Q3

যদি `P(A) = 0.7` হয়, তাহলে `A` না ঘটার probability কত?

### Q4

Fair coin দুইবার toss করলে `HH` আসার probability কত?

### Q5

যদি `P(A ∩ B) = 0.2` এবং `P(B) = 0.5` হয়, তাহলে `P(A|B) = ?`

### Answers

1. **1/6**
2. **1/2**
3. **0.3**
4. **1/4**
5. **0.4**

---

## Final Cheat Sheet

| Concept | সহজ meaning |
|---|---|
| Probability | কোনো event-এর chance |
| Outcome | একটি possible result |
| Event | Outcome-এর group |
| General Formula | Favorable / Total |
| Probability Tree | Sequential outcomes-এর visual |
| Complement | Event না ঘটার chance |
| Sum Rule | A OR B |
| Conditional Probability | Condition জানা থাকলে probability |
| `P(A\|B)` | B given থাকলে A-এর probability |
| Formula | `P(A∩B) / P(B)` |

### One-line Mental Model

> **Probability = uncertainty measure; condition জানা থাকলে probability-এর possible space বদলে যায়।**
