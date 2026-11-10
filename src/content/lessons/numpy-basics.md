*Bangla + English mixed notes.* — **Python Module 10** (course lesson-by-lesson notes)

> 📓 **Class notebook:** `module-10-numpy-basics.ipynb` — [👁️ View](/ai/ml/notebooks/module-10-numpy-basics) / [⬇️ Download](/notebooks/module-10-numpy-basics.ipynb)

**Course duration:** 2 hr 12 min | **14 units**

> Screenshot-এ visible lesson titles অনুযায়ী note তৈরি করা হয়েছে। Header-এ 14 units দেখা গেলেও সব unit screenshot-এ নেই; unseen titles invent করা হয়নি।

## Exact Course Roadmap

1. Text Instructions Module 10 — Post content
2. **(Must Watch) 10.0 Module Introduction** — 8 min
3. **10.1 Intro to Numpy** — 9 min
4. **10.2 ndarray and its attributes** — 20 min
5. **10.3 Ndarray Data Type** — 15 min
6. **10.4 ndarray creation from Existing data** — 20 min
7. **10.5 ndarray generation with random values** — 8 min
8. **10.6 ndarray creation from range** — 14 min
9. **10.7 ndarray Indexing and Slicing** — 15 min
10. **10.8 Ndarray Copy Advanced Indexing and Iteration** — 16 min
11. **10.9 Module Overview** — 7 min
12. Quiz Module 10 — Quiz
13–14. Two additional units — titles not visible in provided screenshots

---

## 10.0 Module Introduction

NumPy-এর full form **Numerical Python**। Python-এ numerical data নিয়ে fast calculation করার জন্য এটি popular library।

```python
import numpy as np

numbers = np.array([10, 20, 30, 40])
print(numbers)
```

Output:
```text
[10 20 30 40]
```

NumPy দিয়ে:
- Fast numerical calculations
- Large dataset-এর উপর operations
- Matrix এবং multi-dimensional data handle
- Statistics ও scientific computing
- ML data preparation

করা যায়।

### NumPy vs Python List

```python
python_list = [1, 2, 3]
numpy_array = np.array([1, 2, 3])

print(python_list * 2)  # [1, 2, 3, 1, 2, 3]
print(numpy_array * 2) # [2 4 6]
```

List multiplication list repeat করে; NumPy array multiplication প্রতিটি element-কে multiply করে।

---

## 10.1 Intro to NumPy

Install:

```bash
pip install numpy
```

Jupyter/Colab cell-এ:

```python
%pip install numpy
```

Import:

```python
import numpy as np
```

`np` হলো commonly used alias।

Array তৈরি:

```python
data = np.array([10, 20, 30, 40])
print(data)
```

---

## 10.2 ndarray and Its Attributes

`ndarray` মানে **N-dimensional array**। NumPy-এর মূল array object।

### 1D array

```python
a = np.array([10, 20, 30])
```

### 2D array

```python
b = np.array([
    [1, 2, 3],
    [4, 5, 6]
])
```

Visual:

```text
[1 2 3]
[4 5 6]
```

### 3D array

একাধিক 2D layer হিসেবে ভাবতে পারো:

```python
c = np.array([
    [[1, 2], [3, 4]],
    [[5, 6], [7, 8]]
])
```

### Important attributes

```python
a = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

print(a.ndim)     # 2
print(a.shape)    # (2, 3)
print(a.size)     # 6
print(a.dtype)    # array-এর element type
print(a.itemsize) # প্রতিটি element-এর bytes
```

| Attribute | Meaning |
|---|---|
| `ndim` | Number of dimensions |
| `shape` | প্রতিটি dimension-এর size |
| `size` | Total elements |
| `dtype` | Element data type |
| `itemsize` | One element-এর bytes |

`shape = (2, 3)` মানে 2 rows, 3 columns।

---

## 10.3 ndarray Data Type

NumPy array সাধারণত একই ধরনের data রাখে।

```python
a = np.array([1, 2, 3])
print(a.dtype)
```

```python
b = np.array([1.5, 2.5, 3.5])
print(b.dtype)
```

### Explicit dtype

```python
a = np.array([1, 2, 3], dtype=np.float64)
print(a)
```

Output:
```text
[1. 2. 3.]
```

Common types:

| Type | Meaning |
|---|---|
| `np.int32` | 32-bit integer |
| `np.int64` | 64-bit integer |
| `np.float32` | 32-bit floating point |
| `np.float64` | 64-bit floating point |
| `np.bool_` | Boolean |
| `np.str_` | String |

### `astype()` — type conversion

