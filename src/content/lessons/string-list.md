*Bangla + English mixed notes.* — **2 hr 15 min | 12 Units**

> এই module-এ Python-এর **String এবং List** খুব ভালোভাবে বুঝব। এগুলো real-world data handle করার জন্য extremely important।

## Roadmap

1. Text Instructions (Module 03) — 1 min read
2. 3.0 Module Introduction — 4 min
3. 3.1 Installing Anaconda, Jupyter Notebook, Google Colab — 13 min
4. 3.2 String, Indexing and Slicing — 23 min
5. 3.3 String Methods — 20 min
6. 3.4 String Splitting, Joining and Formatting — 20 min
7. 3.5 List and List Methods — 18 min
8. 3.6 List as Stack and Queue — 21 min
9. 3.7 List Comprehension — 6 min
10. 3.8 List Comprehension with List of String — 5 min
11. 3.9 Module Overview — 5 min
12. Extra Practice Problem (Module 03) — 1 min read

---

## 3.0 — Module Introduction

### String কী?

String হলো **characters-এর sequence** (text)।

```python
name = "Riaz"
city = "Dhaka"
message = "Hello World"
```

String quotes-এর মধ্যে থাকে — `"Hello"` বা `'Hello'` দুটোই চলে।

### List কী?

List হলো একসাথে multiple values রাখার collection।

```python
numbers = [10, 20, 30, 40]
```

একটা list-এর মধ্যে different type-এর value-ও থাকতে পারে:

```python
data = ["Riaz", 27, 5.8, True]
```

### String vs List

```text
String → characters-এর sequence    "Riaz"
List   → values-এর collection      [10, 20, 30]
```

দুটোতেই position/index থাকে।

---

## 3.1 — Anaconda, Jupyter Notebook, Google Colab

Python code লেখার জন্য বিভিন্ন environment আছে।

### Anaconda

Anaconda হলো Python/data science-এর জন্য popular **distribution**।

এর সাথে অনেক useful package/tool (NumPy, Pandas, Jupyter ইত্যাদি) সহজে পাওয়া যায়। ML/Data Science learning-এ Anaconda useful হতে পারে।

### Jupyter Notebook

Jupyter Notebook-এ code ছোট ছোট **cell**-এ run করা যায়।

```text
Cell 1 → variable
Cell 2 → calculation
Cell 3 → graph
Cell 4 → analysis
```

এটা learning এবং data analysis-এর জন্য খুব convenient।

### Google Colab

Google Colab হলো **browser-based** notebook environment।

```text
Browser
  ↓
Google Colab
  ↓
Python Code
  ↓
Output
```

Local computer-এ সব setup না করেও Python practice করা যায়।

### কোনটা কখন?

| Tool | Basic idea |
|---|---|
| Python | Language |
| Anaconda | Python/data science distribution |
| Jupyter | Interactive notebook |
| Google Colab | Cloud/browser notebook |

---

## 3.2 — String, Indexing and Slicing

### String indexing

```python
name = "Riaz"
```

Characters:

```text
R  i  a  z
0  1  2  3
```

Python index **0 থেকে শুরু হয়**।

```text
name[0] → "R"
name[1] → "i"
name[2] → "a"
name[3] → "z"
```

### Negative indexing

শেষ character থেকে count করতে পারি:

```text
 R   i   a   z
-4  -3  -2  -1
```

```text
name[-1] → "z"
name[-2] → "a"
```

### String slicing

Slicing মানে string-এর একটা অংশ নেওয়া।

Syntax:

```python
string[start:stop]
```

**`stop` index include হয় না।**

Example:

```python
name = "Python"
```

```text
P  y  t  h  o  n
0  1  2  3  4  5
```

```text
name[0:3] → "Pyt"     (index 0, 1, 2)
```

### More examples

```text
text = "Python"

text[:3]   → "Pyt"      (শুরু থেকে index 2 পর্যন্ত)
text[2:]   → "thon"     (index 2 থেকে শেষ পর্যন্ত)
text[:]    → "Python"   (পুরোটা)
```

### Step

Slicing-এ step দেওয়া যায়:

```python
text[start:stop:step]
```

```text
text[::2] → "Pto"
```

কারণ প্রতি 2nd character নেওয়া হচ্ছে: **P**y**t**h**o**n

### Reverse string

```text
text[::-1] → "nohtyP"
```

Step `-1` মানে উল্টো দিক থেকে। এটা খুব useful trick।

---

## 3.3 — String Methods

String-এর উপর বিভিন্ন built-in method ব্যবহার করা যায়।

> String methods original string change করে না — **নতুন string return** করে। তাই result রাখতে চাইলে variable-এ assign করো: `name = name.upper()`

### `upper()` / `lower()`

```python
name = "riaz"
print(name.upper())
```

Output:

```text
RIAZ
```

```python
name = "RIAZ"
print(name.lower())
```

Output:

```text
riaz
```

