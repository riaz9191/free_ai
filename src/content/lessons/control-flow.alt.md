*Version 2 — Class notebook code walkthrough (Python Module 02).*

> 📓 **Class notebook:** `module-02-control-flow.ipynb` — [👁️ View](/ai/ml/notebooks/module-02-control-flow) / [⬇️ Download](/notebooks/module-02-control-flow.ipynb)

> Version 1-এ `if`, `for`, `while`, `break`, `continue`-এর concept দেখেছি। এখানে class notebook-এর **সব code cell** clean করে run করা হয়েছে — code, output, আর ছোট explanation।

## Roadmap

1. Conditional Statements in Python
2. Loop in Python (nested `for`, `while`, `continue`, `break`)
3. Max and Min Problem
4. Even, Odd, Positive and Negative
5. Digits

---

## Conditional Statements in Python

```python
taka = 1000
raining = False

# 500 টাকার বেশি থাকলে AND বৃষ্টি না হলে ঘুরতে যাব
if (taka > 500) and (raining == False):
    print("ghurte jabo")
else:
    print("Taka ta save korbo")
```

```text
ghurte jabo
```

`taka > 500` True এবং `raining == False` True — দুইটাই True, তাই `if` block run হলো। একটাও False হলে `else` block চলত।

> Notebook-এ condition-এর শেষে একটা অপ্রয়োজনীয় `or ()` ছিল। `()` (empty tuple) সবসময় falsy, তাই result বদলায় না — এখানে সেটা বাদ দেওয়া হয়েছে।

```text
(True and True) or ()   → True
(True and False) or ()  → ()   (falsy, তাই else চলত)
```

---

## Loop in Python

### Nested `for` loop

```python
for i in range(1, 10):
    for j in range(1, 5):
        print(i, j)
```

```text
1 1
1 2
1 3
1 4
2 1
2 2
2 3
2 4
3 1
3 2
3 3
3 4
4 1
4 2
4 3
4 4
5 1
5 2
5 3
5 4
6 1
6 2
6 3
6 4
7 1
7 2
7 3
7 4
8 1
8 2
8 3
8 4
9 1
9 2
9 3
9 4
```

Outer loop `i = 1…9`, আর প্রতিটা `i`-এর জন্য inner loop `j = 1…4` পুরোটা ঘোরে। তাই মোট `9 × 4 = 36` line। মনে রাখো: `range(1, 10)`-এ `10` বাদ যায়।

### `while` loop — condition শুরুতেই False

```python
count = 10

while count < 10:
    print(count, "hello world")
    count = count + 1

print(count)
```

```text
10
```

শুরুতেই `count < 10` → `10 < 10` False, তাই loop body একবারও run হয়নি। শুধু শেষের `print(count)` চলেছে।

### `continue` — odd number-গুলোর যোগফল

```python
total = 0

for i in range(1, 11):
    print(i, "is processing")

    if i % 2 == 0:   # even হলে বাকি অংশ skip
        continue

    total += i
    print(i, "is added to the sum")

print("Total:", total)
```

```text
1 is processing
1 is added to the sum
2 is processing
3 is processing
3 is added to the sum
4 is processing
5 is processing
5 is added to the sum
6 is processing
7 is processing
7 is added to the sum
8 is processing
9 is processing
9 is added to the sum
10 is processing
Total: 25
```

Even number-এ `continue` হলে loop-এর বাকি line skip হয়ে সরাসরি পরের iteration-এ যায়। তাই শুধু odd (`1+3+5+7+9 = 25`) যোগ হয়েছে। (শেষ `print("Total:", ...)` line-টা clarity-র জন্য যোগ করা।)

### `break` — accuracy 100 হলে থামো

Notebook-এ এই cell-টা অসম্পূর্ণ ছিল (`SyntaxError`, আর `prev` variable define করা ছিল না)। মূল idea ছিল comment করা `for` loop-টা — accuracy বাড়াতে থাকো, `100` হলে `break`। এখানে সেটা runnable করা হলো:

```python
accuracy = 95

for i in range(20):
    accuracy += 1
    print(accuracy)
    if accuracy == 100:
        break
```

```text
96
97
98
99
100
```

`range(20)` মানে সর্বোচ্চ 20 বার চলতে পারত, কিন্তু `accuracy == 100` হতেই `break` loop থেকে বের করে দিল।

Same কাজ `while True` দিয়ে — যখন আগে থেকে জানি না কতবার loop লাগবে:

```python
accuracy = 95

while True:
    accuracy += 1
    print("accuracy:", accuracy)
    if accuracy == 100:
        break

print("Training stopped at", accuracy)
```

```text
accuracy: 96
accuracy: 97
accuracy: 98
accuracy: 99
accuracy: 100
Training stopped at 100
```

