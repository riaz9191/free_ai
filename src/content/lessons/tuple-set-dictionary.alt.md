*Version 2 — Class notebook code walkthrough (Python Module 05).*

> 📓 **Class notebook:** `module-05-tuple-set-dictionary.ipynb` — [👁️ View](/ai/ml/notebooks/module-05-tuple-set-dictionary) / [⬇️ Download](/notebooks/module-05-tuple-set-dictionary.ipynb)

> Version 1-এ Tuple, Set, Dictionary-র concept দেখেছি। এখানে class notebook-এর **সব code cell** clean করে run করা হয়েছে — code, output, আর ছোট explanation।

## Roadmap

1. Tuples
2. Set
3. Set Mathematical Methods
4. Dictionaries in Python
5. Iterating over Dictionary
6. Dictionary Comprehension
7. Problem Solving with In-Built Structures

---

## Tuples

### Declaration

```python
tup = (10, 20, 30, 40)

float_tup = (10.5, 10.2)
mixed_tup = (10, 10.5, "str", True)

lst = [10, 20, 30]

tup1 = tuple(lst)    # list থেকে tuple-এ convert

print(type(tup1), tup1)
```

```text
<class 'tuple'> (10, 20, 30)
```

Tuple লেখা হয় `()` দিয়ে, যেকোনো type রাখা যায়। `tuple(lst)` দিয়ে list-কে tuple বানানো যায়।

### Access — indexing আর slicing

```python
tup = (10, 20, 30, 10.5, "str", False)

# index
print(tup[3])

# slicing
new_tup = tup[0:3]
print(new_tup)
```

```text
10.5
(10, 20, 30)
```

List-এর মতোই indexing/slicing — আর slicing করলে নতুন একটা tuple পাওয়া যায়।

### Mutable vs Immutable

```python
# list — mutable
lst = [10, 20, 30, 40]
lst.append(60)
lst[1] = 100
print(lst)

# tuple — immutable
tup = (10, 20, 30, 40)
try:
    tup[1] = 100
except TypeError as e:
    print("TypeError:", e)
```

```text
[10, 100, 30, 40, 60]
TypeError: 'tuple' object does not support item assignment
```

List-এ value বদলানো যায়, tuple-এ যায় না। Notebook-এ এই cell ইচ্ছা করে error দেখানোর জন্য ছিল — এখানে `try/except` দিয়ে error message print করা হয়েছে যাতে cell crash না করে।

### Tuple methods

```python
tup = (10, 20, 30, 40, 10, 20, 30, 10)

print(tup.count(10))   # 10 কতবার আছে
print(tup.index(40))   # 40 প্রথম কোন index-এ
```

```text
3
3
```

Tuple immutable বলে method মাত্র দুইটা: `count()` আর `index()`।

---

## Set

### Declaration

```python
A = {1, 2, 3}

print(type(A), A)
```

```text
<class 'set'> {1, 2, 3}
```

Set লেখা হয় `{}` দিয়ে — duplicate রাখে না, order-ও guarantee করে না।

### Empty structures

```python
B = []
print(type(B))

C = ()
print(type(C))

S = set()
print(type(S))
```

```text
<class 'list'>
<class 'tuple'>
<class 'set'>
```

Empty set বানাতে অবশ্যই `set()` লিখতে হবে — শুধু `{}` লিখলে সেটা empty **dictionary** হয়।

### Membership check আর iteration

```python
S = {1, 2, 3, 4, 1, 2}   # duplicate 1, 2 বাদ পড়ে যাবে

if 10 in S:
    print("10 is present")
else:
    print("not present")

total = 0

for element in S:
    total += element

print(total)
```

```text
not present
10
```

`in` দিয়ে set-এ খুব দ্রুত search হয়। Duplicate বাদ যাওয়ায় set আসলে `{1, 2, 3, 4}`, তাই যোগফল `10`।

> Notebook-এ check হচ্ছিল `10 in S` কিন্তু message ছিল `"3 is present"` — message ঠিক করা হয়েছে। আর `sum` built-in নাম, তাই variable-এর নাম `total` রাখা হয়েছে।

