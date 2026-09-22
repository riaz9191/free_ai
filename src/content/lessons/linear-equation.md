> **Goal:** Equation, line, slope, prediction, error, MSE, best-fit line, gradient descent এবং learning rate — সবগুলো concept একসাথে বুঝে Linear Regression-এর basic mathematical foundation তৈরি করা।

---

## 1. Equation কী?

**Equation** হলো এমন একটি mathematical statement যেখানে `=` চিহ্নের দুই পাশের value সমান।

উদাহরণ:

```text
x + 5 = 10
```

এখানে `x` কত হলে equation সত্য হবে?

```text
x + 5 = 10
x = 10 - 5
x = 5
```

### মূল ধারণা

- `x` একটি unknown value বা variable।
- Equation একটি relationship/rule প্রকাশ করে।
- লক্ষ্য হলো unknown variable-কে isolate করে তার value বের করা।
- কোনো operation এক পাশে করলে balance বজায় রাখতে অন্য পাশেও equivalent operation করতে হয়।

### আরও উদাহরণ

```text
x + 7 = 15
x = 8
```

```text
x - 4 = 10
x = 14
```

```text
2x = 10
x = 5
```

```text
3x = 18
x = 6
```

---

## 2. Variables, Input এবং Output

Machine Learning-এ variable দিয়ে data represent করা হয়।

উদাহরণ:

```text
y = x + 2
```

এখানে:

- `x` = input
- `y` = output
- `y = x + 2` = input এবং output-এর relationship

যদি `x = 3`:

```text
y = 3 + 2
y = 5
```

সহজ flow:

```text
Input x
  ↓
Equation / Rule
  ↓
Output y
```

---

## 3. Equation with Two Variables

দুইটি variable-এর equation:

```text
y = x + 1
```

কিছু value বসাই:

| x | y = x + 1 | Point |
|---|---|---|
| 0 | 1 | `(0, 1)` |
| 1 | 2 | `(1, 2)` |
| 2 | 3 | `(2, 3)` |
| 3 | 4 | `(3, 4)` |

প্রতিটি `(x, y)` pair graph-এর একটি point।

```text
x → equation → y → (x,y) → graph
```

যদি points একটি straight pattern follow করে, সেগুলো connect করলে straight line পাওয়া যায়।

### Example

```text
y = 2x
```

`x = 3` হলে:

```text
y = 2 × 3 = 6
```

`x = 4` হলে:

```text
y = 2 × 4 = 8
```

---

## 4. Equation with Three Variables

উদাহরণ:

```text
z = 2x + 3y
```

এখানে `x` এবং `y` input, `z` output হিসেবে ভাবা যায়।

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

আর যদি:

```text
x = 4
y = 3
```

তাহলে:

```text
z = 2(4) + 3(3)
  = 8 + 9
  = 17
```

### ML-এর সাথে connection

একটি house-price model-এ:

```text
size
bedrooms
bathrooms
age
location
   ↓
 Model
   ↓
price
```

এখানে size, bedrooms ইত্যাদি হলো **features**।

> **Feature = model-কে দেওয়া input information.**

বাস্তব ML model-এ একসাথে অনেক feature থাকতে পারে।

---

## 5. Equation of a Line

Straight line-এর সবচেয়ে পরিচিত equation:

```text
y = mx + b
```

এখানে:

- `x` = input
- `y` = output
- `m` = slope
- `b` = y-intercept / starting value

উদাহরণ:

```text
y = 2x + 1
```

| x | y |
|---|---|
| 0 | 1 |
| 1 | 3 |
| 2 | 5 |

খেয়াল করো, `x` প্রতি 1 বাড়লে `y` 2 করে বাড়ছে। কারণ `m = 2`।

আর `x = 0` হলে:

```text
y = 2(0) + 1 = 1
```

তাই `b = 1` হলো line-এর y-axis starting point।

---

## 6. Real-Life Example of `y = mx + b`

ধরো taxi-এর starting fare 50 টাকা এবং প্রতি km-এ 20 টাকা।

```text
Total Fare = 20 × Distance + 50
```

অর্থাৎ:

```text
y = 20x + 50
```

এখানে:

- `x` = distance
- `y` = total fare
- `m = 20` = প্রতি km-এর cost
- `b = 50` = starting fare

এই equation দেখায় কেন `m` এবং `b` বাস্তব relationship represent করতে পারে।

