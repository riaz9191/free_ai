*Bangla + English mixed notes.* — **58 min | 7 Units**

## Roadmap

1. 6-1 Derivative as an Optimizer
2. 6-2 Cost Function Minimization Idea
3. 6-3 Gradient Descent Algorithm (Visualization)
4. 6-4 Gradient Descent Procedure
5. 6-5 Learning Rate
6. 6-6 Usage of GD in ML
7. 6-7 GD Considering Multiple Variables

### 🎯 Module Goal

**Derivative → Direction → Cost কমানো → Gradient Descent → ML Model Training**

---

## 6-1 — Derivative as an Optimizer

### Optimizer কী?

Optimizer হলো এমন method যেটা model-এর parameter এমনভাবে change করে যাতে **loss/cost কমে**।

সহজভাবে:

> **Optimizer = কোন direction-এ parameter change করলে model better হবে সেটা খুঁজে বের করা।**

Derivative বলে কোনো জায়গা থেকে একটু সামনে গেলে function/value **কোন দিকে এবং কত দ্রুত change করছে**।

যদি cost function-এর derivative positive হয়, ওই direction-এ গেলে cost বাড়ছে। তাই cost কমাতে আমরা **opposite direction**-এ যাই।

### Core idea

```text
Derivative
    ↓
Local direction / slope
    ↓
কোন দিকে cost কমবে?
    ↓
Parameter update
```

Gradient Descent এই idea ব্যবহার করে।

---

## 6-2 — Cost Function Minimization Idea

### Cost Function কী?

Cost function একটি number দেয় যা বলে:

> **আমাদের model কতটা ভুল করছে।**

Cost বেশি → model খারাপ  
Cost কম → model ভালো

Example:

```text
Model A → Cost = 4
Model B → Cost = 12
```

A better, কারণ cost কম।

### Goal

Training-এর সময়:

**Cost → Minimum**

একটা bowl-এর মতো imagine করো:

```text
Cost
 ↑
 |       \       /
 |        \     /
 |         \   /
 |          \_/
 |           ↑
 |         Minimum
 +----------------→ parameter
```

### Mountain analogy

তুমি পাহাড়ের উপরে আছো এবং lowest valley-তে যেতে চাও।

```text
   ●
    \
     \            /
      \          /
       \___  ___/
           \/
           ↑
      lowest point
```

Gradient Descent step-by-step lowest point খুঁজে।

---

## 6-3 — Gradient Descent Algorithm (Visualization)

Basic flow:

```text
Start
  ↓
Initial parameter
  ↓
Cost calculate
  ↓
Derivative / Gradient calculate
  ↓
Opposite direction-এ move
  ↓
New parameter
  ↓
Cost আবার calculate
  ↓
Repeat
```

Gradient Descent একবারে magic করে minimum-এ যায় না।

> **Step-by-step improve করে।**

---

## 6-4 — Gradient Descent Procedure

ধরো:

```text
m = 10
learning rate = 0.1
gradient = 5
```

Update rule:

**new parameter = old parameter − learning rate × gradient**

তাহলে:

```text
m_new = 10 − (0.1 × 5)
      = 9.5
```

অর্থাৎ:

```text
10 → 9.5
```

পরের step-এ নতুন gradient বের হবে।

যদি next gradient = 3:

```text
9.5 − (0.1 × 3)
= 9.2
```

তাহলে:

```text
10 → 9.5 → 9.2 → ...
```

### কেন minus (−)?

Gradient আমাদের বলে cost কোন দিকে বাড়ছে। Cost কমাতে আমরা **opposite direction**-এ move করি।

---

## 6-5 — Learning Rate

Learning Rate (`α`) মানে:

> **প্রতিটি update-এ কত বড় step নেব।**

Formula:

**new parameter = old parameter − α × gradient**

### খুব ছোট learning rate

```text
●
  ●
    ●
      ●
```

Step খুব ছোট → **training slow**

### খুব বড় learning rate

```text
●       ●
   ●
        ●
```

বেশি jump → **overshoot / unstable** হতে পারে।

### Good learning rate

```text
●
  ●
    ●
      ●
       ●
       ↓
    minimum
```

### মনে রাখো

```text
Too small → Slow
Too large → Overshoot / unstable
Good      → Smoothly approaches minimum
```

---

## 6-6 — Usage of GD in ML

Gradient Descent ML model training-এর খুব important part।

### Linear Regression example

আমাদের line:

**y = mx + b**

এখানে:

- `m` = slope
- `b` = intercept

