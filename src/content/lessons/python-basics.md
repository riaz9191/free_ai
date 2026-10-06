*Bangla + English mixed notes.* — **1 hr 15 min | 7 Units**

> 📓 **Class notebook:** `module-01-python-basics.ipynb` — [👁️ View](/ai/ml/notebooks/module-01-python-basics) / [⬇️ Download](/notebooks/module-01-python-basics.ipynb)

> এই note-টা beginner-friendly করে বানানো। আগে concept বুঝবে, তারপর code practice করবে। মুখস্থ করার দরকার নেই।

## Roadmap

1. Text Instruction (Module 01) — 1 min read
2. 1.1 Installing Python and Compiler — 11 min
3. 1.2 Variables and Data Type in Python — 14 min
4. 1.3 Taking Input in Python — 9 min
5. 1.4 Operators in Python — 14 min
6. 1.5 Logical Operator and Precedence, Associativity — 13 min
7. 1.6 Problem Solving — Digit Summation

---

## 1.1 — Installing Python and Compiler

### Python কী?

Python হলো একটি **programming language**।

Programming language দিয়ে আমরা computer-কে instruction দিই।

Example:

```python
print("Hello")
```

Computer এই instruction execute করে:

```text
Hello
```

### Python Interpreter কী?

Python code সরাসরি computer-এর machine language না।

Python interpreter আমাদের Python code পড়ে এবং execute করে।

Simple flow:

```text
Your Python Code
       ↓
Python Interpreter
       ↓
Computer
       ↓
Output
```

তাই beginner হিসেবে মনে রাখো:

> **Interpreter = Python code বুঝে execute করতে সাহায্য করে।**

### Compiler vs Interpreter — খুব সহজ ধারণা

দুটোর main কাজ হলো programming code-কে computer-এর জন্য understandable করা।

Beginner level-এ:

- **Compiler** → code compile করে তারপর run করার approach
- **Interpreter** → code execute করার সময় instruction interpret করে

Python সাধারণত interpreted language হিসেবে শেখানো হয়, যদিও Python-এর ভিতরে bytecode ইত্যাদির মতো implementation details আছে।

এখন এত deep যাওয়ার দরকার নেই।

### Python Code Run করার জায়গা

Python code লেখার জন্য বিভিন্ন environment ব্যবহার করা যায়:

```text
Python installed
     ↓
Code Editor / IDE
     ↓
Python Interpreter
     ↓
Output
```

পরের Module 03-এ আমরা **Anaconda, Jupyter Notebook, Google Colab** নিয়েও কাজ করব।

---

## 1.2 — Variables and Data Type in Python

### Variable কী?

Variable হলো এমন একটি **name**, যার মাধ্যমে আমরা কোনো value store/refer করি।

Example:

```python
age = 27
```

```text
age → variable
27  → value
```

আরেকটি:

```python
name = "Riaz"
```

```text
name   → variable
"Riaz" → value
```

### `=` মানে কী?

```python
x = 10
```

এখানে `=` মানে সাধারণ mathematical equality না। এটা **assignment**:

> `10` value-টা `x`-এর মধ্যে রাখো/assign করো।

তারপর:

```python
print(x)
```

Output:

```text
10
```

### Variable change করা যায়

```python
x = 10
x = 20

print(x)
```

Output:

```text
20
```

শেষ assignment-এর value থাকে।

### Data Types

Python-এ value-এর বিভিন্ন type আছে। সবচেয়ে important beginner types:

#### 1. Integer — `int`

Whole number:

```python
age = 27
count = 100
temperature = -5
```

#### 2. Float — `float`

Decimal number:

```python
price = 99.5
height = 5.8
```

#### 3. String — `str`

Text। String সাধারণত quotes-এর মধ্যে থাকে:

```python
name = "Riaz"
city = 'Dhaka'
```

Single `'...'` বা double `"..."` — দুটোই চলে।

#### 4. Boolean — `bool`

শুধু দুইটা value: `True` এবং `False`

```python
is_logged_in = True
```

### Type দেখার জন্য `type()`

```python
x = 10
print(type(x))
```

