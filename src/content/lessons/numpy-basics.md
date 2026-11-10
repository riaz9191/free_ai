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

---

## Extra Important NumPy Topics — Detailed Add-on

আগের notes-এ কিছু topic শুধু mention করা হয়েছিল বা বাদ পড়েছিল। নিচে সেগুলো বিস্তারিত যোগ করা হলো। এগুলো screenshot-এর আলাদা lesson title নয়; NumPy ভালোভাবে শেখার জন্য supplementary topics.

### 1. Vectorization

Vectorization হলো manual Python loop না লিখে NumPy array operation দিয়ে একসঙ্গে সব element process করা।

**Normal loop:**
```python
numbers = [1, 2, 3, 4]
result = []
for n in numbers:
    result.append(n * 2)
```

**NumPy vectorized:**
```python
import numpy as np
numbers = np.array([1, 2, 3, 4])
result = numbers * 2
print(result)  # [2 4 6 8]
```

Visual:
```text
Input:  [1, 2, 3, 4]
          × 2
Output: [2, 4, 6, 8]
```

আরও examples:
```python
a = np.array([10, 20, 30])
a + 5    # [15, 25, 35]
a * 2    # [20, 40, 60]
a ** 2   # [100, 400, 900]
```

কেন useful: code ছোট হয়, manual loop কমে, এবং numerical operation অনেক ক্ষেত্রে দ্রুত হয়। NumPy optimized compiled code-এর ভিতরে কাজ করে। তবে সব input size/operation-এ speedup guaranteed নয়।

### 2. Broadcasting

Compatible shape-এর array-এর মধ্যে operation করার সময় NumPy ছোট array বা scalar-কে বড় array-এর সঙ্গে মানিয়ে নেয়—এটাই broadcasting।

**Scalar + array:**
```python
a = np.array([10, 20, 30])
print(a + 5)  # [15 25 35]
```

**একটি row vector + matrix:**
```python
A = np.array([[1, 2, 3],
              [4, 5, 6]])
b = np.array([10, 20, 30])
print(A + b)
```
Output:
```text
[[11 22 33]
 [14 25 36]]
```

Broadcasting shape rule: ডান দিক থেকে dimension compare করো। দুই dimension সমান হলে compatible; অথবা একটির dimension `1` হলে সেটি broadcast হতে পারে। কোনো dimension-ই match না করলে error হবে।

```text
(2, 3) + (1, 3) → valid, result (2, 3)
(2, 3) + (2, 1) → valid, result (2, 3)
(2, 3) + (2, 2) → incompatible
```

### 3. `axis` — Row-wise and Column-wise

```python
A = np.array([[10, 20, 30],
              [40, 50, 60]])
```

`axis=0`: row direction collapse হয়, প্রতিটি column-এর result থাকে।
```python
A.sum(axis=0)   # [50, 70, 90]
A.mean(axis=0)  # [25., 35., 45.]
```

`axis=1`: column direction collapse হয়, প্রতিটি row-এর result থাকে।
```python
A.sum(axis=1)   # [60, 150]
A.mean(axis=1)  # [20., 50.]
```

মনে রাখো:
- `axis=0` → column-wise result
- `axis=1` → row-wise result
- `A.sum()` → সব element-এর sum

### 4. Reshape, Flatten and Ravel

`reshape()` element সংখ্যা না বদলে shape বদলায়।

```python
a = np.array([1, 2, 3, 4, 5, 6])
print(a.reshape(2, 3))
```
Output:
```text
[[1 2 3]
 [4 5 6]]
```

6 elements-কে `(3, 2)` করা যায়, কিন্তু `(4, 2)` করা যাবে না—কারণ 8টি position লাগবে।

`-1` দিলে NumPy একটি dimension নিজে হিসাব করে:
```python
a.reshape(2, -1)  # shape (2, 3)
```

Flatten:
```python
A = np.array([[1, 2], [3, 4]])
A.flatten()  # [1 2 3 4]
A.ravel()    # [1 2 3 4]
```
- `flatten()` সবসময় copy দেয়।
- `ravel()` সম্ভব হলে view দেয়; দরকার হলে copy দেয়।

### 5. Transpose

Rows ও columns swap হয়:
```python
A = np.array([[1, 2, 3],
              [4, 5, 6]])
print(A.T)
```
Output:
```text
[[1 4]
 [2 5]
 [3 6]]
```
Shape `(2, 3)` থেকে `(3, 2)` হয়। ML matrix multiplication-এ orientation বোঝার জন্য গুরুত্বপূর্ণ।

### 6. Mathematical and Statistical Operations

```python
a = np.array([10, 20, 30, 40])

np.sum(a)     # 100
np.mean(a)    # 25.0
np.median(a)  # 25.0
np.min(a)     # 10
np.max(a)     # 40
np.std(a)     # standard deviation
np.var(a)     # variance
np.sqrt(a)    # element-wise square root
np.abs([-2, 3])  # [2 3]
```

`np.log()`, `np.exp()`, `np.sin()`-এর মতো functions-ও array-এর প্রতিটি element-এর উপর কাজ করে। এগুলোকে universal functions বা **ufuncs** বলা হয়।

### 7. Element-wise Multiplication vs Matrix Multiplication

এগুলো এক নয়।

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

