*Bangla + English mixed notes.* — **Python Module 10**

> 📓 **Class notebook:** `module-10-numpy-basics.ipynb` — [👁️ View](/ai/ml/notebooks/module-10-numpy-basics) / [⬇️ Download](/notebooks/module-10-numpy-basics.ipynb)

> এই module-এ আমরা **NumPy** শিখব — Python-এ fast numerical computing-এর foundation। Machine Learning-এর প্রায় সব library (Pandas, scikit-learn, TensorFlow, PyTorch) ভেতরে NumPy-এর মতো array দিয়েই কাজ করে।

## Roadmap

1. Why NumPy? — List vs ndarray
2. ndarray — 1D, 2D, 3D array
3. Array Attributes — `ndim`, `shape`, `dtype`, `size`
4. ndarray Data Type (`dtype`)
5. ndarray Creation from Existing Data
6. Creating ndarray from Scratch
7. Array Creation with Random Values
8. Array Creation with Range Functions
9. Creating Matrices for Linear Algebra
10. Indexing and Slicing
11. Advanced Indexing and Iteration

### 🎯 Module Goal

```text
Python list   → general purpose collection, slow math
NumPy ndarray → same-type numbers, fast vectorized math
```

এই module শেষে তুমি পারবে:

- NumPy array বানাতে (list, tuple, set, dict, zeros, ones, random, range থেকে)
- Array-এর shape, dimension, dtype বুঝতে
- Array থেকে element/row/column বের করতে (indexing, slicing, boolean indexing)

**ML connection:** আগের lessons-এ যে **vector** আর **matrix** শিখেছি, NumPy-তে সেগুলোই হলো 1D আর 2D array।

```text
Scalar → 5                        (0D)
Vector → np.array([1, 2, 3])      (1D)
Matrix → np.array([[1, 2], [3, 4]]) (2D)
Tensor → 3D বা তার বেশি dimension
```

---

## Why NumPy? — List vs ndarray

### Python list দিয়ে multiply

```python
arr = [1, 2, 3]

print(arr * 5)

arr = [x * 5 for x in arr]

print(arr)
```

```text
[1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3]
[5, 10, 15]
```

List-কে `* 5` করলে **list 5 বার repeat** হয় — math হয় না! প্রতিটা element-কে 5 দিয়ে গুণ করতে list comprehension (loop) লাগে।

### NumPy array দিয়ে multiply

```python
import numpy as np

arr1 = np.array([1, 2, 3])

arr1 = arr1 * 5

print(arr1)
```

```text
[ 5 10 15]
```

NumPy array-তে `* 5` করলে **প্রতিটা element-এ** গুণ হয়। Loop লাগে না — এটাকে বলে **vectorization**।

### কেন NumPy fast?

| Python list | NumPy ndarray |
|---|---|
| যেকোনো type mix করা যায় | সব element **same type** |
| Loop লাগে math করতে | Vectorized math (loop ছাড়া) |
| Slow (Python level) | Fast (C level, contiguous memory) |
| `*` → repeat | `*` → element-wise multiply |

> ML-এ লাখ লাখ number নিয়ে কাজ হয় — তাই NumPy ছাড়া চলে না।

---

## ndarray — 1D, 2D, 3D Array

NumPy-এর main object হলো **ndarray** (n-dimensional array)।

```python
import numpy as np

# 1D array (vector)
arr1 = np.array([1, 2, 3, 4, 5])

# 2D array (matrix)
arr2 = np.array([
    [1, 2, 3],   # row 1
    [4, 5, 6],   # row 2
])

# 3D array (3 "floors", each floor is a 2x3 matrix)
arr3 = np.array([
    # 1st floor
    [[1, 2, 3],   # row 1
     [4, 5, 6]],  # row 2

    # 2nd floor
    [[1, 2, 3],
     [4, 5, 6]],

    # 3rd floor
    [[1, 2, 3],
     [4, 5, 6]],
])
```

এই cell কিছু print করে না — শুধু তিনটা array তৈরি করে। পরের section-এ এদের attributes দেখব।

### Mental picture

```text
1D → একটা line        [1 2 3 4 5]
2D → table (row × col)  2 rows, 3 columns
3D → building-এর floor  3 floors, প্রতিটায় 2×3 table
```

