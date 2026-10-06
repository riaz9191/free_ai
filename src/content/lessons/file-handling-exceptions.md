*Bangla + English mixed notes.* — **Python Module 07**

> 📓 **Class notebook:** `module-07-file-handling-exceptions.ipynb` — [👁️ View](/ai/ml/notebooks/module-07-file-handling-exceptions) / [⬇️ Download](/notebooks/module-07-file-handling-exceptions.ipynb)

> এই module-এ শিখব কীভাবে Python দিয়ে **file read/write** করতে হয়, file-এর cursor (`tell`, `seek`) কীভাবে কাজ করে, আর **Exception Handling** দিয়ে error হলেও program crash না করে কীভাবে চালিয়ে যেতে হয়।

## Roadmap

1. 7.1 File Read
2. 7.2 File Write and Append
3. 7.3 File Cursor — `tell()` and `seek()`
4. 7.4 Practice 1 — Line, Word, Character Counter
5. 7.5 Practice 2 — Write then Read with One `open`
6. 7.6 Exception Handling

### 🎯 Module Goal

Real-world ML/data কাজে data সাধারণত **file**-এ থাকে:

```text
File (disk)
    ↓  read
Python program
    ↓  process
File (disk)  ← write result
```

আর কিছু ভুল হলে (file নেই, 0 দিয়ে ভাগ…) program যেন crash না করে:

```text
try → চেষ্টা করো
except → error হলে handle করো
finally → সবশেষে সবসময় চালাও
```

Main concepts:

- `open()`, `read()`, `readlines()`, `close()`
- `with open(...) as file:`
- File modes: `"r"`, `"w"`, `"a"`, `"w+"`
- `write()`, `writelines()`
- `tell()`, `seek()`, `truncate()`
- `try / except / else / finally`

> **Note:** এই notebook Google Colab-এ লেখা, তাই path `./sample_data/sample.txt` (Colab-এর default sample folder)। নিজের computer-এ চালালে একটা `sample_data` folder বানিয়ে তার মধ্যে নিজের `sample.txt` file তৈরি করে নাও।

Examples-এ `sample.txt`-এর content ছিল এরকম:

```text
Hello world
Welcome to the AI/ML with Phitron
 
```

---

## 7.1 — File Read

### `open()` + `read()` + `close()`

```python
file = open("./sample_data/sample.txt", "r")

content = file.read()

print(type(content))

file.close()
print(file.closed)
```

```text
<class 'str'>
True
```

- `"r"` → read mode।
- `read()` পুরো file একটা **string** হিসেবে দেয়।
- কাজ শেষে `close()` করতে হয়; `file.closed` → `True` মানে বন্ধ হয়েছে।

### `readlines()` — line by line list

```python
file = open("./sample_data/sample.txt", "r")

content = file.readlines()

content = list(map(str.strip, content))

filter_content = list(filter(lambda x: len(x) >= 1, content))

print(filter_content)
```

```text
['Hello world', 'Welcome to the AI/ML with Phitron']
```

- `readlines()` → প্রতিটা line একটা list item (শেষে `\n` সহ)।
- `map(str.strip, ...)` → `\n` আর extra space বাদ।
- `filter(...)` → empty line বাদ। আগের module-এর `map`/`filter` এখানে কাজে লাগলো।

### `with open(...)` — auto close

```python
with open("./sample_data/sample.txt", "r") as file:
    content = file.readlines()
    print(content)

print(file.closed)
```

```text
['Hello world\n', 'Welcome to the AI/ML with Phitron\n', ' ']
True
```

`with` block শেষ হলেই file **automatically close** হয়ে যায় — `close()` লিখতে হয় না। এটাই recommended way।

### File-এর উপর loop

```python
with open("./sample_data/sample.txt", "r") as file:
    for line in file:
        l = line.strip()
        print(l)
```

```text
Hello world
Welcome to the AI/ML with Phitron

```

File object নিজেই iterable — `for line in file` দিয়ে একটা একটা line পড়া যায়। বড় file-এর জন্য এটা memory-friendly।

---

## 7.2 — File Write and Append

### `"w"` — নতুন file তৈরি করে লেখা

```python
# creating a new file and writing there
with open("./sample_data/test.txt", "w") as file:
    file.write("Hello test file\n")
    file.write("How is learning going on ?")
```

`test.txt`-এর content:

```text
Hello test file
How is learning going on ?
```

File না থাকলে `"w"` নতুন file বানায়। `write()` নিজে newline দেয় না — তাই `\n` লিখতে হয়।

### `"w"` আবার — overwrite

```python
# writing on an existing file
# it overwrites the file
with open("./sample_data/test.txt", "w") as file:
    file.write("Second attempt\n")
    file.write("learning is going fast\n")
```

`test.txt`-এর content:

```text
Second attempt
learning is going fast
```

`"w"` mode আগের সব content **মুছে ফেলে** নতুন করে লেখে।

### `"a"` — append (শেষে যোগ)

