*Bangla + English mixed notes.* — **Python Module 06**

> 📓 **Class notebook:** `module-06-functions.ipynb` — [👁️ View](/ai/ml/notebooks/module-06-functions) / [⬇️ Download](/notebooks/module-06-functions.ipynb)

> এই module-এ **Functions** শিখব — কীভাবে code-কে reusable block বানাতে হয়, input নিতে হয়, output return করতে হয়। তারপর iterator, generator, lambda, এবং `map` / `filter` / `reduce` দিয়ে data process করা শিখব।

## Roadmap

1. 6.1 Defining a Function
2. 6.2 Function Parameters (Input)
3. 6.3 `*args` and `**kwargs`
4. 6.4 `return` (Output)
5. 6.5 Iterator
6. 6.6 Generator
7. 6.7 Lambda Function
8. 6.8 `map()`
9. 6.9 `filter()`
10. 6.10 `reduce()`

### 🎯 Module Goal

Function হলো একটা **machine** এর মতো:

```text
Input (parameters)
      ↓
  [ Function ]
      ↓
Output (return)
```

Main concepts:

- `def` দিয়ে function বানানো
- Default, positional, keyword arguments
- `*args`, `**kwargs`
- `return` এবং multiple values return
- `iter()` / `next()`
- `yield` দিয়ে generator
- `lambda`
- `map`, `filter`, `reduce`

---

## 6.1 — Defining a Function

### Function কী?

Function হলো reusable code block যেটা একটা নির্দিষ্ট কাজ করে। একবার লিখে বারবার call করা যায়।

```python
def greet():
    print("hello")
```

এখানে:

```text
def     → function define করার keyword
greet   → function-এর নাম
()      → parameters (এখানে নেই)
:       → এরপর indented body
```

শুধু define করলে কিছু হয় না। Function **call** করতে হয়:

```python
greet()
```

```text
hello
```

`greet()` লিখলেই function-এর body execute হয়।

---

## 6.2 — Function Parameters (Input)

### Parameter with default value

```python
def greet(user="guest"):
    print(f"hello {user}")
```

```python
greet("adil")
```

```text
hello adil
```

`user="guest"` হলো **default value**। কোনো argument না দিলে `greet()` → `hello guest` print করবে।

### Positional vs Keyword argument

```python
def square_addition(a, b, c):
    print(f"{a} {b} {c}")
    a = a ** 2
    b = b ** 2
    return a + b + c

# positional argument
ans = square_addition(10, 20, 30) + 10
print(ans)

# keyword argument
ans = square_addition(b=10, c=20, a=30) + 10
print(ans)
```

```text
10 20 30
540
30 10 20
1030
```

- **Positional** → order অনুযায়ী value বসে: `a=10, b=20, c=30` → `100 + 400 + 30 + 10 = 540`।
- **Keyword** → নাম ধরে value বসে, order matter করে না: `a=30, b=10, c=20` → `900 + 100 + 20 + 10 = 1030`।

```text
square_addition(10, 20, 30)        → a=10, b=20, c=30   (position দিয়ে)
square_addition(b=10, c=20, a=30)  → a=30, b=10, c=20   (name দিয়ে)
```

---

## 6.3 — `*args` and `**kwargs`

### `*args` — যত খুশি positional argument

কতগুলো input আসবে জানা না থাকলে `*args` ব্যবহার করি। সব values একটা **tuple** হিসেবে আসে।

```python
def square_addition(*args):
    summation = 0
    for i in args:
        i = i ** 2
        summation += i
    return summation
```

```python
ans = square_addition(10, 20, 30, 40, 50)
print(ans)
```

```text
5500
```

```text
args → (10, 20, 30, 40, 50)
100 + 400 + 900 + 1600 + 2500 = 5500
```

### `**kwargs` — যত খুশি keyword argument

`**kwargs` সব `name=value` pairs একটা **dictionary** হিসেবে নেয়।

```python
def student(**kwargs):
    for key, val in kwargs.items():
        print(f"{key} : {val}")
```

```python
student(name="adil", cls=10, roll=30, marks=30.5)
```

```text
name : adil
cls : 10
roll : 30
marks : 30.5
```

```text
kwargs → {"name": "adil", "cls": 10, "roll": 30, "marks": 30.5}
```

