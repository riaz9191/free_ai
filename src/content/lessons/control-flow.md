*Bangla + English mixed notes.* — **1 hr 22 min | 8 Units**

> 📓 **Class notebook:** `module-02-control-flow.ipynb` — [👁️ View](/ai/ml/notebooks/module-02-control-flow) / [⬇️ Download](/notebooks/module-02-control-flow.ipynb)

> এই module-এর focus হলো program-কে **decision নিতে এবং repeat করতে শেখানো**। আগে concept বুঝবে, তারপর code practice করবে।

## Roadmap

1. Text Instruction (Module 02) — 1 min read
2. 2.1 Conditionals statement in Python — 14 min
3. 2.2 For loop in Python — 10 min
4. 2.3 While Loop in Python — 6 min
5. 2.4 Break and Continue Statements in Python — 15 min
6. 2.5 Problem 1 — Min and Max — 11 min
7. 2.6 Problem 2 — C — Even, Odd, Positive and Negative — 12 min
8. 2.7 Problem 3 — Digits — 14 min

### 🎯 Module Goal

Normal code একটার পর একটা চলে:

```text
একটা instruction
      ↓
পরের instruction
      ↓
পরের instruction
```

Control flow দিয়ে program **decision** নিতে পারে:

```text
Condition?
   ↓
Yes → এটা করো
No  → অন্যটা করো
```

অথবা একই কাজ **repeat** করতে পারে:

```text
Repeat
Repeat
Repeat
...
```

Main concepts:

- `if / elif / else`
- `for`
- `while`
- `break`
- `continue`
- Problem solving with loops and conditions

---

## 2.1 — Conditionals Statement in Python

### Condition কী?

Condition হলো এমন একটা question যার answer `True` অথবা `False`।

```python
age > 18
```

```text
age = 25 → 25 > 18 → True
age = 15 → 15 > 18 → False
```

### `if`

Condition True হলে code execute করবে।

```python
age = 20

if age >= 18:
    print("Adult")
```

Output:

```text
Adult
```

#### Important: Indentation

Python-এ indentation খুব important।

```python
if age >= 18:
    print("Adult")
```

`print()`-এর আগে space আছে (সাধারণত 4 space)। এটাকে **indentation** বলে — এটা দিয়েই Python বোঝে কোন lines `if`-এর ভিতরে।

### `if - else`

দুইটা possibility থাকলে:

```python
age = 15

if age >= 18:
    print("Adult")
else:
    print("Minor")
```

Output:

```text
Minor
```

Flow:

```text
        age >= 18?
         /      \
       Yes       No
        ↓         ↓
      Adult     Minor
```

### `if - elif - else`

একাধিক condition থাকলে:

```python
marks = 75

if marks >= 80:
    print("A+")
elif marks >= 70:
    print("A")
elif marks >= 60:
    print("B")
else:
    print("Below B")
```

Output:

```text
A
```

Python **top থেকে** condition check করে। প্রথম True condition পাওয়া গেলে শুধু তার block execute করে, বাকিগুলো skip।

`75 >= 80` → False, `75 >= 70` → True → `"A"` print, তারপর বাকি check আর হয় না।

### Comparison + condition

```python
x = 10

if x == 10:
    print("Yes")
```

মনে রাখো:

```text
=   → assignment
==  → comparison
```

---

## 2.2 — For Loop in Python

### Loop কী?

Loop মানে:

> **একই কাজ বারবার করা।**

ধরো:

```python
print(1)
print(2)
print(3)
print(4)
print(5)
```

এটা repetitive। Loop দিয়ে:

```python
for i in range(1, 6):
    print(i)
```

Output:

```text
1
2
3
4
5
```

### `range()`

```text
range(5)     → 0, 1, 2, 3, 4      (5 include হবে না)
range(1, 6)  → 1, 2, 3, 4, 5
```

#### Mental model

```text
range(start, stop)

start → included
stop  → excluded
```

### Step by step

```python
for i in range(1, 4):
    print(i)
```