```python
a = np.array([1.2, 2.8, 3.5])
b = a.astype(int)

print(b)  # [1 2 3]
```

এখানে decimal part বাদ পড়েছে; এটি rounding নয়, truncation।

---

## 10.4 ndarray Creation from Existing Data

List বা tuple থেকে array:

```python
numbers = [10, 20, 30, 40]
arr1 = np.array(numbers)

values = (5, 10, 15)
arr2 = np.array(values)
```

Nested list থেকে 2D array:

```python
matrix = np.array([
    [1, 2, 3],
    [4, 5, 6]
])
```

### `zeros()`

```python
np.zeros((2, 3))
```

2 rows, 3 columns-এর zero array।

### `ones()`

```python
np.ones((2, 2))
```

সব element one।

### `full()`

```python
np.full((2, 3), 7)
```

সব element 7।

### `eye()`

```python
np.eye(3)
```

3×3 identity matrix তৈরি করে।

---

## 10.5 ndarray Generation with Random Values

```python
np.random.rand(3)
```

0 থেকে 1-এর মধ্যে 3টি random floating-point value দেয়।

2D random array:

```python
np.random.rand(2, 3)
```

Random integers:

```python
np.random.randint(1, 10, size=5)
```

1 থেকে 9 পর্যন্ত integer থেকে 5টি value দেয়; upper limit 10 include হয় না।

### Reproducible result

একই random sequence আবার পেতে seed ব্যবহার করা যায়:

```python
np.random.seed(42)
print(np.random.randint(1, 10, size=5))
```

---

## 10.6 ndarray Creation from Range

### `np.arange()`

`range()`-এর মতো start, stop, step দিয়ে array তৈরি করে।

```python
np.arange(1, 6)
# [1 2 3 4 5]

np.arange(0, 10, 2)
# [0 2 4 6 8]
```

Syntax:

```python
np.arange(start, stop, step)
```

Stop value include হয় না।

### `np.linspace()`

দুই endpoint-এর মধ্যে নির্দিষ্ট সংখ্যক evenly spaced values:

```python
np.linspace(0, 10, 5)
```

Output:
```text
[ 0.   2.5  5.   7.5 10. ]
```

Default-এ endpoint include হয় এবং মোট 5টি value তৈরি হয়।

| `arange()` | `linspace()` |
|---|---|
| Step size specify করি | কতটি value চাই specify করি |
| Stop সাধারণত exclude | Default-এ endpoint include |
| Step-based sequence | Fixed-count evenly spaced values |

---

## 10.7 ndarray Indexing and Slicing

Index 0 থেকে শুরু হয়।

### 1D indexing

```python
a = np.array([10, 20, 30, 40, 50])

a[0]   # 10
a[-1]  # 50
```

### Slicing

```python
a[1:4]  # [20 30 40]
```

Stop index include হয় না।

### 2D indexing

```python
matrix = np.array([
    [10, 20, 30],
    [40, 50, 60]
])

matrix[0, 1]  # 20
```

Visual:

```text
             columns
          0    1    2
row 0    10   20   30
row 1    40   50   60
```

- `matrix[0, :]` → first row
- `matrix[:, 1]` → second column
- `matrix[0:2, 1:3]` → selected rows and columns-এর subarray

Colon `:` মানে ওই axis-এর সব index।

---

## 10.8 ndarray Copy, Advanced Indexing and Iteration

### View vs Copy

#### View

View original array-এর data share করে। View পরিবর্তন করলে original-ও change হতে পারে।

```python
a = np.array([10, 20, 30, 40])
view = a[1:3]
view[0] = 99

print(a)  # [10 99 30 40]
```

Basic slicing অনেক ক্ষেত্রে view দেয়।

#### Copy

Copy আলাদা data তৈরি করে:

```python
a = np.array([10, 20, 30, 40])
copied = a[1:3].copy()
copied[0] = 99

print(a)  # [10 20 30 40]
```

Independent data দরকার হলে `.copy()` ব্যবহার করো।

### Advanced indexing — integer index array

```python
a = np.array([10, 20, 30, 40, 50])
indices = [0, 2, 4]

print(a[indices])  # [10 30 50]
```

এটি fancy/integer array indexing; সাধারণত copy তৈরি করে।

### Boolean indexing

Condition দিয়ে values select:

```python
a = np.array([10, 15, 20, 25, 30])
print(a[a > 20])
```

Output:
```text
[25 30]
```

Data filtering-এ useful।

### Iteration

1D array:

```python
a = np.array([10, 20, 30])

for value in a:
    print(value)
```

2D array-তে loop করলে default-এ row পাওয়া যায়:

```python
matrix = np.array([[1, 2], [3, 4]])

for row in matrix:
    print(row)
```

প্রতিটি element-এ যেতে nested loop:

```python
for row in matrix:
    for value in row:
        print(value)
```

NumPy-তে অনেক কাজ loop ছাড়াই vectorized operation দিয়ে করা যায়; সাধারণত সেটা faster এবং cleaner।

---

## 10.9 Module Overview

```text
NumPy
  ↓
ndarray
  ↓
Dimensions & Attributes
  ↓
Data Types
  ↓
Create arrays from data
  ↓
Random arrays
  ↓
arange / linspace
  ↓
Indexing & Slicing
  ↓
View / Copy
  ↓
Advanced Indexing
  ↓
Iteration
```

---

## 🔗 ML / Data Science Connection

ML-এ data প্রায়ই NumPy array বা array-like structure-এ represent করা হয়।

```python
X = np.array([
    [2, 10],
    [4, 20],
    [6, 30]
])

print(X.shape)  # (3, 2)
```

এখানে:
- 3 rows = 3 samples
- 2 columns = 2 features
- `X.shape` = `(3, 2)`

Column-wise average:

```python
print(X.mean(axis=0))
```

`axis=0` দিলে row direction বরাবর aggregate হয়, ফলে প্রতিটি column-এর mean পাওয়া যায়।

---

## Common Confusions

| Concept | মনে রাখবে |
|---|---|
| `np.array()` | Existing data থেকে array |
| `ndim` | Dimension count |
| `shape` | প্রতিটি axis-এর size |
| `size` | Total elements |
| `dtype` | Element type |
| `itemsize` | Bytes per element |
| `arange()` | Step-based sequence |
| `linspace()` | Fixed number of evenly spaced values |
| `rand()` | Random floats in [0, 1) |
| `randint()` | Random integers; high endpoint excluded |
| `a[start:stop]` | Stop excluded |
| View | Original data share করতে পারে |
| Copy | Independent data |
| Boolean indexing | Condition দিয়ে filter |
| `axis=0` | Column-wise result |
| `axis=1` | Row-wise result |

---

## 📝 Quick Practice

**Q1**
```python
a = np.array([10, 20, 30])
print(a.ndim)
```
Output কত?

**Q2**
```python
a = np.array([[1, 2, 3], [4, 5, 6]])
print(a.shape)
```
Shape কী?

**Q3** `a.size` কী জানায়?

A. Dimensions  
B. Total elements  
C. Data type

**Q4**
```python
np.arange(1, 5)
```
কী values তৈরি করবে?

**Q5**
```python
np.linspace(0, 10, 3)
```
কোন values দেবে?

**Q6**
```python
a = np.array([10, 20, 30, 40])
print(a[1:3])
```
Output কী?

**Q7**
```python
a = np.array([10, 20, 30, 40])
print(a[a > 20])
```
Output কী?

**Q8** Original array থেকে independent data তৈরি করতে কোনটি ব্যবহার করবে?

A. View  
B. `.copy()`  
C. `ndim`

**Q9** `matrix[:, 1]` কী select করে?

A. First row  
B. Second column  
C. Last element

**Q10** `mean(axis=0)` করলে কোন result পাওয়া যায়?

A. Column-wise mean  
B. Row-wise mean

### Answers

1. **1**
2. **`(2, 3)`**
3. **B — Total elements**
4. **`[1, 2, 3, 4]`**
5. **`[0., 5., 10.]`**
6. **`[20, 30]`**
7. **`[30, 40]`**
8. **B — `.copy()`**
9. **B — Second column**
10. **A — Column-wise mean**

---

## Final Cheat Sheet

| Topic | Core idea |
|---|---|
| NumPy | Numerical computing library |
| `np.array()` | Array create |
| `ndarray` | N-dimensional array |
| `ndim` | Number of dimensions |
| `shape` | Dimensions-এর size |
| `size` | Total elements |
| `dtype` | Data type |
| `itemsize` | Bytes per element |
| `astype()` | Convert dtype |
| `zeros()` / `ones()` | Filled arrays |
| `random` | Random arrays |
| `arange()` | Step-based range |
| `linspace()` | Fixed-count evenly spaced values |
| Indexing | Element access |
| Slicing | Subarray select |
| View | Shared data |
| Copy | Independent data |
| Boolean indexing | Filter by condition |
| Iteration | Element/row ধরে loop |

### One-line Mental Model

> **NumPy = numerical data-কে efficient array-তে রাখা, shape/type বোঝা, প্রয়োজনমতো select করা এবং দ্রুত calculation করা।**