**ML connection:** একটা grayscale image = 2D array (height × width)। Color image = 3D array (height × width × 3 channels)।

---

## Array Attributes

প্রতিটা array-এর কিছু **attribute** থাকে যা array সম্পর্কে information দেয়।

```python
# dimension
print(arr1.ndim)
print(arr2.ndim)
print(arr3.ndim)

# shape
print(arr1.shape)
print(arr2.shape)
print(arr3.shape)

# data type
print(arr1.dtype)
print(arr2.dtype)
print(arr3.dtype)

# size (total number of elements)
print(arr1.size)
print(arr2.size)
print(arr3.size)
```

```text
1
2
3
(5,)
(2, 3)
(3, 2, 3)
int64
int64
int64
5
6
18
```

- `ndim` → কয়টা dimension (axis)
- `shape` → প্রতিটা dimension-এ কয়টা element — `(rows, cols)` বা `(floors, rows, cols)`
- `dtype` → element-গুলোর data type
- `size` → total element সংখ্যা = shape-এর সব সংখ্যার গুণফল (3 × 2 × 3 = 18)

### `(5,)` কেন comma আছে?

```text
(5,)   → 1D, 5টা element (tuple-এ একটা মাত্র value থাকলে comma লাগে)
(2, 3) → 2D, 2 rows × 3 columns
```

| Attribute | Meaning | `arr2`-এর জন্য |
|---|---|---|
| `ndim` | Number of dimensions | `2` |
| `shape` | Size along each axis | `(2, 3)` |
| `dtype` | Element type | `int64` |
| `size` | Total elements | `6` |

> Note: Windows-এ default integer অনেক সময় `int32` দেখায়, Mac/Linux-এ `int64`।

---

## ndarray Data Type (dtype)

### Automatic dtype

```python
arr = np.array([1, 2, 3])
print(arr.dtype)

arr = np.array([1.5, 2.4, 3.2])
print(arr.dtype)
```

```text
int64
float64
```

NumPy নিজে থেকেই data দেখে dtype ঠিক করে — সব integer হলে `int64`, decimal থাকলে `float64`।

### Upcasting — mixed data হলে কী হয়?

```python
arr = np.array([1, 2, 3.2])
# upcasted to float
print(arr.dtype)

# upcasted to string
arr = np.array([1, 2, 3.2, 'hello'])
print(arr.dtype)

arr = np.array([1, True, 3.25, 'hello'])
print(arr.dtype)
```

```text
float64
<U32
<U32
```

ndarray-তে **সব element same type** হতে হবে। তাই NumPy সবাইকে একটা "বড়" type-এ convert করে — এটাকে বলে **upcasting**।

```text
bool → int → float → string
(ছোট)                  (বড়)
```

`<U32` মানে Unicode string, সর্বোচ্চ 32 character। একটা string থাকলেই পুরো array string হয়ে যায় — তখন আর math করা যায় না!

### Selecting a data type for an array

```python
arr = np.array([1, 2, 300], dtype=np.int16)
print(arr.dtype)
print(arr)

# convert to another dtype
arr = arr.astype(np.int32)
print(arr.dtype)

# error: 'hello' cannot become a float
arr = np.array([1, 2, 3.2, 'hello'], dtype=np.float64)
```

```text
int16
[  1   2 300]
int32
ValueError: could not convert string to float: 'hello'
```

- `dtype=` দিয়ে array বানানোর সময়ই type ঠিক করা যায়।
- `.astype()` দিয়ে পরে type change করা যায় (নতুন array return করে)।
- যে value convert করা যায় না (যেমন `'hello'` → float) — সেখানে **error** আসবে। এই error টা intentional, দেখানোর জন্য।

### Common dtypes

| dtype | Meaning | Range / Use |
|---|---|---|
| `int8` | 8-bit integer | -128 থেকে 127 |
| `int16` | 16-bit integer | -32768 থেকে 32767 |
| `int32` / `int64` | Bigger integers | Default integer |
| `float32` | 32-bit decimal | Deep learning-এ common (memory কম) |
| `float64` | 64-bit decimal | Default float |
| `bool` | True / False | Masks |
| `<U..` | Unicode string | Text |

