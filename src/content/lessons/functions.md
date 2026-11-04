*Bangla + English mixed notes.* — **Python Module 06** (course lesson-by-lesson notes)

**Week 02: Python Foundations for Machine Learning 2** → **Module 06: Function Through the Lens of ML**

> 📓 **Class notebook:** `module-06-functions.ipynb` — [👁️ View](/ai/ml/notebooks/module-06-functions) / [⬇️ Download](/notebooks/module-06-functions.ipynb)

**1 hr 23 min | 15 units** (8 video lessons — 79 min, plus text instructions)

## Exact Course Roadmap

1. **6.1 Function** — 9 min
2. **6.2 Structure of a function – Parameters** — 8 min
3. **6.3 Structure of a func – Return and Doc** — 7 min
4. **6.4 Positional Arguments** — 7 min
5. **6.5 Keyword Arguments** — 8 min
6. **6.6 Return Type of a Function** — 14 min
7. **6.7 Iterator and Generator** — 15 min
8. **6.8 Lambda, Map and Apply function** — 11 min

---

## 6.1 Function

Function হলো reusable code-এর block, যেটা নির্দিষ্ট কাজ করে।

```python
def greet():
    print("Hello!")

greet()
```

Output: `Hello!`

- `def` দিয়ে function define হয়।
- `greet` function-এর নাম।
- `()` call করার সময় ব্যবহার হয়।
- `:` function body শুরু করে।
- Indentation-এর ভিতরের code function-এর অংশ।

একবার define করে অনেকবার call করা যায়। Function code reuse, repetition কমানো, code organize করা এবং বড় problem ছোট অংশে ভাগ করতে সাহায্য করে।

---

## 6.2 Structure of a Function — Parameters

Function বাইরের value receive করতে পারে।

```python
def greet(name):
    print("Hello", name)

greet("Riaz")
```

Output: `Hello Riaz`

- `name` হলো **parameter** — function definition-এর variable।
- `"Riaz"` হলো **argument** — function call-এর actual value।

Multiple parameters:

```python
def add(a, b):
    print(a + b)

add(10, 20)  # 30
```

Default parameter:

```python
def greet(name="Friend"):
    print("Hello", name)

greet()        # Hello Friend
greet("Riaz")  # Hello Riaz
```

---

## 6.3 Structure of a Function — Return and Doc

### `return`

`return` function থেকে result caller-এর কাছে পাঠায়।

```python
def add(a, b):
    return a + b

result = add(10, 20)
print(result)  # 30
```

### `print()` vs `return`

```python
def add_print(a, b):
    print(a + b)

def add_return(a, b):
    return a + b

x = add_print(2, 3)   # screen-এ 5 দেখায়
y = add_return(2, 3)  # y-এর মধ্যে 5 ফেরত আসে

print(x)  # None
print(y)  # 5
```

মনে রাখো: **print দেখায়, return value ফেরত দেয়।**

`return` execute হলে function সেখানেই শেষ হয়।

### Docstring

Function কী কাজ করে তা document করতে function-এর শুরুতে triple quotes ব্যবহার হয়:

```python
def square(number):
    """Return the square of a number."""
    return number * number

print(square.__doc__)
```

---

## 6.4 Positional Arguments

Positional arguments-এ value parameter-এর **position/order অনুযায়ী** assign হয়।

```python
def introduce(name, city):
    print(name, "lives in", city)

introduce("Riaz", "Dhaka")
```

Mapping:

```text
"Riaz"  → name (first parameter)
"Dhaka" → city (second parameter)
```

Order বদলালে value-ও অন্য parameter-এ যাবে।

```python
def subtract(a, b):
    return a - b

print(subtract(10, 3))  # 7
print(subtract(3, 10))  # -7
```

---

## 6.5 Keyword Arguments

Keyword arguments-এ parameter-এর নাম লিখে value পাঠানো হয়।

```python
def introduce(name, city):
    print(name, "lives in", city)

introduce(city="Dhaka", name="Riaz")
```

