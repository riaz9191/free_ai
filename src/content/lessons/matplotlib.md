*Bangla + English mixed notes.* — **Python Module 15**

> 📓 **Class notebook:** `module-15-matplotlib.ipynb` — [👁️ View](/ai/ml/notebooks/module-15-matplotlib) / [⬇️ Download](/notebooks/module-15-matplotlib.ipynb)

> এই module-এ আমরা **Matplotlib** দিয়ে data-কে chart-এ রূপ দেওয়া শিখব। Number-এর table দেখে pattern বোঝা কঠিন — কিন্তু একটা ভালো chart দেখলে এক নজরেই trend, relation, distribution বোঝা যায়।

## Roadmap

1. Setup — `numpy`, `pandas`, `matplotlib.pyplot` import
2. 2D Line Plot — basic line, label/title, multiple lines
3. Line Plot from Pandas Data — CSV থেকে line, legend, styling, grid
4. Scatter Plot — দুইটা variable-এর relation (correlation)
5. Histogram — একটা numeric variable-এর distribution, `bins`
6. Bar Chart — category-wise count/comparison
7. Pie Chart — part of a whole (percentage)

### 🎯 Module Goal

```text
Data (table / list)
      ↓
Right chart select করো
      ↓
plt.plot / plt.scatter / plt.hist / plt.bar / plt.pie
      ↓
Label + Title + Legend দিয়ে readable বানাও
```

Main question যেটা সবসময় নিজেকে করবে:

```text
আমি কী দেখাতে চাই?
 ├── সময়ের সাথে change (trend)      → Line plot
 ├── দুইটা number-এর relation        → Scatter plot
 ├── একটা number কীভাবে ছড়িয়ে আছে  → Histogram
 ├── category-wise compare           → Bar chart
 └── পুরো-র কত % কোন অংশ            → Pie chart
```

### 📂 Dataset

এই lesson-এ এই CSV files লাগবে — download করে notebook-এর same folder-এ রাখো:

- [enrollment_data.csv](/datasets/enrollment_data.csv) — বছর অনুযায়ী Programming ও Digital Marketing enrollment
- [student_iqdata.csv](/datasets/student_iqdata.csv) — Shoe size, Study hour, Chilling hours, IQ score
- [student_data.csv](/datasets/student_data.csv) — Student marks, CompletionStatus, Location ইত্যাদি

---

## Setup — Import Libraries

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
```

- `numpy` → numerical কাজ
- `pandas` → CSV read, DataFrame
- `matplotlib.pyplot` → chart আঁকার main module; convention হলো `plt` নামে import করা

> Jupyter/Colab-এ cell run করলেই chart নিচে দেখায়। Normal `.py` script-এ chart দেখতে শেষে `plt.show()` লাগবে।

---

## 2D Line Plot

### Line plot কখন?

যখন **ordered x** (যেমন day, month, year) এর সাথে একটা value কীভাবে **change** হচ্ছে সেটা দেখাতে চাও — অর্থাৎ **trend**।

### Basic line plot

একজন student এক সপ্তাহে প্রতিদিন কত ঘণ্টা পড়েছে:

```python
hours = [2, 3, 4, 1, 5, 7, 3]
days = [1, 2, 3, 4, 5, 6, 7]

plt.plot(days, hours)
```

![Basic line plot — days (1–7) vs study hours](/lessons/matplotlib/cell-02-1.png)

`plt.plot(x, y)` — প্রথম argument x-axis, দ্বিতীয়টা y-axis। Points গুলো line দিয়ে join হয়।

> Output-এ `[<matplotlib.lines.Line2D at 0x...>]` লেখা দেখাতে পারে — এটা শুধু object-এর representation, ignore করো। চাইলে শেষ line-এর পরে `;` দিলে বা `plt.show()` দিলে এটা আর দেখাবে না।

### Label আর Title যোগ করা

Chart কী বোঝাচ্ছে সেটা পাঠককে বলতে হবে — তাই axis label আর title দরকার।

```python
plt.xlabel('Days')
plt.ylabel('Study Hours')
plt.title('Trend of a student study time over a week')

plt.plot(days, hours)
```

![Line plot with x-label Days, y-label Study Hours and a title](/lessons/matplotlib/cell-03-1.png)

```text
plt.xlabel() → x-axis-এর নাম
plt.ylabel() → y-axis-এর নাম
plt.title()  → পুরো chart-এর শিরোনাম
```

### Multiple lines একই chart-এ

দুইজন student-এর study hours compare করতে চাইলে দুইবার `plt.plot()` call করো — একই axes-এ দুইটা line আঁকা হবে, matplotlib নিজেই আলাদা color দেয়।

```python
hours_1 = [2, 3, 4, 1, 5, 7, 3]
hours_2 = [1, 4, 3, 5, 7, 2, 1]
days = [1, 2, 3, 4, 5, 6, 7]