**ML connection:** Deep learning-এ প্রায়ই `float32` ব্যবহার হয় — memory অর্ধেক লাগে, GPU-তে fast।

---

## ndarray Creation from Existing Data

`np.array()` দিয়ে Python-এর যেকোনো collection থেকে array বানানো যায়।

### From list

```python
# list
lst = [10, 20, 30, 40, 40.5]
arr = np.array(lst, dtype=np.int32)   # 40.5 becomes 40 (decimal part dropped)

# mixed list → everything becomes string
mixed_lst = [10, True, 'Hello']
arr = np.array(mixed_lst)

# nested list → 2D array (matrix)
matrix = [
    [1, 2, 3],   # row 1
    [4, 5, 6],   # row 2
]

arr = np.array(matrix)

print(arr)
print(type(arr))
print(arr.dtype)
print(arr.shape)
print(arr.ndim)
```

```text
[[1 2 3]
 [4 5 6]]
<class 'numpy.ndarray'>
int64
(2, 3)
2
```

Nested list (list-এর ভেতরে list) দিলে **2D array** তৈরি হয়। প্রতিটা inner list একটা row।

> `dtype=np.int32` দিয়ে float `40.5` রাখলে decimal অংশ কেটে `40` হয়ে যায় (rounding না, truncation)।

### From tuple

```python
# tuple
tpl = (10, 20, 30)

arr = np.array(tpl, dtype=np.int32)
print(arr.dtype)

arr = arr.astype(np.int16)
print(arr)
print(type(arr))
print(arr.dtype)
print(arr.shape)
print(arr.ndim)
```

```text
int32
[10 20 30]
<class 'numpy.ndarray'>
int16
(3,)
1
```

Tuple থেকেও list-এর মতোই array হয়। `astype()` দিয়ে `int32` → `int16` করা হলো।

### From set

```python
# set
st = {1, 2, 3}

arr = np.array(list(st))   # convert set to list first
arr = arr.astype(np.int16)

print(arr)
print(type(arr))
print(arr.dtype)
print(arr.shape)
print(arr.ndim)
```

```text
[1 2 3]
<class 'numpy.ndarray'>
int16
(3,)
1
```

Set-কে সরাসরি `np.array(st)` দিলে ঠিকমতো array হয় না (একটা `object` element হয়ে যায়)। তাই আগে `list(st)` করতে হবে। মনে রাখো — set-এর order guaranteed না।

### From dictionary

```python
# dictionary
dc = {'a': 10, 'b': 20, 'c': 30}

keys = dc.keys()
values = dc.values()
items = dc.items()
```

এই cell শুধু keys, values, items আলাদা করে রাখে — কোনো output নেই।

#### Keys → ndarray

```python
arr = np.array(list(keys))

print(arr)
print(type(arr))
print(arr.dtype)
print(arr.shape)
print(arr.ndim)
print(arr.size)
```

```text
['a' 'b' 'c']
<class 'numpy.ndarray'>
<U1
(3,)
1
3
```

Keys সব string, তাই dtype `<U1` (1 character-এর string)।

#### Values → ndarray

```python
arr = np.array(list(values))
print(arr)

arr = arr.astype(np.int16)
print(type(arr))
print(arr.dtype)
print(arr.shape)
print(arr.ndim)
print(arr.size)
```

```text
[10 20 30]
<class 'numpy.ndarray'>
int16
(3,)
1
3
```

Values numeric — তাই math করার জন্য ready।

#### Items → ndarray

```python
arr = np.array(list(items))

print(arr)
print(type(arr))
print(arr.dtype)
print(arr.shape)
print(arr.ndim)
print(arr.size)
```

```text
[['a' '10']
 ['b' '20']
 ['c' '30']]
<class 'numpy.ndarray'>
<U21
(3, 2)
2
6
```

প্রতিটা item একটা `(key, value)` pair → তাই **2D array** (3 rows × 2 cols)। String থাকায় number-গুলোও string হয়ে গেছে (`'10'`) — upcasting!

| Source | How to convert |
|---|---|
| list | `np.array(lst)` |
| tuple | `np.array(tpl)` |
| set | `np.array(list(st))` |
| dict keys/values | `np.array(list(dc.keys()))` |
| dict items | `np.array(list(dc.items()))` → 2D |

