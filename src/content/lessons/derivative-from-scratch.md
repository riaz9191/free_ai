*Bangla + English mixed notes.*

## Roadmap

1. 4-1 Derivatives Intro
2. 4-2 Learning (Visualization)
3. 4-3 Derivative Example
4. 4-4 Derivative Geometrical Intuition
5. 4-5 What is Function
6. 4-6 Derivative of a Constant Value
7. 4-7 Derivative of a Straight Line

---

## 4-1 — Derivatives Intro

### Derivative কী?

সহজ ভাষায়:

> **Derivative = কোনো quantity কত দ্রুত change করছে তার measure।**

Example:

```text
Time:      1 sec → 2 sec
Distance:  10 m  → 20 m
```

Time 1 second বাড়লে distance 10 meter বেড়েছে। তাই rate of change = 10 m/s।

#### Change এবং Delta (Δ)

```text
x: 1 → 3
y: 10 → 30
```

```text
Δx = 3 - 1 = 2
Δy = 30 - 10 = 20
```

`Δ` মানে change।

```text
Δy / Δx = 20 / 2 = 10
```

অর্থাৎ x প্রতি 1 unit বাড়লে y গড়ে 10 unit বাড়ছে।

### Average Rate of Change

```text
x: 2 → 5
y: 10 → 25
```

```text
Δx = 3
Δy = 15
Δy / Δx = 15 / 3 = 5
```

Average rate = 5।

### Average vs Instantaneous Rate

Average rate পুরো interval-এর change দেখে।

Instantaneous rate দেখে **একটি নির্দিষ্ট মুহূর্তে** change কত দ্রুত হচ্ছে।

```text
Average rate
    ↓
একটা interval-এর change

Instantaneous rate
    ↓
একটা নির্দিষ্ট মুহূর্তের change
    ↓
Derivative
```

### ML connection

```text
Data
 ↓
Prediction
 ↓
Loss
 ↓
Derivative / Gradient
 ↓
কোন direction-এ change করলে loss কমবে?
 ↓
Gradient Descent
 ↓
Parameter Update
 ↓
Better Model
```

> **Derivative নিজে loss কমায় না; derivative change-এর direction/rate সম্পর্কে information দেয়। Gradient Descent সেই information ব্যবহার করে।**

---

## 4-2 — Learning (Visualization)

ML model শুরুতেই perfect হয় না।

ধরো parameter `m`:

```text
m = 1 → loss বেশি
m = 2 → loss কম
m = 3 → loss আরও কম
m = 4 → loss সবচেয়ে কম
m = 5 → loss আবার বাড়ে
```

Loss-কে bowl-এর মতো ভাবতে পারো:

```text
Loss
 ↑
 | \          /
 |  \        /
 |   \      /
 |    \    /
 |     \  /
 |      \/
 |       ● ← minimum
 +----------------→ parameter
```

Model-এর learning:

```text
Guess
 ↓
Prediction
 ↓
Loss
 ↓
Derivative দিয়ে change বোঝা
 ↓
Parameter update
 ↓
New prediction
 ↓
New loss
 ↓
Repeat
```

### Gradient Descent connection

```text
বর্তমান position
 ↓
Slope/derivative দেখে
 ↓
কোন দিকে নিচে নামা যায়
 ↓
একটা step
 ↓
আবার slope
 ↓
আবার step
```

- Derivative → local change/slope-এর information
- Gradient Descent → information ব্যবহার করে move করে
- Learning Rate → step কত বড় হবে

---

## 4-3 — Derivative Example

ধরো:

```text
y = x²
```

x = 2 point-এ derivative জানতে চাই।

```text
A = (2, 4)
```

আরেকটি point:

```text
B = (3, 9)
```

দুই point-এর slope:

```text
(9 - 4) / (3 - 2) = 5
```

এটা average slope।

এখন B-কে A-এর কাছে আনি।

#### B = (2.5, 6.25)

```text
(6.25 - 4) / (2.5 - 2)
= 2.25 / 0.5
= 4.5
```

#### B = (2.1, 4.41)

```text
(4.41 - 4) / (2.1 - 2)
= 0.41 / 0.1
= 4.1
```

তাই:

```text
B = 3.0  → slope = 5
B = 2.5  → slope = 4.5
B = 2.1  → slope = 4.1
B → 2    → slope → 4
```

সুতরাং:

```text
Derivative at x = 2 = 4
```

**4 guess করা হয়নি।** Second point-কে target point-এর কাছে আনতে আনতে slope কোন value-এর দিকে যাচ্ছে সেটা দেখে 4 পাওয়া গেছে।

### যেকোনো second point?

শুরুতে কাছাকাছি বিভিন্ন point নেওয়া যায়:

```text
A = (2,4)

B = (3,9)
B = (2.5,6.25)
B = (2.1,4.41)
```

কিন্তু B-কে A-এর কাছে আনতে হবে। একদম A-তেই নেওয়া যাবে না, কারণ তখন `Δx = 0` হয়ে division by zero হবে।

---

## Secant Line

Curve-এর দুইটি point join করলে যে straight line পাওয়া যায় সেটি **Secant Line**।

```text
Curve
   ● A
         \ ← Secant
      ● B
```

Secant slope = দুই point-এর average rate of change।

---

## 4-4 — Derivative Geometrical Intuition

একটি curve-এর target point `P` এবং nearby point `Q` নাও।

```text
Curve
       Q ●
      /
     /
  P ●
```