plt.xlabel('Days')
plt.ylabel('Study Hours')
plt.title('Trend of a student study time over a week')

plt.plot(days, hours_1)
plt.plot(days, hours_2)
```

![Two lines (blue and orange) comparing two students' study hours over 7 days](/lessons/matplotlib/cell-04-1.png)

সমস্যা: কোন line কোন student — বোঝা যাচ্ছে না! এর solution হলো **legend** (পরের section-এ)।

---

## 2D Line Plot from Pandas Data

Real life-এ data list-এ না, CSV/DataFrame-এ থাকে। DataFrame-এর column সরাসরি `plt.plot()`-এ দেওয়া যায়।

### CSV load

```python
df = pd.read_csv('enrollment_data.csv')
df
```

```text
   Year  Programming  Digital Marketing
0  2015          589                734
1  2016          862                963
2  2017         1085               1157
3  2018         1150               1404
4  2019         1439               1497
5  2020         1715               1579
6  2021         1785               1948
7  2022         1995               2073
8  2023         2236               2310
9  2024         2442               2338
```

### একটা column-এর trend

```python
plt.xlabel('Years')
plt.ylabel('Count of Enrollment')
plt.title('Student Enrollment over 8 years')

plt.plot(df['Year'], df['Programming'])
```

![Programming enrollment rising steadily from 2015 to 2024](/lessons/matplotlib/cell-07-1.png)

Line টা উপরের দিকে যাচ্ছে → Programming enrollment প্রতি বছর বাড়ছে।

### দুইটা column একসাথে

```python
plt.xlabel('Years')
plt.ylabel('Count of Enrollment')
plt.title('Student Enrollment over 8 years')

plt.plot(df['Year'], df['Programming'])
plt.plot(df['Year'], df['Digital Marketing'])
```

![Programming and Digital Marketing enrollment lines over the years, without legend](/lessons/matplotlib/cell-08-1.png)

### Legend যোগ করা — `label` + `plt.legend()`

প্রতিটা `plt.plot()`-এ `label=` দাও, তারপর `plt.legend()` call করো।

```python
plt.xlabel('Years')
plt.ylabel('Count of Enrollment')
plt.title('Student Enrollment over 8 years')

plt.plot(df['Year'], df['Programming'], label='Programming')
plt.plot(df['Year'], df['Digital Marketing'], label='Digital Marketing')

plt.legend(loc='best')
```

![Two enrollment lines with a legend identifying Programming and Digital Marketing](/lessons/matplotlib/cell-09-1.png)

`loc='best'` → matplotlib নিজে এমন জায়গায় legend বসায় যেখানে data ঢাকা পড়ে না। অন্য option: `'upper left'`, `'lower right'` ইত্যাদি।

### Styling — color, linewidth, linestyle, marker

```python
plt.xlabel('Years')
plt.ylabel('Count of Enrollment')
plt.title('Student Enrollment over 8 years')

plt.plot(df['Year'], df['Programming'], label='Programming',
         color='#11b86f', linewidth=3, linestyle='dashed', marker='o', markersize=7)
plt.plot(df['Year'], df['Digital Marketing'], label='Digital Marketing',
         color='black', linewidth=3, linestyle='dashed')

plt.legend()
```

![Styled dashed lines — green with circle markers for Programming, black for Digital Marketing](/lessons/matplotlib/cell-10-1.png)

| Parameter | কী করে | Example |
|---|---|---|
| `color` | Line-এর রং (name বা hex) | `'black'`, `'#11b86f'` |
| `linewidth` | Line কত মোটা | `3` |
| `linestyle` | Line-এর ধরন | `'solid'`, `'dashed'`, `'dotted'` |
| `marker` | প্রতিটা data point-এ চিহ্ন | `'o'`, `'s'`, `'^'` |
| `markersize` | Marker-এর size | `7` |

### Grid + `plt.show()`

```python
plt.xlabel('Years')
plt.ylabel('Count of Enrollment')
plt.title('Student Enrollment over 8 years')

plt.plot(df['Year'], df['Programming'], label='Programming',
         color='#11b86f', linewidth=3, linestyle='dashed', marker='o', markersize=7)
plt.plot(df['Year'], df['Digital Marketing'], label='Digital Marketing',
         color='black', linewidth=3, linestyle='dashed')

plt.legend()
plt.grid()