```python
# no overwriting, just append the text at the end
# append mode
with open("./sample_data/test.txt", "a") as file:
    file.write("The learning of AI/ML is fun\n")
    file.write("I am enjoying the classes")
```

`test.txt`-এর content:

```text
Second attempt
learning is going fast
The learning of AI/ML is fun
I am enjoying the classes
```

`"a"` আগের content রেখে **শেষে** নতুন text যোগ করে।

### `writelines()` — list লেখা

```python
strings = ['hello', 'hi', 'good bye', 'what up']

with open("./sample_data/test2.txt", "a") as file:
    file.writelines(strings)
```

`test2.txt`-এর content:

```text
hellohigood byewhat up
```

`writelines()` list-এর সব string লেখে, কিন্তু মাঝে **newline দেয় না**। আলাদা line চাইলে প্রতিটা string-এর শেষে `\n` রাখতে হবে।

### File modes summary

| Mode | মানে | File না থাকলে | আগের content |
|---|---|---|---|
| `"r"` | Read | Error | অক্ষত |
| `"w"` | Write | নতুন বানায় | মুছে ফেলে |
| `"a"` | Append | নতুন বানায় | রেখে শেষে যোগ |
| `"w+"` | Write + Read | নতুন বানায় | মুছে ফেলে |

---

## 7.3 — File Cursor: `tell()` and `seek()`

File পড়ার সময় একটা **cursor** থাকে — কোথা থেকে পড়া হবে সেটা নির্দেশ করে।

```text
tell()   → cursor এখন কোন position-এ
seek(n)  → cursor-কে position n-এ সরাও
```

> এই তিনটা example চালানোর সময় `sample.txt`-এ শুধু `Hello world` ছিল (11 characters)।

### `read()` এর পরে cursor শেষে চলে যায়

```python
with open("./sample_data/sample.txt", "r") as file:
    print(file.tell())  # cursor এখন কোথায়
    print(file.read())
    print(file.tell())
    # cursor এখন শেষে, তাই আবার read করলে কিছুই পাবো না
    print(file.read())
```

```text
0
Hello world
11

```

প্রথম `read()` এর পর cursor 11-এ (শেষে)। তাই দ্বিতীয় `read()` empty string দেয়।

### `read(n)` — n টা character পড়া

```python
with open("./sample_data/sample.txt", "r") as file:
    print(file.tell())
    print(file.read(5))
    print(file.tell())

    print(file.read())
    print(file.tell())
```

```text
0
Hello
5
 world
11
```

`read(5)` → প্রথম 5টা character। তারপর `read()` বাকিটা (cursor 5 থেকে) পড়ে।

### `seek()` — cursor আবার শুরুতে

```python
# seek
with open("./sample_data/sample.txt", "r") as file:
    print(file.tell())

    print(file.read(5))

    print(file.tell())

    file.seek(0)
    print(file.tell())
    print(file.read(5))
```

```text
0
Hello
5
0
Hello
```

`seek(0)` cursor-কে শুরুতে নিয়ে যায় — তাই আবার `Hello` পড়া গেল।

---

## 7.4 — Practice 1: Line, Word, Character Counter

**Task:** `sample.txt` থেকে text নিয়ে count করো —

- Number of lines
- Number of words
- Number of characters

এবং result `counter_of_string.txt` file-এ save করো।

```python
from functools import reduce

with open("./sample_data/sample.txt", "r") as file:
    string_list = file.readlines()

    # total কয়টা line
    total_lines = len(string_list)

    # প্রতিটা line-এ কয়টা word
    number_of_words = list(map(lambda x: len(x.split()), string_list))
    # total words
    total_number_of_words = reduce(lambda x, y: x + y, number_of_words)

    # cleaning process
    # 1. newline delete
    string_list = list(map(str.strip, string_list))

    # 2. space delete
    string_list = list(map(lambda x: x.replace(" ", ""), string_list))

    # প্রতিটা line-এ কয়টা character
    number_of_character = list(map(lambda x: len(x), string_list))

    # total characters
    total_number_of_characters = reduce(lambda x, y: x + y, number_of_character)

with open("./sample_data/counter_of_string.txt", "w") as file:
    file.write(f"total line: {total_lines}\ntotal number of words:{total_number_of_words}\ntotal number of char: {total_number_of_characters}")
```

`counter_of_string.txt`-এর content:

```text
total line: 3
total number of words:8
total number of char: 38
```

Steps:

```text
readlines()         → line list
len(list)           → lines
split() + reduce    → words
strip + replace(" ") → space ছাড়া characters
reduce              → total
write()             → result save
```

এখানে character count-এ space আর `\n` বাদ দেওয়া হয়েছে।

---

## 7.5 — Practice 2: Write then Read with One `open`

`"w+"` mode-এ একই `open`-এ লেখা আর পড়া দুটোই করা যায়।

```python
with open("./sample_data/write_read.txt", "w+") as file:
    file.write("Hello world")

    print(file.tell())

    file.seek(0)
    print(file.tell())

    print(file.read())

    file.truncate(5)

    file.seek(0)

    print(file.read())
```