Output:

```text
<class 'int'>
```

আর:

```python
x = 10.5
print(type(x))
```

Output:

```text
<class 'float'>
```

### Quick mental model

```text
27       → int
10.5     → float
"Riaz"   → str
True     → bool
```

### Variable Naming Basics

Valid:

```python
age = 27
user_name = "Riaz"
total2 = 100
```

Invalid:

```python
2age = 27           # number দিয়ে শুরু করা যায় না
user-name = "Riaz"  # "-" ব্যবহার করা যায় না, "_" ব্যবহার করো
```

Python **case-sensitive** — `age`, `Age`, `AGE` তিনটা different names।

---

## 1.3 — Taking Input in Python

Program-কে user-এর কাছ থেকে data নিতে হলে `input()` ব্যবহার করি।

```python
name = input("Enter your name: ")

print(name)
```

User যদি লেখে `Riaz`, তাহলে output:

```text
Riaz
```

### Important: `input()` সবসময় string দেয়

```python
age = input("Enter age: ")
```

User `27` লিখলেও `age`-এর type হবে `str` (`"27"`)।

তাই calculation করতে চাইলে convert করতে হয়:

```python
age = int(input("Enter age: "))

print(age + 1)
```

Input `27` → Output:

```text
28
```

### Common conversions

```python
x = int("10")      # String → Integer
x = float("10.5")  # String → Float
x = str(10)        # Number → String
```

### Example: দুইটা number input

```python
a = int(input("Enter first number: "))
b = int(input("Enter second number: "))

print(a + b)
```

Input:

```text
10
20
```

Output:

```text
30
```

---

## 1.4 — Operators in Python

Operator হলো এমন symbol/keyword যেটা কোনো operation করে।

### Arithmetic Operators

| Operator | কাজ |
|---|---|
| `a + b` | Addition |
| `a - b` | Subtraction |
| `a * b` | Multiplication |
| `a / b` | Division |
| `a // b` | Floor Division |
| `a % b` | Modulus (remainder) |
| `a ** b` | Power |

### Example

```python
a = 10
b = 3
```

```text
a + b  → 13
a - b  → 7
a * b  → 30
a / b  → 3.333...
a // b → 3
a % b  → 1
a ** b → 1000
```

### `%` Modulus কেন important?

`%` remainder বের করে।

3 দিয়ে 10 ভাগ করলে remainder 1:

```text
10 % 3 → 1
```

Even/Odd problem-এ `%` খুব important:

```python
number % 2
```

- result `0` → **even**
- result `1` → **odd**

### Comparison Operators

দুইটা value compare করে, result `True` বা `False`।

```text
==   equal
!=   not equal
>    greater than
<    less than
>=   greater than or equal
<=   less than or equal
```

Example:

```text
10 > 5   → True
10 == 5  → False
```

### Assignment Operators

`x = 10`-এর পাশাপাশি shortcut আছে:

```python
x += 5   # মানে x = x + 5
x -= 2   # মানে x = x - 2
x *= 3   # মানে x = x * 3
x /= 2   # মানে x = x / 2
```

---

## 1.5 — Logical Operator and Precedence, Associativity

### Logical Operators

Main three: `and`, `or`, `not`

#### `and`

দুই condition-ই True হতে হবে।

```python
age > 18 and age < 30
```

```text
True  and True   → True
True  and False  → False
False and True   → False
False and False  → False
```

#### `or`

কমপক্ষে একটা True হলেই True।

```text
True  or True    → True
True  or False   → True
False or True    → True
False or False   → False
```

#### `not`

True কে False এবং False কে True করে।

```text
not True   → False
not False  → True
```

### Precedence

একাধিক operator থাকলে কোনটা আগে execute হবে সেটা precedence ঠিক করে।

```python
2 + 3 * 4
```

আগে multiplication, তারপর addition:

```text
3 * 4  = 12
2 + 12 = 14
```

#### Parentheses

Parentheses ব্যবহার করলে priority clear করা যায়।

```python
(2 + 3) * 4
```

```text
2 + 3 = 5
5 * 4 = 20
```

