> **Goal:** Machine Learning-এ Scalar, Vector এবং basic vector mathematics একদম foundation level থেকে বোঝা।

---

## Module 2 Roadmap

1. Basic Understanding of Vectors in ML
2. Scalar and Vector
3. Row Vector, Column Vector and Transpose
4. Vector Distance from the Origin
5. Distance Between Two Vectors
6. Dot Product of Two Vectors
7. Vector Operations

---

## 1. Basic Understanding of Vectors in ML

Machine Learning-এ একটি real-world object সম্পর্কে একাধিক information থাকতে পারে।

উদাহরণ: একটি house

```text
Size       = 1200 sq ft
Bedrooms   = 3
Bathrooms  = 2
Age        = 5 years
```

এই information একসাথে লেখা যায়:

```text
[1200, 3, 2, 5]
```

এটি একটি **vector** হিসেবে represent করা যায়।

```text
House
  ↓
[1200, 3, 2, 5]
  ↓
Machine Learning Model
  ↓
Prediction
```

Vector ML-এ useful কারণ একটি data point-এর অনেকগুলো feature একসাথে represent করা যায়।

---

## 2. Scalar কী?

**Scalar = একটি single number/value.**

উদাহরণ:

```text
5
10
-3
2.5
100
```

এগুলো প্রত্যেকটি Scalar।

Real-life examples:

| Information | Value |
|---|---|
| Age | 27 |
| Temperature | 30 |
| Weight | 70 |
| Price | 500 |
| Speed | 60 |

যেমন:

```text
Age = 27
```

এখানে `27` একটি scalar।

---

## 3. Vector কী?

**Vector = ordered collection of numbers.**

উদাহরণ:

```text
[20, 5, 90]
```

ধরি:

```text
[Age, Study Hours, Attendance]
```

তাহলে:

```text
20 → Age
5  → Study Hours
90 → Attendance
```

পুরো `[20, 5, 90]` হলো vector।

### Scalar vs Vector

```text
Scalar:
7
```

```text
Vector:
[7, 10, 15]
```

একটি vector-এর প্রতিটি element একটি scalar value হতে পারে।

```text
[1200, 3, 2, 5]
   ↑    ↑  ↑  ↑
 scalar scalar scalar scalar

পুরো collection → Vector
```

---

## 4. Feature এবং Vector

Machine Learning-এর একটি data point:

```text
[Size, Bedrooms, Bathrooms, Age]
```

যেমন:

```text
[1200, 3, 2, 5]
```

এখানে প্রতিটি position-এর নির্দিষ্ট meaning আছে।

অর্থাৎ:

```text
position 1 → Size
position 2 → Bedrooms
position 3 → Bathrooms
position 4 → Age
```

Order গুরুত্বপূর্ণ।

```text
[1200, 3, 2, 5]
```

এবং

```text
[3, 1200, 2, 5]
```

একই vector meaning করে না যদি position-এর meaning fixed থাকে।

---

## 5. Row Vector

Vector-কে এক লাইনে লিখলে:

```text
[ 10   20   30 ]
```

এটাকে **Row Vector** বলা হয়।

এখানে values একটি row-তে আছে।

---

## 6. Column Vector

একই values একটির নিচে আরেকটি লিখলে:

```text
[ 10 ]
[ 20 ]
[ 30 ]
```

এটাকে **Column Vector** বলা হয়।

### একই data, আলাদা shape

Row:

```text
[ 10   20   30 ]
```

Column:

```text
[ 10 ]
[ 20 ]
[ 30 ]
```

Numbers একই, কিন্তু arrangement/shape আলাদা।

---

## 7. Transpose

**Transpose = Row ↔ Column**

Row vector:

```text
[ 10   20   30 ]
```

Transpose করলে:

```text
[ 10 ]
[ 20 ]
[ 30 ]
```

এটি লেখা যায়:

```text
vᵀ
```

আবার transpose করলে:

```text
[ 10 ]
[ 20 ]
[ 30 ]

      ↓ transpose

[ 10   20   30 ]
```

অর্থাৎ দুইবার transpose করলে original orientation-এ ফিরে আসা যায়।

### কেন দরকার?

ML mathematics-এ vector-এর **shape/orientation** গুরুত্বপূর্ণ।

পরে matrix multiplication, dot product এবং neural-network calculations-এ row/column orientation গুরুত্বপূর্ণ হবে।

---

## 8. Coordinate এবং Origin

2D graph-এ:

```text
          y
          ↑
          |
          |
----------●----------→ x
        (0,0)
```

