*Bangla + English mixed notes.* — **1 hr 36 min | 11 Units**

> এই module-এ Python-এর important built-in data structures শিখব: **Tuple, Set, Dictionary**। এগুলো data organize, search এবং process করার জন্য খুব useful।

## Roadmap

1. Text Instructions (Module 05) — 1 min read
2. 5.0 Module Introduction — 2 min
3. 5.1 Tuples in Python — 15 min
4. 5.2 Sets in Python — 21 min
5. 5.3 Dictionary Basics — 11 min
6. 5.4 Dictionary Methods — 14 min
7. 5.5 Dictionary View Methods — 8 min
8. 5.6 Dictionary Comprehension — 8 min
9. 5.7 Problem solving with In Built Structures — 10 min
10. 5.8 Module Overview — 7 min
11. Extra Practice Problem (Module 05) — 1 min read

---

## 5.0 — Module Introduction

আগের module-এ আমরা List শিখেছি। এখন আরও তিনটি important structure: **Tuple, Set, Dictionary** — প্রতিটির কাজ আলাদা।

| Structure | Syntax | Main idea |
|---|---|---|
| List | `[1, 2, 3]` | Ordered collection, change করা যায় |
| Tuple | `(1, 2, 3)` | Ordered collection, change করা যায় না |
| Set | `{1, 2, 3}` | Unique values |
| Dictionary | `{"a": 1}` | Key → Value |

---

## 5.1 — Tuples in Python

### Tuple কী?

Tuple হলো ordered collection — List-এর মতো, কিন্তু **immutable** (change করা যায় না)।

```python
numbers = (10, 20, 30)
```

Index থাকে:

```text
10   20   30
 0    1    2
```

```text
numbers[0] → 10
```

### Tuple vs List

```python
numbers_list  = [10, 20, 30]   # List  → square bracket
numbers_tuple = (10, 20, 30)   # Tuple → parentheses
```

Main difference:

```text
List   → mutable
Tuple  → immutable
```

```python
numbers_list[0] = 100    # ✅ List-এ করা যায়
numbers_tuple[0] = 100   # ❌ TypeError — Tuple-এ করা যায় না
```

### কেন Tuple ব্যবহার করব?

যখন data change হওয়ার দরকার নেই।

```python
location = (23.8, 90.4)   # latitude, longitude pair
rgb = (255, 0, 0)         # red color
```

### Tuple unpacking

```python
person = ("Riaz", 27, "Dhaka")

name, age, city = person
```

এখন:

```text
name → "Riaz"
age  → 27
city → "Dhaka"
```

একটা line-এ multiple variable-এ value বসে যায় — এটা খুব useful।

### One-item tuple

একটা important syntax:

```python
x = (10,)   # Comma-এর কারণে এটা tuple
y = (10)    # এটা শুধু integer 10 — parentheses এখানে math-এর bracket
```

```text
type(x) → <class 'tuple'>
type(y) → <class 'int'>
```

---

## 5.2 — Sets in Python

### Set কী?

Set হলো এমন collection যেখানে **duplicate values থাকে না**।

```python
numbers = {1, 2, 3, 3, 4}
print(numbers)
```

Output:

```text
{1, 2, 3, 4}
```

Duplicate `3` একবারই থাকবে।

### Set কেন useful?

যখন আমাদের দরকার **unique values**।

```python
names = ["Riaz", "Hasib", "Riaz", "Fariya"]
print(set(names))
```

Output (order আলাদা হতে পারে):

```text
{'Riaz', 'Hasib', 'Fariya'}
```

> Set **unordered** — print করলে values কোন order-এ আসবে তার guarantee নেই।

### Set-এ index নেই

```python
numbers[0]   # ❌ Set-এ এভাবে access করা যায় না (TypeError)
```

কারণ set-এর মূল purpose হলো unique collection, position-based access না।

### `add()`

```python
numbers = {1, 2, 3}
numbers.add(4)
```

Result:

```text
{1, 2, 3, 4}
```

### `remove()` vs `discard()`

দুটোই value remove করে। পার্থক্য হলো value **না থাকলে**:

```python
numbers = {1, 2, 3, 4}

numbers.remove(2)     # ✅ 2 remove → {1, 3, 4}
numbers.remove(10)    # ❌ KeyError — 10 নেই

numbers.discard(10)   # ✅ কোনো error নেই, কিছুই হয় না
```

```text
remove()  → না থাকলে error
discard() → না থাকলে চুপচাপ ignore
```

### Set Operations

Set-এর mathematical operations খুব useful।

```python
A = {1, 2, 3, 4}
B = {3, 4, 5, 6}
```

