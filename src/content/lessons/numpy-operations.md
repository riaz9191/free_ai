*Bangla + English mixed notes.* — **Python Module 11**

> 📓 **Class notebook:** `module-11-numpy-operations.ipynb` — [👁️ View](/ai/ml/notebooks/module-11-numpy-operations) / [⬇️ Download](/notebooks/module-11-numpy-operations.ipynb)

> আগের module-এ NumPy array **বানানো** শিখেছি। এই module-এ শিখব array দিয়ে **কাজ করা** — shape বদলানো, জোড়া লাগানো, math, comparison, sorting, searching, counting, statistics আর linear algebra।

## Roadmap

1. Reshape, Flatten and Ravel
2. Concatenate, Transpose and Split
3. Arithmetic Operators and Mathematical Functions
4. Broadcasting
5. Logical Functions
6. Sorting
7. Searching
8. Counting in ndarray
9. Statistical Functions
10. Linear Algebra

### 🎯 Module Goal

```text
Data (ndarray)
     ↓
Reshape / combine     → shape ঠিক করো
     ↓
Math / logic          → transform করো
     ↓
Sort / search / count → খুঁজে বের করো
     ↓
Statistics / linalg   → insight ও model math
```

**ML connection:** ML dataset সাধারণত একটা 2D array — **rows = samples, columns = features**। এই module-এর প্রতিটা operation real data preprocessing ও model math-এ রোজ লাগে।

> এই module-এর অনেক cell `np.random` ব্যবহার করে — তোমার output-এর values আলাদা হবে, কিন্তু shape ও behavior same থাকবে। (Notebook Windows-এ run হয়েছিল, তাই `dtype=int32` দেখায়; Mac/Linux-এ `int64` দেখাবে।)

---

## Reshape, Flatten and Ravel

### Dataset-এর মতো array

```python
import numpy as np

arr = np.random.randint(1, 100, size=(10, 5))   # 10 samples, 5 features
```

```python
arr.shape
```

```text
(10, 5)
```

10 rows (samples) × 5 columns (features) — একদম ছোট্ট একটা dataset-এর মতো।

### `reshape` — shape বদলাও, data same

```python
b = arr.reshape(5, 10)

b.shape
b.ndim
b
```

```text
array([[63, 19, 88,  8,  9,  2, 61, 65, 45,  9],
       [73, 35, 26,  4,  8, 78, 84, 89, 57, 92],
       [32, 68, 28, 99, 41, 98, 97, 90, 19, 91],
       [90, 44, 91,  2, 44, 11, 84, 37, 27,  9],
       [ 9, 84, 54, 37, 55, 90, 46, 43, 86, 93]], dtype=int32)
```

50টা element-কে 10×5 থেকে 5×10 বানানো হলো। Jupyter-এ শুধু **last line** (`b`)-এর value display হয় — `b.shape`, `b.ndim` দেখতে চাইলে `print()` দাও।

```text
Rule: পুরনো size == নতুন size
(10, 5) → 50   ✅ (5, 10) → 50
(10, 5) → 50   ❌ (6, 8)  → 48  → ValueError
```

> Tip: `arr.reshape(5, -1)` → `-1` দিলে NumPy নিজে বাকি dimension হিসাব করে (এখানে 10)।

### `flatten` ও `ravel` — 1D বানাও

```python
flatten = b.flatten()
print(flatten.ndim)
flatten

# order='C' → row by row (row-major)
row_wise_flattening = np.ravel(b, order='C')

print(row_wise_flattening)
```

```text
1
[63 19 88  8  9  2 61 65 45  9 73 35 26  4  8 78 84 89 57 92 32 68 28 99
 41 98 97 90 19 91 90 44 91  2 44 11 84 37 27  9  9 84 54 37 55 90 46 43
 86 93]
```

দুটোই multi-dimensional array-কে **1D** বানায়।

> **Fix:** Notebook-এ variable-এর নাম ছিল `column_wise_flattening`, কিন্তু `order='C'` আসলে **row-wise** (C-style)। Column-wise চাইলে `order='F'` (Fortran-style)।