`(0,0)` হলো **Origin**।

একটি 2D vector:

```text
v = [3, 4]
```

কে coordinate point `(3,4)` হিসেবে visualize করা যায়।

---

## 9. Vector-এর Distance from Origin

ধরো:

```text
v = [3, 4]
```

Origin:

```text
(0,0)
```

তাহলে `(0,0)` থেকে `(3,4)` পর্যন্ত একটি right triangle তৈরি হয়।

```text
        ● (3,4)
        |\
      4 | \
        |  \
        |   \
        |    \
        ●-----●
      (0,0)  (3,0)
          3
```

Pythagorean theorem:

```text
distance² = 3² + 4²
          = 9 + 16
          = 25
```

তাই:

```text
distance = √25
         = 5
```

অর্থাৎ:

> `[3,4]` vector-এর origin থেকে distance/length = `5`.

---

## 10. Vector Magnitude

Vector-এর length-কে **magnitude** বলা হয়।

For a 2D vector:

```text
v = [x, y]
```

magnitude:

```text
||v|| = √(x² + y²)
```

### Example

```text
v = [6,8]
```

```text
||v|| = √(6² + 8²)
      = √(36 + 64)
      = √100
      = 10
```

তাই `[6,8]`-এর magnitude = `10`.

### Intuition

```text
Vector [3,4]
      ↓
Origin থেকে length
      ↓
Magnitude = 5
```

---

## 11. Distance Between Two Vectors

এবার origin-এর বদলে দুইটি vector:

```text
A = [2,3]
B = [5,7]
```

A থেকে B-তে change:

```text
x difference = 5 - 2 = 3
y difference = 7 - 3 = 4
```

তাই:

```text
distance = √(3² + 4²)
         = √25
         = 5
```

অর্থাৎ:

```text
distance(A,B) = 5
```

### Formula

For:

```text
A = [x₁,y₁]
B = [x₂,y₂]
```

Euclidean distance:

```text
d(A,B) = √((x₂-x₁)² + (y₂-y₁)²)
```

### Process

```text
Two vectors
    ↓
Find difference at each position
    ↓
Square each difference
    ↓
Add
    ↓
Square root
    ↓
Distance
```

---

## 12. Why Vector Distance Matters in ML

ধরো দুইটি house:

```text
House A = [1000, 2]
House B = [1300, 4]
```

যদি vector:

```text
[Size, Bedrooms]
```

হয়, তাহলে vector distance তাদের feature-space-এ কতটা আলাদা তা measure করতে পারে।

এ ধরনের distance idea পরে:

- similarity
- nearest neighbors
- clustering
- recommendation
- pattern matching

এর মতো ML concepts-এ কাজে আসে।

---

## 13. Dot Product

ধরো:

```text
A = [2,3]
B = [4,5]
```

Dot product করার basic rule:

> একই position-এর values multiply করো, তারপর সব result যোগ করো।

```text
A · B
= (2×4) + (3×5)
= 8 + 15
= 23
```

তাই:

```text
A · B = 23
```

### Another Example

```text
A = [3,2]
B = [4,5]
```

```text
A · B
= (3×4) + (2×5)
= 12 + 10
= 22
```

---

## 14. Dot Product-এর ML Connection

ধরো:

```text
Features:
x = [1000, 3]

Weights:
w = [0.05, 2]
```

Dot product:

```text
x · w
= (1000×0.05) + (3×2)
= 50 + 6
= 56
```

ML model-এ features এবং weights combine করার সময় dot product খুব common।

সাধারণ linear-model intuition:

```text
features
   ↓
multiply by corresponding weights
   ↓
add
   ↓
combined score
```

---

## 15. Vector Addition

ধরো:

```text
A = [2,3]
B = [4,5]
```

Corresponding positions যোগ করি:

```text
A + B
= [2+4, 3+5]
= [6,8]
```

তাই:

```text
[2,3] + [4,5] = [6,8]
```

### General rule

```text
[a,b] + [c,d]
= [a+c,b+d]
```

---

## 16. Vector Subtraction

ধরো:

```text
A = [5,7]
B = [2,3]
```

```text
A - B
= [5-2, 7-3]
= [3,4]
```

তাই:

```text
[5,7] - [2,3] = [3,4]
```

### General rule

```text
[a,b] - [c,d]
= [a-c,b-d]
```

---

## 17. Scalar Multiplication

Scalar হলো single number।

ধরো:

```text
A = [2,4]
```

Scalar:

```text
3
```

তাহলে:

```text
3A
= [3×2, 3×4]
= [6,12]
```