Output: `Riaz lives in Dhaka`

এখানে order বদলালেও parameter name-এর কারণে সঠিক value assign হয়।

Positional argument আগে, keyword argument পরে:

```python
def student(name, age, city):
    print(name, age, city)

student("Riaz", age=27, city="Dhaka")
```

---

## 6.6 Return Type of a Function

Python function বিভিন্ন ধরনের value return করতে পারে।

Integer:
```python
def get_age():
    return 27
```

String:
```python
def get_name():
    return "Riaz"
```

Boolean:
```python
def is_adult(age):
    return age >= 18

print(is_adult(27))  # True
```

List:
```python
def get_numbers():
    return [10, 20, 30]
```

Multiple values:
```python
def calculate(a, b):
    return a + b, a - b

result = calculate(10, 3)
print(result)  # (13, 7)
```

Python multiple returned values-কে tuple হিসেবে pack করে। Unpack করা যায়:

```python
total, difference = calculate(10, 3)
```

Explicit `return` না থাকলে function `None` return করে।

### Type hints

```python
def add(a: int, b: int) -> int:
    return a + b
```

এগুলো expected type বোঝায়; Python runtime-এ সবসময় type enforce করে না।

---

## 6.7 Iterator and Generator

### Iterable

যে object-এর item একটার পর একটা iterate করা যায়, সেটি iterable। Examples: list, string, tuple।

```python
for item in [10, 20, 30]:
    print(item)
```

### Iterator

Iterator হলো object যেটা `next()` দিয়ে একবারে একটি item দেয়।

```python
numbers = [10, 20, 30]
it = iter(numbers)

print(next(it))  # 10
print(next(it))  # 20
print(next(it))  # 30
```

সব item শেষ হলে `next()` সাধারণভাবে `StopIteration` exception দেয়।

```text
Iterable → যার উপর iterate করা যায়
Iterator → next() দিয়ে পরের item দেয়
```

### Generator

Generator হলো iterator তৈরির সহজ উপায়। Function-এর ভিতরে `yield` ব্যবহার করে।

```python
def count_up_to_three():
    yield 1
    yield 2
    yield 3

for number in count_up_to_three():
    print(number)
```

Output: `1, 2, 3`

#### `return` vs `yield`

- `return` function শেষ করে result ফেরত দেয়।
- `yield` একটি value দেয়, function-এর state রেখে pause করে; পরে আবার resume হয়।

Generator বড় data-র item প্রয়োজন অনুযায়ী produce করতে পারে, তাই memory efficient হতে পারে।

---

## 6.8 Lambda, Map and Apply Function

### Lambda

Lambda হলো ছোট anonymous function।

```python
square = lambda x: x * x
print(square(5))  # 25
```

Structure: `lambda parameters: expression`

Multiple parameters:

```python
add = lambda a, b: a + b
print(add(3, 4))  # 7
```

ছোট expression-এর জন্য lambda useful; complex logic-এর জন্য normal `def` বেশি readable।

### `map()`

`map()` iterable-এর প্রতিটি item-এর উপর একটি function apply করে।

```python
numbers = [1, 2, 3, 4]
squares = map(lambda x: x * x, numbers)

print(list(squares))
```

Output: `[1, 4, 9, 16]`

`map()` Python 3-এ iterator return করে; result দেখতে `list()` দিয়ে convert করেছি।

### Apply function — Important distinction

Screenshot-এ lesson title “Lambda, Map and Apply function”।

Python 3-এ পুরোনো built-in `apply()` function নেই (এটি Python 2-এ ছিল)। Data analysis-এ **Pandas `.apply()` method** ব্যবহার হয়:

```python
import pandas as pd

numbers = pd.Series([1, 2, 3, 4])
squares = numbers.apply(lambda x: x * x)

print(squares)
```

এখানে `.apply()` হলো Pandas-এর method, Python built-in `apply()` নয়।

---