```text
m = [[1 2 3]
     [4 5 6]]

np.ravel(m, order='C') → [1 2 3 4 5 6]   (row by row)
np.ravel(m, order='F') → [1 4 2 5 3 6]   (column by column)
```

| Method | Returns | Original-এ effect |
|---|---|---|
| `a.flatten()` | সবসময় **copy** | Safe |
| `np.ravel(a)` / `a.ravel()` | সম্ভব হলে **view** (faster) | Change করলে original-ও বদলাতে পারে |
| `a.reshape(...)` | সম্ভব হলে view | Same data, new shape |

**ML connection:** 28×28 image-কে neural network-এ দেওয়ার আগে `flatten` করে 784 length-এর vector বানানো হয়।

---

## Concatenate, Transpose and Split

### Two random arrays

```python
a = np.random.randint(1, 10, size=(2, 3))
b = np.random.randint(20, 30, size=(2, 3))

print(a)
print(b)
```

```text
[[5 4 2]
 [1 1 2]]
[[26 27 26]
 [24 25 23]]
```

(Notebook-এ `print` ছিল না কিন্তু output ছিল — তাই `print` যোগ করা হলো।)

### `np.concatenate` — array জোড়া লাগাও

```python
con_row = np.concatenate((a, b), axis=0)   # row-wise (stack vertically)

print(con_row)

con_col = np.concatenate((a, b), axis=1)   # column-wise (side by side)

print(con_col)
```

```text
[[ 5  4  2]
 [ 1  1  2]
 [26 27 26]
 [24 25 23]]
[[ 5  4  2 26 27 26]
 [ 1  1  2 24 25 23]]
```

- `axis=0` → নিচে নিচে যোগ (rows বাড়ে): `(2,3) + (2,3) → (4,3)`
- `axis=1` → পাশাপাশি যোগ (columns বাড়ে): `(2,3) + (2,3) → (2,6)`

### Concatenate-এর rule (error example)

```python
# Rule:
# row-wise (axis=0) concat → number of columns must match
# column-wise (axis=1) concat → number of rows must match

x = np.random.randint(1, 10, size=(2, 3))
y = np.random.randint(1, 10, size=(1, 3))

r = np.concatenate((x, y), axis=0)   # OK: both have 3 columns → (3, 3)
r = np.concatenate((x, y), axis=1)   # ERROR: rows are 2 vs 1
print(r)
```

```text
ValueError: all the input array dimensions except for the concatenation axis must match exactly, but along dimension 0, the array at index 0 has size 2 and the array at index 1 has size 1
```

এই error intentional। `axis=0` line কাজ করে, কিন্তু `axis=1`-এ rows mismatch (2 vs 1) তাই error।

```text
যে axis ধরে জোড়া দিচ্ছ, সেটা ছাড়া বাকি সব dimension same হতে হবে।
```

### Transpose — rows ↔ columns

```python
mat = np.array([
    [10, 20, 30],
    [30, 40, 50],
])

transpose = mat.T

print(transpose)
```

```text
[[10 30]
 [20 40]
 [30 50]]
```

`.T` দিয়ে shape `(2, 3)` → `(3, 2)`। Matrices lesson-এর transpose এখানে এক character-এ!

### Array split

```python
a = np.random.randint(1, 10, size=(10,))
print(a)

# array_split → allows unequal parts
splitted_array = np.array_split(a, 3)
print(splitted_array)

# split → only equal division (10 / 3 is not equal → error)
splitted_array = np.split(a, 3)
```

```text
[5 9 4 5 6 4 4 6 5 9]
[array([5, 9, 4, 5], dtype=int32), array([6, 4, 4], dtype=int32), array([6, 5, 9], dtype=int32)]
ValueError: array split does not result in an equal division
```

- `np.array_split(a, 3)` → 10টা element-কে 4, 3, 3 ভাগে ভাগ করে (unequal OK)।
- `np.split(a, 3)` → শুধু **equal** ভাগ হলে কাজ করে — 10 কে 3 সমান ভাগ করা যায় না, তাই error (intentional)।