---

## 7. Slope কী?

**Slope** বলে `x` পরিবর্তন হলে `y` কতটা পরিবর্তন করছে।

সহজভাবে:

> `x` 1 unit বাড়লে `y` কতটা বাড়ে বা কমে।

Line equation-এ:

```text
y = mx + b
```

`m`-ই slope।

উদাহরণ:

```text
y = 5x + 3
```

এখানে:

```text
m = 5
b = 3
```

অর্থাৎ `x` 1 বাড়লে `y` 5 বাড়ে।

---

## 8. Slope Formula

দুটি point থাকলে:

```text
A = (x₁, y₁)
B = (x₂, y₂)
```

Slope:

```text
m = (y₂ - y₁) / (x₂ - x₁)
```

এটা এখনই মুখস্থ করা জরুরি নয়। Concept বোঝাই মূল লক্ষ্য।

### Example

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

অর্থাৎ `x` 1 unit পরিবর্তনের বিপরীতে `y` average 2 unit পরিবর্তন করছে।

---

## 9. Positive, Negative এবং Zero Slope

### Positive slope

```text
y = 2x
```

`x` বাড়লে `y` বাড়ে। Slope: `m > 0`

### Negative slope

```text
y = -2x
```

`x` বাড়লে `y` কমে। Slope: `m < 0`

### Zero slope

```text
y = 5
```

`x` পরিবর্তন হলেও `y` একই থাকে। Slope: `m = 0`

---

## 10. Two Points থেকে Line Equation

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

একটি point `(1, 3)` বসাই:

```text
3 = 2(1) + b
3 = 2 + b
b = 1
```

তাই line:

```text
y = 2x + 1
```

### General flow

```text
Two points
   ↓
Find slope m
   ↓
Use y = mx + b
   ↓
Insert one point
   ↓
Find b
   ↓
Complete line equation
```

---

## 11. Linear Regression কী?

Real-world data সবসময় perfect straight line follow করে না।

উদাহরণ:

| Study Hours | Exam Score |
|---|---|
| 1 | 42 |
| 2 | 48 |
| 3 | 61 |
| 4 | 67 |
| 5 | 78 |

Data points-এর মধ্যে overall একটি upward relationship আছে।

**Linear Regression** এমন একটি straight line খুঁজে বের করার চেষ্টা করে যা data-এর overall relationship ভালোভাবে represent করে এবং নতুন input-এর জন্য prediction করতে পারে।

একটি common notation:

```text
ŷ = b₀ + b₁x
```

এটা মূলত `y = mx + b`-এর একই ধরনের idea।

এখানে:

- `x` = feature/input
- `ŷ` = predicted value
- `b₁` = slope
- `b₀` = intercept

`ŷ` ("y-hat") ব্যবহার করা হয় বোঝাতে যে এটি actual `y` নয়, model-এর prediction।

---

## 12. Prediction

ধরো model:

```text
y = 5x + 20
```

`x = 4` হলে:

```text
y = 5(4) + 20
  = 20 + 20
  = 40
```

Model prediction = `40`।

---

## 13. Actual vs Predicted

ML model prediction করার পরে সেটাকে actual value-এর সাথে compare করা হয়।

উদাহরণ:

```text
Actual = 70
Predicted = 65
```

Model পুরোপুরি ঠিক হয়নি। Difference আছে। এই difference-ই **Error / Residual**।

---

## 14. Error / Residual

আমাদের শেখার convention:

```text
Error = Actual - Predicted
```

উদাহরণ:

```text
Actual = 70
Predicted = 65

Error = 70 - 65 = 5
```

আর:

```text
Actual = 70
Predicted = 75

Error = 70 - 75 = -5
```

Positive বা negative sign direction বোঝায়। Error-এর magnitude বলে prediction কতটা দূরে।

Graph-এ residual-কে actual point এবং prediction line-এর vertical distance হিসেবে ভাবা যায়।

---

## 15. কেন শুধু Error যোগ করি না?

ধরো দুটি error: `+5` এবং `-5`।

যোগ করলে:

```text
5 + (-5) = 0
```

কিন্তু model দুইবারই ভুল করেছে। Total error `0` বললে ভুল ধারণা হবে।

এই সমস্যা এড়াতে error square করা হয়।

---

## 16. Squared Error

```text
Squared Error = Error²
```