### `capitalize()`

```text
"hello".capitalize() → "Hello"
```

### `strip()`

Beginning/end-এর unnecessary whitespace remove করে:

```text
"  hello  ".strip() → "hello"
```

### `replace()`

```python
text = "I like Java"
print(text.replace("Java", "Python"))
```

Output:

```text
I like Python
```

### `find()`

কোনো text কোথায় (কোন index-এ) আছে সেটা খুঁজে:

```text
"Hello Python".find("Python") → 6
```

না পেলে `-1` return করে।

### `count()`

কোনো character/text কতবার আছে:

```text
"banana".count("a") → 3
```

### `startswith()` / `endswith()`

```text
"Python".startswith("Py") → True
"Python".endswith("on")   → True
```

---

## 3.4 — String Splitting, Joining and Formatting

### `split()`

একটা string-কে parts-এ ভাগ করে **list** বানায়।

```python
text = "I love Python"
words = text.split()
print(words)
```

Output:

```text
['I', 'love', 'Python']
```

### Separator দিয়ে split

```python
text = "apple,banana,mango"
fruits = text.split(",")
print(fruits)
```

Output:

```text
['apple', 'banana', 'mango']
```

### `join()`

List-এর strings-গুলোকে আবার একটি **string** বানায়।

```python
words = ["I", "love", "Python"]
sentence = " ".join(words)
print(sentence)
```

Output:

```text
I love Python
```

`" "` হলো মাঝখানে কী বসবে — `"-".join(words)` দিলে `I-love-Python`।

#### Important

```text
split  → String → List
join   → List   → String
```

### String Formatting

```python
name = "Riaz"
age = 27
```

Modern Python-এ **f-string** খুব useful — string-এর আগে `f` দাও, আর `{}`-এর মধ্যে variable:

```python
message = f"My name is {name} and I am {age} years old."
print(message)
```

Output:

```text
My name is Riaz and I am 27 years old.
```

#### Why formatting?

Text-এর মধ্যে variable-এর value সুন্দরভাবে insert করা যায়।

```python
price = 500
print(f"Price is {price} taka")
```

Output:

```text
Price is 500 taka
```

---

## 3.5 — List and List Methods

### List

```python
numbers = [10, 20, 30, 40]
```

Index:

```text
10  20  30  40
 0   1   2   3
```

### Access

```text
numbers[0]  → 10
numbers[-1] → 40
```

### Change value

List **mutable** — মানে list-এর existing value change করা যায়।

```python
numbers = [10, 20, 30]
numbers[1] = 50
print(numbers)
```

Output:

```text
[10, 50, 30]
```

### List Methods — step by step

একটা list নিয়ে একটার পর একটা method চালাই:

```python
numbers = [10, 20, 30]
```

| Code | কাজ | List এখন |
|---|---|---|
| `numbers.append(40)` | শেষে value add | `[10, 20, 30, 40]` |
| `numbers.insert(1, 99)` | index 1-এ 99 add | `[10, 99, 20, 30, 40]` |
| `numbers.remove(20)` | value `20` remove | `[10, 99, 30, 40]` |
| `numbers.pop()` | শেষ item remove + return (`40`) | `[10, 99, 30]` |
| `numbers.pop(1)` | index 1 remove + return (`99`) | `[10, 30]` |
| `numbers.append(5)` | শেষে value add | `[10, 30, 5]` |
| `numbers.sort()` | Ascending order | `[5, 10, 30]` |
| `numbers.reverse()` | বর্তমান order উল্টো | `[30, 10, 5]` |
| `len(numbers)` | কয়টা item → `3` | `[30, 10, 5]` |

> `remove()` **value** দিয়ে কাজ করে, `pop()` **index** দিয়ে।

---

## 3.6 — List as Stack and Queue

List ব্যবহার করে basic data structure-এর behavior তৈরি করা যায়।

### Stack

Stack follows:

> **LIFO — Last In, First Out**

Real-life example: **Plate stack** — শেষে যে plate রাখবে, আগে সেটাই বের হবে।

```python
stack = []

stack.append("A")
stack.append("B")
stack.append("C")
```

Stack:

```text
C  ← top (শেষে এসেছে, আগে বের হবে)
B
A
```

```python
print(stack.pop())
```

Output:

```text
C
```

তারপর `pop()` করলে B, তারপর A।

#### Stack flow

```text
append A
append B
append C

[A, B, C]

pop → C
pop → B
pop → A
```

### Queue

Queue follows:

> **FIFO — First In, First Out**

Real-life example: **Bank queue** — যে আগে এসেছে, সে আগে service পাবে।

```text
A → B → C
↑
first
```

Python list দিয়ে basic queue:

```python
queue = ["A", "B", "C"]
print(queue.pop(0))
```

Output:

```text
A
```

তারপর `pop(0)` করলে B, তারপর C।

