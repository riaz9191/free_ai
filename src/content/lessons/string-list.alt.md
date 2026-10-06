*Version 2 — Class notebook code walkthrough (Python Module 03).*

> 📓 **Class notebook:** `module-03-string.ipynb` — [👁️ View](/ai/ml/notebooks/module-03-string) / [⬇️ Download](/notebooks/module-03-string.ipynb) · `module-03-list.ipynb` — [👁️ View](/ai/ml/notebooks/module-03-list) / [⬇️ Download](/notebooks/module-03-list.ipynb)

> Version 1-এ String আর List-এর concept দেখেছি। এখানে class-এর দুইটা notebook (**String** আর **List**) থেকে **সব code cell** clean করে, run করে output সহ দেখানো হলো।

## Roadmap

1. String Basics — single line ও multi-line string
2. Indexing and Slicing
3. String Methods
4. Splitting, Joining, Formatted String
5. List Basics — declaration, access, modification, sorting
6. List as Stack
7. List as Queue
8. List Comprehension

---

## String Basics

### Single line string

```python
# single line string
prompt = "what is your name?"

print(prompt)
print(type(prompt))
```

```text
what is your name?
<class 'str'>
```

Single বা double quote-এর ভিতরে লেখা text হলো `str` type।

### Multi-line string

```python
# multi-line string — triple quote
message = """tell me about yourself ?
what are the issues you've been facing while learning to code ?
How are you tackling them ?
"""

print(message)
```

```text
tell me about yourself ?
what are the issues you've been facing while learning to code ?
How are you tackling them ?

```

Triple quote (`"""`) দিয়ে একাধিক line-এর string লেখা যায়। শেষে একটা ফাঁকা line এসেছে কারণ string-এর শেষে `\n` আছে, আর `print()` নিজেও একটা new line দেয়।

---

## Indexing and Slicing

### Single character access

```python
string = "hello world"

print(string[7])
```

```text
o
```

Index `0` থেকে শুরু: `h=0, e=1, l=2, l=3, o=4, ' '=5, w=6, o=7`।

### Slicing `[start:end]`

```python
first_message = message[0:24]   # index 0 থেকে 23 পর্যন্ত

print(first_message)
```

```text
tell me about yourself ?
```

`[0:24]` মানে index `0` থেকে `23` পর্যন্ত — end index বাদ যায়। এভাবে multi-line message-এর প্রথম প্রশ্নটা আলাদা করা হলো।

### Negative indexing

```python
print(first_message[-1])
print(first_message[-2])
print(first_message[-3])
print(first_message[-4])
print(first_message[-5])
```

```text
?
 
f
l
e
```

`-1` মানে শেষ character, `-2` তার আগেরটা — এভাবে। `-2`-তে একটা space আছে, তাই output-এ ফাঁকা line দেখাচ্ছে।

### String reverse — `[::-1]`

```python
new_first_message = first_message[::-1]

print(new_first_message)
```

```text
? flesruoy tuoba em llet
```

`[start:end:step]`-এ step `-1` দিলে string উল্টো দিক থেকে পড়া হয়।

---

## String Methods

```python
string = "Welcome to Phitron ML Course , Phitron ML , Hello ML"

processed_string = string.lower()

# length
print(len(string))

# word আছে কিনা → bool
print("phitron" in processed_string)

# substring প্রথম কোন index থেকে শুরু হয়েছে
start_index = processed_string.find("phitron")
print(start_index)

# substring শেষবার কোন index থেকে শুরু হয়েছে
last_index = processed_string.rfind("phitron")
print(last_index)

# substring কয়বার আছে
count = processed_string.count("phitron")
print(count)

# substring replace
processed_string = string.replace("ML", "AI/ML")
print(processed_string)
```

```text
52
True
11
31
2
Welcome to Phitron AI/ML Course , Phitron AI/ML , Hello AI/ML
```

`lower()` করে নিলে case-insensitive search করা যায় (`"Phitron"` আর `"phitron"` একই ধরা হয়)। `find()` প্রথম match-এর index দেয়, `rfind()` শেষ match-এর; না পেলে দুটোই `-1` দেয়।

> Notebook-এ `find`, `rfind`, `count`-এর result variable-এ রাখা হয়েছিল কিন্তু print করা হয়নি — এখানে `print()` যোগ করা হয়েছে যাতে value দেখা যায়।