উদাহরণ:

```text
Error = 5
Squared Error = 5² = 25
```

Negative error:

```text
Error = -5
Squared Error = (-5)² = 25
```

### Squaring-এর সুবিধা

1. Negative এবং positive error cancel করে না।
2. সব squared error non-negative হয়।
3. বড় error-কে বেশি penalty দেয়।

উদাহরণ:

```text
Error 2  → Squared Error 4
Error 5  → Squared Error 25
Error 10 → Squared Error 100
```

---

## 17. MSE — Mean Squared Error

**MSE = Mean Squared Error**, অর্থাৎ সব squared error-এর average।

Formula:

```text
MSE = Sum of Squared Errors / Number of Observations
```

অথবা:

```text
MSE = (e₁² + e₂² + ... + eₙ²) / n
```

### Example

| Actual | Predicted | Error | Squared Error |
|---|---|---|---|
| 80 | 75 | 5 | 25 |
| 60 | 65 | -5 | 25 |
| 90 | 87 | 3 | 9 |

তাহলে:

```text
MSE = (25 + 25 + 9) / 3
    = 59 / 3
    ≈ 19.67
```

---

## 18. MSE দিয়ে Model Compare করা

ধরো:

```text
Model A → MSE = 1
Model B → MSE = 14.33
```

এই dataset-এ Model A-এর squared prediction errors overall কম।

সাধারণভাবে:

> **Lower MSE = lower average squared error on the evaluated data.**

তবে বাস্তব ML-এ training data-তে কম MSE হলেই model সবসময় নতুন data-তে best হবে — এমন নিশ্চয়তা নেই। পরে train/test data ও overfitting শিখলে বিষয়টি আরও পরিষ্কার হবে।

---

## 19. Best Fit Line

Linear Regression-এর লক্ষ্য হলো এমন line খুঁজে বের করা যা data points-এর overall relationship ভালোভাবে represent করে।

MSE ব্যবহার করলে আমরা এমন parameters চাই যেগুলো MSE minimize করে।

সহজভাবে:

```text
Many possible lines
       ↓
Make predictions
       ↓
Calculate errors
       ↓
Calculate MSE
       ↓
Search for lower MSE
       ↓
Best-fit parameters
```

Best-fit line সব data point-এর মধ্য দিয়ে যেতেই হবে এমন নয়।

---

## 20. Cost / Loss Function

Model কতটা ভুল করছে তা measure করার mathematical function-কে সাধারণভাবে **loss function** বা optimization context-এ **cost/objective function** বলা হয়।

আমাদের Linear Regression example-এ MSE একটি common loss/objective:

```text
Parameters m,b
      ↓
Predictions
      ↓
MSE(m,b)
```

আমাদের লক্ষ্য:

```text
MSE যতটা সম্ভব কমানো
```

---

## 21. Gradient Descent কী?

ধরো MSE একটি পাহাড়ের মতো surface।

```text
          ● Start
         /
        /
       /
      /
_____/________  Low area
```

আমাদের লক্ষ্য সবচেয়ে নিচের দিকে যাওয়া, অর্থাৎ **loss/MSE কমানো**।

**Gradient Descent** হলো parameters-কে ছোট ছোট step-এ update করে loss কমানোর একটি optimization algorithm।

---

## 22. Gradient কী?

Gradient বলে loss function কোন direction-এ সবচেয়ে দ্রুত বাড়ছে এবং কত দ্রুত পরিবর্তন হচ্ছে।

একটি parameter-এর ক্ষেত্রে এটাকে slope-এর মতো ভাবা যায়।

```text
Gradient → uphill direction information
Gradient Descent → opposite direction-এ move করে
```

কারণ আমাদের লক্ষ্য loss **বাড়ানো নয়, কমানো**। এই কারণে update rule-এ minus sign থাকে।

---

## 23. Learning Rate কী?

Gradient Descent একবারে কত বড় step নেবে তা **Learning Rate** control করে।

সাধারণত learning rate-কে `α` (alpha) বা `η` (eta) দিয়ে লেখা হয়।

### খুব ছোট Learning Rate

- ছোট step
- training ধীর হতে পারে
- minimum-এর দিকে steady movement হতে পারে

### খুব বড় Learning Rate

- minimum overshoot করতে পারে
- এদিক-ওদিক oscillate করতে পারে
- training unstable বা diverge করতে পারে