| Function | কাজ |
|---|---|
| `np.concatenate((a, b), axis=0)` | Vertically জোড়া |
| `np.concatenate((a, b), axis=1)` | Horizontally জোড়া |
| `a.T` | Transpose |
| `np.array_split(a, n)` | n ভাগ (unequal OK) |
| `np.split(a, n)` | n সমান ভাগ (নাহলে error) |

**ML connection:** Dataset-কে train/validation/test-এ ভাগ করা, বা নতুন feature column যোগ করা (`axis=1` concat) — এগুলো রোজকার কাজ।

---

## Arithmetic Operators and Mathematical Functions

### Element-wise arithmetic

```python
# vectorized → fast, no loop needed
x = np.array([10, 8, 30, 100])
y = np.array([2, 3, 4, 5])

add = np.add(x, y)
print(add)

sub = x - y
print(sub)

mul = x * y
print(mul)

div = x / y
print(div)

remainder = x % y
print(remainder)
```

```text
[ 12  11  34 105]
[ 8  5 26 95]
[ 20  24 120 500]
[ 5.          2.66666667  7.5        20.        ]
[0 2 2 0]
```

প্রতিটা operation **position by position** হয়: `10+2, 8+3, 30+4, 100+5`। `np.add(x, y)` আর `x + y` একই জিনিস।

```text
x     = [10,  8, 30, 100]
y     = [ 2,  3,  4,   5]
x * y = [20, 24, 120, 500]
```

`/` সবসময় float দেয়। Vector lesson-এর **vector addition** NumPy-তে ঠিক এভাবেই।

### Trigonometry

```python
# sin, cos, tan take values in RADIANS

sin_val = np.sin(x)
print(sin_val)

cos_val = np.cos(x)
print(cos_val)

deg_con = np.rad2deg(x)   # radian → degree
print(deg_con)

# np.deg2rad → degree → radian
```

```text
[-0.54402111  0.91294525 -0.98803162  0.74511316]
[-0.83907153  0.40808206  0.15425145 -0.66693806]
[ 572.95779513 1145.91559026 1718.87338539 2291.83118052]
```

`np.sin(x)` প্রতিটা element-এর sin দেয়। Input **radian** ধরে নেয় — degree থাকলে আগে `np.deg2rad()` করো।

```text
np.deg2rad([0, 90, 180]) → [0.         1.57079633 3.14159265]
```

### Log ও square root

```python
x = np.array([10, 8, 16, 100])

base_10_log_val = np.log10(x)
print(base_10_log_val)

base_2_log_val = np.log2(x)   # how many times can we divide by 2
print(base_2_log_val)

sqrt = np.sqrt(x)
print(sqrt)
```

```text
[1.         0.90308999 1.20411998 2.        ]
[3.32192809 3.         4.         6.64385619]
[ 3.16227766  2.82842712  4.         10.        ]
```

- `log10(100) = 2` কারণ 10² = 100
- `log2(16) = 4` কারণ 2⁴ = 16
- `sqrt(100) = 10`
- Natural log চাইলে `np.log()` (base e)

### Sum ও cumulative sum

```python
s = np.sum(x)
print(s)

# prefix sum (running total)
cumul = np.cumulative_sum(x)
print(cumul)
```

```text
134
[ 10  18  34 134]
```

`sum` সব যোগ করে একটা number দেয়। Cumulative sum প্রতিটা step-এ running total দেয়: `10, 10+8, 10+8+16, ...`।

> Note: `np.cumulative_sum` NumPy **2.1+**-এ এসেছে। পুরনো version-এ `np.cumsum(x)` ব্যবহার করো — same result।

| Function | কাজ |
|---|---|
| `np.add`, `+ - * / %` | Element-wise arithmetic |
| `np.sin`, `np.cos`, `np.tan` | Trig (radian input) |
| `np.rad2deg`, `np.deg2rad` | Angle conversion |
| `np.log`, `np.log10`, `np.log2` | Logarithms |
| `np.sqrt` | Square root |
| `np.sum` | Total |
| `np.cumsum` / `np.cumulative_sum` | Running total |

**ML connection:** Skewed data-তে `np.log` apply করা (log transform) common preprocessing। Loss function-এ (cross-entropy) log, distance-এ sqrt লাগে।

---

## Broadcasting