> বড়/efficient queue-এর জন্য Python-এ `collections.deque` বেশি suitable, কারণ `pop(0)` বড় list-এ slow। কিন্তু concept শেখার জন্য list দিয়ে বুঝতে পারো।

---

## 3.7 — List Comprehension

List comprehension হলো concise (ছোট) way-এ list তৈরি করা।

Normal for loop:

```python
squares = []

for x in range(1, 6):
    squares.append(x * x)
```

List comprehension:

```python
squares = [x * x for x in range(1, 6)]
```

দুটোরই result:

```text
[1, 4, 9, 16, 25]
```

### Basic structure

```python
[expression for item in iterable]
```

Mental model:

```text
for loop
   ↓
প্রতিটি item
   ↓
expression
   ↓
নতুন list
```

---

## 3.8 — List Comprehension with List of String

### Uppercase

```python
names = ["riaz", "hasib", "fariya"]

upper_names = [name.upper() for name in names]
```

Result:

```text
['RIAZ', 'HASIB', 'FARIYA']
```

### String length

```python
names = ["Riaz", "Hasib", "Fariya"]

lengths = [len(name) for name in names]
```

Result:

```text
[4, 5, 6]
```

### Condition সহ

```python
numbers = [1, 2, 3, 4, 5, 6]

even = [x for x in numbers if x % 2 == 0]
```

Result:

```text
[2, 4, 6]
```

Structure:

```python
[expression for item in iterable if condition]
```

---

## 3.9 — Module Overview

এই module-এ আমরা শিখলাম:

```text
String
 ↓
Indexing
 ↓
Slicing
 ↓
String Methods
 ↓
split / join
 ↓
Formatting
 ↓
List
 ↓
List Methods
 ↓
Stack / Queue
 ↓
List Comprehension
 ↓
String + List Comprehension
```

---

## ML Connection

String এবং List ML-এ অনেক জায়গায় দরকার।

### Text data

```python
text = "I love machine learning"
```

Text processing করতে:

```text
String
 ↓
split
 ↓
words
 ↓
clean
 ↓
process
```

### Dataset

একটা row:

```python
["Riaz", 27, "Dhaka", 50000]
```

Multiple rows (list of lists):

```python
[
    ["Riaz", 27, "Dhaka"],
    ["Hasib", 25, "Chittagong"],
    ["Fariya", 24, "Dhaka"]
]
```

এখান থেকেই পরে data science-এর structured data handling-এর দিকে যাওয়া যায়।

---

## Common Confusions

### String কি mutable?

না। Python string **immutable**।

```python
text = "Hello"
text[0] = "J"   # ❌ Error — individual character direct change করা যায় না
```

বদলাতে চাইলে নতুন string বানাতে হয়: `text = "J" + text[1:]` → `"Jello"`

### List কি mutable?

হ্যাঁ।

```python
numbers[0] = 100   # ✅ করা যায়
```

### `split()` vs `join()`

```text
split → String → List
join  → List   → String
```

### `append()` কী করে?

List-এর শেষে **একটা item** add করে।

### `pop()` কী করে?

Item remove করে এবং removed item return করে।

### Stack vs Queue

```text
Stack → LIFO
Queue → FIFO
```

---

## Quick Practice

### Q1

```python
name = "Python"
print(name[0])
```

Output?

### Q2

```python
text = "Python"
print(text[-1])
```

Output?

### Q3

```python
text = "I love Python"
print(text.split())
```

Result কী হবে?

### Q4

```python
numbers = [10, 20, 30]
numbers.append(40)
```

Final list?

### Q5

```python
stack = ["A", "B", "C"]
stack.pop()
```

কোন value বের হবে?

### Q6

```python
[x * 2 for x in [1, 2, 3]]
```

Result?

### Q7

```python
names = ["riaz", "hasib"]
[name.upper() for name in names]
```

Result?

### Answers

1. **P**
2. **n**
3. **`['I', 'love', 'Python']`**
4. **`[10, 20, 30, 40]`**
5. **C**
6. **`[2, 4, 6]`**
7. **`['RIAZ', 'HASIB']`**

---

## Final Cheat Sheet

| Concept | Core idea |
|---|---|
| String | Text sequence (immutable) |
| Index | Position, starts at 0 |
| Negative index | End থেকে count |
| Slice | `[start:stop:step]` — stop excluded |
| `split()` | String → List |
| `join()` | List → String |
| `upper()` | Uppercase |
| `lower()` | Lowercase |
| `replace()` | Text replace |
| f-string | `f"... {variable} ..."` |
| List | Multiple values-এর collection (mutable) |
| `append()` | End-এ add |
| `insert()` | Position-এ add |
| `remove()` | Value দিয়ে remove |
| `pop()` | Index দিয়ে remove + return |
| Stack | LIFO |
| Queue | FIFO |
| List comprehension | Short way to create list |

### One-line Mental Model

> **String = text handle করা, List = multiple data handle করা, আর methods/comprehension = এই data দ্রুত process করা।**