| Operation | Code | মানে | Result |
|---|---|---|---|
| Union | `A \| B` | দুই set-এর সব unique values | `{1, 2, 3, 4, 5, 6}` |
| Intersection | `A & B` | দুই set-এ common values | `{3, 4}` |
| Difference | `A - B` | A-তে আছে, B-তে নেই | `{1, 2}` |
| Difference | `B - A` | B-তে আছে, A-তে নেই | `{5, 6}` |

### Mental picture

```text
        A                 B
   ┌─────────┬─────┬─────────┐
   │  1   2  │ 3 4 │  5   6  │
   └─────────┴─────┴─────────┘
     A - B     A & B   B - A
              (common)

   A | B = সব মিলিয়ে → {1, 2, 3, 4, 5, 6}
```

---

## 5.3 — Dictionary Basics

### Dictionary কী?

Dictionary data store করে:

> **Key → Value**

```python
person = {
    "name": "Riaz",
    "age": 27,
    "city": "Dhaka"
}
```

এখানে:

```text
"name" → "Riaz"
"age"  → 27
"city" → "Dhaka"
```

### Value access

```text
person["name"] → "Riaz"
person["age"]  → 27
```

Key না থাকলে `person["country"]` → ❌ `KeyError`

### কেন Dictionary useful?

যখন data-কে **meaningful name** দিয়ে access করতে চাই।

List:

```python
person = ["Riaz", 27, "Dhaka"]
person[1]   # এটা কী? দেখে বোঝা কঠিন
```

Dictionary:

```python
person["age"]   # অনেক clearer
```

### Add, Update, Delete

```python
person["job"] = "Developer"   # নতুন key add
person["age"] = 28            # existing key-এর value update
del person["city"]            # key delete
```

Result:

```text
{'name': 'Riaz', 'age': 28, 'job': 'Developer'}
```

> Key আগে না থাকলে `=` দিয়ে **add** হয়, থাকলে **update** হয় — একই syntax।

---

## 5.4 — Dictionary Methods

```python
person = {"name": "Riaz", "age": 27, "city": "Dhaka"}
```

### `get()`

Safe way-এ value access:

```text
person.get("name")                  → "Riaz"
person.get("country")               → None     (error দেয় না)
person.get("country", "Unknown")    → "Unknown" (default value)
```

```text
person["country"]      → ❌ KeyError
person.get("country")  → None
```

### `keys()`, `values()`, `items()`

```text
person.keys()    → সব keys
person.values()  → সব values
person.items()   → (key, value) pairs
```

Details পরের unit (5.5)-এ।

### `update()`

একাধিক value একসাথে update/add:

```python
person.update({
    "age": 28,
    "job": "Developer"
})
```

Result:

```text
{'name': 'Riaz', 'age': 28, 'city': 'Dhaka', 'job': 'Developer'}
```

### `pop()`

Specific key remove করে এবং তার **value return** করে:

```python
age = person.pop("age")
print(age)
```

Output:

```text
28
```

### `clear()`

সব item remove — dictionary empty হবে:

```python
person.clear()
print(person)
```

Output:

```text
{}
```

---

## 5.5 — Dictionary View Methods

Dictionary-এর `keys()`, `values()`, `items()` methods **view objects** return করে।

```python
person = {
    "name": "Riaz",
    "age": 27
}
```

```python
print(person.keys())
print(person.values())
print(person.items())
```

Output:

```text
dict_keys(['name', 'age'])
dict_values(['Riaz', 27])
dict_items([('name', 'Riaz'), ('age', 27)])
```

> View মানে dictionary-এর **live** দৃশ্য — dictionary change হলে view-ও automatically update হয়। List হিসেবে চাইলে: `list(person.keys())`

### Loop through dictionary

Keys (default loop keys দেয়):

```python
for key in person:
    print(key)
```

Values:

```python
for value in person.values():
    print(value)
```

Both:

```python
for key, value in person.items():
    print(key, value)
```

Output:

```text
name Riaz
age 27
```

---

## 5.6 — Dictionary Comprehension

List comprehension-এর মতো dictionary-ও concise way-এ তৈরি করা যায়।

```python
numbers = [1, 2, 3, 4]

squares = {x: x * x for x in numbers}
```

Result:

```text
{1: 1, 2: 4, 3: 9, 4: 16}
```

### Basic structure

```python
{key: value for item in iterable}
```

### Condition সহ

```python
numbers = [1, 2, 3, 4, 5]

even_squares = {x: x * x for x in numbers if x % 2 == 0}
```

Result:

```text
{2: 4, 4: 16}
```

---

## 5.7 — Problem Solving with In-Built Structures

Built-in data structures problem solving অনেক সহজ করে।

### Problem: Duplicate remove

```python
numbers = [1, 2, 2, 3, 3, 4]

unique = list(set(numbers))
print(unique)
```

Output:

```text
[1, 2, 3, 4]
```

Concept:

```text
List
 ↓
Set  (duplicates removed)
 ↓
List
```