Shape আলাদা হলেও NumPy অনেক সময় ছোট array-কে "stretch" করে বড়টার সাথে মিলিয়ে নেয় — এটাই **broadcasting**।

```python
x = np.array([10, 8, 16, 100])

result = x + 2          # scalar is broadcast to every element

# rule: vector length must match the number of columns of the matrix

matrix = np.array([
    [10, 20, 30],
    [30, 40, 50],
])

result = matrix + 2

vector = np.array([1, 2, 3, 4])

result = matrix + vector   # ERROR: 3 columns vs 4 elements
print(result)
```

```text
ValueError: operands could not be broadcast together with shapes (2,3) (4,)
```

Scalar (`+ 2`) সবসময় কাজ করে। কিন্তু matrix-এর 3 columns আর vector-এর 4 elements — মিলে না, তাই error (intentional)।

### Correct version

```python
x = np.array([10, 8, 16, 100])
print(x + 2)

matrix = np.array([
    [10, 20, 30],
    [30, 40, 50],
])
print(matrix + 2)

vector = np.array([1, 2, 3])   # length 3 = number of columns
print(matrix + vector)
```

```text
[ 12  10  18 102]
[[12 22 32]
 [32 42 52]]
[[11 22 33]
 [31 42 53]]
```

Vector `[1, 2, 3]` প্রতিটা **row**-তে যোগ হয়েছে।

```text
matrix (2, 3)  +  vector (3,)
[[10 20 30]       [ 1  2  3]   ← row 1-এ যোগ
 [30 40 50]]      [ 1  2  3]   ← row 2-এ যোগ (stretched)
```

**Broadcasting rule (simple):** Shape-গুলো **ডান দিক থেকে** মিলাও — প্রতিটা dimension হয় same হবে, নয়তো একটা 1 হবে।

**ML connection:** `X - X.mean(axis=0)` (প্রতিটা feature থেকে তার mean বাদ) — broadcasting দিয়ে এক line-এ normalization।

---

## Logical Functions

```python
# comparison: >, <, >=, <=, ==, !=

x = np.array([10, 8, 16, 100])
y = np.array([2, 3, 16, 5])

greater_than = x > y
print(greater_than)

equal = x == y
print(equal)

# np.all() → are ALL values True?
# np.any() → is AT LEAST ONE value True?

print(np.all(greater_than))
print(np.any(equal))
```

```text
[ True  True False  True]
[False False  True False]
False
True
```

Comparison-ও element-wise — result একটা **boolean array**।

- `np.all(greater_than)` → False, কারণ position 2-তে `16 > 16` False।
- `np.any(equal)` → True, কারণ position 2-তে `16 == 16`।

```text
np.all → AND (সব True লাগবে)
np.any → OR  (একটা True হলেই হবে)
```

> Multiple condition: `(x > 5) & (x < 50)` — `and` না, `&` ব্যবহার করো, আর প্রতিটা condition bracket-এ রাখো।

**ML connection:** Accuracy = `np.mean(y_pred == y_true)` — boolean array-এর mean মানে True-এর ratio!

---

## Sorting

### In-place sort — `a.sort()`

```python
# in-place
x = np.array([10, 8, 16, 100])

z = x.copy()

print(z)

z.sort()

print(z)
```

```text
[ 10   8  16 100]
[  8  10  16 100]
```

`z.sort()` **নিজেকেই** change করে, কিছু return করে না (`None`)। তাই আগে `copy()` নেওয়া হয়েছে যাতে `x` safe থাকে।

### Copy sort — `np.sort(a)`

```python
# copy sorting
print(x)

sort_arr = np.sort(x)

print(sort_arr)

print(x)
```

```text
[ 10   8  16 100]
[  8  10  16 100]
[ 10   8  16 100]
```

`np.sort(x)` নতুন sorted array return করে — original `x` unchanged।

### 2D array sorting

```python
mat = np.array([[10, 3, 5], [8, 4, 9]])

# axis=1 → sort each row (horizontal)
hor_sort = np.sort(mat, axis=1)
print(hor_sort)

# axis=0 → sort each column (vertical)
vert_sort = np.sort(mat, axis=0)
print(vert_sort)
```