P ও Q join করলে Secant line।

Q-কে P-এর কাছে আনতে থাকি:

```text
P ●────────Q
P ●────Q
P ●──Q
P ●Q
```

Q যত P-এর কাছে আসে, Secant line তত P-এর local direction-এর কাছে আসে।

সেখানে যে straight line curve-এর local steepness বোঝায়, সেটি **Tangent Line**।

> **Tangent line-এর slope = ওই point-এর derivative।**

### Geometrical meaning

```text
Derivative = একটি point-এ curve-এর local steepness
```

- Uphill → positive derivative
- Downhill → negative derivative
- Flat → derivative 0

Real-life analogy: পাহাড়ি রাস্তায় তুমি যেখানে দাঁড়িয়ে আছো, সেই জায়গায় রাস্তা কতটা খাড়া — এটাই derivative-এর intuition।

---

## 4-5 — What is Function?

Function-কে একটা machine ভাবো:

```text
Input (x)
   ↓
┌─────────────┐
│  Function   │
│   Machine   │
└─────────────┘
   ↓
Output (y)
```

Example:

```text
f(x) = 2x + 1
```

যদি x = 1:

```text
f(1) = 2(1) + 1 = 3
```

যদি x = 5:

```text
f(5) = 2(5) + 1 = 11
```

> **Function = input → rule → output**

একটি normal function-এ একই input-এর জন্য একটিই output থাকে।

### Function + Derivative

```text
f(x) = x²

x = 1 → 1
x = 2 → 4
x = 3 → 9
```

Derivative জানতে চায়:

> x change করলে output কত দ্রুত change করছে?

```text
Function
 ↓
Input changes
 ↓
Output change rate
 ↓
Derivative
```

---

## 4-6 — Derivative of a Constant Value

Constant change করে না।

```text
y = 5
```

x যতই change করি:

```text
x: 1 → 2 → 3 → 4
y: 5 → 5 → 5 → 5
```

তাই:

```text
Δy = 0
```

এবং rate of change = 0।

সুতরাং:

```text
Derivative of constant = 0
```

Graphically:

```text
y
↑
|    ───────────────── y=5
|
+--------------------------→ x
```

Flat line → slope 0 → derivative 0।

---

## 4-7 — Derivative of a Straight Line

আমরা আগে শিখেছি:

```text
y = mx + b
```

যেখানে `m = slope`, `b = intercept`।

ধরো:

```text
y = 3x + 2
```

এখানে:

```text
m = 3
b = 2
```

Straight line-এর steepness সব জায়গায় একই।

```text
x = 1 → slope = 3
x = 2 → slope = 3
x = 3 → slope = 3
x = 100 → slope = 3
```

তাই:

```text
Derivative = slope = 3
```

### Straight line vs Curve

```text
Straight line
→ একই steepness everywhere
→ derivative constant

Curve
→ steepness জায়গাভেদে বদলায়
→ derivative point অনুযায়ী বদলাতে পারে
```

---

## Module 04 Mental Model

```text
Function
   ↓
Input change
   ↓
Output change
   ↓
Rate of change
   ↓
Slope
   ↓
Specific point-এর slope
   ↓
Derivative
```

ML connection:

```text
Model
 ↓
Prediction
 ↓
Loss
 ↓
Derivative / Gradient
 ↓
Direction of change
 ↓
Gradient Descent
 ↓
Parameter Update
 ↓
Better Model
```

---

## Must Understand — Not Memorize

এখন word-by-word formula মুখস্থ করার দরকার নেই। বুঝতে হবে:

- Change কী
- Rate of change কী
- Average rate vs instantaneous rate
- Derivative কী
- Derivative = local/tangent slope
- Secant line কী
- Tangent line কী
- Tangent slope = derivative
- Function কী
- Constant-এর derivative কেন 0
- Straight line-এর derivative কেন slope
- Derivative-এর ML connection

---

## Quick Practice

### Q1

```text
x: 2 → 5
y: 10 → 25
```

Answer:

```text
Δx = 3
Δy = 15
Δy/Δx = 5
```

### Q2

```text
f(x) = 3x + 2
f(4) = ?
```

Answer:

```text
f(4) = 3(4) + 2 = 14
```

### Q3

```text
y = 5
```

Derivative?

**Answer: 0**

### Q4

```text
y = 3x + 2
```

Derivative?

**Answer: 3**

### Q5

```text
y = x²
```

x = 2 point-এর derivative?

**Answer: 4**

কারণ nearby point কাছে আনতে আনতে secant slope 4-এর দিকে যায়।

---

## Final Summary

> **Derivative হলো কোনো function-এর কোনো নির্দিষ্ট point-এ output কত দ্রুত change করছে তার measure।**

Geometrically:

> **Derivative = tangent line-এর slope।**

ML-এ:

> **Derivative/Gradient model-এর loss কীভাবে change করছে সেটা বুঝতে সাহায্য করে, আর Gradient Descent সেই information ব্যবহার করে parameters update করে।**

---

## Next Module

### Module 05 — Advanced Derivative

1. Derivative of Squared Function
2. Notion of Derivative Through Smaller Differences
3. Mathematical View of Quadratic Derivative
4. Derivative of Cubic Function + Generalization for Polynomial Function
5. Derivative of `log x`
6. Scalar Multiplication and Sum Rule
7. Product Rule and Chain Rule

**Learning approach:** intuition → visual → example → calculation → rule.