```text
"phitron" in processed_string   → True
processed_string.find("phitron")  → 11
processed_string.rfind("phitron") → 31
processed_string.count("phitron") → 2
```

---

## Splitting, Joining, Formatted String

### `split()` আর `join()`

```python
prompt = "what is Phitron ?"

tokens = prompt.split()
print(tokens)
print(type(tokens))

sentence = "-".join(tokens)
print(sentence)
print(type(sentence))
```

```text
['what', 'is', 'Phitron', '?']
<class 'list'>
what-is-Phitron-?
<class 'str'>
```

`split()` string ভেঙে **list** বানায় (NLP-তে একে tokenization-এর basic রূপ বলা যায়)। `"-".join(list)` list-কে আবার `-` দিয়ে জুড়ে **string** বানায়।

> Notebook-এর output-এ `type(tokens)` ভুলভাবে `<class 'str'>` দেখাচ্ছিল (পুরনো run-এর output)। আসলে `split()` সবসময় `list` return করে।

### Formatted string (f-string)

```python
name = "Adil"
age = 23
height = 5.1123445

info = f"His name is {name.upper()}. He is {age} years old. He is {height:.3} feet tall."
print(info)

model_accuracy = 0.83333

print(f"the model accuracy is {model_accuracy}")
```

```text
His name is ADIL. He is 23 years old. He is 5.11 feet tall.
the model accuracy is 0.83333
```

`f"..."`-এর ভিতরে `{}` দিয়ে variable বা expression (`name.upper()`) সরাসরি বসানো যায়। `{height:.3}` মানে মোট **3টা significant digit** (`5.11`) — decimal-এর পরে 3 digit চাইলে `:.3f` লিখতে হয়।

```text
f"{height:.3}"          → 5.11
f"{height:.3f}"         → 5.112
f"{model_accuracy:.2%}" → 83.33%
```

> Notebook-এ `info` তৈরি করা হয়েছিল কিন্তু print করা হয়নি, আর accuracy-র output (`10.83333`) পুরনো run থেকে এসেছিল। এখানে আসল output দেখানো হয়েছে।

---

## List Basics

> নিচের List cell-গুলো **একটার পর একটা** run করা হয়েছে — প্রতিটা cell আগের cell-এর পরিবর্তিত `numbers` list নিয়ে কাজ করে। (Notebook-এর কিছু output out-of-order re-run থেকে এসেছিল, তাই এখানে sequential run-এর সঠিক output দেখানো হলো।)

### Declaration

```python
numbers = [100, 20, 30, 40, 50, 100, 100]       # int
float_numbers = [10.20, 3.15, 2.4, 2.7, 3.5]    # float
fruits = ['apple', 'orange', 'lichi']           # string
mix = [10, 10.20, 'apple']                      # mixed list

nested_list = [[100, 20, 30], [14, 12, 31], [13, 12, 12]]   # list-এর মধ্যে list

print(numbers)
print(mix)
print(nested_list[1][2])
```

```text
[100, 20, 30, 40, 50, 100, 100]
[10, 10.2, 'apple']
31
```

List-এ যেকোনো type রাখা যায়, এমনকি একসাথে mixed type-ও। Nested list-এ `[1][2]` মানে 2nd row-এর 3rd element — matrix-এর মতো।

### Access, update, slicing

```python
print(numbers[2])

numbers[2] = 90     # list mutable — value বদলানো যায়

print(numbers[2])

new_list = numbers[0:3]

print(new_list)
```

```text
30
90
[100, 20, 90]
```

String-এর মতোই indexing/slicing চলে, কিন্তু list **mutable** — `numbers[2] = 90` দিয়ে সরাসরি value বদলানো যায় (string-এ এটা করা যায় না)।

### Modification — `append`, `insert`, `pop`, `remove`

```python
# শেষে একটা item যোগ
numbers.append(80)
print(numbers)

# যেকোনো position-এ insert
numbers.insert(0, 45)
print(numbers)

# শেষের value delete
numbers.pop()
print(numbers)

# নির্দিষ্ট value delete (প্রথম match-টা)
numbers.remove(100)
print(numbers)
```

```text
[100, 20, 90, 40, 50, 100, 100, 80]
[45, 100, 20, 90, 40, 50, 100, 100, 80]
[45, 100, 20, 90, 40, 50, 100, 100]
[45, 20, 90, 40, 50, 100, 100]
```