> Set unordered, তাই এই trick-এ original order হারিয়ে যেতে পারে।

### Problem: Frequency count

```python
items = ["apple", "banana", "apple", "mango", "banana", "apple"]
```

আমাদের count দরকার:

```text
apple  → 3
banana → 2
mango  → 1
```

Dictionary দিয়ে:

```python
count = {}

for item in items:
    if item in count:
        count[item] += 1
    else:
        count[item] = 1

print(count)
```

Output:

```text
{'apple': 3, 'banana': 2, 'mango': 1}
```

Step by step:

```text
"apple"  → নেই → count["apple"] = 1
"banana" → নেই → count["banana"] = 1
"apple"  → আছে → count["apple"] = 2
"mango"  → নেই → count["mango"] = 1
"banana" → আছে → count["banana"] = 2
"apple"  → আছে → count["apple"] = 3
```

এটা খুব important problem-solving pattern।

`get()` দিয়ে আরও ছোট করা যায়:

```python
for item in items:
    count[item] = count.get(item, 0) + 1
```

### কোন structure কখন?

```text
Input data
    ↓
Choose suitable structure
    ↓
Process
    ↓
Store result
```

```text
Unique data          → Set
Key-value data       → Dictionary
Fixed group          → Tuple
Ordered mutable data → List
```

---

## 5.8 — Module Overview

```text
Tuple
 ↓
Immutable ordered data
 ↓
Set
 ↓
Unique values
 ↓
Dictionary
 ↓
Key → Value
 ↓
Dictionary Methods
 ↓
View Methods
 ↓
Dictionary Comprehension
 ↓
Problem Solving
```

---

## ML / Data Science Connection

### Tuple

Fixed grouped data:

```python
point = (10, 20)
```

### Set

Unique categories/labels:

```python
labels = ["cat", "dog", "cat", "bird"]
unique_labels = set(labels)   # {'cat', 'dog', 'bird'}
```

### Dictionary

Structured information:

```python
student = {
    "age": 27,
    "score": 85
}
```

Configuration এবং mapping-এর ক্ষেত্রেও dictionary খুব common — যেমন label → number mapping: `{"cat": 0, "dog": 1, "bird": 2}`।

---

## Common Confusions

### List vs Tuple

```text
List   → mutable
Tuple  → immutable
```

### List vs Set

```text
List → order/index important, duplicate থাকতে পারে
Set  → uniqueness important, order নেই
```

### Dictionary vs Set

দুটোই `{}` ব্যবহার করে, কিন্তু:

```text
Set        → {1, 2, 3}           শুধু values
Dictionary → {"a": 1, "b": 2}    key + value
```

> খালি `{}` হলো **empty dictionary**। Empty set বানাতে `set()` লিখতে হয়।

### `keys()` vs `values()` vs `items()`

```text
keys()   → keys
values() → values
items()  → key-value pairs
```

### `remove()` vs `pop()`

Structure অনুযায়ী behavior আলাদা:

```text
list.remove(value)  → value দিয়ে remove
list.pop(index)     → index দিয়ে remove + value return
set.remove(value)   → value remove (না থাকলে error)
dict.pop(key)       → key remove + value return
```

---

## Quick Practice

### Q1

```python
x = (10, 20, 30)
```

এটা কোন structure?

A. List  
B. Tuple  
C. Set

### Q2

```python
x = {1, 2, 2, 3}
```

শেষে unique values কয়টা থাকবে?

### Q3

```python
person = {"name": "Riaz", "age": 27}
```

Age access করার code কী?

### Q4

```python
A = {1, 2, 3}
B = {3, 4, 5}
```

`A & B` কী?

### Q5

Dictionary-এর কোন method key-value pairs দেয়?

A. `keys()`  
B. `values()`  
C. `items()`

### Q6

Duplicate remove করার জন্য কোন structure useful?

A. Set  
B. Tuple  
C. Dictionary

### Answers

1. **B — Tuple**
2. **3**
3. **`person["age"]`** (অথবা `person.get("age")`)
4. **`{3}`**
5. **C — `items()`**
6. **A — Set**

---

## Final Cheat Sheet

| Structure / Concept | Core idea |
|---|---|
| Tuple | Ordered + immutable |
| Set | Unique values, unordered |
| Union `A \| B` | All unique values |
| Intersection `A & B` | Common values |
| Difference `A - B` | Only in first set |
| Dictionary | Key → Value |
| `get()` | Safe value access |
| `keys()` | Keys |
| `values()` | Values |
| `items()` | Key-value pairs |
| `update()` | Add/update values |
| Dictionary comprehension | Short dictionary creation |
| Frequency count | Dictionary-based counting |

### One-line Mental Model

> **Tuple = fixed data, Set = unique data, Dictionary = named/key-value data।**