---

## Creating ndarray from Scratch

অনেক সময় data নেই, কিন্তু নির্দিষ্ট shape-এর একটা array দরকার (যেমন weights initialize করতে)। তখন এই functions কাজে আসে।

### `np.zeros` — সব 0

```python
# np.zeros(shape)
arr = np.zeros((2, 3), dtype=np.int8)

# zeros_like → same shape as arr3, all 0
arr = np.zeros_like(arr3)
print(arr)
print(arr.shape)
```

```text
[[[0 0 0]
  [0 0 0]]

 [[0 0 0]
  [0 0 0]]

 [[0 0 0]
  [0 0 0]]]
(3, 2, 3)
```

`np.zeros((2, 3))` → 2×3 shape-এর সব 0। `zeros_like(arr3)` → `arr3`-এর **same shape ও dtype**, কিন্তু সব 0।

### `np.ones` — সব 1

```python
# np.ones(shape)
arr = np.ones((3, 4, 3), dtype=np.int8)

# ones_like → same shape as arr3, all 1
arr = np.ones_like(arr3)
print(arr)
print(arr.shape)
```

```text
[[[1 1 1]
  [1 1 1]]

 [[1 1 1]
  [1 1 1]]

 [[1 1 1]
  [1 1 1]]]
(3, 2, 3)
```

### `np.empty` — initialize না করা array

```python
# np.empty(shape) → memory allocate করে, values set করে না
arr = np.empty((4, 3), dtype=np.int8)

arr = np.empty_like(arr3)
print(arr)
print(arr.shape)
```

```text
[[[0 0 0]
  [0 0 0]]

 [[0 0 0]
  [0 0 0]]

 [[0 0 0]
  [0 0 0]]]
(3, 2, 3)
```

> ⚠️ `empty` এর values **garbage** (memory-তে আগে যা ছিল) — তোমার machine-এ অন্য values দেখাতে পারে। এটা fastest, কিন্তু পরে নিজে values fill করতে হবে।

### `np.full` — নির্দিষ্ট value দিয়ে ভরা

```python
# np.full(shape, fill_value)
arr = np.full((4, 3), np.inf)

# full_like → same shape as arr3, filled with infinity
arr = np.full_like(arr3, np.inf, dtype=np.float64)

print(arr)
print(arr.shape)
print(arr.dtype)
```

```text
[[[inf inf inf]
  [inf inf inf]]

 [[inf inf inf]
  [inf inf inf]]

 [[inf inf inf]
  [inf inf inf]]]
(3, 2, 3)
float64
```

`np.inf` = infinity (float)। `arr3` integer, তাই `dtype=np.float64` দিতে হয়েছে — নাহলে infinity integer-এ রাখা যায় না।

| Function | কী দেয় | `_like` version |
|---|---|---|
| `np.zeros(shape)` | সব 0 | `np.zeros_like(a)` |
| `np.ones(shape)` | সব 1 | `np.ones_like(a)` |
| `np.empty(shape)` | Garbage (uninitialized) | `np.empty_like(a)` |
| `np.full(shape, v)` | সব `v` | `np.full_like(a, v)` |

**ML connection:** Neural network-এ bias সাধারণত `np.zeros` দিয়ে initialize হয়।

---

## Array Creation with Random Values

> Random values প্রতিবার run-এ **আলাদা** হবে — নিচের output শুধু example। Same result চাইলে আগে `np.random.seed(0)` দাও।

### `np.random.rand` — 0 থেকে 1

```python
# np.random.rand(d0, d1, ...) → values in [0, 1)
arr = np.random.rand(2, 3)

print(arr)
print(type(arr))
print(arr.dtype)
print(arr.shape)
print(arr.ndim)
print(arr.size)
```

```text
[[0.5488135  0.71518937 0.60276338]
 [0.54488318 0.4236548  0.64589411]]
<class 'numpy.ndarray'>
float64
(2, 3)
2
6
```

Shape আলাদা আলাদা argument হিসেবে দাও (tuple না)। Values 0 থেকে 1-এর মধ্যে (1 বাদে), uniformly distributed।

