*Bangla + English mixed notes.* — **56 min | 7 Units**

## Roadmap

1. 7-1 Intro to Stat
2. 7-2 Usage of Stat in ML
3. 7-3 Use of Stat in Data Preprocessing
4. 7-4 Population and Sample
5. 7-5 Mean, Median, Mode
6. 7-6 Variance
7. 7-7 Standard Deviation

### 🎯 Module Goal

Statistics হলো data-কে **collect, summarize, understand এবং analyze** করার way।

ML-এ statistics দরকার কারণ আমাদের model সবসময় data নিয়েই কাজ করে।

**Statistics → ML usage → Data preprocessing → Population/Sample → Mean/Median/Mode → Variance → Standard Deviation**

---

## 7-1 — Intro to Stat

### Statistics কী?

সহজভাবে:

> **Statistics = data থেকে useful information বের করার process।**

ধরো 10 জন student-এর marks:

```text
50, 60, 65, 70, 75, 80, 82, 85, 90, 95
```

শুধু list দেখলে পুরো class-এর performance বোঝা একটু কঠিন।

Statistics দিয়ে আমরা জানতে পারি:

- Average কত?
- মাঝামাঝি value কত?
- সবচেয়ে common value কোনটা?
- Data কতটা spread out?
- Data-এর overall pattern কেমন?

### Real-life example

একটা shop-এর daily sales:

```text
1000
1200
1500
900
1800
```

Statistics দিয়ে owner বুঝতে পারে:

> Average sales কত এবং sales কতটা ওঠানামা করছে।

---

## 7-2 — Usage of Stat in ML

ML-এ statistics অনেক জায়গায় ব্যবহার হয়।

### 1. Data বোঝার জন্য

Dataset-এর:

- average
- minimum
- maximum
- spread

বোঝা যায়।

### 2. Data preprocessing

Data-এর unusual value, missing value, scale ইত্যাদি বুঝতে statistics সাহায্য করে।

### 3. Feature analysis

কোন feature useful হতে পারে সেটা বুঝতে statistical analysis করা যায়।

### 4. Model evaluation

Prediction কতটা ভালো বা error কেমন — এগুলো analyze করতে statistics ব্যবহার করা হয়।

### ML Flow

```text
Raw Data
   ↓
Statistics দিয়ে data বুঝি
   ↓
Preprocessing
   ↓
ML Model
   ↓
Prediction
   ↓
Evaluation
```

### Important idea

> **Statistics ML-এর replacement না; Statistics ML-এর data understanding এবং analysis-এর foundation-এর একটি অংশ।**

---

## 7-3 — Use of Stat in Data Preprocessing

Data preprocessing মানে:

> **Raw data-কে ML model-এর জন্য usable করা।**

### Outlier

ধরো age data:

```text
20
21
22
23
500
24
```

এখানে `500` suspicious value।

Statistics ব্যবহার করে আমরা বুঝতে পারি যে এটা অন্য values থেকে অনেক দূরে।

এ ধরনের value-কে **outlier** বলা হতে পারে।

### Missing values

ধরো:

```text
20
22
?
24
26
```

এখানে একটা value missing।

Statistics-এর কিছু measure ব্যবহার করে missing value fill করা যেতে পারে।

যেমন বাকি values:

```text
20, 22, 24, 26
```

Mean:

```text
(20 + 22 + 24 + 26) / 4 = 92 / 4 = 23
```

তাহলে missing value-এর জায়গায় context অনুযায়ী `23` ব্যবহার করা যেতে পারে।

> বাস্তবে কোন method ব্যবহার হবে সেটা dataset-এর situation-এর উপর depend করে।

### Scaling-এর idea

ধরো দুই feature:

```text
Age     → 20, 25, 30
Salary  → 30000, 50000, 80000
```

দুটোর scale খুব different।

Preprocessing-এর সময় statistical techniques ব্যবহার করে features-কে comparable scale-এ আনা যায়।

---

## 7-4 — Population and Sample

এটা খুব important concept।

### Population

Population মানে:

> **যে পুরো group নিয়ে আমরা জানতে চাই।**

Example: Bangladesh-এর সব university student — এটাই population হতে পারে।

### Sample

Population-এর ছোট অংশকে sample বলা হয়।

Example: সব university student-এর বদলে আমরা 1000 জন student-এর data নিলাম।

```text
Population
┌─────────────────────────────┐
│  ● ● ● ● ● ● ● ● ● ● ...    │
│        পুরো group            │
│             ↓               │
│          Sample             │
│         ● ● ● ●             │
└─────────────────────────────┘
```

### কেন sample ব্যবহার করি?

সব মানুষের data collect করা অনেক সময়:

- expensive
- slow
- practically difficult

তাই population থেকে **representative sample** নেওয়া হয়।

### Simple example

Question:

> বাংলাদেশের মানুষের average height কত?

```text
Population → সব মানুষ
Sample     → ধরো 5000 জন selected মানুষ
```

Sample-এর data analyze করে population সম্পর্কে estimate করা যায়।

---

## 7-5 — Mean, Median, Mode

এগুলো হলো **central tendency** বোঝার common measures।

### Mean

Mean = Average

Formula:

**Mean = Sum of values / Number of values**

Example:

```text
2, 4, 6, 8
```

```text
Sum              = 2 + 4 + 6 + 8 = 20
Number of values = 4
Mean             = 20 / 4 = 5
```

**Mean = 5**

### Median

Median হলো:

> **Sorted data-এর middle value।**

Example:

```text
2, 4, 6, 8, 10
```

Middle value = `6`, তাই **median = 6**

#### Even number of values

ধরো:

```text
2, 4, 6, 8
```

Middle দুইটা: `4, 6`

```text
Median = (4 + 6) / 2 = 5
```

তাই **median = 5**

### Mode

Mode = যে value সবচেয়ে বেশি বার আসে।

Example:

```text
2, 3, 3, 4, 5
```

`3` সবচেয়ে বেশি এসেছে, তাই **Mode = 3**

### Mean vs Median vs Mode

| Measure | Meaning |
|---|---|
| Mean | Average |
| Median | Middle value |
| Mode | Most frequent value |

### Outlier-এর effect

ধরো:

```text
10, 11, 12, 13, 14
```

```text
Mean   = 60 / 5 = 12
Median = 12
```

এখন শেষ value-এর জায়গায় একটা huge value বসাই:

```text
10, 11, 12, 13, 100
```

```text
Mean   = 146 / 5 = 29.2   ← অনেক বেড়ে গেল
Median = 12               ← একই থাকলো
```

Median comparatively stable থাকে।

এই কারণে skewed/outlier-heavy data-তে median অনেক সময় বেশি useful হয়।

---

## 7-6 — Variance

এখন আমরা জানতে চাই:

> **Data values গুলো mean থেকে কতটা spread out?**

এটাই variance-এর basic idea।

ধরো:

```text
A: 4, 5, 6
B: 1, 5, 9
```

দুইটার mean-ই `5`, কিন্তু B অনেক বেশি spread out।

```text
A:      4  5  6
        ↑  ↑  ↑
       close

B:   1       5       9
     ↑       ↑       ↑
          spread out
```

Variance এই spread-কে quantify করে।

### Variance কীভাবে ভাববে?

1. Mean বের করি।
2. প্রতিটি value mean থেকে কত দূরে দেখি।
3. Difference-গুলো square করি।
4. সেগুলোর average নিই।

Example:

```text
Data = 2, 4, 6
Mean = 4
```

Differences:

```text
2 - 4 = -2
4 - 4 =  0
6 - 4 = +2
```

Square:

```text
4, 0, 4
```

Average:

```text
Variance = (4 + 0 + 4) / 3
         = 8 / 3
         ≈ 2.67
```

### কেন difference square করি?

কারণ শুধু যোগ করলে:

```text
-2 + 0 + 2 = 0
```

এতে spread-এর information cancel হয়ে যায়।

Square করলে:

```text
(-2)² = 4
  0²  = 0
  2²  = 4
```

সব positive হয় এবং বড় deviation বেশি weight পায়।

---

## 7-7 — Standard Deviation

Variance-এর একটা সমস্যা আছে:

> Variance **squared unit**-এ থাকে।

তাই variance-এর square root নিলে আমরা পাই Standard Deviation:

**Standard Deviation = √Variance**

### Example

```text
Variance = 25
SD       = √25 = 5
```

### Intuition

Standard deviation বলে:

> **Data সাধারণভাবে mean-এর আশেপাশে কতটা spread out।**

#### Low SD

```text
     ●●●●
      ↑
     mean
```

Values কাছাকাছি।

#### High SD

```text
●       ●       ●
        ↑
       mean
```

Values বেশি spread out।

---

## Mean → Variance → Standard Deviation Connection

```text
Data
 ↓
Mean
 ↓
Mean থেকে distance
 ↓
Square
 ↓
Average
 ↓
Variance
 ↓
Square Root
 ↓
Standard Deviation
```

---

## Module 07 + ML Connection

Statistics ML-এ mainly data বুঝতে সাহায্য করে।

```text
Dataset
   ↓
Mean / Median / Mode
   ↓
Spread বুঝি
   ↓
Variance / Standard Deviation
   ↓
Outlier / distribution বুঝি
   ↓
Data preprocessing
   ↓
ML Model
```

---

## Common Confusions

### Mean কি সবসময় best measure?

না। Outlier থাকলে mean অনেক affected হতে পারে।

### Median কি average?

না। Median = sorted data-এর middle value।

### Mode কি middle value?

না। Mode = most frequent value।

### Variance আর Standard Deviation same?

না। **SD = √Variance**

### Population আর Sample same?

না।

- Population = পুরো group
- Sample = population-এর একটি অংশ

---

## Quick Practice

### Q1

Data: `2, 4, 6, 8` — Mean কত?

### Q2

Data: `1, 3, 5, 7, 9` — Median কত?

### Q3

Data: `2, 3, 3, 4, 5` — Mode কত?

### Q4

Variance যদি `36` হয়, Standard Deviation কত?

### Q5

সব university student হলো:

A. Sample  
B. Population

### Q6

1000 students নিয়ে research করলে:

A. Population  
B. Sample

### Answers

1. **5**
2. **5**
3. **3**
4. **6**
5. **B — Population**
6. **B — Sample**

---

## Final Cheat Sheet

| Concept | সহজ meaning |
|---|---|
| Statistics | Data understand/analyze করা |
| Population | পুরো group |
| Sample | Population-এর অংশ |
| Mean | Average |
| Median | Middle value |
| Mode | Most frequent value |
| Variance | Data কতটা spread out তার squared measure |
| Standard Deviation | Spread-এর original-scale measure |

### One-line Mental Model

> **Statistics = Data-কে summarize করে তার center এবং spread বুঝে useful information বের করা।**