```text
i = 1 → print
i = 2 → print
i = 3 → print
```

তারপর loop শেষ।

### List-এর উপর loop

```python
numbers = [10, 20, 30]

for x in numbers:
    print(x)
```

Output:

```text
10
20
30
```

### Sum using for loop

```python
total = 0

for i in range(1, 6):
    total = total + i

print(total)
```

Calculation:

```text
 0 + 1 = 1
 1 + 2 = 3
 3 + 3 = 6
 6 + 4 = 10
10 + 5 = 15
```

Output:

```text
15
```

---

## 2.3 — While Loop in Python

`while` loop condition True থাকা পর্যন্ত চলে।

```python
i = 1

while i <= 5:
    print(i)
    i = i + 1
```

Output:

```text
1
2
3
4
5
```

Flow:

```text
i = 1
  ↓
i <= 5 ?  ── No ──→ loop শেষ
  ↓ Yes
print(i)
  ↓
i = i + 1
  ↓
condition আবার check
```

### For vs While

#### For

যখন কতবার বা কোন sequence-এর উপর loop করতে হবে সেটা জানা থাকে:

```python
for i in range(5):
    print(i)
```

#### While

যখন condition-এর উপর loop চলবে:

```python
while x < 10:
    ...
```

### Infinite Loop

যদি condition কখনো False না হয়:

```python
i = 1

while i <= 5:
    print(i)
```

এখানে `i` change হচ্ছে না, তাই condition সবসময় True।

Result:

```text
1
1
1
1
...
```

এটা **infinite loop** — program কখনো থামবে না।

তাই while loop-এ condition eventually False হবে কিনা খেয়াল করতে হবে।

---

## 2.4 — Break and Continue Statements

### `break`

`break` loop **পুরোপুরি stop** করে।

```python
for i in range(1, 10):
    if i == 5:
        break
    print(i)
```

Output:

```text
1
2
3
4
```

`i == 5` হলে loop শেষ।

#### Mental model

```text
1 → 2 → 3 → 4 → 5
                ↓
              BREAK
                ↓
              STOP
```

### `continue`

`continue` **current iteration skip** করে এবং next iteration-এ যায়।

```python
for i in range(1, 6):
    if i == 3:
        continue
    print(i)
```

Output:

```text
1
2
4
5
```

3 skip হয়েছে।

### Difference

```text
break    → পুরো loop বন্ধ
continue → শুধু current iteration skip
```

---

## 2.5 — Problem 1: Min and Max

ধরো numbers:

```python
numbers = [5, 2, 9, 1, 7]
```

আমাদের বের করতে হবে:

```text
Minimum = 1
Maximum = 9
```

Python-এর built-in আছে:

```python
min(numbers)
max(numbers)
```

কিন্তু problem solving-এর জন্য logic বুঝি।

### Minimum manually

প্রথম value-কে temporary minimum ধরি:

```python
numbers = [5, 2, 9, 1, 7]

minimum = numbers[0]

for x in numbers:
    if x < minimum:
        minimum = x

print(minimum)
```

Flow:

```text
minimum = 5

2 < 5 → yes → minimum = 2
9 < 2 → no
1 < 2 → yes → minimum = 1
7 < 1 → no

Final minimum = 1
```

### Maximum

```python
maximum = numbers[0]

for x in numbers:
    if x > maximum:
        maximum = x

print(maximum)
```

Final:

```text
maximum = 9
```

### Important pattern

```text
Start with first value
        ↓
Compare next value
        ↓
Better candidate?
        ↓
Update
        ↓
Repeat
```

এই pattern অনেক problem-এ কাজে লাগে।

---

## 2.6 — Problem 2: Even, Odd, Positive and Negative

এই problem-এ condition + `%` খুব important।

### Even / Odd

```python
x = 8
```

```text
8 % 2 → 0   → তাই even
```

Code:

```python
if x % 2 == 0:
    print("Even")
else:
    print("Odd")
```

### Positive / Negative