### `np.random.randint` — random integers

```python
# np.random.randint(low, high, shape) → high excluded
arr = np.random.randint(1, 10, (2, 3))

print(arr)
print(type(arr))
print(arr.dtype)
print(arr.shape)
print(arr.ndim)
print(arr.size)
```

```text
[[5 8 7]
 [9 9 2]]
<class 'numpy.ndarray'>
int64
(2, 3)
2
6
```

1 থেকে 9 পর্যন্ত random integer — **`high` (10) include হয় না**।

### `np.random.uniform` — range-এর মধ্যে random float

```python
# np.random.uniform(low, high, shape)
arr = np.random.uniform(50, 100, (3, 3, 4))

print(arr)
print(type(arr))
print(arr.dtype)
print(arr.shape)
print(arr.ndim)
print(arr.size)
```

```text
[[[89.5862519  76.44474599 78.40222805 96.27983191]
  [53.55180291 54.35646499 51.01091987 91.63099228]
  [88.90783755 93.50060741 98.93091711 89.95792821]]

 [[73.07396811 89.02645881 55.91372129 81.99605107]
  [57.16766437 97.23344585 76.09241609 70.733097  ]
  [63.22778061 88.71168447 72.80751661 78.42169744]]

 [[50.93949002 80.88177485 80.60478614 80.84669984]
  [97.18740393 84.09101496 67.97539503 71.85159769]
  [84.8815598  53.01127358 83.33833577 83.53189348]]]
<class 'numpy.ndarray'>
float64
(3, 3, 4)
3
36
```

50 থেকে 100-এর মধ্যে random decimal, shape `(3, 3, 4)` → 3 × 3 × 4 = 36 elements।

| Function | Output | Range |
|---|---|---|
| `np.random.rand(2, 3)` | float | [0, 1) |
| `np.random.randint(lo, hi, shape)` | int | [lo, hi) |
| `np.random.uniform(lo, hi, shape)` | float | [lo, hi) |

**ML connection:** Neural network-এর weights random values দিয়ে initialize হয়। Fake/test dataset বানাতেও random array লাগে।

---

## Array Creation with Range Functions

### `np.arange` — Python `range`-এর মতো

```python
# np.arange(start, stop, step) → stop excluded
arr = np.arange(1, 10, 1)
mat = arr.reshape(3, 3)

print(arr)
print(mat)
print(type(arr))
print(arr.dtype)
print(arr.shape)
print(arr.ndim)
print(arr.size)
```

```text
[1 2 3 4 5 6 7 8 9]
[[1 2 3]
 [4 5 6]
 [7 8 9]]
<class 'numpy.ndarray'>
int64
(9,)
1
9
```

`arange` 1 থেকে 9 দেয় (10 বাদে)। `reshape(3, 3)` দিয়ে 9টা element-কে 3×3 matrix বানানো হলো — element সংখ্যা same থাকতে হবে (9 = 3 × 3)।

### `np.linspace` — equal gap-এ নির্দিষ্ট সংখ্যক value

```python
# np.linspace(start, stop, num) → stop INCLUDED, num = how many values
arr = np.linspace(0, 4, 6)

print(arr)
print(type(arr))
print(arr.dtype)
print(arr.shape)
print(arr.ndim)
print(arr.size)
```

```text
[0.  0.8 1.6 2.4 3.2 4. ]
<class 'numpy.ndarray'>
float64
(6,)
1
6
```

0 থেকে 4 পর্যন্ত **6টা** equally spaced value। Gap = (4 − 0) / (6 − 1) = 0.8।

### `np.logspace` — log scale-এ values

```python
# np.logspace(start, stop, num, base) → base**start ... base**stop
arr = np.logspace(0, 4, 6, base=2)

print(arr)
```

```text
[ 1.          1.74110113  3.03143313  5.27803164  9.18958684 16.        ]
```

এখানে exponent গুলো `linspace(0, 4, 6)` = `0, 0.8, 1.6, ...4`, আর value = 2^exponent। তাই 2^0 = 1 থেকে 2^4 = 16।