A * B
# [[ 5 12]
#  [21 32]]
```
`*` একই position-এর element multiply করে।

```python
A @ B
# [[19 22]
#  [43 50]]
```
`@` matrix multiplication করে। `np.matmul(A, B)` একই কাজ করে। 2D array-তে `np.dot()`-ও একই ধরনের result দিতে পারে; higher dimensions-এ `dot` ও `matmul` আলাদা হতে পারে।

### 8. Boolean Masking and `where()`

Condition দিয়ে values filter:

```python
scores = np.array([45, 70, 82, 35, 90])
mask = scores >= 50
print(mask)
# [False True True False True]

print(scores[mask])
# [70 82 90]
```

Short form:
```python
scores[scores >= 50]
```

Condition অনুযায়ী output choose:
```python
np.where(scores >= 50, "Pass", "Fail")
```

### 9. Concatenate and Stack

Arrays join করা:

```python
a = np.array([1, 2])
b = np.array([3, 4])

np.concatenate((a, b))
# [1 2 3 4]
```

2D arrays-এ:
- `axis=0` → row direction-এ যোগ
- `axis=1` → column direction-এ যোগ

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

np.vstack((A, B))  # vertically stack
np.hstack((A, B))  # horizontally stack
```

### 10. Sorting, Unique and NaN

```python
a = np.array([30, 10, 40, 20])
np.sort(a)  # [10 20 30 40]
```
`np.sort(a)` sorted copy দেয়; `a.sort()` original array in-place sort করে।

```python
np.unique([1, 2, 2, 3, 3])  # [1 2 3]
```

`NaN` মানে Not a Number; missing/undefined numerical value বোঝাতে পারে:
```python
a = np.array([10.0, np.nan, 30.0])
np.isnan(a)      # [False True False]
np.nanmean(a)    # 20.0
```
NaN থাকলে `np.mean(a)` সাধারণত NaN দেয়; `np.nanmean()` NaN বাদ দিয়ে mean করে।

### 11. Modern Random Generator

`np.random.seed()` শেখার জন্য ঠিক আছে। নতুন code-এ Generator API ব্যবহার করতে পারো:

```python
rng = np.random.default_rng(42)
rng.integers(1, 10, size=5)  # 1..9 থেকে 5টি integer
rng.random(3)                # 0 থেকে 1-এর মধ্যে 3টি float
```

একই seed দিলে reproducible sequence পাওয়া যায়।

### 12. Performance Basics

```python
import time
import numpy as np

a = np.arange(1_000_000)

start = time.perf_counter()
result = a * 2
elapsed = time.perf_counter() - start
print(elapsed)
```

Benchmark-এ একই কাজ ও একই input compare করবে। Machine load, data size এবং operation অনুযায়ী timing বদলায়।

### 13. ML Connection — Weighted Sum

```python
X = np.array([[1000, 2],
              [1500, 3],
              [2000, 4]])

weights = np.array([0.05, 2])
predictions = X @ weights
print(predictions)
```

- `X` = samples × features
- `weights` = feature weights
- `X @ weights` = প্রতিটি sample-এর weighted sum

এটি Linear Regression-এর basic calculation-এর সঙ্গে সম্পর্কিত।

---

## Extra Topics — Quick Practice

**Q1**
```python
a = np.array([2, 4, 6])
print(a * 3)
```
Output?

**Q2**
```python
A = np.array([[1, 2], [3, 4]])
print(A + 10)
```
Output?

**Q3**
```python
A = np.array([[1, 2, 3], [4, 5, 6]])
print(A.sum(axis=0))
```
Output?

**Q4** 6 elements-কে 3 rows-এ reshape করলে shape কী?

**Q5** `(2, 4)` shape transpose করলে কী হবে?

**Q6** `A * B` এবং `A @ B` কি একই?

**Q7**
```python
a = np.array([3, 8, 2, 9])
print(a[a > 5])
```
Output?

**Q8**
```python
np.unique([1, 1, 2, 3, 3])
```
Output?

#### Answers
1. `[6, 12, 18]`
2. `[[11, 12], [13, 14]]`
3. `[5, 7, 9]`
4. `(3, 2)` — 6 elements হলে
5. `(4, 2)`
6. না। `*` element-wise; `@` matrix multiplication
7. `[8, 9]`
8. `[1, 2, 3]`

---

## NumPy Learning Checklist

**Screenshot-এর visible syllabus**
- [ ] NumPy introduction
- [ ] ndarray and attributes
- [ ] ndarray data types
- [ ] Existing data থেকে array creation
- [ ] Random array generation
- [ ] `arange()` / range-based creation
- [ ] Indexing and slicing
- [ ] Copy, advanced indexing and iteration
- [ ] Module overview and quiz

**Extra important foundations**
- [ ] Vectorization
- [ ] Broadcasting
- [ ] `axis=0` and `axis=1`
- [ ] Reshape, flatten, ravel
- [ ] Transpose
- [ ] Mathematical/statistical operations and ufuncs
- [ ] Element-wise vs matrix multiplication
- [ ] Boolean masking and `where()`
- [ ] Concatenate and stack
- [ ] Sorting, unique and NaN
- [ ] Modern random Generator
- [ ] Performance basics
- [ ] ML weighted-sum connection

### Final Mental Model

> NumPy শুধু array বানানোর library নয়। এটি shape/type manage করে, vectorized calculation, broadcasting, filtering, reshaping, aggregation এবং matrix operations-এর মাধ্যমে ML-এর numerical foundation তৈরি করে।