#### Simple precedence idea

উপর থেকে নিচে — উপরেরটা আগে:

```text
()
↓
**
↓
*, /, //, %
↓
+, -
↓
comparisons (==, !=, >, <, >=, <=)
↓
not
↓
and
↓
or
```

সব detail মুখস্থ করার দরকার নেই। Confusion হলে parentheses ব্যবহার করো।

### Associativity

একই precedence-এর operator থাকলে কোন দিক থেকে evaluate হবে — এটাই associativity।

```python
10 - 3 - 2
```

এটা left-to-right:

```text
(10 - 3) - 2
= 7 - 2
= 5
```

Exception: `**` right-to-left চলে — `2 ** 3 ** 2` মানে `2 ** (3 ** 2)` = `2 ** 9` = `512`।

Parentheses দিলে result স্পষ্ট হয়।

---

## 1.6 — Problem Solving: Digit Summation

এখন basic Python দিয়ে একটা ছোট problem solve করি।

### Problem

একটা number দেওয়া আছে: `1234`

Digits-এর sum বের করতে হবে:

```text
1 + 2 + 3 + 4 = 10
```

### Core trick: `% 10` এবং `// 10`

শেষ digit বের করতে `% 10`, শেষ digit remove করতে `// 10`:

```text
1234 % 10  → 4
1234 // 10 → 123
```

আবার:

```text
123 % 10  → 3
123 // 10 → 12
```

পুরো process:

```text
number   digit (% 10)   number (// 10)
1234  →      4      →      123
 123  →      3      →       12
  12  →      2      →        1
   1  →      1      →        0   ← stop
```

Digits: `4 + 3 + 2 + 1 = 10`

### Python solution

```python
number = 1234
total = 0

while number > 0:
    digit = number % 10
    total = total + digit
    number = number // 10

print(total)
```

Output:

```text
10
```

> `while` loop নিয়ে details পরের module (Control Flow)-এ আসবে। এখন শুধু বোঝো: condition true থাকা পর্যন্ত ভিতরের lines repeat হয়।

### Line-by-line understanding

1. `digit = number % 10` — শেষ digit বের করি।
2. `total = total + digit` — Digit-টা total-এর সাথে যোগ করি।
3. `number = number // 10` — শেষ digit remove করি।
4. Number `0` না হওয়া পর্যন্ত repeat করি।

---

## Module 01 Mental Model

```text
Python Basics
      ↓
Variables
      ↓
Data Types
      ↓
Input
      ↓
Operators
      ↓
Logical Operators
      ↓
Precedence / Associativity
      ↓
Basic Problem Solving
      ↓
Digit Sum
```

---

## Quick Practice

### Q1

```python
x = 10
y = 5
print(x + y)
```

Output?

### Q2

`17 % 5` কত?

### Q3

User input নিয়ে age-কে integer করার code কোনটি?

A. `age = input()`  
B. `age = int(input())`

### Q4

`2 + 3 * 4` — Output কত?

### Q5

`123`-এর digit sum কত?

### Q6

`and` কখন True হয়?

A. At least one condition True  
B. Both conditions True

### Answers

1. **15**
2. **2**
3. **B**
4. **14**
5. **6**
6. **B**

---

## Final Cheat Sheet

| Topic | Core idea |
|---|---|
| Python | Programming language |
| Interpreter | Python code execute করতে সাহায্য করে |
| Variable | Value refer/store করার নাম |
| `int` | Whole number |
| `float` | Decimal number |
| `str` | Text |
| `bool` | True / False |
| `input()` | User input নেয় (string হিসেবে) |
| `int()` | Integer conversion |
| `%` | Remainder |
| `//` | Floor division |
| `and` | Both conditions true |
| `or` | At least one true |
| `not` | Opposite boolean |
| Precedence | কোন operation আগে হবে |
| Associativity | Same priority হলে evaluation direction |
| Digit Sum | `% 10` + `// 10` দিয়ে digit process |

### One-line Mental Model

> **Python basics = data রাখো → input নাও → operators দিয়ে process করো → logic apply করো → ছোট problem solve করো।**