| Function | কী ঠিক করো | Stop included? |
|---|---|---|
| `np.arange(start, stop, step)` | Step size | ❌ না |
| `np.linspace(start, stop, num)` | কয়টা value | ✅ হ্যাঁ |
| `np.logspace(start, stop, num, base)` | কয়টা value (log scale) | ✅ হ্যাঁ |

**ML connection:** Learning rate খুঁজতে `np.logspace(-4, 0, 5)` → `0.0001, 0.001, 0.01, 0.1, 1` — hyperparameter tuning-এ খুব common। Graph plot করতে x-values বানাতে `linspace` ব্যবহার হয়।

---

## Creating Matrices for Linear Algebra

### Diagonal matrix

```python
diagonal_matrix = np.diag([1, 2, 3, 4])

print(diagonal_matrix)
print(diagonal_matrix.shape)
```

```text
[[1 0 0 0]
 [0 2 0 0]
 [0 0 3 0]
 [0 0 0 4]]
(4, 4)
```

Diagonal-এ দেওয়া values বসে, বাকি সব 0। Matrices lesson-এ diagonal matrix দেখেছি — এখানে এক line-এ বানানো গেল।

### Identity matrix — `np.eye`

```python
# identity matrix
identity_mat = np.eye(4)
print(identity_mat)
print(identity_mat.shape)

# np.eye(rows, cols, k) → k = which diagonal gets the 1s
mat = np.eye(3, 4)
print(mat)

mat = np.eye(3, 4, 1)
print(mat)
```

```text
[[1. 0. 0. 0.]
 [0. 1. 0. 0.]
 [0. 0. 1. 0.]
 [0. 0. 0. 1.]]
(4, 4)
[[1. 0. 0. 0.]
 [0. 1. 0. 0.]
 [0. 0. 1. 0.]]
[[0. 1. 0. 0.]
 [0. 0. 1. 0.]
 [0. 0. 0. 1.]]
```

- `np.eye(4)` → 4×4 identity matrix (main diagonal-এ 1)।
- `np.eye(3, 4)` → 3 rows × 4 cols, non-square-ও হতে পারে।
- `k=1` → 1s এক ঘর **উপরের** diagonal-এ সরে যায় (`k=-1` হলে নিচে)।

> Notebook-এ প্রথম `print` দুটো comment করা ছিল; এখানে output দেখানোর জন্য চালানো হয়েছে।

**ML connection:** Identity matrix হলো matrix-এর "1" — `A @ I = A`। Regularization (Ridge regression)-এ `λI` যোগ হয়।

---

## Indexing and Slicing

> এই section-এ আগের `arr1 = [1 2 3 4 5]` আর `arr2 = [[1 2 3], [4 5 6]]` ব্যবহার হচ্ছে।

### Indexing — একটা element ধরা ও change করা

```python
print(arr1)
print(arr2)

# arr1[2] = 100   # 1D: change element at index 2

arr2[0][2] = 100   # row 0, column 2
print(arr2)
```

```text
[1 2 3 4 5]
[[1 2 3]
 [4 5 6]]
[[  1   2 100]
 [  4   5   6]]
```

`arr2[0][2]` → row 0-এর column 2। NumPy-তে better style হলো `arr2[0, 2]` — একবারে row, column দেওয়া।

```text
arr2[0, 2]  → row 0, col 2
arr2[1, 0]  → row 1, col 0 → 4
arr2[-1, -1] → last row, last col → 6
```

### 1D Slicing ও `.copy()`

```python
# 1D slicing: arr[start:end:step]
arr1_mod = arr1[1:4].copy()
arr1[1] = 2

arr1_mod[2] = 200
print(arr1_mod)
print(arr1)
```

```text
[  2   3 200]
[1 2 3 4 5]
```

`arr1[1:4]` → index 1, 2, 3 → `[2 3 4]`। `.copy()` করায় `arr1_mod` change করলেও `arr1` unchanged থাকে।

#### ⚠️ View vs Copy — খুব important

```text
b = a[1:4]          → VIEW  (b change করলে a-ও change হয়!)
b = a[1:4].copy()   → COPY  (আলাদা memory, a safe)
```

Python list-এর slicing নতুন list দেয়, কিন্তু **NumPy slicing একটা view দেয়** (same memory)। তাই original রক্ষা করতে চাইলে `.copy()` দাও।