| Syntax | কী নেয় | ভিতরে type |
|---|---|---|
| `*args` | Extra positional values | `tuple` |
| `**kwargs` | Extra keyword values | `dict` |

---

## 6.4 — `return` (Output)

`return` function থেকে value **বাইরে পাঠায়**। `print` শুধু screen-এ দেখায়, কিন্তু `return` করা value আমরা variable-এ রাখতে পারি।

### Return int

```python
def give_prediction():
    return 10

type(give_prediction())
```

```text
int
```

### Return float

```python
def give_prediction():
    return 10.5

type(give_prediction())
```

```text
float
```

### Return string

```python
def give_prediction():
    return "name"

type(give_prediction())
```

```text
str
```

Function যে type-এর value return করে, call-এর result সেই type-এর হয়।

### Multiple values return + unpacking

```python
def give_prediction(a, b):
    return a, b

print(type(give_prediction(10, 30)))
print(give_prediction(10, 30))

# unpacking
x, y = give_prediction(10, 30)
print(x, y)
```

```text
<class 'tuple'>
(10, 30)
10 30
```

`return a, b` আসলে একটা **tuple** return করে। `x, y = ...` দিয়ে tuple-কে আলাদা variables-এ **unpack** করা যায়।

### Return multiple lists

```python
def give_prediction():
    a = [10, 20, 30]
    b = [20, 30, 40]
    return a, b

# unpacking
x, y = give_prediction()

print(x)
print(y)
```

```text
[10, 20, 30]
[20, 30, 40]
```

যেকোনো type return করা যায় — list-ও।

### Return a set and a list

```python
def give_prediction():
    a = {10, 20, 30}
    b = [100, 200, 300]
    return a, b

x = give_prediction()

print(type(x))

for item in x:
    print(item)
```

```text
<class 'tuple'>
{10, 20, 30}
[100, 200, 300]
```

Unpack না করলে পুরো result একটা tuple — তাই loop চালিয়ে প্রতিটা item পাওয়া যায়।

### Return dictionaries

```python
def give_prediction():
    return {"name": "adil", "addr": "Ctg"}, {"name": "abrar", "addr": "dhaka"}

x, y = give_prediction()

print(type(x))

for item in x.items():
    print(item)
```

```text
<class 'dict'>
('name', 'adil')
('addr', 'Ctg')
```

দুইটা dictionary return হয়েছে; `x` হলো প্রথমটা। `.items()` প্রতিটা `(key, value)` pair দেয়।

---

## 6.5 — Iterator

**Iterable** (list, set, string…) থেকে `iter()` দিয়ে **iterator** বানানো যায়। Iterator একবারে **একটা করে** item দেয় `next()` call করলে।

```python
s = {10, 20, 30, 40, 50}

s_iter = iter(s)
print(next(s_iter))
print(next(s_iter))
print(next(s_iter))
print(next(s_iter))
print(next(s_iter))

for i in s:
    print(i)
```

```text
50
20
40
10
30
50
20
40
10
30
```

- Set unordered, তাই order `10, 20, 30…` না হয়ে অন্যরকম এসেছে।
- `for` loop আসলে ভিতরে ভিতরে এই `iter()` + `next()` ই ব্যবহার করে।
- সব item শেষ হলে আবার `next()` call করলে `StopIteration` error আসে।

```text
iter(s)  → iterator তৈরি
next()   → পরের item
শেষ হলে → StopIteration
```

---

## 6.6 — Generator

Generator হলো এমন function যেটা `return`-এর বদলে **`yield`** ব্যবহার করে। এটা সব data একসাথে memory-তে না রেখে **দরকার মতো একটা একটা chunk** দেয়।

ML-এ বড় dataset batch-এ batch-এ load করতে এটা খুব useful (data loader)।

```python
lst = [x for x in range(500)]  # dataset

def data_loader(chunk_size, lst):
    for i in range(0, len(lst), chunk_size):
        yield lst[i:i + chunk_size]

x = data_loader(5, lst)

print(next(x))
print(next(x))
```

```text
[0, 1, 2, 3, 4]
[5, 6, 7, 8, 9]
```

প্রতিবার `next(x)` call করলে function আগের জায়গা থেকে resume করে এবং পরের 5টা item `yield` করে।

```text
return → একবার value দিয়ে function শেষ
yield  → value দেয়, pause করে, পরে আবার continue
```