### Set mutable — `add`, `pop`, `remove`

```python
s = {5, 1, 2, 4, 3}

s.add(10)
s.add(0)
print(s)

s.pop()
s.pop()
print(s)

s.remove(5)
print(s)
```

```text
{0, 1, 2, 3, 4, 5, 10}
{2, 3, 4, 5, 10}
{2, 3, 4, 10}
```

`add()` element যোগ করে, `remove(5)` নির্দিষ্ট element মুছে দেয়। `pop()` একটা **arbitrary** element মুছে — এখানে `0` আর `1` গেছে, কিন্তু সবসময় এটা guarantee না।

---

## Set Mathematical Methods

```python
a = {1, 2, 3}
b = {1, 2, 5, 6, 4}

print(a.union(b))
print(a.intersection(b))
print(a.isdisjoint(b))
print(a.issubset(b))
```

```text
{1, 2, 3, 4, 5, 6}
{1, 2}
False
False
```

`union` = দুই set-এর সব element; `intersection` = common element। `isdisjoint` False কারণ `1, 2` common আছে; `issubset` False কারণ `3` `b`-তে নেই।

```text
a | b            → {1, 2, 3, 4, 5, 6}
a & b            → {1, 2}
a - b            → {3}
a.issubset(b)    → False
```

---

## Dictionaries in Python

### Declaration

```python
# empty dictionary
dic = {}
print(type(dic))

dic = {"name": "Phitron", "age": 20, "address": "Dhaka", "numbers": [10, 20, 30]}

print(type(dic), dic)
```

```text
<class 'dict'>
<class 'dict'> {'name': 'Phitron', 'age': 20, 'address': 'Dhaka', 'numbers': [10, 20, 30]}
```

Dictionary হলো **key: value** pair-এর collection। Value যেকোনো type হতে পারে — এমনকি list-ও।

### Access আর update

```python
# access: dic_name[key]
print(dic["numbers"])
print(dic.get("age"))

dic["name"] = "Phitron AI/ML"   # existing key-এর value update
print(dic["name"])

# duplicate key দিলে শেষের value-টাই থাকে
dic = {"name": "Phitron", "age": 20, "address": "Dhaka", "numbers": [10, 20, 30], "age": 30}
print(dic)
```

```text
[10, 20, 30]
20
Phitron AI/ML
{'name': 'Phitron', 'age': 30, 'address': 'Dhaka', 'numbers': [10, 20, 30]}
```

Key unique — একই key (`"age"`) দুইবার লিখলে পরেরটা (`30`) আগেরটাকে overwrite করে। (Update-এর result দেখাতে `print(dic["name"])` line-টা যোগ করা হয়েছে।)

### Default value — `get()`

```python
print(dic)

print(dic.get("math_marks"))
print(dic.get("math_marks", 0))
```

```text
{'name': 'Phitron', 'age': 30, 'address': 'Dhaka', 'numbers': [10, 20, 30]}
None
0
```

Key না থাকলে `dic["math_marks"]` error (`KeyError`) দিত, কিন্তু `get()` দেয় `None` — অথবা আমাদের দেওয়া default value (`0`)।

### Adding a value

```python
dic = {"name": "Phitron", "age": 20, "address": "Dhaka", "numbers": [10, 20, 30], "age": 30}
print(dic)

dic["math_marks"] = 30
print(dic)

dic.update({"english_marks": 40})
print(dic)
```

```text
{'name': 'Phitron', 'age': 30, 'address': 'Dhaka', 'numbers': [10, 20, 30]}
{'name': 'Phitron', 'age': 30, 'address': 'Dhaka', 'numbers': [10, 20, 30], 'math_marks': 30}
{'name': 'Phitron', 'age': 30, 'address': 'Dhaka', 'numbers': [10, 20, 30], 'math_marks': 30, 'english_marks': 40}
```

নতুন key-তে value assign করলেই add হয়ে যায়। `update()` দিয়ে একসাথে এক বা একাধিক pair add/update করা যায়।