```text
11
0
Hello world
Hello
```

- লেখার পর cursor 11-এ — তাই পড়ার আগে `seek(0)` দরকার।
- `truncate(5)` → file-কে প্রথম 5 character-এ কেটে ছোট করে।
- আবার `seek(0)` করে পড়লে শুধু `Hello`।

---

## 7.6 — Exception Handling

### Exception কী?

Program চলার সময় error হলে (যেমন 0 দিয়ে ভাগ) Python **exception** raise করে এবং program থেমে যায়। `try / except` দিয়ে সেই error ধরে handle করা যায়।

### `try / except`

```python
try:
    a = 10 / 0
except ZeroDivisionError:
    print("you cant divide a number by 0")

print("hello world")
```

```text
you cant divide a number by 0
hello world
```

Error ধরা পড়েছে, তাই program crash করেনি — পরের line `hello world` ও চলেছে।

### Multiple `except` + `Exception as e`

```python
try:
    x = y
except ZeroDivisionError:
    print("you cant divide a number by 0")
except Exception as e:
    print(e)

print("hello world")
```

```text
name 'y' is not defined
hello world
```

- এখানে error টা `NameError` (`y` define করা নেই), তাই প্রথম `except` match করেনি।
- `Exception` সব ধরনের error ধরে; `e`-তে error message থাকে।

### `try / except / else / finally`

```python
# model train
try:
    file = open("./sample_data/data1.txt", "r")
except Exception as e:
    print(e)
else:
    # model train
    print(file.read())
finally:
    print("Gpu is stopped")
```

```text
hello
Gpu is stopped
```

(এখানে `data1.txt`-এ `hello` লেখা ছিল।)

```text
try     → risky code (file open)
except  → error হলে চলে
else    → error না হলে চলে
finally → সবসময় চলে (error হোক বা না হোক)
```

File না থাকলে output হতো error message (`[Errno 2] No such file or directory: ...`) + `Gpu is stopped`। ML-এ `finally` দিয়ে resource (GPU, file, connection) সবসময় release করা হয়।

---

## Common Confusions

### `"w"` vs `"a"`

```text
"w" → পুরনো content মুছে নতুন লেখা
"a" → পুরনো content রেখে শেষে যোগ
```

### `read()` vs `readlines()`

```text
read()      → পুরো file একটা string
readlines() → line-এর list (প্রতিটার শেষে \n)
```

### দ্বিতীয়বার `read()` কেন empty?

কারণ cursor শেষে চলে গেছে। আবার পড়তে চাইলে `seek(0)`।

### `write()` / `writelines()` newline দেয় না

নিজে `\n` লিখতে হবে।

### `open()` vs `with open()`

```text
open()      → নিজে close() করতে হয়
with open() → block শেষে auto close
```

### `except` vs `finally`

```text
except  → শুধু error হলে
finally → সবসময়
```

---

## Quick Practice

### Q1

`"w"` mode-এ existing file open করে লিখলে আগের content-এর কী হয়?

### Q2

```python
with open("a.txt", "w") as f:
    f.write("Python")

with open("a.txt", "r") as f:
    print(f.read(2))
    print(f.tell())
```

Output?

### Q3

`with open(...)` block শেষ হলে `file.closed` কত?

### Q4

```python
f.writelines(["a", "b", "c"])
```

File-এ কী লেখা হবে?

### Q5

```python
try:
    print(10 / 0)
except ZeroDivisionError:
    print("Error")
finally:
    print("Done")
```

Output?

### Q6

`else` block কখন চলে?

A. Error হলে  
B. Error না হলে  
C. সবসময়

### Answers

1. **মুছে যায় (overwrite)**
2. **`Py`** তারপর **`2`**
3. **`True`**
4. **`abc`** (newline ছাড়া)
5. **`Error`** তারপর **`Done`**
6. **B**

---

## Final Cheat Sheet

| Concept | Core idea |
|---|---|
| `open(path, mode)` | File open |
| `"r"` / `"w"` / `"a"` / `"w+"` | Read / Overwrite / Append / Write+Read |
| `read()` | পুরো file string |
| `read(n)` | n টা character |
| `readlines()` | Line list |
| `for line in file` | Line by line পড়া |
| `write()` | String লেখা (newline নিজে দিতে হয়) |
| `writelines()` | List লেখা (newline ছাড়া) |
| `close()` / `with` | File বন্ধ / auto close |
| `tell()` | Cursor position |
| `seek(n)` | Cursor সরানো |
| `truncate(n)` | File n character-এ কাটা |
| `try` | Risky code |
| `except X` | X error ধরলে |
| `except Exception as e` | যেকোনো error + message |
| `else` | Error না হলে |
| `finally` | সবসময় |

### One-line Mental Model

> **File handling = disk থেকে data আনা ও রাখা; Exception handling = কিছু ভুল হলেও program-কে সুন্দরভাবে চালিয়ে নেওয়া।**
