*Bangla + English mixed notes.* — **Python Module 07** (course lesson-by-lesson notes)

> 📓 **Class notebook:** `module-07-file-handling-exceptions.ipynb` — [👁️ View](/ai/ml/notebooks/module-07-file-handling-exceptions) / [⬇️ Download](/notebooks/module-07-file-handling-exceptions.ipynb)

**Total:** 1 hr 42 min | **12/12 units**

> এই module-এ শিখব Python দিয়ে file create/read/write করা, file-এর ভিতরে position control করা এবং error হলে program safely handle করা।

---

## 📚 Exact Course Roadmap

1. **Text Instructions Module 07** — Post content
2. **7.1 File Handling Basics** — 7 min
3. **7.2 File Read** — 15 min
4. **7.3 File Write and Append** — 14 min
5. **7.4 File Pointer** — 13 min
6. **7.5 Practice Problems on File** — 26 min
7. **7.6 Exceptions and why handling them** — 7 min
8. **7.7 Try Except, Else and Finally Block** — 15 min
9. **7.8 Module Overview** — 5 min
10. **Quiz Module 07** — Quiz
11. **Quiz Explanation and Extra Practice Problem (Module 07)** — Post content
12. **সার্টিফিকেট ... (Module 07)** — Post content

*শেষের Bengali post-এর পুরো title screenshot-এ ছোট/অস্পষ্ট; তাই সেটার wording আন্দাজ করে বাড়ানো হয়নি।*

---

## 7.1 File Handling Basics

### File Handling কী?

Program থেকে computer-এর file-এ data **read** বা **write** করার process-কে File Handling বলে।

Examples:
- `.txt` file-এ notes save করা
- CSV file থেকে dataset পড়া
- Program-এর result file-এ রাখা
- Log file তৈরি করা

### File open করা

Python-এ `open()` দিয়ে file খোলা হয়।

```python
file = open("notes.txt", "r")
```

এখানে:
- `"notes.txt"` = file name/path
- `"r"` = read mode

কাজ শেষে file close করতে হয়:

```python
file.close()
```

Better approach হলো `with` ব্যবহার করা:

```python
with open("notes.txt", "r") as file:
    content = file.read()
    print(content)
```

`with` block শেষ হলে file automatically close হয়—এটাই recommended pattern।

---

## 7.2 File Read

ধরো `notes.txt`-এর ভিতরে আছে:

```text
Hello Python
I am learning file handling.
```

### `read()`

পুরো file পড়তে:

```python
with open("notes.txt", "r") as file:
    content = file.read()
    print(content)
```

### `readline()`

একবারে একটি line পড়ে:

```python
with open("notes.txt", "r") as file:
    first_line = file.readline()
    print(first_line)
```

পরের `readline()` call পরের line পড়বে।

### `readlines()`

সব line list হিসেবে দেয়:

```python
with open("notes.txt", "r") as file:
    lines = file.readlines()

print(lines)
```

Possible result:

```python
["Hello Python\n", "I am learning file handling.\n"]
```

### Loop দিয়ে line-by-line পড়া

বড় file-এর ক্ষেত্রে একবারে পুরো file memory-তে না তুলে line ধরে পড়া useful:

```python
with open("notes.txt", "r") as file:
    for line in file:
        print(line.strip())
```

`strip()` line-এর শুরু/শেষের whitespace এবং newline remove করে।

---

## 7.3 File Write and Append

### Write mode — `"w"`

```python
with open("notes.txt", "w") as file:
    file.write("Learning Python!")
```

- File না থাকলে create হয়।
- File থাকলে পুরোনো content overwrite/truncate হয়।

**সতর্কতা:** `"w"` mode পুরোনো content মুছে নতুন করে লেখে।

### Append mode — `"a"`

```python
with open("notes.txt", "a") as file:
    file.write("\nLearning Machine Learning!")
```

- File না থাকলে create হয়।
- File থাকলে existing content রেখে শেষে নতুন content add হয়।

### Multiple lines write

```python
lines = ["Python\n", "Machine Learning\n", "Data Science\n"]

with open("topics.txt", "w") as file:
    file.writelines(lines)
```

`writelines()` নিজে থেকে line-এর মাঝে newline যোগ করে না; তাই string-গুলোর মধ্যে `\n` দেওয়া হয়েছে।

### Common file modes

| Mode | Meaning |
|---|---|
| `"r"` | Read; file থাকতে হবে |
| `"w"` | Write; পুরোনো content overwrite |
| `"a"` | Append; শেষে content যোগ |
| `"x"` | নতুন file create; আগে থেকে থাকলে error |
| `"r+"` | Read এবং write |
| `"b"` | Binary mode modifier, যেমন `"rb"` |
| `"t"` | Text mode modifier; default |

