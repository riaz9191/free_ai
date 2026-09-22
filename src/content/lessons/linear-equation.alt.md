> **Goal:** Equation থেকে শুরু করে Linear Regression, MSE, Gradient Descent এবং Learning Rate পর্যন্ত পুরো foundation সহজভাবে বোঝা।
>
> **Study rule:** Formula মুখস্থ করার আগে concept বোঝো। Example solve করতে করতে formula নিজে থেকেই familiar হয়ে যাবে।

---

## 1. Equation কী?

Equation হলো এমন একটি mathematical statement যেখানে `=` চিহ্নের দুই পাশের value সমান।

```text
x + 5 = 10
```

এখানে এমন `x` খুঁজতে হবে যাতে equation সত্য হয়।

```text
x + 5 = 10
x = 10 - 5
x = 5
```

কারণ:

```text
5 + 5 = 10
```

### মূল ধারণা

Equation-কে একটি **relationship বা rule** হিসেবেও ভাবা যায়।

```text
Input → Rule/Equation → Output
```

Machine Learning-এ এই relationship-এর ধারণা অনেক গুরুত্বপূর্ণ।

---

## 2. Types of Equation — Basic Idea

এই module-এর জন্য সবচেয়ে গুরুত্বপূর্ণ হলো **linear equation**।

### One-variable equation

```text
x + 5 = 10
2x = 10
```

### Two-variable equation

```text
y = 2x + 1
```

এখানে `x` এবং `y` দুইটি variable।

### Three-variable equation

```text
z = 2x + 3y
```

এখানে `x`, `y`, `z` আছে।

> এখনই equation-এর সব mathematical category মুখস্থ করার প্রয়োজন নেই। ML foundation-এর জন্য relationship, variables এবং linear equations বুঝলেই শুরু করা যায়।

---

## 3. Linear Equation Solve করা

Goal হলো unknown variable-কে একা করা।

**Example 1**

```text
x + 7 = 15
x = 15 - 7
x = 8
```

**Example 2**

```text
x - 4 = 10
x = 10 + 4
x = 14
```

**Example 3**

```text
2x = 10
x = 10 / 2
x = 5
```

**Example 4**

```text
3x = 18
x = 18 / 3
x = 6
```

### Better mathematical way to think

শুধু "পাশ বদলালে sign বদলায়" মুখস্থ না করে ভাবো:

> Equation-এর এক পাশে যে operation করবে, balance রাখতে অন্য পাশেও equivalent operation করতে হবে।

---

## 4. 2 Variables-এর Equation

Example:

```text
y = x + 1
```

এখানে:

- `x` = input
- `y` = output

Different `x` দিলে different `y` পাওয়া যায়।

| x | y = x + 1 |
|---|---|
| 0 | 1 |
| 1 | 2 |
| 2 | 3 |
| 3 | 4 |

তাই আমরা points পাই:

```text
(0,1)
(1,2)
(2,3)
(3,4)
```

### Flow

```text
x
↓
Equation
↓
y
↓
(x, y)
↓
Graph
```

---

## 5. 2 Variable Equation Plot করা

Equation:

```text
y = 2x
```

কিছু value বসাই:

| x | y |
|---|---|
| 0 | 0 |
| 1 | 2 |
| 2 | 4 |
| 3 | 6 |

Points:

```text
(0,0), (1,2), (2,4), (3,6)
```

Simple graph:

```text
y
6 |             ●
5 |
4 |         ●
3 |
2 |     ●
1 |
0 | ●
  +----------------→ x
    0   1   2   3
```

Points connect করলে straight line পাওয়া যায়।

---

## 6. 3 Variables-এর Equation

Example:

```text
z = 2x + 3y
```

এখানে:

- `x` = input
- `y` = input
- `z` = output

যদি:

```text
x = 5
y = 2
```

তাহলে:

```text
z = 2(5) + 3(2)
  = 10 + 6
  = 16
```

### ML connection: Features

ধরো house price predict করব।

Inputs হতে পারে:

```text
Size
Bedrooms
Bathrooms
Age
Location
```

এগুলোকে ML-এ **features** বলা হয়।

```text
Features → Model → Prediction
```

একটি feature হলে একটি input, অনেক feature হলে অনেক input একসাথে model ব্যবহার করতে পারে।

---

## 7. Equation of a Line — `y = mx + b`

Straight line-এর common equation:

```text
y = mx + b
```

এখানে:

- `x` = input
- `y` = output
- `m` = slope
- `b` = y-intercept / starting value

Example:

```text
y = 2x + 1
```

তাহলে:

```text
m = 2
b = 1
```