### Deleting

```python
del dic["math_marks"]
print(dic)
```

```text
{'name': 'Phitron', 'age': 30, 'address': 'Dhaka', 'numbers': [10, 20, 30], 'english_marks': 40}
```

`del dic[key]` দিয়ে নির্দিষ্ট key-value pair মুছে ফেলা যায়।

### Copy

```python
dic_2 = dic.copy()
print(dic_2)
```

```text
{'name': 'Phitron', 'age': 30, 'address': 'Dhaka', 'numbers': [10, 20, 30], 'english_marks': 40}
```

`copy()` একটা নতুন dictionary বানায় — `dic_2`-তে key add/delete করলে `dic` বদলাবে না। (তবে এটা shallow copy: ভিতরের `numbers` list দুইটাই share করে।)

### Testing — dictionary কি key হতে পারে?

```python
try:
    dic_3 = {{"name": "adil", "age": 20}: 20}
    print(dic_3)
except TypeError as e:
    print("TypeError:", e)

# immutable tuple key হিসেবে চলে
dic_4 = {("adil", 20): 20}
print(dic_4)
```

```text
TypeError: unhashable type: 'dict'
{('adil', 20): 20}
```

Key অবশ্যই **hashable** (immutable) হতে হবে — `dict` বা `list` key হতে পারে না, কিন্তু `str`, `int`, `tuple` পারে। Notebook-এ এটা error দেখানোর test cell ছিল; এখানে `try/except` আর একটা tuple-key উদাহরণ যোগ করা হয়েছে।

---

## Iterating over Dictionary

### View methods — `keys()`, `values()`, `items()`

```python
dic = {"name": "Phitron", "age": 20, "address": "Dhaka", "numbers": [10, 20, 30], "age": 30}

keys = dic.keys()
print(keys)

dic["math_marks"] = 30
print(keys)

values = dic.values()
print(values)

dic["math_marks"] = 40
print(values)

items = dic.items()
print(items)
```

```text
dict_keys(['name', 'age', 'address', 'numbers'])
dict_keys(['name', 'age', 'address', 'numbers', 'math_marks'])
dict_values(['Phitron', 30, 'Dhaka', [10, 20, 30], 30])
dict_values(['Phitron', 30, 'Dhaka', [10, 20, 30], 40])
dict_items([('name', 'Phitron'), ('age', 30), ('address', 'Dhaka'), ('numbers', [10, 20, 30]), ('math_marks', 40)])
```

এগুলো **view object** — dictionary বদলালে view নিজে থেকেই update হয়। দেখো, `keys` আবার assign না করেও নতুন `math_marks` দেখাচ্ছে।

> Notebook-এ key-এর নামে typo ছিল (`math_numebers`) — এখানে `math_marks` করা হয়েছে।

### `for` loop দিয়ে key, value

```python
for key, value in dic.items():
    print(key, value)
```

```text
name Phitron
age 30
address Dhaka
numbers [10, 20, 30]
math_marks 40
```

`items()` প্রতিবার একটা `(key, value)` tuple দেয়, যেটা loop-এ দুইটা variable-এ unpack হয়।

---

## Dictionary Comprehension

### Even number-এর square

```python
square = {x: x**2 for x in range(1, 11) if x % 2 == 0}

print(square)
```

```text
{2: 4, 4: 16, 6: 36, 8: 64, 10: 100}
```

Pattern: `{key_expr: value_expr for x in iterable if condition}`। এখানে শুধু even `x` নিয়ে `x: x²` pair বানানো হয়েছে।

### `zip()` দিয়ে দুইটা list জোড়া

```python
coordinates = [(10, 10.5), (20.5, 192), (101, 102)]
locations = ["dhaka", "chattogram", "sylhet"]

exact_location = {co_or: loc for co_or, loc in zip(coordinates, locations)}

print(exact_location)
```

```text
{(10, 10.5): 'dhaka', (20.5, 192): 'chattogram', (101, 102): 'sylhet'}
```