অর্থাৎ scalar vector-এর **প্রতিটি element**-কে multiply করে।

### General rule

```text
k[a,b,c]
= [ka,kb,kc]
```

---

## 18. Scalar Division

Vector-কে একটি scalar দিয়ে divide করলে প্রতিটি element divide হয়।

```text
A = [10,20,30]
```

```text
A / 2
= [10/2,20/2,30/2]
= [5,10,15]
```

### General rule

```text
[a,b,c] / k
= [a/k,b/k,c/k]
```

এখানে `k ≠ 0` হতে হবে।

---

## 19. Negative / Opposite Vector

একটি vector-এর প্রতিটি element-কে `-1` দিয়ে multiply করলে তার **opposite/negative vector** পাওয়া যায়।

```text
A = [2,5]
```

```text
-A
= -1 × [2,5]
= [-2,-5]
```

Visual intuition:

```text
A       = [ 2, 5 ]
-A      = [-2,-5]
```

এটি direction-এর বিপরীতের intuition দিতে পারে।

---

## 20. Component-wise Operations

Vector addition, subtraction, scalar multiplication/division-এর basic pattern:

> **প্রতিটি corresponding component-এর ওপর operation করো।**

Example:

```text
A = [10,20,30]
B = [ 1, 2, 3]
```

Addition:

```text
A+B = [11,22,33]
```

Subtraction:

```text
A-B = [9,18,27]
```

Scalar multiplication:

```text
2A = [20,40,60]
```

Scalar division:

```text
A/10 = [1,2,3]
```

---

## 21. Vector Operation-এর Shape Rule

Vector addition/subtraction করতে সাধারণভাবে vector-এর size compatible হতে হয়।

Valid:

```text
[1,2] + [3,4]
```

কারণ দুটোরই 2 elements।

Invalid in ordinary component-wise addition:

```text
[1,2] + [3,4,5]
```

কারণ একটিতে 2 components, অন্যটিতে 3।

---

## 22. Distance vs Dot Product

এই দুইটি গুলিয়ে ফেলো না।

### Distance

প্রশ্ন: দুই vector কত দূরে?

```text
A = [2,3]
B = [5,7]

distance = 5
```

### Dot Product

প্রশ্ন: Corresponding values multiply করে যোগ করলে কত?

```text
[2,3] · [4,5]
= 23
```

দুটোর কাজ আলাদা।

---

## 23. Module 2 Visual Summary

```text
                    VECTOR
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
       Scalar       Row/Column    Features
                         │
                      Transpose
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
      Magnitude        Distance       Dot Product
          │              │              │
       Origin        Two Vectors    Multiply + Add
                         │
                         ↓
                  Vector Operations
                         │
             ┌───────────┼───────────┐
             ↓           ↓           ↓
          Addition   Subtraction   Scaling
                                     │
                              × scalar / ÷ scalar
```

---

## 24. Formula Cheat Sheet

**Scalar**

```text
single number
```

**Vector**

```text
[x₁,x₂,...,xₙ]
```

**2D Magnitude**

```text
||v|| = √(x²+y²)
```

**2D Distance**

```text
d(A,B) = √((x₂-x₁)² + (y₂-y₁)²)
```

**Dot Product**

```text
A·B = a₁b₁ + a₂b₂ + ... + aₙbₙ
```

**Addition**

```text
A+B = [a₁+b₁, a₂+b₂, ...]
```

**Subtraction**

```text
A-B = [a₁-b₁, a₂-b₂, ...]
```

**Scalar Multiplication**

```text
kA = [ka₁, ka₂, ...]
```

**Scalar Division**

```text
A/k = [a₁/k, a₂/k, ...], k ≠ 0
```

**Negative Vector**

```text
-A = [-a₁,-a₂,...]
```

**Transpose**

```text
Row → Column
Column → Row
```

---

## 25. Common Confusions

**Scalar কি vector?**
না।

```text
5 → Scalar
[5] → Vector representation
```

একটি one-element vector-এর value একটাই হলেও mathematical object হিসেবে scalar এবং vector আলাদা concept।

**Vector কি শুধু 2 numbers?**
না।

```text
[2,3]
[2,3,4]
[10,20,30,40,50]
```

সব vector হতে পারে।

**Vector কি শুধু ML-এর জন্য?**
না। Physics, mathematics, graphics, robotics, engineering — অনেক জায়গায় vector ব্যবহার হয়।

**Transpose কি values পরিবর্তন করে?**
না। মূলত orientation/shape বদলায়।