```text
[[ 3  5 10]
 [ 4  8  9]]
[[ 8  3  5]
 [10  4  9]]
```

- `axis=1` → প্রতিটা row আলাদা ভাবে বাম→ডান sort।
- `axis=0` → প্রতিটা column আলাদা ভাবে উপর→নিচ sort (`10, 8` → `8, 10`)।

```text
axis=0 → ↓ (column ধরে, rows across)
axis=1 → → (row ধরে, columns across)
```

| Method | Original change? | Return |
|---|---|---|
| `a.sort()` | ✅ হ্যাঁ | `None` |
| `np.sort(a)` | ❌ না | New sorted array |
| `np.argsort(a)` | ❌ না | Sorted order-এর **indices** |

> Descending চাইলে: `np.sort(x)[::-1]`

---

## Searching

```python
print(x)
```

```text
[ 10   8  16 100]
```

### `np.where` — condition দিয়ে খোঁজা

```python
# np.where(condition)        → indices where condition is True
# np.where(condition, a, b)  → a where True, otherwise b

index = np.where(x == 8)   # returns index
print(index)

arr = np.where(x > 8, x, 0)   # returns array
print(arr)
```

```text
(array([1]),)
[ 10   0  16 100]
```

- শুধু condition দিলে → matching **index** দেয় (tuple আকারে)।
- 3টা argument দিলে → if-else-এর মতো: True হলে `x`-এর value, False হলে 0।

### 2D-তে `np.where`

```python
print(mat)
```

```text
[[10  3  5]
 [ 8  4  9]]
```

```python
index = np.where(mat > 8)   # returns (row_indices, col_indices)
print(index)

arr = np.where(mat > 8, mat, 0)   # returns array
print(arr)
```

```text
(array([0, 1]), array([0, 2]))
[[10  0  0]
 [ 0  0  9]]
```

2D-তে দুইটা array আসে — rows `[0, 1]`, cols `[0, 2]` → মানে position `(0, 0)` = 10 আর `(1, 2)` = 9।

### `argmax` ও `argmin` — max/min-এর position

```python
x = np.array([10, 100, 8, 16, 100])

maximum_value_indx = np.argmax(x)
minimum_value_indx = np.argmin(x)

print(maximum_value_indx)
print(minimum_value_indx)
```

```text
1
2
```

`argmax` max value (100)-এর **index** দেয়। 100 দুইবার আছে — **প্রথমটার** index (1) return হয়।

**ML connection:** Classification model প্রতিটা class-এর probability দেয় — `np.argmax(probs)` দিয়ে predicted class বের করা হয়।

---

## Counting in ndarray

```python
a = np.random.randint(1, 100, size=(100,))
print(a)
```

```text
[63  9  1 21 25 41 99 58 97 19 30 77 35 68 18 16 21 46 49 60 49 34 82 76
 85 78  2 89 53 47 44 60 31 84 71 66 91 17 64 93 15 24 37 83 41 70 94  5
 56 17 15 30 69 97 42 20 31 52 94 29  2 55 35 10 63 69 72 95 39 63 34 23
 71 63 96 26 86 79 69 86 51 37 37 71 67  5 76 51 72 61 46 90 58 64 43 71
 86 67 21 29]
```

1 থেকে 99-এর মধ্যে 100টা random number (তোমার values আলাদা হবে)।

### `np.count_nonzero` — condition কতবার True

```python
count_of_97 = np.count_nonzero(a == 97)
print(count_of_97)
```

```text
2
```

`a == 97` একটা boolean array; True = 1 (nonzero), তাই count করলে 97 কতবার আছে সেটা পাই।

> **Fix:** Notebook-এ variable নাম ছিল `value_great_than_60` কিন্তু code ছিল `a == 97`। নাম ঠিক করা হলো। 60-এর বড় count চাইলে `np.count_nonzero(a > 60)` (এই data-তে 44)।

### `np.unique` — unique values ও তাদের count

```python
unique_value, count = np.unique(a, return_counts=True)

print(unique_value)
print(count)
```