Values:

| x | y |
|---|---|
| 0 | 1 |
| 1 | 3 |
| 2 | 5 |

Notice:

- `x = 0` হলে `y = b = 1`
- `x` প্রতি 1 বাড়লে `y` 2 করে বাড়ছে

### Real-life example: Taxi Fare

ধরো:

- Starting fare = 50
- প্রতি km = 20

তাহলে:

```text
Fare = 20 × Distance + 50
```

বা:

```text
y = 20x + 50
```

এখানে:

```text
m = 20
b = 50
```

---

## 8. Slope

Slope বলে:

> `x` change করলে `y` কতটা change করে।

Line equation:

```text
y = mx + b
```

এখানে `m` হলো slope।

### Example

```text
y = 3x + 5
```

Slope:

```text
m = 3
```

অর্থাৎ `x` 1 বাড়লে `y` 3 বাড়ে।

### Two points থেকে slope

Formula:

```text
m = (y₂ - y₁) / (x₂ - x₁)
```

Example:

```text
A = (1, 4)
B = (3, 8)
```

তাহলে:

```text
m = (8 - 4) / (3 - 1)
  = 4 / 2
  = 2
```

**Positive Slope**

```text
y = 2x
```

`x ↑` হলে `y ↑`

```text
    /
   /
  /
 /
```

**Negative Slope**

```text
y = -2x
```

`x ↑` হলে `y ↓`

```text
\
 \
  \
   \
```

**Zero Slope**

```text
y = 5
```

`x` change হলেও `y` একই।

```text
-----------
```

---

## 9. Two Points থেকে Line Equation

ধরো:

```text
A = (1, 3)
B = (3, 7)
```

প্রথমে slope:

```text
m = (7 - 3) / (3 - 1)
  = 4 / 2
  = 2
```

এখন:

```text
y = mx + b
```

একটি point `(1,3)` বসাই:

```text
3 = 2(1) + b
3 = 2 + b
b = 1
```

তাই line:

```text
y = 2x + 1
```

### Complete flow

```text
Two points
↓
Slope m
↓
y = mx + b
↓
একটি point বসাও
↓
b বের করো
↓
Full line equation
```

---

## 10. Machine Learning-এর সাথে Connection

আমরা এত equation কেন শিখলাম?

কারণ ML অনেক সময় data-এর মধ্যে relationship খোঁজে।

Example:

```text
Study Hours → Exam Score
House Size → House Price
Experience → Salary
```

Simple relationship:

```text
Input x
↓
Model
↓
Output y
```

Model যদি straight-line relationship শিখে, সেটি এমন হতে পারে:

```text
y = mx + b
```

ML-এর কাজ হলো useful `m` এবং `b` খুঁজে বের করা যাতে prediction data-এর সাথে ভালোভাবে fit করে।

---

## 11. Linear Regression

Linear Regression হলো একটি supervised learning technique যেখানে input এবং output-এর relationship-কে একটি straight line দিয়ে model করার চেষ্টা করা হয়।

Example data:

| Study Hours | Score |
|---|---|
| 1 | 42 |
| 2 | 48 |
| 3 | 61 |
| 4 | 67 |
| 5 | 78 |

সব points perfectly এক line-এর উপর নাও থাকতে পারে।

Linear Regression এমন একটি line খোঁজে যা points-এর **overall কাছাকাছি** থাকে।

Model notation প্রায়ই:

```text
ŷ = b₀ + b₁x
```

এটি conceptually একই:

```text
y = mx + b
```

Mapping:

```text
b₁ ≈ slope m
b₀ ≈ intercept b
ŷ  = predicted y
```

> `ŷ` ("y-hat") মানে model-এর predicted value।

---

## 12. Prediction

ধরো trained model:

```text
y = 5x + 20
```

যদি:

```text
x = 4
```

Prediction:

```text
y = 5(4) + 20
  = 20 + 20
  = 40
```

ML-এর basic idea:

```text
New Input
↓
Learned Model
↓
Prediction
```

---

## 13. Error / Residual

Model-এর prediction actual value-এর সাথে সবসময় exactly match নাও করতে পারে।

Simple convention হিসেবে:

```text
Error = Actual - Predicted
```

Example:

```text
Actual = 70
Predicted = 65

Error = 70 - 65 = 5
```

আর যদি:

```text
Actual = 70
Predicted = 75

Error = 70 - 75 = -5
```

Positive/negative sign direction বোঝায়।

Graphically error-কে point এবং predicted line-এর vertical difference হিসেবে ভাবা যায়।

```text
Actual point ●
             |
             | Error
             |
Prediction --×-- line
```