**Distance কি negative হতে পারে?**
সাধারণ Euclidean distance negative নয়।

**Dot product কি vector দেয়?**
সাধারণ dot product-এর result একটি **scalar**।

উদাহরণ:

```text
[2,3] · [4,5] = 23
```

---

## 26. Worked Examples

### Example 1 — Magnitude

```text
v = [3,4]
```

```text
||v|| = √(3²+4²)
      = √25
      = 5
```

### Example 2 — Distance

```text
A = [1,2]
B = [4,6]
```

Differences:

```text
4-1 = 3
6-2 = 4
```

Distance:

```text
√(3²+4²)
= 5
```

### Example 3 — Dot Product

```text
A = [3,2]
B = [4,5]
```

```text
A·B
= 3×4 + 2×5
= 22
```

### Example 4 — Addition

```text
A = [3,5]
B = [2,4]
```

```text
A+B
= [3+2,5+4]
= [5,9]
```

### Example 5 — Subtraction

```text
A = [7,9]
B = [3,4]
```

```text
A-B
= [7-3,9-4]
= [4,5]
```

### Example 6 — Scalar Multiplication

```text
A = [2,5]
```

```text
3A
= [6,15]
```

### Example 7 — Scalar Division

```text
A = [12,20,30]
```

```text
A/2
= [6,10,15]
```

---

## 27. Mini Practice Test

নিজে solve করো।

1. কোনটি Vector? A) `25` B) `[25,10,80]` C) `7`
2. `[5,10,15]`-এর transpose লিখো।
3. `v = [3,4]` হলে Magnitude কত?
4. `A = [1,2]`, `B = [4,6]` হলে Distance কত?
5. `A = [3,2]`, `B = [4,5]` হলে Dot product কত?
6. `A = [3,5]`, `B = [2,4]` হলে `A+B` কত?
7. `A = [7,9]`, `B = [3,4]` হলে `A-B` কত?
8. `A = [2,5]` হলে `3A` কত?
9. `A = [12,20,30]` হলে `A/2` কত?
10. `A = [2,5]` হলে `-A` কত?

### Answers

1. `B`
2. `[5]`, `[10]`, `[15]` (column vector)
3. `5`
4. `5`
5. `22`
6. `[5,9]`
7. `[4,5]`
8. `[6,15]`
9. `[6,10,15]`
10. `[-2,-5]`

---

## 28. Module 2 Final Mental Model

সবচেয়ে সহজভাবে:

```text
Scalar
= একটি number

Vector
= ordered numbers-এর collection

Row / Column
= vector-এর shape

Transpose
= Row ↔ Column

Magnitude
= vector-এর length

Distance
= দুই point/vector-এর separation

Dot Product
= corresponding multiply + add

Vector Addition
= corresponding values add

Vector Subtraction
= corresponding values subtract

Scalar Multiplication
= প্রতিটি value × scalar

Scalar Division
= প্রতিটি value ÷ scalar

Negative Vector
= প্রতিটি value × (-1)
```

---

## 29. ML Connection

Module 2-এর সবচেয়ে বড় উদ্দেশ্য formula মুখস্থ করা নয়।

Machine Learning-এ:

```text
Real-world object
      ↓
Features
      ↓
Vector
      ↓
Weights / Parameters
      ↓
Vector operations
      ↓
Model calculation
      ↓
Prediction
```

উদাহরণ:

```text
House features
[1200, 3, 2, 5]
       ↓
      Vector
       ↓
Model calculations
       ↓
Predicted price
```

Dot product-এর মতো operations পরে model-এর mathematical calculations-এর core অংশ হয়ে ওঠে।

---

## 30. What to Remember

এখন শুধু এই ৮টা idea strong করো:

1. **Scalar = single value**
2. **Vector = ordered collection of values**
3. **Transpose = row ↔ column**
4. **Magnitude = vector-এর length**
5. **Distance = দুই vector-এর separation**
6. **Dot Product = multiply corresponding values + add**
7. **Vector operations = component-wise basic operations**
8. **ML-এ features-কে vector হিসেবে represent করা যায়**

Formula মুখস্থ না হলেও সমস্যা নেই। Examples solve করতে করতে formulas familiar হয়ে যাবে।

---

## 🎉 Module 2 Complete

```text
Module 2
Scalars & Vectors
       ↓
      DONE ✅
```

**Next: Module 3 — Matrices**

এখানে আমরা আবার **একদম zero থেকে** শুরু করব: **Matrix কী → rows/columns → matrix shape → matrix operations → ML-এ matrix কেন লাগে।**