---

## 6.7 — Lambda Function

Lambda হলো **ছোট, একলাইনের, নামহীন (anonymous)** function।

```python
def square_addition(x, y):
    return x ** 2 + y ** 2

sq_add = lambda x, y: x ** 2 + y ** 2

print(sq_add(2, 3))
```

```text
13
```

উপরের `def` version আর `lambda` version একই কাজ করে: `2² + 3² = 4 + 9 = 13`।

```text
lambda parameters : expression
```

Lambda-তে শুধু **একটা expression** থাকে, এবং সেটাই auto return হয়।

---

## 6.8 — `map()`

`map(function, iterable)` → iterable-এর **প্রতিটা item-এ function apply** করে।

### map with normal function

```python
lst = [1, 2, 3, 4, 5, 6]

def square(x):
    return x ** 2

lst = list(map(square, lst))

print(lst)
```

```text
[1, 4, 9, 16, 25, 36]
```

`map` একটা lazy object দেয়, তাই `list()` দিয়ে list বানাতে হয়।

### map on a string

```python
string = "hello world, welcome to the age of AI"
string1 = list(map(str.upper, string))
print(string1)
string1 = " ".join(string1)
print(string1)
```

```text
['H', 'E', 'L', 'L', 'O', ' ', 'W', 'O', 'R', 'L', 'D', ',', ' ', 'W', 'E', 'L', 'C', 'O', 'M', 'E', ' ', 'T', 'O', ' ', 'T', 'H', 'E', ' ', 'A', 'G', 'E', ' ', 'O', 'F', ' ', 'A', 'I']
H E L L O   W O R L D ,   W E L C O M E   T O   T H E   A G E   O F   A I
```

String-এর প্রতিটা character-এ `str.upper` apply হয়েছে। `" ".join` প্রতিটা character-এর মাঝে space বসায় — `"".join` দিলে আবার normal sentence পাওয়া যেত।

### map with lambda

```python
lst = [1, 2, 3, 4, 5, 6]

lst = list(map(lambda x: x ** 2, lst))

print(lst)
```

```text
[1, 4, 9, 16, 25, 36]
```

আলাদা `def` না লিখে সরাসরি lambda দিয়েই কাজ হয়ে গেছে।

---

## 6.9 — `filter()`

`filter(function, iterable)` → যেসব item-এর জন্য function **True** দেয়, শুধু সেগুলো রাখে।

### Numbers filter

```python
numbers = [x for x in range(100)]

# even
even = list(filter(lambda x: x % 2 == 0, numbers))
# print(even)

fifty_upper = list(filter(lambda x: x > 50, numbers))

print(fifty_upper)
```

```text
[51, 52, 53, 54, 55, 56, 57, 58, 59, 60, ..., 95, 96, 97, 98, 99]
```

`even` → শুধু জোড় সংখ্যা; `fifty_upper` → 50-এর বড় সংখ্যা।

### `filter(None, ...)` — falsy values বাদ

```python
data = [0, 1, '', None, 'Hello', [], [1, 2], None, True, False, None]

cleaned_data = list(filter(None, data))

print(cleaned_data)
```

```text
[1, 'Hello', [1, 2], True]
```

Function-এর জায়গায় `None` দিলে **falsy** values (`0`, `''`, `None`, `[]`, `False`) বাদ যায়। Data cleaning-এ useful।

### String filter — vowels

```python
# string1 আগের map example থেকে আসা uppercase string
vowel_ = list(filter(lambda x: x in "AEIOU", string1))

print(vowel_)
```

```text
['E', 'O', 'O', 'E', 'O', 'E', 'O', 'E', 'A', 'E', 'O', 'A', 'I']
```

String-এর প্রতিটা character check হয়েছে — vowel হলে রাখা হয়েছে।

### Length দিয়ে filter

```python
fruits = ['aaa', 'bb', 'cccc', 'ddddd']

filtering = list(filter(lambda x: len(x) > 2, fruits))

print(filtering)
```

```text
['aaa', 'cccc', 'ddddd']
```

`'bb'`-এর length 2, তাই বাদ পড়েছে।

---

## 6.10 — `reduce()`

`reduce` পুরো list-কে **একটা single value**-তে নিয়ে আসে — দুইটা দুইটা করে combine করে। এটা `functools` থেকে import করতে হয়।