```python
x = -5

if x > 0:
    print("Positive")
elif x < 0:
    print("Negative")
else:
    print("Zero")
```

Output:

```text
Negative
```

### Combine both

```python
x = 8

if x > 0:
    print("Positive")
elif x < 0:
    print("Negative")
else:
    print("Zero")

if x % 2 == 0:
    print("Even")
else:
    print("Odd")
```

Output:

```text
Positive
Even
```

এখানে দুইটা **আলাদা** `if` block — তাই দুইটাই check হয়, দুইটা line print হয়।

### Important

- `0` positive-ও না, negative-ও না।
- `0` even, কারণ `0 % 2 → 0`।

---

## 2.7 — Problem 3: Digits

এখানে loop + `%` + `//` ব্যবহার করে number-এর digits নিয়ে কাজ করব।

ধরো `number = 1234`

```text
1234 % 10  → 4     (শেষ digit বের)
1234 // 10 → 123   (শেষ digit remove)
```

তারপর আবার:

```text
123 % 10  → 3
123 // 10 → 12

12 % 10   → 2
12 // 10  → 1

1 % 10    → 1
1 // 10   → 0   ← stop
```

### Digit count

1234-এর কয়টা digit?

```python
number = 1234
count = 0

while number > 0:
    number = number // 10
    count = count + 1

print(count)
```

Output:

```text
4
```

> Edge case: `number = 0` হলে loop একবারও চলে না, তাই `count = 0` আসে — অথচ `0`-এর digit আসলে 1টা। দরকার হলে `0`-কে আলাদা করে handle করো।

### Digit sum

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

কারণ:

```text
1 + 2 + 3 + 4 = 10
```

---

## Module 02 Mental Model

```text
Control Flow
     ↓
Condition
 ┌───┴────┐
if       else
     ↓
Loop
 ┌───┴────┐
for     while
     ↓
Loop control
 ┌───┴──────┐
break    continue
     ↓
Problem Solving
 ├── Min / Max
 ├── Even / Odd
 ├── Positive / Negative
 └── Digits
```

---

## Common Confusions

### `=` vs `==`

```text
x = 5   → Assignment
x == 5  → Comparison
```

### `break` vs `continue`

```text
break    → loop completely stops
continue → current iteration skips
```

### `for` vs `while`

```text
for   → sequence/range-based repetition
while → condition-based repetition
```

### `%` vs `//`

```text
%  → remainder
// → floor division
```

For digits:

```text
% 10  → last digit
// 10 → remove last digit
```

---

## Quick Practice

### Q1

```python
x = 10

if x > 5:
    print("A")
else:
    print("B")
```

Output?

### Q2

```python
for i in range(1, 4):
    print(i)
```

কী print হবে?

### Q3

`17 % 2` কত?

### Q4

`break` কী করে?

A. Current iteration skip করে  
B. পুরো loop stop করে

### Q5

`continue` কী করে?

A. Current iteration skip করে  
B. পুরো program stop করে

### Q6

Numbers: `5, 2, 9, 1` — Minimum কত?

### Q7

`1234 % 10` কত?

### Q8

`1234 // 10` কত?

### Answers

1. **A**
2. **1, 2, 3**
3. **1**
4. **B**
5. **A**
6. **1**
7. **4**
8. **123**

---

## Final Cheat Sheet

| Concept | Meaning |
|---|---|
| `if` | Condition true হলে execute |
| `elif` | Another condition |
| `else` | সব condition false হলে |
| `for` | Sequence/range loop |
| `while` | Condition-based loop |
| `break` | Loop stop |
| `continue` | Current iteration skip |
| `%` | Remainder |
| `//` | Floor division |
| Min logic | Smaller value পেলে update |
| Max logic | Larger value পেলে update |
| Digit extraction | `% 10` |
| Last digit remove | `// 10` |

### One-line Mental Model

> **Control Flow = Program-কে decision নিতে এবং একই কাজ repeatedly করতে শেখানো।**