> কিছু বই/লাইব্রেরি residual বা error-এর sign convention উল্টোভাবে লিখতে পারে (`Predicted - Actual`)। Squared Error-এর ক্ষেত্রে sign square হয়ে যায়, তাই MSE একই থাকে।

---

## 14. Squared Error

**Problem:** দুইটা error:

```text
+5
-5
```

Direct sum:

```text
5 + (-5) = 0
```

কিন্তু model তো দুইবারই ভুল করেছে!

তাই error square করা যায়:

```text
5² = 25
(-5)² = 25
```

### Formula

```text
Squared Error = Error²
```

Example:

```text
Actual = 80
Predicted = 75

Error = 5
Squared Error = 5² = 25
```

### কেন square?

1. Negative এবং positive error cancel করে না।
2. বড় error-কে বেশি penalty দেয়।

Example:

```text
Error 2 → Squared Error 4
Error 10 → Squared Error 100
```

---

## 15. MSE — Mean Squared Error

MSE = **Mean Squared Error**, অর্থাৎ সব squared error-এর average।

Formula:

```text
MSE = Σ(Actual - Predicted)² / n
```

এখানে:

- `Σ` = সবগুলো যোগ করো
- `n` = total observations

Example:

| Actual | Predicted | Error | Squared Error |
|---|---|---|---|
| 80 | 75 | 5 | 25 |
| 60 | 65 | -5 | 25 |
| 90 | 87 | 3 | 9 |

তাই:

```text
MSE = (25 + 25 + 9) / 3
    = 59 / 3
    ≈ 19.67
```

### Interpretation

একই dataset এবং একই target scale-এ model compare করলে সাধারণভাবে:

```text
Lower MSE → Lower average squared prediction error
Higher MSE → Higher average squared prediction error
```

> MSE-এর unit target-এর unit-এর square হয়। তাই `MSE = 4` মানে সরাসরি "average error 4" বলা ঠিক নয়।

---

## 16. Best Fit Line

ধরো দুইটা model:

```text
Model A → MSE = 1
Model B → MSE = 14.33
```

এই dataset-এর জন্য Model A-এর squared prediction error কম।

Linear Regression training-এর goal:

> এমন `m` এবং `b` খোঁজা যাতে training data-এর loss/MSE কম হয়।

Conceptually:

```text
Possible Lines
↓
Predictions
↓
Errors
↓
MSE
↓
Lower-error line
```

এই line-কে আমরা **best fit line** বলি।

Important: best fit line-এর সব point-এর মধ্য দিয়ে যাওয়া বাধ্যতামূলক নয়।

```text
●
    ●
------- best-fit trend
       ●
   ●
```

এটি overall data trend capture করার চেষ্টা করে।

---

## 17. Gradient

Gradient নামটা কঠিন, idea সহজ।

পাহাড় কল্পনা করো:

```text
High
   ●
    \
     \
      \
       ●
        \
         \____ Lowest
```

আমাদের loss/MSE-কে পাহাড়ের height হিসেবে ভাবতে পারি।

Gradient local slope/direction-এর information দেয় — parameter একটু change করলে loss কোন দিকে এবং কত দ্রুত change করছে।

### One-dimensional intuition

```text
Gradient positive
→ parameter বাড়ালে loss locally বাড়ছে
→ loss কমাতে parameter কমানোর দিকে যাওয়া যায়
```

```text
Gradient negative
→ parameter বাড়ালে loss locally কমছে
→ loss কমাতে parameter বাড়ানোর দিকে যাওয়া যায়
```

Gradient Descent gradient-এর **opposite direction** ব্যবহার করে।

---

## 18. Gradient Descent

Gradient Descent হলো loss/MSE কমানোর জন্য parameters ধাপে ধাপে update করার optimization method।

পাহাড়ের analogy:

```text
Start ●
      \
       ●
        \
         ●
          \
           ●
            \___ 🎯 Low point
```

ML-এ:

```text
Current m, b
↓
Prediction
↓
Loss / MSE
↓
Gradient
↓
m, b update
↓
New prediction
↓
New loss
↓
Repeat
```

একবারেই perfect value পাওয়ার দরকার নেই।

ছোট ছোট steps:

```text
8 → 7.4 → 7.0 → 6.8 → ...
```

---

## 19. Learning Rate

Learning Rate বলে:

> Gradient Descent এক update-এ কত বড় step নেবে।

সাধারণ notation:

```text
α (alpha)
```

Example:

```text
Learning Rate = 0.1
```

### Too Small

```text
● → ● → ● → ● → ● → 🎯
```