`zip()` দুইটা list-এর same index-এর element জোড়া বানায়। Coordinate tuple immutable, তাই সেটা key হতে পেরেছে।

---

## Problem Solving with In-Built Structures

### 1. List থেকে unique values

**Task:** একটা list of numbers দেওয়া আছে — শুধু unique value নিয়ে নতুন list বানাও।

```python
lst = [10, 20, 10, 30, 30, 50, 30, 10, 20, 10, 10]

unique_values = set(lst)     # set-এ convert — duplicate বাদ

lst = list(unique_values)    # আবার list-এ ফেরত

print(lst)
```

```text
[10, 20, 50, 30]
```

`set()` automatically duplicate বাদ দেয়। তবে set-এর order guarantee নেই — sorted চাইলে `sorted(set(lst))` লেখো।

### 2. String-এ word frequency

**Task:** একটা string দেওয়া আছে — প্রতিটা word কতবার এসেছে print করো।

```python
text = """data science machine learning data analysis machine
learning statistics data models data training data validation features
features labels preprocessing data augmentation models data optimization
gradient descent neural networks data tensors matrices visualization
exploration pandas numpy matplotlib seaborn scikitlearn tensorflow pytorch
deployment inference production monitoring reproducibility experiments results
metrics accuracy precision recall f1 cross validation data machine
"""

words = text.split()

count = {}

for word in words:
    count[word] = count.get(word, 0) + 1

for k, v in count.items():
    print(f"count of {k} is {v}")
```

```text
count of data is 9
count of science is 1
count of machine is 3
count of learning is 2
count of analysis is 1
count of statistics is 1
count of models is 2
count of training is 1
count of validation is 2
count of features is 2
count of labels is 1
count of preprocessing is 1
count of augmentation is 1
count of optimization is 1
count of gradient is 1
count of descent is 1
count of neural is 1
count of networks is 1
count of tensors is 1
count of matrices is 1
count of visualization is 1
count of exploration is 1
count of pandas is 1
count of numpy is 1
count of matplotlib is 1
count of seaborn is 1
count of scikitlearn is 1
count of tensorflow is 1
count of pytorch is 1
count of deployment is 1
count of inference is 1
count of production is 1
count of monitoring is 1
count of reproducibility is 1
count of experiments is 1
count of results is 1
count of metrics is 1
count of accuracy is 1
count of precision is 1
count of recall is 1
count of f1 is 1
count of cross is 1
```

`count.get(word, 0) + 1` — word প্রথমবার এলে default `0` থেকে শুরু, পরে আগের count-এর সাথে `+1`। NLP-তে এটাই **bag of words** / word frequency-র basic idea।

```text
1st "data" → count.get("data", 0) + 1 → 1
2nd "data" → count.get("data", 0) + 1 → 2
```

---

## Practice from Notebook

1. **Unique values** — list থেকে duplicate বাদ দিয়ে unique list বানাও (`set` ব্যবহার করে)।
2. **Word frequency** — string-এর প্রতিটা word কতবার এসেছে dictionary দিয়ে count করো।
3. নিজে চেষ্টা: word frequency-র result থেকে সবচেয়ে বেশি আসা word বের করো — hint: `max(count, key=count.get)` (answer `data`)।

---

## Quick Recap

- Tuple `()` — ordered, **immutable**; method শুধু `count()`, `index()`।
- Set `{}` — unique element, unordered; empty set = `set()` (শুধু `{}` হলো dict)।
- Set operations: `union`, `intersection`, `isdisjoint`, `issubset`; `pop()` arbitrary element মুছে।
- Dictionary `{key: value}` — key unique ও hashable; `get(key, default)` দিয়ে safe access।
- Add: `dic[key] = value` / `update()`; delete: `del dic[key]`; copy: `copy()`।
- `keys()`, `values()`, `items()` live view দেয়; loop-এ `for k, v in dic.items()`।
- Dict comprehension: `{k: v for ... if ...}`; দুইটা list জোড়াতে `zip()`।
- Frequency count pattern: `count[w] = count.get(w, 0) + 1`।