`while True` নিজে থেকে কখনো থামে না — তাই ভিতরে অবশ্যই একটা `break` condition রাখতে হয়। ML training-এ এভাবেই target accuracy পেলে training থামানো হয় (early stopping-এর basic idea)।

---

## Max and Min Problem

**Task:** এক line-এ তিনটা integer দেওয়া হবে — সবচেয়ে ছোট আর সবচেয়ে বড়টা print করো।

```python
inp = input()

numbers = inp.split()

x = int(numbers[0])
y = int(numbers[1])
z = int(numbers[2])

mn = x
mx = x

# minimum
if y < mn:
    mn = y
if z < mn:
    mn = z

# maximum
if y > mx:
    mx = y
if z > mx:
    mx = z

print(mn, mx)
```

Sample input:

```text
1 20 -1
```

Output:

```text
-1 20
```

প্রথমে ধরে নিই `x`-ই min এবং max, তারপর `y` আর `z` দিয়ে compare করে update করি।

> Notebook-এ variable-এর নাম ছিল `min` আর `max` — এগুলো Python-এর built-in function, তাই এখানে `mn`, `mx` নাম দেওয়া হয়েছে।

---

## Even, Odd, Positive and Negative

**Task:** প্রথম line-এ `n`, দ্বিতীয় line-এ `n`-টা number। কয়টা even, odd, positive, negative — count করো। (`0` even, কিন্তু positive/negative কোনোটাই না।)

```python
n = int(input())

inp = input()
numbers = inp.split()

positive = 0
negative = 0
even = 0
odd = 0

for i in range(n):
    x = int(numbers[i])

    # positive or negative
    if x > 0:
        positive += 1
    elif x < 0:
        negative += 1

    # odd or even
    if x % 2 != 0:
        odd += 1
    else:
        even += 1

print("Even:", even)
print("Odd:", odd)
print("Positive:", positive)
print("Negative:", negative)
```

Sample input:

```text
5
-1 2 0 -3 -4
```

Output:

```text
Even: 3
Odd: 2
Positive: 1
Negative: 3
```

দুইটা আলাদা `if` block ব্যবহার করা হয়েছে, কারণ একটা number একসাথে "even" আর "negative" দুইটাই হতে পারে। `elif` দেওয়ায় `0` positive/negative কোনোটাতেই count হয়নি।

---

## Digits

**Task:** `t` টা test case। প্রতিটা number-এর digit-গুলো **উল্টো দিক থেকে** (last digit আগে) space দিয়ে print করো।

```python
t = int(input())

for i in range(t):
    number = int(input())

    if number == 0:       # 0 হলে while loop চলবে না, তাই আলাদা handle
        print(0)
        continue

    while number > 0:
        print(number % 10, end=" ")   # last digit
        number //= 10                 # last digit কেটে ফেলো
    print()                           # পরের test case-এর জন্য new line
```

Sample input:

```text
3
1200
0
321
```

Output:

```text
0 0 2 1
0
1 2 3
```

`% 10` দিয়ে last digit নিই, `// 10` দিয়ে সেটা কেটে ফেলি — number `0` হওয়া পর্যন্ত। `end=" "` দিলে `print()` new line না দিয়ে space দেয়।

```text
1200 → print 0, number = 120
120  → print 0, number = 12
12   → print 2, number = 1
1    → print 1, number = 0  (loop শেষ)
```

---

## Practice from Notebook

1. **Max and Min** — তিনটা number-এর min ও max বের করো (built-in `min()`/`max()` ছাড়া)।
2. **Even, Odd, Positive and Negative** — `n`-টা number classify করে count করো।
3. **Digits** — প্রতিটা number-এর digit উল্টো order-এ print করো; `0`-এর জন্য special case মনে রাখো।
4. নিজে চেষ্টা: `continue` cell-টা বদলে শুধু **even** number-এর যোগফল বের করো (answer `30`)।

---

## Quick Recap

- `if / else` — condition True হলে `if` block, না হলে `else`; একাধিক condition `and` / `or` দিয়ে।
- Nested loop: outer-এর প্রতিটা step-এ inner loop পুরোটা ঘোরে।
- `while` condition শুরুতেই False হলে body একবারও চলে না।
- `continue` → এই iteration-এর বাকি অংশ skip; `break` → পুরো loop থেকে বের।
- `while True` ব্যবহার করলে ভিতরে অবশ্যই `break` রাখো।
- Digit বের করার pattern: `n % 10` (last digit) + `n //= 10` (কেটে ফেলা)।
- `min`, `max`, `sum`-এর মতো built-in নাম variable হিসেবে ব্যবহার কোরো না।