Training flow:

```text
Data
 ↓
Prediction
 ↓
Error
 ↓
Cost / MSE
 ↓
Gradient
 ↓
Gradient Descent
 ↓
Update m and b
 ↓
Better prediction
```

`m` এবং `b` দুটোই update হতে পারে।

Conceptually:

```text
m → gradient বের করো → m update
b → gradient বের করো → b update
```

### Training loop

```text
Initialize parameters
        ↓
Predict
        ↓
Calculate Cost
        ↓
Calculate Gradient
        ↓
Update Parameters
        ↓
Repeat
```

Repeat করতে করতে সাধারণত cost কমে আসে।

---

## 6-7 — GD Considering Multiple Variables

বাস্তব ML model-এ একাধিক feature থাকে।

House price example:

```text
x₁ = house size
x₂ = bedrooms
x₃ = bathrooms
x₄ = age
```

Model:

**ŷ = w₁x₁ + w₂x₂ + w₃x₃ + w₄x₄ + b**

Parameters:

```text
w₁, w₂, w₃, w₄, b
```

প্রতিটির জন্য gradient থাকে।

```text
Cost
 ↓
Gradient
 ├── gradient of w₁
 ├── gradient of w₂
 ├── gradient of w₃
 ├── gradient of w₄
 └── gradient of b
        ↓
Update all parameters
```

Concept:

> **প্রতিটি parameter-এর জন্য derivative/gradient বের করে cost কমার দিকে parameter-কে move করা হয়।**

---

## Module 06 Mental Model

```text
              DATA
                ↓
            Prediction
                ↓
             Error
                ↓
          Cost Function
                ↓
             Derivative
                ↓
        কোন দিকে Cost বাড়ে?
                ↓
      Opposite direction-এ move
                ↓
         Gradient Descent
                ↓
        Update Parameters
                ↓
       Cost আবার calculate
                ↓
             Repeat
                ↓
          Lower Cost
```

---

## Previous Modules-এর সাথে Connection

### Module 04

Derivative কী?

→ **Change-এর rate / slope**

### Module 05

Different functions-এর derivative কীভাবে বের করি?

→ যেমন `x² → 2x`

### Module 06

Derivative-এর ব্যবহার কী?

→ **Model-এর parameter এমনভাবে update করা যাতে cost কমে।**

**Derivative → Gradient → Gradient Descent → Lower Cost**

---

## Common Confusions

### 1. Gradient Descent কি prediction করে?

না। Prediction করে **ML model**।

Gradient Descent model-এর **parameters improve করে**।

### 2. Learning rate কি gradient?

না।

- Gradient = cost কোন direction-এ change করছে
- Learning rate = কত বড় step নেব

### 3. Gradient Descent কি একবারেই minimum খুঁজে পায়?

না। সাধারণত multiple iterations লাগে।

### 4. Multiple variables হলে কী হয়?

প্রতিটি parameter-এর gradient বের হয় এবং parameters update হয়।

---

## Quick Practice

### Q1

`m = 10`, learning rate = `0.1`, gradient = `5`

New `m` কত?

### Q2

Learning rate খুব ছোট হলে কী হবে?

A. Training slow হবে  
B. সবসময় overshoot করবে  
C. Cost automatically zero হবে

### Q3

Learning rate খুব বড় হলে কী সমস্যা হতে পারে?

A. Overshoot / unstable movement  
B. Training always perfect  
C. Gradient disappear

### Q4

Gradient Descent-এর main goal কী?

A. Cost বাড়ানো  
B. Cost কমানো  
C. Dataset delete করা

### Q5

Multiple-variable model-এ কী update হয়?

A. শুধু একটা parameter  
B. সব relevant parameters  
C. শুধু dataset

### Answers

1. **9.5**
2. **A**
3. **A**
4. **B**
5. **B**

---

## Final Cheat Sheet

| Concept | সহজ meaning |
|---|---|
| Cost Function | Model কতটা ভুল করছে |
| Derivative | কোন দিকে কত দ্রুত change |
| Gradient | Parameter-wise direction information |
| Gradient Descent | Cost কমানোর optimization method |
| Learning Rate | Step কত বড় হবে |
| Parameter | Model-এর শেখা value |
| Iteration | একবার update করার cycle |
| Minimum | Lowest cost point |

### One-line memory

> **Gradient Descent = Derivative-এর information ব্যবহার করে parameter-কে এমন দিকে step-by-step move করা, যাতে Cost/Loss কমতে থাকে।**