### 2D Slicing

```python
# 2D slicing: arr[row_start:row_end:step, col_start:col_end:step]

# getting a row
row_0 = arr2[0:1, ]
row_1 = arr2[1:, ]

print(row_0)
print(row_1)

# getting a column
col_0 = arr2[:, 0:1]
col_1 = arr2[:, 1:2]

print(col_0)
print(col_1)

# getting a portion
portion = arr2[:, 0:2]

print(portion)
```

```text
[[  1   2 100]]
[[4 5 6]]
[[1]
 [4]]
[[2]
 [5]]
[[1 2]
 [4 5]]
```

Comma-র **আগে rows, পরে columns**। `:` মানে "সব"। (`row_0`, `row_1` print notebook-এ comment করা ছিল — এখানে দেখানো হলো।)

```text
arr2[0:1, :]  → shape (1, 3)  2D row (slice রাখলে dimension থাকে)
arr2[0, :]    → shape (3,)    1D row (single index দিলে dimension কমে)
arr2[:, 0:1]  → shape (2, 1)  column vector
arr2[:, 0]    → shape (2,)    1D
```

**ML connection:** Dataset matrix-এ rows = samples, columns = features। `X[:, 0]` মানে "সব sample-এর 1st feature"।

---

## Advanced Indexing and Iteration

### Fancy indexing — index-এর list দিয়ে

```python
lst = np.array([10, 20, 30, 40])

values = lst[[0, 3, 1]]

print(values)
```

```text
[10 40 20]
```

একটা **list of indices** দিলে সেই position-গুলোর element, সেই order-এ পাওয়া যায়। Fancy indexing সবসময় **copy** দেয়।

### 2D fancy indexing ও Boolean indexing

```python
print(arr2)
print(arr2[[0, 1], [1, 2]])   # elements (0,1) and (1,2)

# boolean indexing: select by condition
print(arr2[arr2 > 1])

# change all values > 2 to 0
arr2[arr2 > 2] = 0

print(arr2)
```

```text
[[  1   2 100]
 [  4   5   6]]
[2 6]
[  2 100   4   5   6]
[[1 2 0]
 [0 0 0]]
```

- `arr2[[0, 1], [1, 2]]` → pairs: `(0, 1)` = 2, `(1, 2)` = 6।
- `arr2 > 1` একটা True/False **mask** বানায়; `arr2[mask]` শুধু True position-গুলো 1D হিসেবে দেয়।
- `arr2[arr2 > 2] = 0` → condition match করা সব element replace।

> **Bug fix:** Notebook-এ `arr2[arr > 1]` লেখা ছিল (ভুল variable `arr`, যার shape আলাদা) — সঠিক হলো `arr2[arr2 > 1]`।

```text
arr2 > 1  →  [[False  True  True]
              [ True  True  True]]
```

### Final state check

```python
print(arr2)
```

```text
[[1 2 0]
 [0 0 0]]
```

Boolean assignment `arr2`-কে সরাসরি (in-place) change করেছে।

### Iteration — `np.nditer`

```python
arr = np.array([[10, 20, 30], [100, 200, 300]])

# iteration over every element (any dimension)
print(arr3)
for i in np.nditer(arr3):
    print(i)
```

```text
[[[1 2 3]
  [4 5 6]]

 [[1 2 3]
  [4 5 6]]

 [[1 2 3]
  [4 5 6]]]
1
2
3
4
5
6
1
2
3
4
5
6
1
2
3
4
5
6
```

Normal `for` loop 3D array-তে প্রথম axis (floors) ধরে iterate করে। `np.nditer` সব dimension "flat" করে **প্রতিটা element** একটা একটা করে দেয় — nested loop লাগে না।

> তবে মনে রাখো: NumPy-তে loop **শেষ উপায়** — যতটা পারো vectorized operation ব্যবহার করো।

| Indexing type | Example | Returns |
|---|---|---|
| Basic index | `a[0, 2]` | Single element |
| Slice | `a[0:2, 1:]` | View |
| Fancy | `a[[0, 3, 1]]` | Copy |
| Boolean | `a[a > 2]` | Copy (1D) |

---

## Common Confusions