plt.show()
```

![Same styled chart with background grid lines for easier value reading](/lessons/matplotlib/cell-11-1.png)

- `plt.grid()` → background-এ grid line, value পড়া সহজ হয়।
- `plt.show()` → chart render করে এবং `<matplotlib...>` টাইপের extra text output আর দেখায় না।

---

## Scatter Plot

### Scatter plot কখন?

যখন **দুইটা numeric variable**-এর মধ্যে **relation (correlation)** আছে কিনা দেখতে চাও। প্রতিটা row = একটা dot। Line দিয়ে join হয় না, কারণ এখানে order-এর কোনো মানে নেই।

```text
Dots নিচ থেকে উপরে (↗)   → Positive correlation
Dots উপর থেকে নিচে (↘)   → Negative correlation
Dots এলোমেলো ছড়ানো      → No correlation
```

### Data load

```python
students = pd.read_csv('student_iqdata.csv')

students
```

```text
    Shoe_Size  Study_Hour  Chilling_Hours  IQ_Score
0        13.5         2.0            17.7        72
1         8.0        18.0             5.0        75
2         6.4         7.2            22.7        78
3         6.9         8.7             6.6       110
4        10.5         8.6             5.8       104
...       ...         ...             ...       ...
```

### Study Hours vs IQ Score — positive correlation

```python
# Relation between Study Hours and IQ Score → positive correlation
plt.xlabel('Study Hours')
plt.ylabel('IQ Score')
plt.title('Relation between Study Hours and IQ Score')

plt.scatter(students['Study_Hour'], students['IQ_Score'])
```

![Scatter of study hours vs IQ score — dots generally rise to the right, with a few outliers](/lessons/matplotlib/cell-15-1.png)

মোটামুটি study hours বাড়লে IQ score-ও বাড়ছে → **weak positive** trend। কিছু outlier আছে (যেমন ~2 hours-এ IQ 145)।

### Shoe Size vs IQ Score — no correlation

```python
# Relation between Shoe Size and IQ Score → no correlation
plt.xlabel('Shoe Size')
plt.ylabel('IQ Score')
plt.title('Relation between Shoe Size and IQ Score')

plt.scatter(students['Shoe_Size'], students['IQ_Score'])
```

![Scatter of shoe size vs IQ score — dots randomly scattered, no pattern](/lessons/matplotlib/cell-16-1.png)

Dots এলোমেলো — জুতার size দিয়ে IQ predict করা যায় না। 😄

### Chilling Hours vs IQ Score — negative correlation

```python
# Relation between Chilling Hours and IQ Score → negative correlation
plt.xlabel('Chilling Time')
plt.ylabel('IQ Score')
plt.title('Relation between Chilling hours and IQ Score')

plt.scatter(students['Chilling_Hours'], students['IQ_Score'], marker='o', color='red')
```

![Red scatter of chilling hours vs IQ score — dots tend to fall as chilling time increases](/lessons/matplotlib/cell-17-1.png)

Chilling time বেশি → IQ score কম হওয়ার tendency → **negative** correlation (একটা outlier বাদে)।

> Correlation ≠ Causation — দুইটা জিনিস একসাথে বাড়া/কমা মানেই একটা আরেকটার কারণ না।

---

## Histogram

### Histogram কখন?

যখন **একটা numeric column**-এর values কীভাবে **distributed** (ছড়ানো) সেটা দেখতে চাও। Values-কে কিছু range (**bin**)-এ ভাগ করে, প্রতিটা bin-এ কতগুলো value পড়েছে (frequency) সেটা bar-এর height।

```text
x-axis → value-এর range (bins)
y-axis → ওই range-এ কতজন (frequency)
```

### IQ Score-এর distribution

```python
# based on IQ
plt.hist(students['IQ_Score'], color='red', edgecolor='black')
plt.xlabel('IQ Score')
plt.ylabel('Frequency of Students')
```

![Histogram of IQ scores — most students in the 70–80 range, one outlier near 145](/lessons/matplotlib/cell-19-1.png)

Default-এ `bins=10`। বেশিরভাগ student 70–80 range-এ; 140+-এ একজন outlier।

`edgecolor='black'` → প্রতিটা bar-এর border, যাতে bar গুলো আলাদা বোঝা যায়।

### `bins` সংখ্যা দিয়ে

```python
# based on study hour
plt.hist(students['Study_Hour'], bins=15, color='red', edgecolor='black')
plt.xlabel('Study Hours')
plt.ylabel('Frequency of Students')
```

![Histogram of study hours with 15 bins](/lessons/matplotlib/cell-20-1.png)

Bins বেশি → বেশি detail, কিন্তু অনেক বেশি হলে noisy দেখায়। কম bins → smooth কিন্তু detail হারায়।

### `bins` নিজে list দিয়ে define করা

```python
plt.hist(students['Study_Hour'], bins=[1, 2, 3, 4, 5, 6, 7, 8], color='red', edgecolor='black')
plt.xlabel('Study Hours')
plt.ylabel('Frequency of Students')
```

![Histogram of study hours with custom bin edges 1 to 8](/lessons/matplotlib/cell-21-1.png)

`bins=[1, 2, ..., 8]` মানে bin edges: 1–2, 2–3, …, 7–8। এই range-এর বাইরের values (যেমন 8-এর বেশি) count হবে না।

---

## Bar Chart

### Bar chart কখন?

যখন **categories** (Gender, Location, Status ...) compare করতে চাও — প্রতিটা category-র count বা কোনো value।

```text
Histogram → numeric data-র distribution (bars গায়ে গায়ে লাগানো)
Bar chart → category-wise compare (bars আলাদা আলাদা)
```

### ছোট DataFrame বানানো

```python
data = {
    'Student': ['B', 'C', 'D', 'E', 'F', 'G', 'H'],
    'Gender': ['Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male'],
    'StudyHours': [2, 5, 3, 7, 4, 8, 1],
    'Attendance': [60, 88, 70, 95, 80, 98, 55],
    'Grade': ['Fail', 'Pass', 'Fail', 'Pass', 'Pass', 'Pass', 'Fail']
}

