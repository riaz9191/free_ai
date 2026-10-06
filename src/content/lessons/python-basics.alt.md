*Version 2 — Class notebook code walkthrough (Python Module 01).*

> 📓 **Class notebook:** `module-01-python-basics.ipynb` — [👁️ View](/ai/ml/notebooks/module-01-python-basics) / [⬇️ Download](/notebooks/module-01-python-basics.ipynb)

> Version 1-এ concept বুঝেছি। এখানে class notebook-এর **প্রতিটা code cell** একে একে run করে দেখব — code, real output, আর ছোট explanation।

## Roadmap

1. Variables and Data Type
2. Taking Input in Python
3. Operators in Python
4. Logical Operator
5. Precedence and Associativity
6. Problem: Digit Summation

---

## Variables and Data Type

### Number store করা

```python
phone_number = 456249

print(phone_number)
```

```text
456249
```

`phone_number` একটা variable, যার মধ্যে integer value `456249` রাখা হয়েছে। `print()` সেই value screen-এ দেখায়।

### String store করা

```python
name = "Phitron"

print(name)
```

```text
Phitron
```

Quote (`" "`) এর ভিতরে লেখা text হলো **string**।

### `type()` দিয়ে data type দেখা

```python
age = 20
height = 5.6
name = "Akash"
is_passed = True

print(type(age), type(height), type(name), type(is_passed))

age = 20.5   # same variable-এ নতুন value — type-ও বদলে গেল

print(type(age))
```

```text
<class 'int'> <class 'float'> <class 'str'> <class 'bool'>
<class 'float'>
```

Python-এ type আগে declare করতে হয় না — value দেখে type ঠিক হয় (dynamic typing)। তাই `age`-এ `20.5` দিলে সেটা `int` থেকে `float` হয়ে যায়।

---

## Taking Input in Python

### Basic `input()`

```python
name = input("What is your name? ")

print(name)
```

Sample input:

```text
Akash
```

Output:

```text
Akash
```

`input()` user-এর কাছ থেকে keyboard input নেয় এবং যা লেখা হয় সেটাই return করে।

### `input()` সবসময় string দেয়

```python
age = input("Age? ")

print(age, type(age))
```

Sample input:

```text
29
```

Output:

```text
29 <class 'str'>
```

Number লিখলেও `input()` সেটা **string** হিসেবে দেয়। (Notebook-এ input ফাঁকা রেখে run করা হয়েছিল, তাই সেখানে শুধু `<class 'str'>` দেখা গেছে।)

### String → `int` convert

```python
age = input("Age? ")   # string হিসেবে input নিলো

age = int(age)          # string-কে int-এ convert করলাম

print(age, type(age))
```

Sample input:

```text
29
```

Output:

```text
29 <class 'int'>
```

Math করতে চাইলে `int()` দিয়ে type casting করতে হয়।

### Decimal input — আগে string

```python
height = input("Height? ")

print(height, type(height))
```

Sample input:

```text
203.4
```

Output:

```text
203.4 <class 'str'>
```

Decimal number-ও convert না করলে string-ই থাকে।

### `float()` দিয়ে সরাসরি convert

```python
height = float(input("Height? "))   # input নিয়েই float-এ convert

print(height, type(height))

height = height + 0.2

print(height)
```

Sample input:

```text
20.6
```

Output:

```text
20.6 <class 'float'>
20.8
```

`float(input())` একসাথে লিখলে আলাদা line লাগে না। এখন `height` number, তাই `+ 0.2` করা যায়।

---

## Operators in Python

### Arithmetic Operators

```python
x = 10
y = 3

total = x + y              # summation
sub = x - y                # subtraction
mult = x * y               # multiplication
div = round(x / y, 2)      # division, 2 decimal পর্যন্ত round
rem = x % y                # remainder

print(total, sub, mult, div, rem)
```

```text
13 7 30 3.33 1
```

`/` সবসময় float দেয় (`3.333...`), `round(..., 2)` সেটাকে `3.33` করে। `%` দেয় ভাগশেষ: `10 % 3 → 1`।

> Notebook-এ variable-এর নাম ছিল `sum` — কিন্তু `sum` Python-এর built-in function, তাই এখানে `total` নাম দেওয়া হয়েছে।