---

## 7.4 File Pointer

### File Pointer কী?

File-এর ভিতরে বর্তমানে কোন position থেকে read/write হবে, সেটাই file pointer-এর current position।

```python
with open("sample.txt", "r") as file:
    print(file.tell())
    content = file.read(5)
    print(content)
    print(file.tell())
```

- `tell()` current position জানায়।
- `read(5)` পাঁচটি character পড়ে।
- পড়ার পর pointer সামনে এগিয়ে যায়।

### `seek()`

Pointer-কে নির্দিষ্ট position-এ move করতে:

```python
with open("sample.txt", "r") as file:
    print(file.read(5))
    file.seek(0)
    print(file.read(5))
```

`seek(0)` pointer-কে শুরুতে ফিরিয়ে নেয়।

Mental model:

```text
File:  P y t h o n
       0 1 2 3 4 5

read(3) → "Pyt"
Pointer → পরের position

seek(0) → আবার শুরুতে
```

Text file-এ সাধারণত `seek(0)`-এর মতো beginning-এ ফেরানো সহজ ও common। Binary file-এ byte position নিয়ে আরও precise কাজ করা যায়।

---

## 7.5 Practice Problems on File

### Problem 1 — Create and write a file

```python
with open("student.txt", "w") as file:
    file.write("Name: Riaz\n")
    file.write("Course: Python")
```

এতে `student.txt` তৈরি হবে এবং দুই line লেখা হবে।

### Problem 2 — Read a file

```python
with open("student.txt", "r") as file:
    print(file.read())
```

### Problem 3 — Append new content

```python
with open("student.txt", "a") as file:
    file.write("\nStatus: Learning")
```

পুরোনো content থাকবে, শেষে নতুন line যোগ হবে।

### Problem 4 — Count lines

```python
count = 0

with open("student.txt", "r") as file:
    for line in file:
        count += 1

print("Total lines:", count)
```

### Problem 5 — Count words

```python
word_count = 0

with open("student.txt", "r") as file:
    for line in file:
        word_count += len(line.split())

print("Total words:", word_count)
```

### Problem 6 — Copy content to another file

```python
with open("student.txt", "r") as source:
    content = source.read()

with open("backup.txt", "w") as destination:
    destination.write(content)
```

এখানে প্রথমে source file read, তারপর destination file-এ write করা হয়েছে।

---

## 7.6 Exceptions and Why Handling Them

### Exception কী?

Program চলার সময় কোনো unexpected problem হলে exception তৈরি হতে পারে।

Examples:
- যে file নেই, সেটা open করতে যাওয়া
- number-এর বদলে text-কে integer বানাতে যাওয়া
- zero দিয়ে divide করা
- List-এর বাইরে index access করা

Example:

```python
number = int("hello")
```

এতে `ValueError` হবে।

### Common exceptions

| Exception | কখন হতে পারে |
|---|---|
| `FileNotFoundError` | File পাওয়া যায়নি |
| `ValueError` | Value-এর type/format expected নয় |
| `TypeError` | Incompatible type operation |
| `ZeroDivisionError` | Zero দিয়ে division |
| `IndexError` | List/sequence-এর invalid index |
| `KeyError` | Dictionary-তে missing key access |

### কেন exception handle করব?

Exception handle না করলে program error-এ থেমে যেতে পারে।

Handling করলে:
- User-friendly message দেওয়া যায়
- Program-এর unexpected stop কমানো যায়
- Alternative action নেওয়া যায়
- File বা resource safely close করা যায়

---

## 7.7 Try, Except, Else and Finally Block

### Basic `try` and `except`

যে code-এ error হওয়ার সম্ভাবনা আছে সেটা `try` block-এ রাখি।

```python
try:
    number = int(input("Enter a number: "))
    print(10 / number)
except ValueError:
    print("Please enter a valid number.")
except ZeroDivisionError:
    print("Cannot divide by zero.")
```

কী হচ্ছে?
- `try`: risky code run করে।
- `except`: নির্দিষ্ট exception হলে handle করে।

### `else`

`try` block-এ কোনো exception না হলে `else` execute হয়।

```python
try:
    number = int(input("Enter a number: "))
except ValueError:
    print("Invalid input")
else:
    print("You entered:", number)
```

### `finally`

Error হোক বা না হোক, `finally` block execute হয়।

```python
try:
    file = open("notes.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("File not found.")
else:
    print(content)
finally:
    print("File operation finished.")
```

এই example-এ file open হলে সেটি close করার জন্য `with` ব্যবহার করাই আরও safe/recommended। `finally` resource cleanup-এর ধারণা বোঝাতে দেখানো হয়েছে।