`insert(0, 45)` index `0`-তে বসায়। `remove(100)` শুধু **প্রথম** `100`-টা মুছে দেয়, বাকিগুলো থেকে যায়।

### Sorting আর reverse

```python
numbers.sort()
print(numbers)

numbers.reverse()
print(numbers)
```

```text
[20, 40, 45, 50, 90, 100, 100]
[100, 100, 90, 50, 45, 40, 20]
```

`sort()` ছোট থেকে বড় সাজায়; `reverse()` শুধু বর্তমান order উল্টে দেয় (sort করে না)।

```python
numbers.sort(reverse=True)

print(numbers)
```

```text
[100, 100, 90, 50, 45, 40, 20]
```

`sort(reverse=True)` সরাসরি বড় থেকে ছোট (descending) সাজায় — এক step-এ।

---

## List as Stack

```python
stack = []

# stack-এ push
stack.append(1)
stack.append(2)
stack.append(3)
stack.append(4)
stack.append(5)

print(f"top element : {stack[-1]}")

# top element remove (pop)
stack.pop()

# নতুন top element
print(f"top element : {stack[-1]}")
```

```text
top element : 5
top element : 4
```

Stack = **LIFO** (Last In, First Out)। `append()` দিয়ে push, `pop()` দিয়ে শেষেরটা remove, আর `stack[-1]` হলো top।

---

## List as Queue

```python
queue = []

# insertion (enqueue)
queue.append(1)
queue.append(2)
queue.append(3)
queue.append(4)
queue.append(5)

# remove from front (dequeue)
print(queue.pop(0))

# front element দেখা
print(f"front element: {queue[0]}")

queue.pop(0)

print(f"front element: {queue[0]}")
```

```text
1
front element: 2
front element: 3
```

Queue = **FIFO** (First In, First Out)। `pop(0)` সামনের element remove করে return করে। বড় data-তে `pop(0)` slow, তখন `collections.deque` ভালো।

---

## List Comprehension

### Naive loop vs comprehension

Notebook-এ naive (loop দিয়ে) version-টা comment করা ছিল — এখানে run করে দেখানো হলো:

```python
even = []

# naive way
for i in range(101):
    if i % 2 == 0:
        even.append(i)

print(even)
```

```text
[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100]
```

একই কাজ comprehension দিয়ে এক line-এ: `[i for i in range(101) if i % 2 == 0]`।

```python
# odd x নিয়ে প্রতিটার সাথে 10 যোগ
random_list = [x + 10 for x in range(1, 101) if x % 2 != 0]

print(random_list)
```

```text
[11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77, 79, 81, 83, 85, 87, 89, 91, 93, 95, 97, 99, 101, 103, 105, 107, 109]
```

Pattern: `[expression for item in iterable if condition]`। এখানে condition দিয়ে odd `x` filter হয়েছে, তারপর expression `x + 10` apply হয়েছে।

### List of string-এ comprehension

```python
fruits = ['APPLE', 'ORange', 'liCHi']

lower_fruits = [fruit.lower() for fruit in fruits]

print(lower_fruits)
```

```text
['apple', 'orange', 'lichi']
```

প্রতিটা string-এ `lower()` apply করে নতুন list — text data clean করার (normalization) common technique।

> Notebook-এ variable-এর নাম ছিল `upper_fruits`, কিন্তু কাজ করছিল `lower()` — তাই নাম ঠিক করে `lower_fruits` করা হয়েছে।

---

## Quick Recap

- String: single/multi-line (`"""`), indexing `s[i]`, negative index `s[-1]`, slicing `s[a:b]`, reverse `s[::-1]`।
- String methods: `lower()`, `len()`, `in`, `find()`, `rfind()`, `count()`, `replace()`।
- `split()` → string থেকে list; `"sep".join(list)` → list থেকে string।
- f-string: `f"{name.upper()}"`, `{x:.3}` = 3 significant digit, `{x:.3f}` = 3 decimal।
- List mutable: `append`, `insert`, `pop`, `remove`, `sort`, `reverse`, `sort(reverse=True)`।
- Stack (LIFO): `append` + `pop()`; Queue (FIFO): `append` + `pop(0)`।
- Comprehension: `[expr for x in iterable if cond]`।