```text
[ 1  2  5  9 10 15 16 17 18 19 20 21 23 24 25 26 29 30 31 34 35 37 39 41
 42 43 44 46 47 49 51 52 53 55 56 58 60 61 63 64 66 67 68 69 70 71 72 76
 77 78 79 82 83 84 85 86 89 90 91 93 94 95 96 97 99]
[1 2 2 1 1 2 1 2 1 1 1 3 1 1 1 1 2 2 2 2 2 3 1 2 1 1 1 2 1 2 2 1 1 1 1 2 2
 1 4 2 1 2 1 3 1 4 2 2 1 1 1 1 1 1 1 3 1 1 1 1 2 1 1 2 1]
```

`unique_value` sorted unique numbers দেয়; `count`-এর same position-এ সেই number কতবার এসেছে। যেমন 63 আর 71 — দুটোই 4 বার।

**ML connection:** Classification dataset-এ প্রতিটা class কতগুলো আছে (class imbalance check) — `np.unique(y, return_counts=True)`।

---

## Statistical Functions

### Data load from CSV

```python
# data load (file: student_scores.csv — columns: Math, Science, English)
data = np.genfromtxt('student_scores.csv', delimiter=',', skip_header=1)

print(data)
```

```text
[[78. 85. 82.]
 [56. 67. 72.]
 [89. 92. 88.]
 [45. 52. 58.]
 [70. 75. 80.]
 [92. 90. 91.]
 [61. 60. 62.]
 [55. 57. 54.]
 [88. 89. 87.]
 [74. 70. 76.]
 [66. 69. 68.]
 [80. 82. 81.]
 [59. 64. 60.]
 [73. 78. 74.]
 [91. 93. 90.]
 [68. 71. 69.]
 [77. 79. 78.]
 [84. 86. 85.]
 [62. 63. 65.]
 [95. 97. 96.]]
```

`genfromtxt` CSV file থেকে সরাসরি NumPy array বানায়। `skip_header=1` → প্রথম line (column names) বাদ। 20 students × 3 subjects → shape `(20, 3)`। ([student_scores.csv](/datasets/student_scores.csv) download করে নাও।)

### Basic statistics

```python
# statistics on the Math column
math_marks = data[:, :1]   # all rows, first column (keeps 2D shape (20, 1))

print(math_marks.T)

max_math_marks = np.max(math_marks)
print(max_math_marks)

min_math_marks = np.min(math_marks)
print(min_math_marks)

average_math_marks = np.mean(math_marks)
print(average_math_marks)

median_math_marks = np.median(math_marks)
print(median_math_marks)

# standard deviation
std_math_marks = np.std(math_marks)
print(std_math_marks)
```

```text
[[78. 56. 89. 45. 70. 92. 61. 55. 88. 74. 66. 80. 59. 73. 91. 68. 77. 84.
  62. 95.]]
95.0
45.0
73.15
73.5
13.788672887555204
```

- `max` / `min` → সর্বোচ্চ 95, সর্বনিম্ন 45
- `mean` → average 73.15
- `median` → sorted করলে মাঝের value 73.5
- `std` → marks average থেকে গড়ে ~13.8 দূরে ছড়িয়ে আছে

`.T` দিয়ে `(20, 1)` column-কে এক row-তে দেখানো হয়েছে, পড়তে সুবিধা। 1D চাইলে `data[:, 0]`।

> সব subject-এর mean একসাথে: `np.mean(data, axis=0)` → `[73.15 75.95 75.8 ]` (প্রতিটা column-এর mean)।

### Correlation

```python
study_hours = np.array([2, 4, 5, 7, 8])
exam_scores = np.array([65, 75, 78, 88, 92])

data = np.array([study_hours, exam_scores])

correlation = np.corrcoef(data)

print("Correlation Matrix:\n", correlation)
```

```text
Correlation Matrix:
 [[1.         0.99859154]
 [0.99859154 1.        ]]
```

`np.corrcoef` প্রতিটা row-কে একটা variable ধরে correlation matrix দেয়। Diagonal সবসময় 1 (নিজের সাথে নিজের)। **0.9986** মানে study hours বাড়লে score প্রায় perfectly বাড়ে (strong positive)।