### All together — execution flow

```text
       try block
           |
     Exception হলো?
       /       \
     Yes        No
      |          |
   except      else
       \        /
        finally
           |
       Continue
```

### Catching a general exception

```python
try:
    result = 10 / 0
except Exception as error:
    print("Something went wrong:", error)
```

`except Exception` অনেক ধরনের সাধারণ exception ধরতে পারে। তবে সম্ভব হলে নির্দিষ্ট exception যেমন `ValueError` বা `FileNotFoundError` handle করাই ভালো।

---

## 7.8 Module Overview

এই module-এর main flow:

```text
File Handling
    ↓
Open a file
    ↓
Read / Write / Append
    ↓
File Pointer: tell() / seek()
    ↓
File-based practice
    ↓
Exceptions
    ↓
try / except / else / finally
```

### ML / Data Science Connection

File handling data science-এ খুব কাজে লাগে:
- CSV/text dataset read করা
- Processed data save করা
- Model output/log save করা
- Configuration বা experiment result রাখা

বাস্তবে CSV-এর জন্য Python-এর `csv` module বা Pandas-এর `read_csv()` / `to_csv()` বেশি convenient হতে পারে। তবে file handling-এর basic concept জানা জরুরি।

---

## ❗ Common Confusions

| Concept | মনে রাখবে |
|---|---|
| `"r"` | Read |
| `"w"` | Write; old content overwrite |
| `"a"` | Append at end |
| `read()` | পুরো content বা নির্দিষ্ট সংখ্যক character |
| `readline()` | একটি line |
| `readlines()` | সব line-এর list |
| `write()` | String write করে |
| `writelines()` | String sequence write করে; newline নিজে যোগ করে না |
| `tell()` | Current pointer position |
| `seek()` | Pointer move |
| Exception | Runtime-এ হওয়া error condition |
| `try` | Risky code |
| `except` | Error handle |
| `else` | Error না হলে run |
| `finally` | দুই ক্ষেত্রেই run |

---

## 📝 Quick Practice

#### Q1
কোন mode existing file-এর পুরোনো content overwrite করে?

A. `"r"`  
B. `"w"`  
C. `"a"`

#### Q2
কোন mode file-এর শেষে নতুন content যোগ করে?

A. `"a"`  
B. `"r"`  
C. `"x"`

#### Q3
`file.read()` কী করে?

A. File delete করে  
B. File content পড়ে  
C. File rename করে

#### Q4
`file.tell()` কী জানায়?

A. File size only  
B. Current file pointer position  
C. File name

#### Q5
`file.seek(0)` কী করে?

A. File বন্ধ করে  
B. Pointer-কে শুরুতে নেয়  
C. File delete করে

#### Q6
যে file নেই সেটা `"r"` mode-এ open করলে কোন exception হতে পারে?

A. `ValueError`  
B. `FileNotFoundError`  
C. `IndexError`

#### Q7
`try` block-এ exception না হলে কোন block run করে?

A. `else`  
B. `except`  
C. কোনো block না

#### Q8
Error হোক বা না হোক কোন block run করে?

A. `try`  
B. `finally`  
C. `except`

#### Q9
`int("hello")` করলে কোন exception হয়?

A. `ValueError`  
B. `KeyError`  
C. `FileNotFoundError`

#### Q10
File automatically close করার recommended pattern কোনটি?

A. `with open(...) as file:`  
B. শুধু `open(...)`  
C. `print(file)`

---

## ✅ Answers

1. **B — `"w"`**
2. **A — `"a"`**
3. **B — File content পড়ে**
4. **B — Current pointer position**
5. **B — Pointer-কে শুরুতে নেয়**
6. **B — `FileNotFoundError`**
7. **A — `else`**
8. **B — `finally`**
9. **A — `ValueError`**
10. **A — `with open(...) as file:`**

---

## 🎯 Final Cheat Sheet

| Topic | Core idea |
|---|---|
| `open()` | File open |
| `with` | Block শেষে file auto-close |
| `"r"` | Read |
| `"w"` | Write / overwrite |
| `"a"` | Append |
| `read()` | Content read |
| `readline()` | One line read |
| `readlines()` | Lines as a list |
| `write()` | Content write |
| `tell()` | Pointer position |
| `seek()` | Pointer move |
| Exception | Runtime problem |
| `try` | Risky code |
| `except` | Handle error |
| `else` | No exception হলে |
| `finally` | Always execute |

### One-line Mental Model

> **File Handling = file থেকে data read/write করা; Exception Handling = unexpected error হলেও program-কে controlledভাবে চালানো।**