df = pd.DataFrame(data)
```

```python
df
```

```text
  Student  Gender  StudyHours  Attendance Grade
0       B    Male           2          60  Fail
1       C  Female           5          88  Pass
2       D    Male           3          70  Fail
3       E  Female           7          95  Pass
4       F    Male           4          80  Pass
5       G  Female           8          98  Pass
6       H    Male           1          55  Fail
```

### Gender-wise count — `groupby().size()`

```python
# gender wise
gender_group = df.groupby('Gender').size()

print(gender_group.index)
print(gender_group.values)
```

```text
Index(['Female', 'Male'], dtype='object', name='Gender')
[3 4]
```

`groupby('Gender').size()` → প্রতিটা gender-এ কয়টা row। `.index` = category names, `.values` = counts।

```python
plt.bar(gender_group.index, gender_group.values, color=['orange', 'red'], edgecolor='black')

plt.xlabel('Gender')
plt.ylabel('Count')
plt.title('Bar Chart of Gender among students')
```

![Bar chart — Female 3 (orange), Male 4 (red)](/lessons/matplotlib/cell-26-1.png)

`plt.bar(x, height)` — x = category, height = value। `color` list দিলে প্রতিটা bar আলাদা রং পায়।

### Real data — Course Completion Status

```python
# Bar chart on real data
df = pd.read_csv('student_data.csv')

df
```

```text
   StudentID          FullName  Data Structure Marks  Algorithm Marks  ...  CompletionStatus  ...  Location
0     PH1001       Alif Rahman                  85.0             85.0  ...         Completed  ...     Dhaka
1     PH1002     Fatima Akhter                  92.0             92.0  ...       In Progress  ...  Chattogram
2     PH1003     Imran Hossain                  88.0             88.0  ...               ...  ...       ...
...
[20 rows]
```

```python
status = df.groupby('CompletionStatus').size()

plt.bar(status.index, status.values, color=['green', 'orange', 'red'], edgecolor='black')

plt.xlabel('Completion Status')
plt.ylabel('Count')
plt.title('Bar Chart of Course completion')
plt.show()
```

![Bar chart of completion status — Completed 13, In Progress 5, Not Started 2](/lessons/matplotlib/cell-28-1.png)

### Location-wise students

```python
# location
status = df.groupby('Location').size()

plt.bar(status.index, status.values, edgecolor='black')

plt.xlabel('Location')
plt.ylabel('Count')
plt.title('Bar Chart of Location of Students')
plt.show()
```

![Bar chart of student locations — Dhaka 8, Chattogram 6, Sylhet 3, Rajshahi 2, Khulna 1](/lessons/matplotlib/cell-29-1.png)

এক নজরে দেখা যাচ্ছে Dhaka থেকে সবচেয়ে বেশি student।

---

## Pie Chart

### Pie chart কখন?

যখন দেখাতে চাও **পুরো (100%)-এর মধ্যে কোন অংশ কত %**। Category কম হলে (2–5টা) pie chart ভালো কাজ করে; বেশি category হলে bar chart better।

```python
status = df.groupby('CompletionStatus').size()