```python
from functools import reduce
```

### Sum

```python
lst = [1, 2, 3, 4, 5, 6]

summation = reduce(lambda x, y: x + y, lst)

print(summation)
```

```text
21
```

```text
1 + 2 = 3
3 + 3 = 6
6 + 4 = 10
10 + 5 = 15
15 + 6 = 21
```

### Max value

```python
lst = [1, 2, 10, 4, 5, 6]

max_value = reduce(lambda x, y: x if x > y else y, lst)

print(max_value)
```

```text
10
```

প্রতিবার দুইটার মধ্যে বড়টা রাখে — শেষে সবচেয়ে বড় value থাকে।

### Strings join

```python
lst = ["hello", "world", "welcome", "to", "programming"]
print(lst)
```

```text
['hello', 'world', 'welcome', 'to', 'programming']
```

```python
string = reduce(lambda x, y: x + " " + y, lst)
print(string)
```

```text
hello world welcome to programming
```

Words গুলো space দিয়ে জোড়া লেগে একটা sentence হয়েছে।

---

## Common Confusions

### `print` vs `return`

```text
print  → শুধু screen-এ দেখায়, value বাইরে যায় না
return → value বাইরে পাঠায়, variable-এ রাখা যায়
```

`return` না থাকলে function automatically `None` return করে।

### Parameter vs Argument

```text
def greet(user):   → user = parameter (definition-এ)
greet("adil")      → "adil" = argument (call-এ)
```

### `*args` vs `**kwargs`

```text
*args    → tuple   (10, 20, 30)
**kwargs → dict    {"name": "adil"}
```

### `return` vs `yield`

```text
return → সব একবারে দেয়, function শেষ
yield  → একটা একটা করে দেয়, pause/resume
```

### `map` vs `filter` vs `reduce`

```text
map    → প্রতিটা item transform     (same length)
filter → কিছু item বাদ দেয়         (ছোট বা same length)
reduce → সব মিলিয়ে একটা value     (single value)
```

### `map`/`filter` কেন `list()` দিয়ে wrap করি?

এরা lazy object return করে। `list()` না দিলে print করলে `<map object at ...>` দেখাবে।

---

## Quick Practice

### Q1

```python
def add(a, b=5):
    return a + b

print(add(10))
```

Output?

### Q2

```python
def f(*args):
    return len(args)

print(f(1, 2, 3, 4))
```

Output?

### Q3

```python
def f():
    return 1, 2

print(type(f()))
```

Output?

### Q4

```python
print(list(map(lambda x: x * 10, [1, 2, 3])))
```

Output?

### Q5

```python
print(list(filter(lambda x: x % 2 == 1, [1, 2, 3, 4, 5])))
```

Output?

### Q6

```python
from functools import reduce
print(reduce(lambda x, y: x * y, [1, 2, 3, 4]))
```

Output?

### Q7

Function-এর ভিতরে `yield` থাকলে সেটাকে কী বলে?

### Answers

1. **15**
2. **4**
3. **`<class 'tuple'>`**
4. **`[10, 20, 30]`**
5. **`[1, 3, 5]`**
6. **24**
7. **Generator**

---

## Final Cheat Sheet

| Concept | Core idea |
|---|---|
| `def` | Function define |
| Default parameter | `def f(x=1)` — value না দিলে default |
| Positional argument | Order অনুযায়ী বসে |
| Keyword argument | নাম দিয়ে বসে, order matter করে না |
| `*args` | Extra positional → tuple |
| `**kwargs` | Extra keyword → dict |
| `return` | Value বাইরে পাঠায় |
| `return a, b` | Tuple return → unpack করা যায় |
| `iter()` / `next()` | একটা একটা item নেওয়া |
| Generator (`yield`) | Lazy, chunk-by-chunk data |
| `lambda` | One-line anonymous function |
| `map(f, data)` | প্রতিটা item-এ f apply |
| `filter(f, data)` | True হওয়া item রাখে |
| `filter(None, data)` | Falsy values বাদ |
| `reduce(f, data)` | সব মিলিয়ে single value |

### One-line Mental Model

> **Function = input নিয়ে কাজ করে output দেওয়া reusable machine; `map`/`filter`/`reduce` = সেই machine-কে পুরো data-র উপর চালানো।**