```text
Too small → slow
Reasonable → useful progress
Too large → may overshoot / diverge
```

---

## 24. Gradient Descent Parameter Update

Basic update rule:

```text
new parameter
=
old parameter
-
learning rate × gradient
```

অর্থাৎ:

```text
θ_new = θ_old - α × gradient
```

এখানে `θ` যেকোনো trainable parameter represent করতে পারে।

### Example: শুধু `m` update

ধরো:

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

---

## 25. Multiple Gradient Descent Steps

একবার update করেই training শেষ হয় না।

উদাহরণ:

```text
8 → 7.4 → 7.0 → 6.8 → ...
```

প্রতিটি step-এ সাধারণত নতুন parameter দিয়ে prediction/loss/gradient আবার calculate হয়। তাই gradient-ও step থেকে step-এ পরিবর্তিত হতে পারে।

---

## 26. `m` এবং `b` দুটোই Update করা

আমাদের model:

```text
y = mx + b
```

তাই `m` এবং `b` দুটোই trainable parameter হতে পারে।

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
      = 5 + 0.4
      = 5.4
```

নতুন line:

```text
y = 1.8x + 5.4
```

### Visual intuition

- `m` বদলালে line-এর slope/angle বদলায়।
- `b` বদলালে line উপরে বা নিচে shift করে।
- দুটো adjust করে model lower-loss line-এর দিকে যেতে পারে।

---

## 27. Complete Linear Regression Training Flow

ধরো dataset:

| x | Actual y |
|---|---|
| 1 | 3 |
| 2 | 5 |
| 3 | 7 |

Initial model:

```text
y = x + 1
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

এরপর optimization process:

```text
Current m,b
    ↓
Predictions
    ↓
Loss / MSE
    ↓
Gradients
    ↓
Gradient Descent update
    ↓
New m,b
    ↓
Repeat
```

Idealভাবে training চলতে চলতে parameters এমন value-এর দিকে যায় যেখানে training objective কম হয়।

---

## 28. Linear Regression-এর Full Mental Model

```text
Raw Data
   ↓
Features (x)
   ↓
Linear Model: ŷ = mx + b
   ↓
Prediction ŷ
   ↓
Compare with Actual y
   ↓
Error / Residual
   ↓
Squared Error
   ↓
MSE / Loss
   ↓
Gradient
   ↓
Gradient Descent
   ↓
Learning Rate controls step size
   ↓
Update m and b
   ↓
Repeat
   ↓
Lower-loss / Best-fit parameters
```

---

## 29. Important Terms Cheat Sheet

| Term | সহজ অর্থ |
|---|---|
| Variable | পরিবর্তন হতে পারে এমন value |
| Equation | values/variables-এর relationship |
| Input | model-কে দেওয়া information |
| Output | model থেকে পাওয়া result |
| Feature | prediction-এর জন্য ব্যবহৃত input |
| `x` | সাধারণত input/feature |
| `y` | actual output/target |
| `ŷ` | predicted output |
| `m` | slope |
| `b` | intercept |
| Slope | x বদলালে y কতটা বদলায় |
| Intercept | x=0 হলে line-এর y value |
| Linear Regression | straight-line relationship দিয়ে numeric prediction করার model |
| Prediction | model-এর estimated output |
| Actual | real/observed output |
| Error / Residual | actual এবং prediction-এর difference |
| Squared Error | error² |
| MSE | squared errors-এর mean |
| Loss | model error measure করার function |
| Best Fit Line | chosen objective অনুযায়ী data-কে ভালোভাবে fit করা line |
| Gradient | loss কোন দিকে/কত দ্রুত বাড়ে তার local information |
| Gradient Descent | gradient-এর opposite direction-এ parameters update করে loss কমানোর algorithm |
| Learning Rate | প্রতিটি update step কত বড় হবে |
| Parameter | model শেখে/adjust করে এমন value, যেমন m ও b |

---

## 30. Formula Cheat Sheet

**Line**

```text
y = mx + b
```

**Slope from two points**

```text
m = (y₂ - y₁) / (x₂ - x₁)
```

**Error**

```text
Error = Actual - Predicted
```

> Note: কিছু বই/লাইব্রেরিতে residual/error-এর sign convention উল্টো হতে পারে। Squared Error/MSE-তে sign square হয়ে যাওয়ায় value একই থাকে।