plt.pie(status, labels=status.index, autopct='%1.1f%%', explode=(0.1, 0, 0), shadow=True)
plt.show()
```

![Pie chart — Completed 65.0% (pulled out), In Progress 25.0%, Not Started 10.0%](/lessons/matplotlib/cell-31-1.png)

| Parameter | কী করে |
|---|---|
| `labels` | প্রতিটা slice-এর নাম |
| `autopct='%1.1f%%'` | Slice-এর উপর % দেখায় (1 decimal) — শেষে `%%` মানে literal `%` |
| `explode=(0.1, 0, 0)` | প্রথম slice-টা একটু বাইরে টেনে আনে (highlight) — tuple-এর length = slice সংখ্যা |
| `shadow=True` | ছায়া effect |

Calculation: 13 / 20 = 65%, 5 / 20 = 25%, 2 / 20 = 10%।

---

## Common Confusions

### Line plot vs Scatter plot

```text
plt.plot()    → points line দিয়ে join → ordered x (time) — trend
plt.scatter() → শুধু dots           → দুইটা variable-এর relation
```

### Histogram vs Bar chart

```text
plt.hist() → raw numeric values দাও, matplotlib নিজে bin করে count করে
plt.bar()  → category + height তুমি নিজে দাও (আগে groupby / count করো)
```

### Legend দেখাচ্ছে না?

```text
plt.plot(..., label='X') না দিলে plt.legend() কিছুই দেখাবে না।
label + plt.legend() — দুইটাই লাগে।
```

### `bins=15` vs `bins=[1, 2, 3, ...]`

```text
bins=15         → 15টা সমান bin, range auto
bins=[1, 2, 3]  → bin edges তুমি ঠিক করো; range-এর বাইরে বাদ
```

### `explode` error

```text
explode tuple-এর length = slice সংখ্যা।
3 category → explode=(0.1, 0, 0)  ✔
3 category → explode=(0.1, 0)     ✘ error
```

### `<matplotlib.lines.Line2D at 0x...>` কী?

```text
Error না — cell-এর শেষ line-এর return value।
plt.show() বা line শেষে ; দিলে লুকানো যায়।
```

---

## Quick Practice

### Q1

প্রতি মাসের sales কীভাবে বাড়ছে/কমছে দেখাতে কোন chart?

### Q2

Height আর Weight-এর মধ্যে relation আছে কিনা দেখতে কোন function?

### Q3

```python
plt.plot(x, y1, label='A')
plt.plot(x, y2, label='B')
```

Legend দেখাতে আর কী লাগবে?

### Q4

100 জন student-এর marks কীভাবে distributed (কোন range-এ বেশি) — কোন chart?

### Q5

4টা category থাকলে `plt.pie(..., explode=...)`-এ explode tuple-এ কয়টা value দিতে হবে?

### Q6

`autopct='%1.1f%%'` দিলে একটা slice 0.25 অংশ হলে কী লেখা দেখাবে?

### Q7

Bar chart আঁকার আগে `df.groupby('Location').size()` কেন করতে হলো?

### Answers

1. **Line plot** — `plt.plot()`
2. **`plt.scatter()`**
3. **`plt.legend()`**
4. **Histogram** — `plt.hist()`
5. **4টা** — যেমন `(0.1, 0, 0, 0)`
6. **`25.0%`**
7. `plt.bar()` নিজে count করে না — প্রতিটা category-র count (height) আগে বের করে দিতে হয়।

---

## Final Cheat Sheet

| Chart | কখন ব্যবহার করবে | Function |
|---|---|---|
| Line plot | সময়/order অনুযায়ী trend | `plt.plot(x, y)` |
| Scatter plot | দুইটা numeric variable-এর relation | `plt.scatter(x, y)` |
| Histogram | একটা numeric variable-এর distribution | `plt.hist(values, bins=...)` |
| Bar chart | Category-wise count/compare | `plt.bar(categories, heights)` |
| Pie chart | Whole-এর মধ্যে % share | `plt.pie(values, labels=..., autopct=...)` |
| Axis label | Axis-এর নাম | `plt.xlabel()`, `plt.ylabel()` |
| Title | Chart-এর শিরোনাম | `plt.title()` |
| Legend | কোন line কোনটা | `label=...` + `plt.legend()` |
| Grid | Background grid | `plt.grid()` |
| Show | Chart render | `plt.show()` |
| Category count | Bar/pie-এর data তৈরি | `df.groupby(col).size()` |

### One-line Mental Model

> **Matplotlib = আগে ঠিক করো কী দেখাতে চাও (trend / relation / distribution / comparison / share), তারপর সেই chart-এর `plt.` function call করে label, title, legend দিয়ে সাজাও।**