### List `* 5` vs Array `* 5`

```text
[1, 2, 3] * 5           → list 5 বার repeat
np.array([1, 2, 3]) * 5 → [ 5 10 15]
```

### `shape (5,)` vs `(1, 5)` vs `(5, 1)`

```text
(5,)   → 1D vector
(1, 5) → 2D, 1 row (row vector)
(5, 1) → 2D, 1 column (column vector)
```

### `arange` vs `linspace`

```text
np.arange(0, 1, 0.25)  → [0.   0.25 0.5  0.75]       (step দাও, stop বাদ)
np.linspace(0, 1, 5)   → [0.   0.25 0.5  0.75 1.  ]  (count দাও, stop সহ)
```

### Slice = View (Copy না!)

```text
b = a[0:3]; b[0] = 99   → a[0]-ও 99 হয়ে যায়
b = a[0:3].copy()       → a safe থাকে
```

### একটা string থাকলেই সব string

```text
np.array([1, 2, 'x'])  → ['1' '2' 'x']  dtype <U21
```

### `np.empty` মানে zeros না

`np.empty` garbage values রাখে। 0 চাইলে `np.zeros` ব্যবহার করো।

### `randint` high value include করে না

```text
np.random.randint(1, 10) → 1 থেকে 9
```

---

## Quick Practice

### Q1

`np.array([[1, 2, 3], [4, 5, 6]]).shape` কত?

### Q2

`np.array([1, 2.5, 3]).dtype` কী হবে?

### Q3

`np.linspace(0, 10, 5)` output কী?

### Q4

`a = np.arange(10)` হলে `a[2:7:2]` কী?

### Q5

`np.array([5, 12, 3, 20])`-এ 10-এর বড় values কীভাবে select করবে?

### Q6

`b = a[1:3]` তারপর `b[0] = 100` করলে `a` change হবে?

### Q7

3×3 identity matrix বানানোর code লেখো।

### Answers

1. **`(2, 3)`** — 2 rows, 3 columns
2. **`float64`** — upcasting
3. **`[ 0.   2.5  5.   7.5 10. ]`**
4. **`[2 4 6]`**
5. **`a[a > 10]`** → `[12 20]`
6. **হ্যাঁ** — slice একটা view। আলাদা রাখতে `.copy()` লাগবে।
7. **`np.eye(3)`**

---

## Final Cheat Sheet

| Concept | Code | Meaning |
|---|---|---|
| Import | `import numpy as np` | Standard alias |
| Create | `np.array([1, 2, 3])` | List → ndarray |
| Dimensions | `a.ndim` | কয়টা axis |
| Shape | `a.shape` | Size per axis |
| Type | `a.dtype` | Element type |
| Total elements | `a.size` | Shape-এর গুণফল |
| Set type | `np.array(x, dtype=np.int16)` | Creation-এ type |
| Change type | `a.astype(np.float32)` | New typed array |
| Zeros / Ones | `np.zeros((2, 3))`, `np.ones((2, 3))` | Filled arrays |
| Fill value | `np.full((2, 3), 7)` | সব 7 |
| Same shape | `np.zeros_like(a)` | `a`-এর shape-এ |
| Random float | `np.random.rand(2, 3)` | [0, 1) |
| Random int | `np.random.randint(1, 10, (2, 3))` | [1, 10) |
| Range | `np.arange(0, 10, 2)` | Step-based |
| Even spacing | `np.linspace(0, 1, 5)` | Count-based, stop সহ |
| Diagonal | `np.diag([1, 2, 3])` | Diagonal matrix |
| Identity | `np.eye(3)` | Identity matrix |
| Element | `a[0, 2]` | Row 0, col 2 |
| Slice | `a[:, 0:2]` | সব row, col 0–1 |
| Fancy | `a[[0, 3, 1]]` | Selected indices |
| Boolean | `a[a > 2]` | Condition filter |
| Safe copy | `a[1:4].copy()` | View এড়াতে |
| Iterate all | `np.nditer(a)` | Every element |

### One-line Mental Model

> **NumPy ndarray = same-type numbers-এর fast grid (vector/matrix/tensor) — loop ছাড়া পুরো array-তে একসাথে math করো।**