**Squared Error**

```text
Squared Error = Error²
```

**Mean Squared Error**

```text
MSE = Σ(Error²) / n
```

**Gradient Descent**

```text
new parameter
=
old parameter
-
learning rate × gradient
```

---

## 31. কী মুখস্থ করতে হবে?

শুরুতে formula মুখস্থ করার চেয়ে **concept বুঝতে হবে**।

এই flowটা বুঝতে পারলে সবচেয়ে বেশি লাভ:

```text
Input
 ↓
Model
 ↓
Prediction
 ↓
Actual-এর সাথে compare
 ↓
Error
 ↓
Loss
 ↓
Gradient
 ↓
Parameter update
 ↓
Better model
```

Practice করতে করতে formula naturally familiar হয়ে যাবে।

---

## 32. Common Confusions

**`m` আর `b` কি data?**
না। Simple Linear Regression-এ এগুলো model-এর **parameters**।

**`x` কী?**
Input/feature।

**`y` আর `ŷ` কি একই?**
না। `y` = actual value, `ŷ` = model prediction।

**Error negative হলে কি খারাপ?**
Negative sign শুধু direction বোঝায়। Magnitude বলে কতটা difference।

**MSE কি negative হতে পারে?**
না। Squared values non-negative, তাই MSE-ও non-negative।

**MSE = 0 মানে কী?**
Evaluated data-তে predictions actual values-এর সাথে exactly match করেছে।

**MSE কম হলেই model perfect?**
না। কোন data-তে MSE measure করা হয়েছে সেটা গুরুত্বপূর্ণ। Training data-তে খুব কম error থাকলেও unseen data-তে performance খারাপ হতে পারে। পরে **generalization, train/test split, overfitting** শিখলে এটা বিস্তারিত বোঝা যাবে।

**Gradient Descent কি শুধু Linear Regression-এ?**
না। Neural Networks-সহ অনেক ML model optimization-এ gradient-based methods ব্যবহার করা হয়।

---

## 33. Mini Practice Set

নিজে solve করার চেষ্টা করো।

1. `y = 3x + 2`, `x = 5` হলে `y = ?`
2. `y = 7x + 4` — `m` এবং `b` কত?
3. Actual = 30, Predicted = 26 হলে Error কত?
4. Error = `-6` হলে Squared Error কত?
5. Squared Errors = 4, 9, 16 হলে MSE কত?
6. Model A MSE = 2, Model B MSE = 8 — এই evaluated dataset-এ কার average squared error কম?
7. `m = 10`, learning rate = 0.1, gradient = 4 হলে নতুন `m` কত?
8. `y = -3x + 5`-এর slope positive, negative নাকি zero?

### Answers

1. `y = 17`
2. `m = 7`, `b = 4`
3. `4`
4. `36`
5. `(4 + 9 + 16) / 3 = 29/3 ≈ 9.67`
6. Model A-এর average squared error কম
7. `10 - (0.1 × 4) = 9.6`
8. Negative slope

---

## 34. Module 1 Final Summary

Module 1 শেষে তুমি এই connection বুঝবে:

```text
Equation
  ↓
Relationship between variables
  ↓
Straight Line: y = mx + b
  ↓
Slope + Intercept
  ↓
Linear Regression
  ↓
Prediction
  ↓
Error
  ↓
Squared Error
  ↓
MSE
  ↓
Best-fit objective
  ↓
Gradient
  ↓
Gradient Descent
  ↓
Learning Rate
  ↓
Update m & b
  ↓
Repeat and reduce loss
```

### সবচেয়ে গুরুত্বপূর্ণ কথা

> **Data থেকে relationship শেখা → prediction করা → ভুল measure করা → ভুল কমানোর জন্য model-এর parameters adjust করা।**

এটাই পরের Module-গুলোর foundation।

---

## Next Module

**Module 2 — Scalars & Vectors**

পরবর্তী concepts:

1. Basic Understanding of Vectors in ML
2. Scalar and Vector
3. Row Vector, Column Vector এবং Transpose
4. Vector Distance from the Origin
5. Distance Between Two Vectors
6. Dot Product
7. Vector Operations

---

> **Study tip:** এই note-টা reference হিসেবে রাখো। একবারে সব মুখস্থ করার দরকার নেই। Example নিজে হাতে solve করাই সবচেয়ে useful practice।