### Comparison Operators

```python
x = 10
y = 3

greater_than = x > y
greater_than_equal = (10 >= 10)
print(greater_than, greater_than_equal)

less_than = x < y
less_than_equal = (10 <= 10)
print(less_than, less_than_equal)

equal = x == y
print(equal)

not_equal = x != y
print(not_equal)
```

```text
True True
False True
False
True
```

Comparison operator সবসময় `bool` (`True`/`False`) return করে। মনে রাখো: `=` হলো assignment, `==` হলো comparison।

---

## Logical Operator

### `and` — দুইটাই True হতে হবে

```python
x = 10
y = 5
z = 3

result = (x > y) and (x > z)

print(result)
```

```text
True
```

`10 > 5` True এবং `10 > 3` True — দুইটাই True, তাই result `True`।

```python
x = 10
y = 5
z = 15

result = (x > y) and (x > z)

print(result)
```

```text
False
```

`10 > 15` False — `and`-এ একটা False থাকলেই পুরোটা `False`।

### `or` — যেকোনো একটা True হলেই চলবে

```python
x = 10
y = 5
z = 15

result = (x > y) or (x > z)

print(result)
```

```text
True
```

`10 > 5` True, তাই `or`-এর result `True`।

```python
x = 10
y = 20
z = 15

result = (x > y) or (x > z)

print(result)
```

```text
False
```

`10 > 20` আর `10 > 15` দুইটাই False — তাই `or`-ও `False`।

---

## Precedence and Associativity

```python
eq = 10 + 10 / 2 - 5 * 2      # precedence অনুযায়ী আগে / আর *
print(eq)

eq = (10 + 10) / 2 - 5 * 2    # bracket-এর অংশ আগে compute হবে
print(eq)
```

```text
5.0
0.0
```

প্রথমটায়: `10/2 = 5.0`, `5*2 = 10` → `10 + 5.0 - 10 = 5.0`। দ্বিতীয়টায় bracket আগে: `20/2 = 10.0` → `10.0 - 10 = 0.0`।

```text
10 + 10/2 - 5*2      → 10 + 5.0 - 10   → 5.0
(10 + 10)/2 - 5*2    → 10.0 - 10       → 0.0
```

---

## Problem: Digit Summation

**Task:** এক line-এ দুইটা number input দেওয়া হবে। দুইটার **last digit** যোগ করে print করো।

```python
inp = input()

numbers = inp.split()        # space দিয়ে ভাগ করে list বানায়

x = int(numbers[0])          # e.g. 13
y = int(numbers[1])          # e.g. 12

last_digit_of_x = x % 10
last_digit_of_y = y % 10

total = last_digit_of_x + last_digit_of_y

print(total)
```

Sample input:

```text
13 12
```

Output:

```text
5
```

`split()` → `["13", "12"]`, তারপর `int()` দিয়ে number। `% 10` দিলে last digit পাওয়া যায়: `13 % 10 → 3`, `12 % 10 → 2`, যোগফল `5`।

---

## Practice from Notebook

1. **Digit Summation** — দুইটা number-এর last digit যোগ করো (উপরের solution দেখো)।
2. নিজে চেষ্টা করো: দুইটা number-এর **first digit** না, বরং **শেষ দুই digit** (`% 100`) যোগ করলে কী হয়?
3. `x = 10; y = 3` দিয়ে `x // y` আর `x / y` print করে পার্থক্য দেখো।

---

## Quick Recap

- Variable-এ value রাখতে `=`; type দেখতে `type()`।
- `input()` সবসময় `str` দেয় — math করতে `int()` / `float()` দিয়ে convert করো।
- Arithmetic: `+ - * / %`; `round(x, 2)` দিয়ে decimal কমানো যায়।
- Comparison operator `True`/`False` দেয়; `and` = দুইটাই True, `or` = যেকোনো একটা True।
- Precedence: `* /` আগে, `+ -` পরে; bracket সবার আগে।
- `n % 10` → last digit।
- Built-in নাম (`sum`, `list`, `str`) variable name হিসেবে ব্যবহার কোরো না।