খুব ধীরে convergence হতে পারে।

### Too Large

```text
      ↙   ↘
   ●         ●
      🎯
```

Minimum-এর এপাশ-ওপাশ overshoot করতে পারে, এমনকি training unstable/diverge-ও করতে পারে।

### Reasonable Learning Rate

Goal হলো এমন step size যাতে training efficiently lower-loss region-এর দিকে যায়।

---

## 20. Parameter Update

Basic Gradient Descent update:

```text
new parameter
=
old parameter
-
learning rate × gradient
```

Mathematically:

```text
θ_new = θ_old - α × gradient
```

`θ` যেকোনো trainable parameter represent করতে পারে।

**Example**

```text
m = 8
Learning Rate = 0.2
Gradient = 3
```

তাহলে:

```text
new m = 8 - (0.2 × 3)
      = 8 - 0.6
      = 7.4
```

আরেকটি:

```text
m = 10
Learning Rate = 0.1
Gradient = 5
```

```text
new m = 10 - (0.1 × 5)
      = 10 - 0.5
      = 9.5
```

---

## 21. m এবং b একসাথে Update

Linear Regression line:

```text
y = mx + b
```

Training-এর সময় `m` এবং `b` দুটোই update হতে পারে।

ধরো:

```text
m = 2
b = 5

learning rate = 0.1
gradient for m = 2
gradient for b = -4
```

### m update

```text
new m = 2 - (0.1 × 2)
      = 1.8
```

### b update

```text
new b = 5 - (0.1 × -4)
      = 5 - (-0.4)
      = 5.4
```

নতুন line:

```text
y = 1.8x + 5.4
```

### Visual intuition

`m` বদলালে line-এর tilt/slope বদলায়।

```text
m small:   ----/
m large:      /
             /
            /
```

`b` বদলালে line উপরে/নিচে shift করে।

```text
Higher b:  ----------
Lower b:   ----------
```

Gradient Descent দুটোকে adjust করে lower loss-এর line-এর দিকে যেতে পারে।

---

## 22. Complete Training Flow

Example dataset:

| x | Actual y |
|---|---|
| 1 | 3 |
| 2 | 5 |
| 3 | 7 |

Initial model:

```text
y = 1x + 1
```

Predictions:

| x | Actual | Predicted | Error |
|---|---|---|---|
| 1 | 3 | 2 | 1 |
| 2 | 5 | 3 | 2 |
| 3 | 7 | 4 | 3 |

Squared errors:

```text
1² = 1
2² = 4
3² = 9
```

MSE:

```text
MSE = (1 + 4 + 9) / 3
    = 14 / 3
    ≈ 4.67
```

এখন optimizer gradients calculate করে `m` এবং `b` update করবে।

তারপর আবার:

```text
New m, b
↓
New predictions
↓
New errors
↓
New MSE
↓
New gradients
↓
Update again
```

Training-এর conceptual loop:

```text
DATA
 ↓
MODEL: y = mx + b
 ↓
PREDICTION
 ↓
ACTUAL vs PREDICTION
 ↓
ERROR
 ↓
SQUARED ERROR
 ↓
MSE / LOSS
 ↓
GRADIENT
 ↓
GRADIENT DESCENT
 ↓
LEARNING RATE × GRADIENT
 ↓
UPDATE m AND b
 ↓
NEW MODEL
 ↓
REPEAT
 ↓
LOWER TRAINING LOSS / BEST-FIT PARAMETERS
```

---

## 23. Common Mistakes

**Mistake 1: `m` এবং `b` গুলিয়ে ফেলা**

```text
y = 5x + 3
```

Correct: `m = 5`, `b = 3`

**Mistake 2: Negative error square ভুল করা**

```text
(-4)² = 16
```

`-16` নয়।

**Mistake 3: MSE কম মানেই সবকিছু perfect ভাবা**

MSE training/evaluation-এর একটি metric। Real ML-এ unseen data performance, overfitting, data quality, feature quality ইত্যাদিও গুরুত্বপূর্ণ।

**Mistake 4: Gradient direction-এই যাওয়া**

Gradient Descent:

```text
parameter = parameter - learning_rate × gradient
```

অর্থাৎ loss কমানোর জন্য gradient-এর opposite direction-এ update করে।

**Mistake 5: Learning rate যত বড় তত ভালো**

না। খুব বড় learning rate minimum overshoot করতে পারে।

**Mistake 6: Formula শুধু মুখস্থ করা**

এই module-এর আসল goal:

```text
কেন → কীভাবে → example → practice
```

Formula পরে naturally familiar হবে।

---

## 24. Quick Cheat Sheet