## 🧠 Full Mental Model

```text
Function → reusable code
    ↓
Parameters receive input
    ↓
Arguments are passed
    ↓
Return sends result back
    ↓
Positional / Keyword arguments
    ↓
Function returns different types
    ↓
Iterator gives items one by one
    ↓
Generator produces items using yield
    ↓
Lambda creates short function
    ↓
map / apply transforms data
```

---

## 🔗 ML / Data Science Connection

Functions data science-এ বারবার ব্যবহার হয়:

- Data cleaning
- Feature transformation
- Reusable preprocessing
- Custom calculations
- Iterating through datasets
- Applying transformations to columns

Example:

```python
def normalize(value, maximum):
    return value / maximum

scores = [20, 40, 60, 80, 100]
normalized = list(map(lambda x: normalize(x, 100), scores))

print(normalized)
```

Output: `[0.2, 0.4, 0.6, 0.8, 1.0]`

---

## ❗ Common Confusions

| Concept | মনে রাখবে |
|---|---|
| Function definition | `def` দিয়ে তৈরি |
| Function call | Function name দিয়ে execute |
| Parameter | Definition-এর variable |
| Argument | Call-এর actual value |
| `print()` | Screen-এ দেখায় |
| `return` | Value ফেরত দেয় |
| Positional | Position অনুযায়ী assign |
| Keyword | Name অনুযায়ী assign |
| Iterable | যার উপর iterate করা যায় |
| Iterator | `next()` দিয়ে item দেয় |
| Generator | `yield` দিয়ে item produce |
| Lambda | ছোট anonymous function |
| `map()` | Iterable-এর প্রতিটি item transform |
| Pandas `.apply()` | Pandas data-তে function apply |

---

## 📝 Quick Practice

**Q1**
```python
def greet():
    print("Hello")
greet()
```
Output কী?

**Q2**
```python
def double(x):
    return x * 2
print(double(6))
```
Output কত?

**Q3** `print()` এবং `return`-এর main difference কী?

**Q4**
```python
def subtract(a, b):
    return a - b
print(subtract(10, 4))
```
Output কত?

**Q5**
```python
def introduce(name, city):
    print(name, city)
introduce(city="Dhaka", name="Riaz")
```
কী print হবে?

**Q6** `return [1, 2, 3]` করলে return type কী?

**Q7**
```python
items = iter([10, 20, 30])
print(next(items))
```
Output কী?

**Q8** Generator-এ value produce করতে কোন keyword লাগে?

A. `return`  B. `yield`  C. `print`

**Q9**
```python
double = lambda x: x * 2
print(double(5))
```
Output?

**Q10**
```python
list(map(lambda x: x + 1, [1, 2, 3]))
```
Result?

### Answers

1. `Hello`
2. `12`
3. `print()` screen-এ দেখায়; `return` value caller-এর কাছে ফেরত দেয়।
4. `6`
5. `Riaz Dhaka`
6. `list`
7. `10`
8. **B — `yield`**
9. `10`
10. `[2, 3, 4]`

---

## 🎯 Final Cheat Sheet

| Topic | Core idea |
|---|---|
| Function | Reusable code block |
| `def` | Function define |
| Parameter | Function-এর input variable |
| Argument | Call-এর value |
| `return` | Result ফেরত |
| Docstring | Function documentation |
| Positional | Position অনুযায়ী argument |
| Keyword | Name অনুযায়ী argument |
| Return type | Function কী value দেয় |
| Iterable | Iterate করা যায় |
| Iterator | একবারে একটি item দেয় |
| Generator | `yield` দিয়ে item produce |
| Lambda | ছোট anonymous function |
| `map()` | প্রতিটি item transform |
| Pandas `.apply()` | Pandas data-তে function apply |

### One-line Mental Model

> **Function = reusable logic; parameters দিয়ে input নেয়, return দিয়ে output দেয়, আর iterator/generator/map দিয়ে data step-by-step process করা যায়।**