```text
+1 → perfect positive
 0 → no linear relation
-1 → perfect negative
```

| Function | কাজ |
|---|---|
| `np.max`, `np.min` | Max / Min |
| `np.mean` | Average |
| `np.median` | Middle value |
| `np.std` | Spread (standard deviation) |
| `np.var` | Variance (= std²) |
| `np.corrcoef` | Correlation matrix |
| `axis=0` | Column-wise (প্রতি feature) |
| `axis=1` | Row-wise (প্রতি sample) |

**ML connection:** Feature scaling (standardization) = `(X - mean) / std`। Correlation দিয়ে বোঝা যায় কোন feature target-এর সাথে বেশি related।

---

## Linear Algebra

### Dot product (matrix multiplication) ও trace

```python
A = np.array([
    [1, 2, 3],
    [4, 5, 6],
])

B = np.array([
    [7, 8],
    [9, 10],
    [11, 12],
])

# number of columns in A must equal number of rows in B
dot_product = np.dot(A, B)
print(dot_product)

# trace = sum of main diagonal
print(np.trace(B))
```

```text
[[ 58  64]
 [139 154]]
17
```

`(2, 3) · (3, 2) → (2, 2)`। প্রথম element: `1·7 + 2·9 + 3·11 = 58`।

```text
(2, 3) @ (3, 2)
     └──┘
   must match → result (2, 2)
```

`trace(B)` = main diagonal-এর যোগফল = `7 + 10 = 17` (non-square matrix-এও কাজ করে)। `A @ B` লিখলেও same result।

### Determinant ও rank

```python
sq_mat = np.array([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
])

det_of_sq = np.linalg.det(sq_mat)

rank_sq = np.linalg.matrix_rank(sq_mat)

print(det_of_sq)

print(rank_sq)
```

```text
6.66133814775094e-16
2
```

Determinant আসলে **0** — কিন্তু floating-point rounding-এর জন্য খুব ছোট একটা number (`6.66e-16` ≈ 0.000000000000000666) এসেছে। Rank 2, কারণ 3rd row = 2 × 2nd row − 1st row (linearly dependent)।

> Determinant 0 মানে matrix **singular** — inverse নেই। Float result compare করতে `np.isclose(det, 0)` ব্যবহার করো।

### Square matrix multiplication

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print(np.dot(A, B))
```

```text
[[19 22]
 [43 50]]
```

`1·5 + 2·7 = 19`, `1·6 + 2·8 = 22`, `3·5 + 4·7 = 43`, `3·6 + 4·8 = 50`।

> মনে রাখো: `A * B` হলো **element-wise** (`[[5 12] [21 32]]`), আর `np.dot(A, B)` / `A @ B` হলো **matrix multiplication**।

| Function | কাজ |
|---|---|
| `np.dot(A, B)` / `A @ B` | Matrix multiplication |
| `A.T` | Transpose |
| `np.trace(A)` | Diagonal sum |
| `np.linalg.det(A)` | Determinant |
| `np.linalg.matrix_rank(A)` | Rank |
| `np.linalg.inv(A)` | Inverse (det ≠ 0 হলে) |

**ML connection:** Linear regression prediction = `X @ w + b`। Neural network-এর প্রতিটা layer আসলে একটা matrix multiplication।

---

## Common Confusions

### `axis=0` vs `axis=1`

```text
axis=0 → ↓ নিচের দিকে (columns ধরে কাজ, rows collapse)
axis=1 → → ডান দিকে (rows ধরে কাজ, columns collapse)