| Concept | Meaning |
|---|---|
| Equation | দুই পাশ equal এমন mathematical relationship |
| Variable | পরিবর্তন হতে পারে এমন value (`x`, `y`) |
| Feature | Model-এর input information |
| `y = mx + b` | Straight line equation |
| `m` | Slope |
| `b` | y-intercept / x=0 হলে predicted y |
| Slope | x change হলে y কতটা change করে |
| Linear Regression | Straight-line relationship দিয়ে prediction model করা |
| `ŷ` | Predicted y |
| Error | Actual − Predicted (এই notes-এর convention) |
| Squared Error | Error² |
| MSE | Squared errors-এর mean |
| Best Fit Line | Data-এর জন্য lower-loss fitting line |
| Gradient | Loss-এর local slope/change information |
| Gradient Descent | Gradient ব্যবহার করে loss কমানোর optimization |
| Learning Rate | প্রতি update-এর step size |
| Parameter | Model শেখে/adjust করে এমন value, যেমন `m`, `b` |

### Important formulas

```text
Line:
y = mx + b
```

```text
Slope:
m = (y₂ - y₁) / (x₂ - x₁)
```

```text
Error:
Error = Actual - Predicted
```

```text
Squared Error:
SE = Error²
```

```text
Mean Squared Error:
MSE = Σ(Actual - Predicted)² / n
```

```text
Gradient Descent Update:
new_parameter = old_parameter - learning_rate × gradient
```

---

## 25. Practice Set

নিজে solve করার চেষ্টা করো।

1. **Equation** — `x + 8 = 15` হলে `x = ?`
2. **Equation** — `3x = 21` হলে `x = ?`
3. **Prediction** — `y = 3x + 2`, `x = 4` হলে `y = ?`
4. **Slope and Intercept** — `y = 5x + 3`-এর `m = ?`, `b = ?`
5. **Slope from Points** — `A = (1, 2)`, `B = (3, 6)` হলে slope কত?
6. **Error** — Actual = 20, Predicted = 17 হলে Error কত?
7. **Squared Error** — Error = `-4` হলে Squared Error কত?
8. **MSE** — Squared errors 4, 9, 16 হলে MSE কত?
9. **Model Comparison** — Model A MSE = 4, Model B MSE = 10 — কোন model-এর squared prediction error কম?
10. **Gradient Descent** — old m = 10, learning rate = 0.1, gradient = 5 হলে new `m` কত?
11. **Negative Gradient** — old b = 5, learning rate = 0.1, gradient = -4 হলে new `b` কত?

### Answers

1. `x = 7`
2. `x = 7`
3. `y = 3(4) + 2 = 14`
4. `m = 5`, `b = 3`
5. `m = (6 - 2) / (3 - 1) = 4 / 2 = 2`
6. `20 - 17 = 3`
7. `(-4)² = 16`
8. `MSE = (4 + 9 + 16) / 3 = 29 / 3 ≈ 9.67`
9. Model A — কারণ একই dataset/target scale-এ `4 < 10`
10. `new m = 10 - (0.1 × 5) = 9.5`
11. `new b = 5 - (0.1 × -4) = 5.4`

---

## Module 1 — Final Mental Model

Module 1-এর সবকিছু যদি এক ছবিতে মনে রাখতে চাও:

```text
REAL DATA
   ↓
FEATURE / INPUT (x)
   ↓
LINEAR MODEL
ŷ = mx + b
   ↓
PREDICTION (ŷ)
   ↓
COMPARE WITH ACTUAL y
   ↓
ERROR
   ↓
SQUARE THE ERROR
   ↓
AVERAGE → MSE
   ↓
GRADIENT
   ↓
GRADIENT DESCENT
   ↓
LEARNING RATE CONTROLS STEP SIZE
   ↓
UPDATE m & b
   ↓
BETTER-FITTING MODEL
   ↓
REPEAT
```

### One-sentence summary

> **Linear Regression data-এর relationship-কে একটি line দিয়ে model করে; prediction-এর error থেকে MSE measure করা হয়, আর Gradient Descent learning rate ব্যবহার করে `m` ও `b` adjust করে loss কমানোর চেষ্টা করে।**

---

## What Comes Next?

**Module 2 — Scalars & Vectors**

Module 1-এ আমরা individual variables এবং line নিয়ে কাজ করেছি। Module 2-তে শিখব কীভাবে অনেকগুলো number/input একসাথে **vector** হিসেবে represent করা যায় — যা modern Machine Learning-এর fundamental language-এর একটি অংশ।

---

**Status: Module 1 Complete ✅**