np.mean(data, axis=0) → প্রতিটা column (feature)-এর mean
```

### `a.sort()` vs `np.sort(a)`

```text
a.sort()    → a নিজেই change, return None
np.sort(a)  → নতুন array, a unchanged
```

### `A * B` vs `A @ B`

```text
A * B → element-wise multiply (same shape লাগে)
A @ B → matrix multiplication (A-এর cols = B-এর rows)
```

### `flatten` vs `ravel`

```text
flatten → সবসময় copy
ravel   → সম্ভব হলে view (original-এর সাথে linked)
```

### `np.split` vs `np.array_split`

```text
np.split(a, 3)       → সমান ভাগ না হলে ValueError
np.array_split(a, 3) → unequal ভাগও OK
```

### `np.where(cond)` vs `np.where(cond, a, b)`

```text
np.where(x > 8)        → indices
np.where(x > 8, x, 0)  → new array (if-else)
```

### `and` vs `&`

```text
(x > 5) and (x < 50)  → ❌ error (array-এ ambiguous)
(x > 5) & (x < 50)    → ✅ element-wise AND
```

### Determinant `6.66e-16` মানে 0

Float calculation-এ ছোট rounding error হয় — `np.isclose(value, 0)` দিয়ে check করো।

---

## Quick Practice

### Q1

`np.arange(12).reshape(3, -1).shape` কত?

### Q2

`a` shape `(2, 3)` আর `b` shape `(2, 3)`। `np.concatenate((a, b), axis=1)`-এর shape কত?

### Q3

`np.array([[1, 2, 3]]) + np.array([10, 20, 30])` result কী?

### Q4

`x = np.array([4, 9, 1, 7])` হলে `np.argmax(x)` আর `np.where(x > 5)` কী?

### Q5

`np.sort(np.array([[3, 1], [2, 5]]), axis=0)` কী?

### Q6

`A` shape `(4, 3)`, `B` shape `(3, 2)` — `A @ B`-এর shape কত? `B @ A` কি possible?

### Q7

`data` shape `(100, 5)` — প্রতিটা feature-এর mean বের করার code?

### Answers

1. **`(3, 4)`** — `-1` এর জায়গায় 12 / 3 = 4
2. **`(2, 6)`**
3. **`[[11 22 33]]`** — broadcasting
4. `np.argmax(x)` = **`1`** (max value 9-এর index — value না, index!); `np.where(x > 5)` = **`(array([1, 3]),)`**
5. **`[[2 1] [3 5]]`** — প্রতিটা column আলাদা sort
6. **`(4, 2)`**; `B @ A` → `(3, 2) @ (4, 3)` → 2 ≠ 4, তাই **না**
7. **`np.mean(data, axis=0)`** → shape `(5,)`

---

## Final Cheat Sheet

| Concept | Code | Meaning |
|---|---|---|
| Reshape | `a.reshape(5, -1)` | Shape বদলাও, size same |
| Flatten | `a.flatten()` / `a.ravel()` | 1D বানাও |
| Concat rows | `np.concatenate((a, b), axis=0)` | নিচে নিচে জোড়া |
| Concat cols | `np.concatenate((a, b), axis=1)` | পাশাপাশি জোড়া |
| Transpose | `a.T` | Rows ↔ cols |
| Split | `np.array_split(a, 3)` | ভাগ করো |
| Arithmetic | `a + b`, `a * b`, `a / b` | Element-wise |
| Math | `np.sqrt`, `np.log`, `np.sin` | Element-wise functions |
| Running total | `np.cumsum(a)` | Prefix sum |
| Broadcasting | `matrix + vector` | ছোটটা stretch হয় |
| Compare | `a > b` | Boolean array |
| All / Any | `np.all(m)`, `np.any(m)` | AND / OR |
| Sort copy | `np.sort(a, axis=...)` | Original safe |
| Sort in-place | `a.sort()` | Original change |
| Where | `np.where(cond, a, b)` | Vectorized if-else |
| Position of max | `np.argmax(a)` | Index |
| Count | `np.count_nonzero(a == v)` | কতবার |
| Unique | `np.unique(a, return_counts=True)` | Values + counts |
| Load CSV | `np.genfromtxt(f, delimiter=',', skip_header=1)` | File → array |
| Stats | `np.mean`, `np.median`, `np.std` | Summary |
| Correlation | `np.corrcoef(data)` | Relation strength |
| Matrix multiply | `np.dot(A, B)` / `A @ B` | Linear algebra |
| Trace / Det / Rank | `np.trace`, `np.linalg.det`, `np.linalg.matrix_rank` | Matrix properties |

### One-line Mental Model

> **NumPy operations = পুরো array-এ একসাথে (vectorized) কাজ — shape বুঝলে, axis বুঝলে, বাকি সব এক line-এর function।**
