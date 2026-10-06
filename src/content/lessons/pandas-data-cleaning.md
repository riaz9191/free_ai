*Bangla + English mixed notes.* — **Python Module 14**

> 📓 **Class notebook:** `module-14-pandas-data-cleaning.ipynb` — [👁️ View](/ai/ml/notebooks/module-14-pandas-data-cleaning) / [⬇️ Download](/notebooks/module-14-pandas-data-cleaning.ipynb)

> আগের module-এ Pandas দিয়ে data load, select, sort, filter শিখেছি। এই module-এর focus হলো **Data Cleaning & Analysis** — missing values, duplicates, নতুন column বানানো, statistics, `apply()`, date-time, আর `groupby()`। ML model-এ data দেওয়ার আগে ঠিক এই কাজগুলোই করতে হয়।

### 📂 Dataset

এই lesson-এ দুইটা CSV লাগবে। Download করে notebook-এর একই folder-এ রাখো:

- [student_data.csv](/datasets/student_data.csv) — 20 জন student-এর marks (কিছু marks missing), status, instructor, location
- [student_completed_data.csv](/datasets/student_completed_data.csv) — 20 জন completed student-এর enrollment date, finished date, total marks (datetime ও groupby part-এর জন্য)

বাকি examples ছোট dictionary দিয়ে code-এর ভিতরেই বানানো হয়েছে।

## Roadmap

1. String Filtering (`str.contains` + regex)
2. Adding New Columns
3. `unique()` and `nunique()`
4. Checking Null Values
5. Handling Duplicate Values
6. Handling Null Values (`dropna`, `fillna`)
7. Statistical Functions
8. `apply()` Function on DataFrame
9. Datetime and Timedelta
10. `groupby()`

### 🎯 Module Goal

Real-world data কখনো clean আসে না:

```text
Raw data
  ├── কিছু value missing (NaN)
  ├── কিছু row duplicate
  ├── date গুলো string হিসেবে আছে
  └── দরকারি column (total, grade) নেই
        ↓
   Data Cleaning + Feature Engineering
        ↓
Clean, model-ready data ✅
```

Main concepts:

- `str.contains()` দিয়ে text-based filtering
- নতুন column — constant, calculation, `np.where`, string split
- `unique()`, `nunique()`
- `isnull()`, `notnull()`, `hasnans`
- `duplicated()`, `drop_duplicates()`
- `dropna()`, `fillna()` (0 / mean দিয়ে)
- `sum`, `min`, `max`, `mean`, `median`, `mode`, `std`, `corr`
- `apply()` — lambda ও custom function
- `pd.to_datetime()`, `.dt.year`, timedelta
- `groupby()` + aggregation

---

## 1. String Filtering

প্রথমে একটা ছোট DataFrame বানাই:

```python
import pandas as pd

data = {
    "Name": ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Hannah", "Sakib"],
    "City": ["New York", "Los Angeles", "Newark", "Boston", "New Delhi", "Chicago", "New Orleans", "Houston", "H Los Ang"],
    "Department": ["HR", "IT", "Finance", "IT", "HR", "Marketing", "Finance", "HR", "HR"],
    "Salary": [50000, 60000, 55000, 70000, 52000, 58000, 62000, 51000, 70000]
}

df = pd.DataFrame(data)
```

```python
df
```

Output:

|  | Name | City | Department | Salary |
|---|---|---|---|---|
| 0 | Alice | New York | HR | 50000 |
| 1 | Bob | Los Angeles | IT | 60000 |
| 2 | Charlie | Newark | Finance | 55000 |
| 3 | David | Boston | IT | 70000 |
| 4 | Eve | New Delhi | HR | 52000 |
| 5 | Frank | Chicago | Marketing | 58000 |
| 6 | Grace | New Orleans | Finance | 62000 |
| 7 | Hannah | Houston | HR | 51000 |
| 8 | Sakib | H Los Ang | HR | 70000 |

### `str.contains()` — text-এর ভিতরে খোঁজা

```python
df.loc[df["City"].str.contains("New")]
```

Output:

|  | Name | City | Department | Salary |
|---|---|---|---|---|
| 0 | Alice | New York | HR | 50000 |
| 2 | Charlie | Newark | Finance | 55000 |
| 4 | Eve | New Delhi | HR | 52000 |
| 6 | Grace | New Orleans | Finance | 62000 |

`.str` দিয়ে column-এর প্রতিটা string-এ string method চালানো যায়। `contains("New")` → যেসব city-তে "New" আছে সেগুলো True। By default **case-sensitive**।

### Case-insensitive search

```python
df.loc[df["City"].str.contains("new", case=False)]
```

Output:

|  | Name | City | Department | Salary |
|---|---|---|---|---|
| 0 | Alice | New York | HR | 50000 |
| 2 | Charlie | Newark | Finance | 55000 |
| 4 | Eve | New Delhi | HR | 52000 |
| 6 | Grace | New Orleans | Finance | 62000 |

`case=False` দিলে "new", "New", "NEW" সব match করবে।

### Regex — শুরুতে (`^`)

```python
# "Los" দিয়ে শুরু
df.loc[df["City"].str.contains(r"^Los")]
```

Output:

|  | Name | City | Department | Salary |
|---|---|---|---|---|
| 1 | Bob | Los Angeles | IT | 60000 |

`contains()` by default **regex** বোঝে। `^` মানে string-এর শুরু। "H Los Ang"-এ Los আছে কিন্তু শুরুতে না, তাই আসেনি।

### Regex — শেষে (`$`)

```python
# "rk" দিয়ে শেষ
df.loc[df["City"].str.contains(r"rk$")]
```

Output:

|  | Name | City | Department | Salary |
|---|---|---|---|---|
| 0 | Alice | New York | HR | 50000 |
| 2 | Charlie | Newark | Finance | 55000 |

`$` মানে string-এর শেষ — "New Yo**rk**", "Newa**rk**"।

### Regex — character set (`[...]`)

```python
# name vowel দিয়ে শুরু
df.loc[df["Name"].str.contains(r"^[AEIOU]")]
```

Output:

|  | Name | City | Department | Salary |
|---|---|---|---|---|
| 0 | Alice | New York | HR | 50000 |
| 4 | Eve | New Delhi | HR | 52000 |

`[AEIOU]` মানে এই character গুলোর যেকোনো একটা। তাই A বা E দিয়ে শুরু হওয়া নাম।

### Regex — OR (`|`)

```python
# City-তে "New" অথবা "Los" আছে
df.loc[df["City"].str.contains(r"New|Los")]
```

Output:

|  | Name | City | Department | Salary |
|---|---|---|---|---|
| 0 | Alice | New York | HR | 50000 |
| 1 | Bob | Los Angeles | IT | 60000 |
| 2 | Charlie | Newark | Finance | 55000 |
| 4 | Eve | New Delhi | HR | 52000 |
| 6 | Grace | New Orleans | Finance | 62000 |
| 8 | Sakib | H Los Ang | HR | 70000 |

Regex-এ `|` মানে OR।

| Pattern | মানে | Example match |
|---|---|---|
| `"New"` | কোথাও "New" আছে | New York, Newark |
| `r"^Los"` | "Los" দিয়ে শুরু | Los Angeles |
| `r"rk$"` | "rk" দিয়ে শেষ | New York |
| `r"^[AEIOU]"` | vowel দিয়ে শুরু | Alice, Eve |
| `r"New\|Los"` | New অথবা Los | New Delhi, H Los Ang |

> **Tip:** Regex special character (যেমন `.`, `+`, `(`) literally খুঁজতে চাইলে `regex=False` দাও।

---

## 2. Adding New Columns

এখন real student dataset load করি:

```python
df = pd.read_csv("student_data.csv")
df
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | NaN | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Mr. Karim | Chattogram |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

*21 rows × 9 columns*

> শেষ row (index `20`) পুরোটা `NaN` — CSV-র শেষ line-এ শুধু commas আছে। এটা আমরা "Handling Null Values" section-এ clean করব।

### Constant value দিয়ে column

```python
# সব row-তে একই value
df["Country"] = "Bangladesh"

df
```

Output:

|  | StudentID | FullName | Data Structure Marks | … | CompletionStatus | EnrollmentDate | Instructor | Location | Country |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | … | Completed | 2024-01-15 | Mr. Karim | Dhaka | Bangladesh |
| 1 | PH1002 | Fatima Akhter | 92.0 | … | In Progress | 2024-01-20 | Ms. Salma | Chattogram | Bangladesh |
| 2 | PH1003 | Imran Hossain | 88.0 | … | Completed | 2024-02-10 | Mr. Karim | Dhaka | Bangladesh |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | … | Completed | 2024-02-12 | Ms. Salma | Sylhet | Bangladesh |
| 4 | PH1005 | Kamal Uddin | NaN | … | In Progress | 2024-03-05 | Mr. Karim | Chattogram | Bangladesh |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | … | Completed | 2025-10-02 | Ms. Salma | Dhaka | Bangladesh |
| 20 | NaN | NaN | NaN | … | NaN | NaN | NaN | NaN | Bangladesh |

*21 rows × 10 columns*

`df["new_col"] = value` — column না থাকলে নতুন তৈরি হয়, সব row-তে একই value বসে। (10+ columns হওয়ায় table-এ মাঝের কিছু column `…` দিয়ে লুকানো।)

### অন্য column থেকে calculate করে

```python
df["Total Marks"] = df["Data Structure Marks"] + df["Python Marks"] + df["Algorithm Marks"]
```

```python
df
```

Output:

|  | StudentID | FullName | Data Structure Marks | … | EnrollmentDate | Instructor | Location | Country | Total Marks |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | … | 2024-01-15 | Mr. Karim | Dhaka | Bangladesh | 258.0 |
| 1 | PH1002 | Fatima Akhter | 92.0 | … | 2024-01-20 | Ms. Salma | Chattogram | Bangladesh | NaN |
| 2 | PH1003 | Imran Hossain | 88.0 | … | 2024-02-10 | Mr. Karim | Dhaka | Bangladesh | 261.0 |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | … | 2024-02-12 | Ms. Salma | Sylhet | Bangladesh | 238.0 |
| 4 | PH1005 | Kamal Uddin | NaN | … | 2024-03-05 | Mr. Karim | Chattogram | Bangladesh | NaN |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | … | 2025-10-02 | Ms. Salma | Dhaka | Bangladesh | 261.0 |
| 20 | NaN | NaN | NaN | … | NaN | NaN | NaN | Bangladesh | NaN |

*21 rows × 11 columns*

Column-wise যোগ — প্রতিটা row-এ আলাদা আলাদা হিসাব হয়, loop লাগে না (**vectorized**)। কিন্তু খেয়াল করো: যেকোনো একটা marks `NaN` হলে Total-ও `NaN` (`85 + NaN = NaN`)।

### Condition দিয়ে — `np.where()`

```python
import numpy as np

df["A+ in DS"] = np.where(df["Data Structure Marks"] > 90, "A+", "A")

df
```

Output:

|  | StudentID | FullName | Data Structure Marks | … | Instructor | Location | Country | Total Marks | A+ in DS |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | … | Mr. Karim | Dhaka | Bangladesh | 258.0 | A |
| 1 | PH1002 | Fatima Akhter | 92.0 | … | Ms. Salma | Chattogram | Bangladesh | NaN | A+ |
| 2 | PH1003 | Imran Hossain | 88.0 | … | Mr. Karim | Dhaka | Bangladesh | 261.0 | A |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | … | Ms. Salma | Sylhet | Bangladesh | 238.0 | A |
| 4 | PH1005 | Kamal Uddin | NaN | … | Mr. Karim | Chattogram | Bangladesh | NaN | A |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | … | Ms. Salma | Dhaka | Bangladesh | 261.0 | A |
| 20 | NaN | NaN | NaN | … | NaN | NaN | Bangladesh | NaN | A |

*21 rows × 12 columns*

`np.where(condition, true_value, false_value)` — Excel-এর `IF()`-এর মতো। শুধু Fatima (92) আর Ziaur (94) পেয়েছে A+। `NaN > 90` হলো False, তাই missing marks-ওয়ালারাও "A" পেয়েছে — এটা একটা hidden bug-এর জায়গা!

### Boolean column

```python
df["Passed in DS"] = df["Data Structure Marks"] > 70

df
```

Output:

|  | StudentID | FullName | Data Structure Marks | … | Location | Country | Total Marks | A+ in DS | Passed in DS |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | … | Dhaka | Bangladesh | 258.0 | A | True |
| 1 | PH1002 | Fatima Akhter | 92.0 | … | Chattogram | Bangladesh | NaN | A+ | True |
| 2 | PH1003 | Imran Hossain | 88.0 | … | Dhaka | Bangladesh | 261.0 | A | True |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | … | Sylhet | Bangladesh | 238.0 | A | True |
| 4 | PH1005 | Kamal Uddin | NaN | … | Chattogram | Bangladesh | NaN | A | False |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | … | Dhaka | Bangladesh | 261.0 | A | True |
| 20 | NaN | NaN | NaN | … | NaN | Bangladesh | NaN | A | False |

*21 rows × 13 columns*

Comparison নিজেই একটা True/False Series দেয় — সেটাকেই column বানানো যায়।

### String split করে

```python
df["First Name"] = df["FullName"].str.split(" ").str[0]

df
```

Output:

|  | StudentID | FullName | Data Structure Marks | … | Country | Total Marks | A+ in DS | Passed in DS | First Name |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | … | Bangladesh | 258.0 | A | True | Alif |
| 1 | PH1002 | Fatima Akhter | 92.0 | … | Bangladesh | NaN | A+ | True | Fatima |
| 2 | PH1003 | Imran Hossain | 88.0 | … | Bangladesh | 261.0 | A | True | Imran |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | … | Bangladesh | 238.0 | A | True | Jannatul |
| 4 | PH1005 | Kamal Uddin | NaN | … | Bangladesh | NaN | A | False | Kamal |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | … | Bangladesh | 261.0 | A | True | Nasir |
| 20 | NaN | NaN | NaN | … | Bangladesh | NaN | A | False | NaN |

*21 rows × 14 columns*

`str.split(" ")` → `["Alif", "Rahman"]` list, তারপর `.str[0]` → প্রথম অংশ।

```python
df
```

Output:

|  | StudentID | FullName | Data Structure Marks | … | Country | Total Marks | A+ in DS | Passed in DS | First Name |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | … | Bangladesh | 258.0 | A | True | Alif |
| 1 | PH1002 | Fatima Akhter | 92.0 | … | Bangladesh | NaN | A+ | True | Fatima |
| 2 | PH1003 | Imran Hossain | 88.0 | … | Bangladesh | 261.0 | A | True | Imran |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | … | Bangladesh | 238.0 | A | True | Jannatul |
| 4 | PH1005 | Kamal Uddin | NaN | … | Bangladesh | NaN | A | False | Kamal |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | … | Bangladesh | 261.0 | A | True | Nasir |
| 20 | NaN | NaN | NaN | … | Bangladesh | NaN | A | False | NaN |

*21 rows × 14 columns*

সব নতুন column একসাথে: `Country`, `Total Marks`, `A+ in DS`, `Passed in DS`, `First Name`।

### Original file কি বদলেছে?

```python
df1 = pd.read_csv("student_data.csv")
df1
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | NaN | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Mr. Karim | Chattogram |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

*21 rows × 9 columns*

না! আমরা শুধু memory-তে থাকা `df` change করেছি। CSV file আগের মতোই আছে।

### নতুন CSV হিসেবে save

```python
df.to_csv("new_data.csv")
```

`to_csv()` দিয়ে modified DataFrame file-এ save হয় (কোনো output দেখায় না)। Tip: `df.to_csv("new_data.csv", index=False)` দিলে index column আলাদা করে save হবে না।

> **ML connection:** নতুন column বানানোকে বলে **Feature Engineering** — raw data থেকে model-এর জন্য useful feature তৈরি করা (যেমন Total Marks, Pass/Fail)।

---

## 3. `unique()` and `nunique()`

```python
data = {
    "Name": ["Alice", "Bob", "Charlie", "Alice", "David", "Bob"],
    "City": ["New York", "London", "Paris", "New York", "Tokyo", "London"],
    "Score": [85, 90, 78, 85, 95, 90]
}

df = pd.DataFrame(data)
df
```

Output:

|  | Name | City | Score |
|---|---|---|---|
| 0 | Alice | New York | 85 |
| 1 | Bob | London | 90 |
| 2 | Charlie | Paris | 78 |
| 3 | Alice | New York | 85 |
| 4 | David | Tokyo | 95 |
| 5 | Bob | London | 90 |

### `unique()` — আলাদা values গুলো

```python
# unique() শুধু Series-এ কাজ করে
df["Name"].unique()
```

Output:

```text
array(['Alice', 'Bob', 'Charlie', 'David'], dtype=object)
```

Duplicate বাদ দিয়ে প্রতিটা value একবার করে — NumPy array হিসেবে।

```python
df1 = pd.read_csv("student_data.csv")

df1
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | NaN | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Mr. Karim | Chattogram |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

*21 rows × 9 columns*

### `nunique()` — কয়টা আলাদা value

```python
print(len(df1["Data Structure Marks"].unique()))

print(df1["Data Structure Marks"].nunique())
```

Output:

```text
13
12
```

Interesting! `len(unique())` = 13 কিন্তু `nunique()` = 12। কারণ `unique()` **`NaN`-কেও** একটা value হিসেবে ধরে, কিন্তু `nunique()` by default `NaN` গোনে না (`dropna=True`)।

### পুরো DataFrame-এ `nunique()`

```python
df.nunique()
```

Output:

```text
Name     4
City     4
Score    4
dtype: int64
```

DataFrame-এ দিলে প্রতিটা column-এর unique count দেয়।

> **ML connection:** `nunique()` দিয়ে বোঝা যায় কোন column **categorical** (কম unique value, যেমন Location) আর কোনটা ID-type (সব unique, যেমন StudentID — model-এ কাজে লাগে না)।

---

## 4. Checking Null Values

### `isnull()` — পুরো DataFrame

```python
df1.isnull()
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | False | False | False | False | False | False | False | False | False |
| 1 | False | False | False | False | True | False | False | False | False |
| 2 | False | False | False | False | False | False | False | False | False |
| 3 | False | False | False | False | False | False | False | False | False |
| 4 | False | False | True | True | False | False | False | False | False |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | False | False | False | False | False | False | False | False | False |
| 20 | True | True | True | True | True | True | True | True | True |

*21 rows × 9 columns*

প্রতিটা cell-এর জন্য True (missing) / False। পুরো table দেখার চেয়ে `df1.isnull().sum()` অনেক useful — প্রতিটা column-এ কয়টা missing সেটা দেয়।

### একটা column-এ `isnull()`

```python
df1["Data Structure Marks"].isnull()
```

Output:

```text
0     False
1     False
2     False
3     False
4      True
5     False
...
18     True
19    False
20     True
Name: Data Structure Marks, Length: 21, dtype: bool
```

### `notnull()` — উল্টোটা

```python
df1["Data Structure Marks"].notnull()
```

Output:

```text
0      True
1      True
2      True
3      True
4     False
5      True
...
18    False
19     True
20    False
Name: Data Structure Marks, Length: 21, dtype: bool
```

`notnull()` = `~isnull()`। Filtering-এ কাজে লাগে: `df1.loc[df1["Python Marks"].notnull()]`।

### `hasnans` — কোনো NaN আছে কি?

```python
df1["Data Structure Marks"].hasnans
```

Output:

```text
True
```

```python
df1["StudentID"].hasnans
```

Output:

```text
True
```

Quick yes/no check। `StudentID`-ও True — কারণ শেষের ওই ফাঁকা row-টা!

### Multiple columns select

```python
df1[["FullName", "StudentID"]]
```

Output:

|  | FullName | StudentID |
|---|---|---|
| 0 | Alif Rahman | PH1001 |
| 1 | Fatima Akhter | PH1002 |
| 2 | Imran Hossain | PH1003 |
| 3 | Jannatul Ferdous | PH1004 |
| 4 | Kamal Uddin | PH1005 |
| ... | ... | ... |
| 19 | Nasir Khan | PH1020 |
| 20 | NaN | NaN |

*21 rows × 2 columns*

Double bracket দিয়ে শুধু দরকারি columns দেখা — null check করার সময় context বুঝতে কাজে লাগে।

---

## 5. Handling Duplicate Values

```python
import pandas as pd

data = {
    "Name": ["Alice", "Bob", "Charlie", "Alice", "David", "Bob"],
    "City": ["New York", "London", "Paris", "New York", "Tokyo", "London"],
    "Score": [85, 90, 78, 70, 95, 90]
}

df = pd.DataFrame(data)
df
```

Output:

|  | Name | City | Score |
|---|---|---|---|
| 0 | Alice | New York | 85 |
| 1 | Bob | London | 90 |
| 2 | Charlie | Paris | 78 |
| 3 | Alice | New York | 70 |
| 4 | David | Tokyo | 95 |
| 5 | Bob | London | 90 |

খেয়াল করো: Alice দুইবার আছে কিন্তু Score আলাদা (85, 70)। Bob দুইবার — সব column হুবহু এক।

### `duplicated()` — কয়টা duplicate row

```python
df.duplicated().sum()
```

Output:

```text
np.int64(1)
```

শুধু row 5 (Bob) **পুরোপুরি** আগের একটা row-এর মতো। Alice-এর score আলাদা হওয়ায় duplicate গোনা হয়নি।

### `drop_duplicates()` — temporary

```python
# duplicate values delete
df.drop_duplicates()
```

Output:

|  | Name | City | Score |
|---|---|---|---|
| 0 | Alice | New York | 85 |
| 1 | Bob | London | 90 |
| 2 | Charlie | Paris | 78 |
| 3 | Alice | New York | 70 |
| 4 | David | Tokyo | 95 |

নতুন DataFrame return করে, original `df` unchanged।

### Permanent delete

```python
# permanent
df.drop_duplicates(inplace=True)
```

```python
df
```

Output:

|  | Name | City | Score |
|---|---|---|---|
| 0 | Alice | New York | 85 |
| 1 | Bob | London | 90 |
| 2 | Charlie | Paris | 78 |
| 3 | Alice | New York | 70 |
| 4 | David | Tokyo | 95 |

এখন `df` থেকে duplicate Bob আসলেই মুছে গেছে।

### `subset` — নির্দিষ্ট column-এর basis-এ

```python
# Name-এর basis-এ duplicate deletion
df.drop_duplicates(subset=["Name"])
```

Output:

|  | Name | City | Score |
|---|---|---|---|
| 0 | Alice | New York | 85 |
| 1 | Bob | London | 90 |
| 2 | Charlie | Paris | 78 |
| 4 | David | Tokyo | 95 |

এখন শুধু `Name` মিলে গেলেই duplicate — তাই দ্বিতীয় Alice (score 70) বাদ।

```python
df
```

Output:

|  | Name | City | Score |
|---|---|---|---|
| 0 | Alice | New York | 85 |
| 1 | Bob | London | 90 |
| 2 | Charlie | Paris | 78 |
| 3 | Alice | New York | 70 |
| 4 | David | Tokyo | 95 |

Original `df` আগের মতোই (inplace দেইনি)।

```python
# City-এর basis-এ
df.drop_duplicates(subset=["City"])
```

Output:

|  | Name | City | Score |
|---|---|---|---|
| 0 | Alice | New York | 85 |
| 1 | Bob | London | 90 |
| 2 | Charlie | Paris | 78 |
| 4 | David | Tokyo | 95 |

### `keep` — কোনটা রাখব?

```python
df.drop_duplicates(subset=["Name"], keep="last")
```

Output:

|  | Name | City | Score |
|---|---|---|---|
| 1 | Bob | London | 90 |
| 2 | Charlie | Paris | 78 |
| 3 | Alice | New York | 70 |
| 4 | David | Tokyo | 95 |

`keep="last"` → শেষের Alice (index 3, score 70) রাখা হয়েছে, প্রথমটা বাদ।

```python
df.drop_duplicates(subset=["Name"], keep="first")
```

Output:

|  | Name | City | Score |
|---|---|---|---|
| 0 | Alice | New York | 85 |
| 1 | Bob | London | 90 |
| 2 | Charlie | Paris | 78 |
| 4 | David | Tokyo | 95 |

`keep="first"` (default) → প্রথমটা রাখে। `keep=False` দিলে duplicate-এর **সবগুলোই** বাদ যায়।

> **ML connection:** Duplicate rows থাকলে model একই example বারবার দেখে bias হয়ে যায়, আর train/test-এ একই row পড়লে accuracy মিথ্যা ভালো দেখায় (data leakage)।

---

## 6. Handling Null Values

```python
df = pd.read_csv("student_data.csv")

df
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | NaN | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Mr. Karim | Chattogram |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

*21 rows × 9 columns*

Missing value handle করার দুইটা main উপায়:

```text
1. Drop  → missing-ওয়ালা row/column বাদ দাও   (dropna)
2. Fill  → কোনো value দিয়ে ভরাট করো           (fillna)
```

### `dropna()` — যেকোনো NaN থাকলেই row বাদ

```python
df.dropna()
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 5 | PH1006 | Laila Begum | 75.0 | 75.0 | 78.0 | Completed | 2024-03-08 | Ms. Salma | Rajshahi |
| 7 | PH1008 | Nadia Islam | 81.0 | 81.0 | 85.0 | Completed | 2024-04-22 | Ms. Salma | Chattogram |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 17 | PH1018 | Babul Ahmed | 88.0 | 88.0 | 85.0 | Completed | 2025-09-05 | Ms. Salma | Sylhet |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |

*13 rows × 9 columns*

21 rows থেকে মাত্র 13 টা বাকি! Default `how="any"` — একটাও NaN থাকলে পুরো row বাদ। অনেক data হারাতে পারো, সাবধান।

```python
df
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | NaN | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Mr. Karim | Chattogram |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

*21 rows × 9 columns*

`inplace` না দেওয়ায় original unchanged।

### `how="all"` — পুরো row NaN হলেই বাদ

```python
df.dropna(how="all", inplace=True)
```

```python
df
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | NaN | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Mr. Karim | Chattogram |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 18 | PH1019 | Faria Rahman | NaN | NaN | NaN | Not Started | 2025-09-15 | Mr. David | Chattogram |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |

*20 rows × 9 columns*

শুধু ওই ফাঁকা row 20 (সব column NaN) মুছে গেছে — বাকি সব student রয়ে গেছে। ফাঁকা row clean করার perfect উপায়।

### `subset` — নির্দিষ্ট column-এ NaN থাকলে

```python
df.dropna(subset=["Python Marks"])
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Mr. Karim | Chattogram |
| 5 | PH1006 | Laila Begum | 75.0 | 75.0 | 78.0 | Completed | 2024-03-08 | Ms. Salma | Rajshahi |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 17 | PH1018 | Babul Ahmed | 88.0 | 88.0 | 85.0 | Completed | 2025-09-05 | Ms. Salma | Sylhet |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |

*15 rows × 9 columns*

শুধু `Python Marks` missing-ওয়ালা rows বাদ (Fatima, Mahmudul, Urmi, Ziaur, Faria)। Kamal-এর DS marks missing হলেও সে আছে।

```python
df.dropna(subset=["Python Marks", "Algorithm Marks"])
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 5 | PH1006 | Laila Begum | 75.0 | 75.0 | 78.0 | Completed | 2024-03-08 | Ms. Salma | Rajshahi |
| 7 | PH1008 | Nadia Islam | 81.0 | 81.0 | 85.0 | Completed | 2024-04-22 | Ms. Salma | Chattogram |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 17 | PH1018 | Babul Ahmed | 88.0 | 88.0 | 85.0 | Completed | 2025-09-05 | Ms. Salma | Sylhet |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |

*13 rows × 9 columns*

দুইটা column-এর যেকোনো একটায় NaN থাকলে বাদ।

```python
df
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | NaN | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Mr. Karim | Chattogram |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 18 | PH1019 | Faria Rahman | NaN | NaN | NaN | Not Started | 2025-09-15 | Mr. David | Chattogram |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |

*20 rows × 9 columns*

### `fillna()` — value দিয়ে ভরাট

```python
df.fillna(0)
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | 0.0 | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 4 | PH1005 | Kamal Uddin | 0.0 | 0.0 | 95.0 | In Progress | 2024-03-05 | Mr. Karim | Chattogram |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 18 | PH1019 | Faria Rahman | 0.0 | 0.0 | 0.0 | Not Started | 2025-09-15 | Mr. David | Chattogram |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |

*20 rows × 9 columns*

সব NaN → 0। কিন্তু marks-এ 0 বসানো ঠিক না — student 0 পায়নি, data নেই! এতে mean অনেক কমে যাবে।

```python
df = pd.read_csv("student_data.csv")

df
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | NaN | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Mr. Karim | Chattogram |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

*21 rows × 9 columns*

Fresh data আবার load করলাম (ফাঁকা row 20 আবার ফিরে এসেছে)।

```python
df.fillna(0)
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | 0.0 | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 4 | PH1005 | Kamal Uddin | 0.0 | 0.0 | 95.0 | In Progress | 2024-03-05 | Mr. Karim | Chattogram |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |
| 20 | 0 | 0 | 0.0 | 0.0 | 0.0 | 0 | 0 | 0 | 0 |

*21 rows × 9 columns*

ফাঁকা row-এর `StudentID`, `FullName`-ও 0 হয়ে গেছে — text column-এ 0 অর্থহীন। তাই column অনুযায়ী আলাদা value দেওয়া ভালো।

### Text column-এ fill

```python
df["FullName"].fillna("unknown")
```

Output:

```text
0          Alif Rahman
1        Fatima Akhter
2        Imran Hossain
3     Jannatul Ferdous
4          Kamal Uddin
5          Laila Begum
...
18        Faria Rahman
19          Nasir Khan
20             unknown
Name: FullName, Length: 21, dtype: object
```

শুধু একটা column-এ fill। Text column-এর জন্য `"unknown"` বা সবচেয়ে common value (mode) ভালো choice।

### Mean দিয়ে fill (Mean Imputation)

```python
df["Python Marks"] = df["Python Marks"].fillna(df["Python Marks"].mean())
```

```python
df
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | 85.666667 | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Mr. Karim | Chattogram |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |
| 20 | NaN | NaN | NaN | NaN | 85.666667 | NaN | NaN | NaN | NaN |

*21 rows × 9 columns*

সব missing Python Marks এখন **85.666667** (বাকি 15 জনের average)। Column-এর overall average বদলায় না।

> ⚠️ **Notebook fix:** Original notebook-এ লেখা ছিল `df['Python Marks'].fillna(df['Python Marks'].mean(), inplace=True)`। এটা **chained assignment** — নতুন Pandas-এ (Copy-on-Write, pandas 3.0) এটা original `df` change করে না, শুধু warning দেয়। সঠিক way: `df["col"] = df["col"].fillna(value)`।

> **Statistics connection:** Statistics Intro lesson-এ দেখেছিলাম — outlier থাকলে mean টেনে নিয়ে যায়, তখন **median** দিয়ে fill করা (`fillna(df["col"].median())`) বেশি safe। Categorical column-এ **mode** দিয়ে fill করা হয়।

---

## 7. Statistical Functions

```python
df
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | 85.666667 | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Mr. Karim | Chattogram |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |
| 20 | NaN | NaN | NaN | NaN | 85.666667 | NaN | NaN | NaN | NaN |

*21 rows × 9 columns*

```python
df.dropna()
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | 85.666667 | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 5 | PH1006 | Laila Begum | 75.0 | 75.0 | 78.0 | Completed | 2024-03-08 | Ms. Salma | Rajshahi |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 17 | PH1018 | Babul Ahmed | 88.0 | 88.0 | 85.0 | Completed | 2025-09-05 | Ms. Salma | Sylhet |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |

*16 rows × 9 columns*

Python Marks fill করার পরে `dropna()` করলে এখন 16 টা row থাকে (আগে ছিল 13) — DS/Algo marks missing-ওয়ালারা এখনো বাদ যায়।

### `sum()`

```python
# sum
df["Data Structure Marks"].sum()
```

Output:

```text
np.float64(1344.0)
```

সব DS marks-এর যোগফল। `NaN` automatically skip হয় (`skipna=True`)।

### `min()` and `max()`

```python
# max and min
print(df["Data Structure Marks"].min())
df["Data Structure Marks"].max()
```

Output:

```text
72.0
np.float64(94.0)
```

সর্বনিম্ন 72, সর্বোচ্চ 94।

### `mean()` — average

```python
# mean -> average
df["Data Structure Marks"].mean()
```

Output:

```text
np.float64(84.0)
```

1344 / 16 = 84.0 (শুধু non-null 16 টা value দিয়ে ভাগ)।

### `median()` — মাঝের value

```python
# median
df["Data Structure Marks"].median()
```

Output:

```text
np.float64(85.5)
```

Sort করলে মাঝের দুইটা (85, 86)-এর average = 85.5। Mean (84) এর চেয়ে বেশি → কিছু কম marks (72, 75) mean-কে নিচে টেনেছে।

### `mode()` — সবচেয়ে বেশিবার আসা value

```python
# mode -> highest frequency-র number
df["Data Structure Marks"].mode()
```

Output:

```text
0    75.0
1    85.0
2    86.0
3    88.0
Name: Data Structure Marks, dtype: float64
```

75, 85, 86, 88 — চারটাই দুইবার করে এসেছে, তাই mode একাধিক। এজন্য `mode()` Series return করে, single number না। একটা চাইলে `mode()[0]`।

### `std()` — standard deviation

```python
# standard deviation -> std
df["Data Structure Marks"].std()
```

Output:

```text
np.float64(6.501281924871945)
```

Marks গড়ে mean থেকে প্রায় ±6.5 দূরে ছড়িয়ে আছে। Std কম = data mean-এর কাছাকাছি।

### `corr()` — correlation matrix

```python
# correlation matrix
df[["Data Structure Marks", "Python Marks"]].corr()
```

Output:

|  | Data Structure Marks | Python Marks |
|---|---|---|
| Data Structure Marks | 1.0 | 0.776845 |
| Python Marks | 0.776845 | 1.0 |

Correlation −1 থেকে +1। এখানে positive — DS-এ ভালো করা student সাধারণত Python-এও ভালো। Diagonal সবসময় 1 (নিজের সাথে নিজে)।

> **ML connection:** `corr()` দিয়ে feature selection হয় — target-এর সাথে বেশি correlated feature useful, আর দুইটা feature নিজেরা খুব বেশি correlated হলে একটা বাদ দেওয়া যায় (redundant)।

### Row-wise sum — `axis=1`

```python
# different columns-এর row-wise sum
df[["Data Structure Marks", "Python Marks"]].sum(axis=1)
```

Output:

```text
0     173.000000
1     177.666667
2     173.000000
3     160.000000
4      95.000000
5     153.000000
...
18     85.666667
19    175.000000
20     85.666667
Length: 21, dtype: float64
```

`axis=1` → প্রতিটা row-এর ভিতরে columns যোগ। খেয়াল করো, এখানে NaN skip হয়েছে (Kamal: শুধু 95) — `+` operator-এর মতো NaN দেয়নি!

### `iloc` দিয়ে Total Marks

```python
df["Total Marks"] = df.iloc[:, 2:5].sum(axis=1)
```

Position 2, 3, 4 = DS, Algo, Python marks — row-wise sum। (Notebook-এ `iloc[::, 2:5]` লেখা ছিল — `::` আর `:` একই, সব rows।)

```python
df
```

Output:

|  | StudentID | FullName | Data Structure Marks | … | CompletionStatus | EnrollmentDate | Instructor | Location | Total Marks |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | … | Completed | 2024-01-15 | Mr. Karim | Dhaka | 258.0 |
| 1 | PH1002 | Fatima Akhter | 92.0 | … | In Progress | 2024-01-20 | Ms. Salma | Chattogram | 269.666667 |
| 2 | PH1003 | Imran Hossain | 88.0 | … | Completed | 2024-02-10 | Mr. Karim | Dhaka | 261.0 |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | … | Completed | 2024-02-12 | Ms. Salma | Sylhet | 238.0 |
| 4 | PH1005 | Kamal Uddin | NaN | … | In Progress | 2024-03-05 | Mr. Karim | Chattogram | 95.0 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | … | Completed | 2025-10-02 | Ms. Salma | Dhaka | 261.0 |
| 20 | NaN | NaN | NaN | … | NaN | NaN | NaN | NaN | 85.666667 |

*21 rows × 10 columns*

ফাঁকা row 20-এর Total = 85.666667 — কারণ শুধু filled Python Marks ছিল, বাকি NaN skip হয়েছে। এটা দেখায় কেন আগে ফাঁকা row মুছে ফেলা জরুরি।

### `describe()` — সব একসাথে

```python
df.describe()
```

Output:

|  | Data Structure Marks | Algorithm Marks | Python Marks | Total Marks |
|---|---|---|---|---|
| count | 16.0 | 16.0 | 21.0 | 21.0 |
| mean | 84.0 | 84.0 | 85.666667 | 213.666667 |
| std | 6.501282 | 6.501282 | 4.512944 | 73.089215 |
| min | 72.0 | 72.0 | 76.0 | 85.666667 |
| 25% | 79.5 | 79.5 | 85.0 | 220.0 |
| 50% | 85.5 | 85.5 | 85.666667 | 247.0 |
| 75% | 88.25 | 88.25 | 88.0 | 261.0 |
| max | 94.0 | 94.0 | 95.0 | 273.666667 |

Python Marks-এর count এখন 21 (সব filled), আর std 5.39 → 4.51 কমে গেছে — mean imputation-এর side effect: data-র spread কৃত্রিমভাবে কমে যায়।

```python
df
```

Output:

|  | StudentID | FullName | Data Structure Marks | … | CompletionStatus | EnrollmentDate | Instructor | Location | Total Marks |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | … | Completed | 2024-01-15 | Mr. Karim | Dhaka | 258.0 |
| 1 | PH1002 | Fatima Akhter | 92.0 | … | In Progress | 2024-01-20 | Ms. Salma | Chattogram | 269.666667 |
| 2 | PH1003 | Imran Hossain | 88.0 | … | Completed | 2024-02-10 | Mr. Karim | Dhaka | 261.0 |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | … | Completed | 2024-02-12 | Ms. Salma | Sylhet | 238.0 |
| 4 | PH1005 | Kamal Uddin | NaN | … | In Progress | 2024-03-05 | Mr. Karim | Chattogram | 95.0 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | … | Completed | 2025-10-02 | Ms. Salma | Dhaka | 261.0 |
| 20 | NaN | NaN | NaN | … | NaN | NaN | NaN | NaN | 85.666667 |

*21 rows × 10 columns*

---

## 8. `apply()` Function on DataFrame

`apply()` দিয়ে একটা function column-এর প্রতিটা value-তে (বা প্রতিটা row-তে) চালানো যায়।

```python
df
```

Output:

|  | StudentID | FullName | Data Structure Marks | … | CompletionStatus | EnrollmentDate | Instructor | Location | Total Marks |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | … | Completed | 2024-01-15 | Mr. Karim | Dhaka | 258.0 |
| 1 | PH1002 | Fatima Akhter | 92.0 | … | In Progress | 2024-01-20 | Ms. Salma | Chattogram | 269.666667 |
| 2 | PH1003 | Imran Hossain | 88.0 | … | Completed | 2024-02-10 | Mr. Karim | Dhaka | 261.0 |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | … | Completed | 2024-02-12 | Ms. Salma | Sylhet | 238.0 |
| 4 | PH1005 | Kamal Uddin | NaN | … | In Progress | 2024-03-05 | Mr. Karim | Chattogram | 95.0 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | … | Completed | 2025-10-02 | Ms. Salma | Dhaka | 261.0 |
| 20 | NaN | NaN | NaN | … | NaN | NaN | NaN | NaN | 85.666667 |

*21 rows × 10 columns*

### Lambda দিয়ে — Min-Max Scaling

```python
# min max scaling
mn = df["Total Marks"].min()
mx = df["Total Marks"].max()

df["Scaled Marks"] = df["Total Marks"].apply(lambda x: (x - mn) / (mx - mn))
```

Formula: `(x − min) / (max − min)` → সব value **0 থেকে 1**-এর মধ্যে চলে আসে।

```python
df
```

Output:

|  | StudentID | FullName | Data Structure Marks | … | EnrollmentDate | Instructor | Location | Total Marks | Scaled Marks |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | … | 2024-01-15 | Mr. Karim | Dhaka | 258.0 | 0.916667 |
| 1 | PH1002 | Fatima Akhter | 92.0 | … | 2024-01-20 | Ms. Salma | Chattogram | 269.666667 | 0.978723 |
| 2 | PH1003 | Imran Hossain | 88.0 | … | 2024-02-10 | Mr. Karim | Dhaka | 261.0 | 0.932624 |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | … | 2024-02-12 | Ms. Salma | Sylhet | 238.0 | 0.810284 |
| 4 | PH1005 | Kamal Uddin | NaN | … | 2024-03-05 | Mr. Karim | Chattogram | 95.0 | 0.049645 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | … | 2025-10-02 | Ms. Salma | Dhaka | 261.0 | 0.932624 |
| 20 | NaN | NaN | NaN | … | NaN | NaN | NaN | 85.666667 | 0.0 |

*21 rows × 11 columns*

সবচেয়ে কম Total = 0.0, সবচেয়ে বেশি = 1.0। খেয়াল করো, 0.0 পেয়েছে ফাঁকা row 20 (Total 85.67), আর Kamal (Total 95, কারণ দুইটা marks missing) প্রায় 0.05 — অর্থাৎ missing data clean না করলে scaling-ও ভুল হয়ে যায়।

> **ML connection:** এটাই **Min-Max Normalization** — ML-এ খুব common preprocessing step। Gradient Descent-এর মতো algorithm-এ features একই scale-এ থাকলে দ্রুত converge করে। (Real project-এ `sklearn.preprocessing.MinMaxScaler` ব্যবহার হয়।)

### Custom function দিয়ে — Grading

```python
# custom built function
def grading_system(marks):
    if marks >= 260:
        return "A+"
    elif marks >= 250:
        return "A"
    else:
        return "A-"


df["Grade"] = df["Total Marks"].apply(grading_system)
```

Series-এ `apply(func)` → প্রতিটা value একে একে function-এ যায়, return value নতুন column-এ বসে। (Kamal-এর Total কম কারণ marks missing, তাই সে "A-" পেয়েছে — আবারও missing data-র effect।)

```python
df
```

Output:

|  | StudentID | FullName | Data Structure Marks | … | Instructor | Location | Total Marks | Scaled Marks | Grade |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | … | Mr. Karim | Dhaka | 258.0 | 0.916667 | A |
| 1 | PH1002 | Fatima Akhter | 92.0 | … | Ms. Salma | Chattogram | 269.666667 | 0.978723 | A+ |
| 2 | PH1003 | Imran Hossain | 88.0 | … | Mr. Karim | Dhaka | 261.0 | 0.932624 | A+ |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | … | Ms. Salma | Sylhet | 238.0 | 0.810284 | A- |
| 4 | PH1005 | Kamal Uddin | NaN | … | Mr. Karim | Chattogram | 95.0 | 0.049645 | A- |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | … | Ms. Salma | Dhaka | 261.0 | 0.932624 | A+ |
| 20 | NaN | NaN | NaN | … | NaN | NaN | 85.666667 | 0.0 | A- |

*21 rows × 12 columns*

### Row-wise apply — `axis=1`

```python
def marking_system(row):
    a = row["Data Structure Marks"] * 2
    b = row["Python Marks"] * 3
    c = row["Algorithm Marks"] * 4

    return a + b + c


df["Exceptional Marks"] = df.apply(marking_system, axis=1)
```

DataFrame-এ `apply(func, axis=1)` → প্রতিটা **row** (Series হিসেবে) function-এ যায়, তাই একাধিক column একসাথে use করা যায়। Weighted score বানানোর মতো। (Notebook-এ parameter-এর নাম ছিল `df` — কাজ করে, কিন্তু confusing, তাই `row` রাখলাম।)

```python
df
```

Output:

|  | StudentID | FullName | Data Structure Marks | … | Location | Total Marks | Scaled Marks | Grade | Exceptional Marks |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | … | Dhaka | 258.0 | 0.916667 | A | 774.0 |
| 1 | PH1002 | Fatima Akhter | 92.0 | … | Chattogram | 269.666667 | 0.978723 | A+ | 809.0 |
| 2 | PH1003 | Imran Hossain | 88.0 | … | Dhaka | 261.0 | 0.932624 | A+ | 783.0 |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | … | Sylhet | 238.0 | 0.810284 | A- | 714.0 |
| 4 | PH1005 | Kamal Uddin | NaN | … | Chattogram | 95.0 | 0.049645 | A- | NaN |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | … | Dhaka | 261.0 | 0.932624 | A+ | 783.0 |
| 20 | NaN | NaN | NaN | … | NaN | 85.666667 | 0.0 | A- | NaN |

*21 rows × 13 columns*

DS বা Algo marks missing হলে Exceptional Marks-ও `NaN` — কারণ এখানে `*` আর `+` operator, যেটা NaN skip করে না।

| Method | কিসে চলে | Use case |
|---|---|---|
| `series.apply(func)` | প্রতিটা value | Grade, scaling |
| `df.apply(func, axis=1)` | প্রতিটা row | একাধিক column মিলিয়ে হিসাব |
| `df.apply(func)` (axis=0) | প্রতিটা column | Column-wise summary |

---

## 9. Datetime and Timedelta

নতুন dataset — completed students, enrollment ও finished date সহ।

```python
df = pd.read_csv("student_completed_data.csv")
df
```

Output:

|  | StudentID | FullName | CompletionStatus | EnrollmentDate | FinishedDate | Instructor | Location | Total Marks |
|---|---|---|---|---|---|---|---|---|
| 0 | PH0001 | Alif Rahman | Completed | 2024-09-01 | 2024-12-23 | Ms. Salma | Khulna | 300 |
| 1 | PH0002 | Fatima Akhter | Completed | 2024-08-11 | 2024-11-07 | Mr. Karim | Dhaka | 271 |
| 2 | PH0003 | Imran Hossain | Completed | 2024-05-08 | 2024-08-08 | Ms. Salma | Dhaka | 269 |
| 3 | PH0004 | Jannatul Ferdous | Completed | 2024-07-05 | 2024-09-23 | Mr. Karim | Khulna | 270 |
| 4 | PH0005 | Kamal Uddin | Completed | 2024-02-01 | 2024-04-17 | Mr. David | Sylhet | 254 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 18 | PH0019 | Faria Rahman | Completed | 2024-04-19 | 2024-08-17 | Mr. Karim | Sylhet | 277 |
| 19 | PH0020 | Tariq Hasan | Completed | 2024-07-21 | 2024-10-11 | Mr. Karim | Khulna | 253 |

*20 rows × 8 columns*

```python
df["EnrollmentDate"]
```

Output:

```text
0     2024-09-01
1     2024-08-11
2     2024-05-08
3     2024-07-05
4     2024-02-01
5     2024-09-07
...
17    2024-06-23
18    2024-04-19
19    2024-07-21
Name: EnrollmentDate, Length: 20, dtype: object
```

`dtype: object` — মানে date গুলো আসলে **string**! String দিয়ে date-এর হিসাব (কয়দিন লাগলো, কোন মাস) করা যায় না।

### `pd.to_datetime()` — string → datetime

```python
df["EnrollmentDate"] = pd.to_datetime(df["EnrollmentDate"])
```

```python
df["EnrollmentDate"]
```

Output:

```text
0    2024-09-01
1    2024-08-11
2    2024-05-08
3    2024-07-05
4    2024-02-01
5    2024-09-07
...
17   2024-06-23
18   2024-04-19
19   2024-07-21
Name: EnrollmentDate, Length: 20, dtype: datetime64[ns]
```

দেখতে প্রায় একই, কিন্তু dtype এখন `datetime64[ns]` — এখন date হিসেবে কাজ করবে।

### `.dt` accessor — year, day বের করা

```python
df["Enrollment Year"] = df["EnrollmentDate"].dt.year
```

```python
df["Enrollment Day"] = df["EnrollmentDate"].dt.day
```

`.dt.year`, `.dt.month`, `.dt.day`, `.dt.day_name()` ইত্যাদি দিয়ে date-এর অংশ আলাদা করা যায়। (Notebook-এ column-এর নাম ছিল `"Enrollment Date"` — কিন্তু এতে শুধু দিন (1–31) আছে, আর `EnrollmentDate`-এর সাথে প্রায় একই নাম হওয়ায় confusing, তাই `"Enrollment Day"` করলাম।)

```python
df
```

Output:

|  | StudentID | FullName | CompletionStatus | … | Instructor | Location | Total Marks | Enrollment Year | Enrollment Day |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH0001 | Alif Rahman | Completed | … | Ms. Salma | Khulna | 300 | 2024 | 1 |
| 1 | PH0002 | Fatima Akhter | Completed | … | Mr. Karim | Dhaka | 271 | 2024 | 11 |
| 2 | PH0003 | Imran Hossain | Completed | … | Ms. Salma | Dhaka | 269 | 2024 | 8 |
| 3 | PH0004 | Jannatul Ferdous | Completed | … | Mr. Karim | Khulna | 270 | 2024 | 5 |
| 4 | PH0005 | Kamal Uddin | Completed | … | Mr. David | Sylhet | 254 | 2024 | 1 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 18 | PH0019 | Faria Rahman | Completed | … | Mr. Karim | Sylhet | 277 | 2024 | 19 |
| 19 | PH0020 | Tariq Hasan | Completed | … | Mr. Karim | Khulna | 253 | 2024 | 21 |

*20 rows × 10 columns*

### Timedelta — দুই date-এর পার্থক্য

```python
df["FinishedDate"] = pd.to_datetime(df["FinishedDate"])
```

```python
df["Total time taken to finish"] = df["FinishedDate"] - df["EnrollmentDate"]
```

দুইটা datetime বিয়োগ করলে পাওয়া যায় **Timedelta** (সময়ের ব্যবধান)।

```python
df
```

Output:

|  | StudentID | FullName | CompletionStatus | … | Location | Total Marks | Enrollment Year | Enrollment Day | Total time taken to finish |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH0001 | Alif Rahman | Completed | … | Khulna | 300 | 2024 | 1 | 113 days |
| 1 | PH0002 | Fatima Akhter | Completed | … | Dhaka | 271 | 2024 | 11 | 88 days |
| 2 | PH0003 | Imran Hossain | Completed | … | Dhaka | 269 | 2024 | 8 | 92 days |
| 3 | PH0004 | Jannatul Ferdous | Completed | … | Khulna | 270 | 2024 | 5 | 80 days |
| 4 | PH0005 | Kamal Uddin | Completed | … | Sylhet | 254 | 2024 | 1 | 76 days |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 18 | PH0019 | Faria Rahman | Completed | … | Sylhet | 277 | 2024 | 19 | 120 days |
| 19 | PH0020 | Tariq Hasan | Completed | … | Khulna | 253 | 2024 | 21 | 82 days |

*20 rows × 11 columns*

যেমন Alif: 2024-09-01 → 2024-12-23 = 113 days। Number হিসেবে চাইলে `.dt.days` ব্যবহার করো।

> **ML connection:** Date column সরাসরি model-এ দেওয়া যায় না। তাই year, month, day-of-week, "কতদিন লেগেছে" — এরকম numeric features বের করা হয়। এটা time-based **feature engineering**।

---

## 10. `groupby()`

`groupby()` = **Split → Apply → Combine**:

```text
        df
        ↓  split by Instructor
 ┌──────────┬──────────┬──────────┐
 │Mr. David │Mr. Karim │Ms. Salma │
 └──────────┴──────────┴──────────┘
        ↓  apply sum / min / max ...
        ↓  combine
   একটা summary table
```

```python
group = df.groupby("Instructor")
```

এটা শুধু একটা GroupBy object বানায় — এখনো কোনো হিসাব হয়নি।

### Unnecessary columns বাদ

```python
df.drop(columns=["StudentID", "FullName", "CompletionStatus", "EnrollmentDate", "FinishedDate"], inplace=True)
```

ID/name-এর মতো text columns aggregate করার মানে নেই, তাই বাদ দিলাম। Raw datetime columns-ও বাদ — কারণ দুইটা date "যোগ" করা যায় না, `group.sum()` তখন `TypeError: datetime64 type does not support sum operations` দেয়। (Notebook-এর drop cell-এ শুধু প্রথম তিনটা column ছিল, কিন্তু output দেখে বোঝা যায় date columns-ও আগেই বাদ দেওয়া হয়েছিল — তাই এখানে explicit করে দিলাম।) `df` change হয়েছে, তাই group আবার বানাতে হবে।

```python
group = df.groupby("Instructor")
```

### `sum()`

```python
group.sum()
```

Output:

| Instructor | Location | Total Marks | Enrollment Year | Enrollment Day | Total time taken to finish |
|---|---|---|---|---|---|
| Mr. David | SylhetKhulnaChattogramDhakaDhakaSylhetRajshahiKhulnaDhaka | 2399 | 18216 | 108 | 662 days |
| Mr. Karim | DhakaKhulnaDhakaSylhetSylhetSylhetKhulna | 1911 | 14168 | 86 | 658 days |
| Ms. Salma | KhulnaDhakaKhulnaRajshahi | 1049 | 8096 | 54 | 335 days |

প্রতিটা instructor-এর students-এর Total Marks যোগফল, আর total time। খেয়াল করো:

- `Location` (string)-এর sum = সব নাম জোড়া লাগানো — অর্থহীন
- Year-এর sum (2024 × students) — অর্থহীন

শুধু numeric meaningful column চাইলে `group["Total Marks"].sum()` বা `group.sum(numeric_only=True)` ব্যবহার করো।

### `min()` and `max()`

```python
group.min()
```

Output:

| Instructor | Location | Total Marks | Enrollment Year | Enrollment Day | Total time taken to finish |
|---|---|---|---|---|---|
| Mr. David | Chattogram | 236 | 2024 | 1 | 43 days |
| Mr. Karim | Dhaka | 253 | 2024 | 4 | 80 days |
| Ms. Salma | Dhaka | 234 | 2024 | 1 | 40 days |

প্রতিটা group-এর সর্বনিম্ন value (string-এর ক্ষেত্রে alphabetically প্রথম)। Ms. Salma-র সবচেয়ে fast student 40 days-এ শেষ করেছে।

```python
group.max()
```

Output:

| Instructor | Location | Total Marks | Enrollment Year | Enrollment Day | Total time taken to finish |
|---|---|---|---|---|---|
| Mr. David | Sylhet | 291 | 2024 | 23 | 115 days |
| Mr. Karim | Sylhet | 291 | 2024 | 21 | 120 days |
| Ms. Salma | Rajshahi | 300 | 2024 | 23 | 113 days |

### `first()` and `last()`

```python
group.first()
```

Output:

| Instructor | Location | Total Marks | Enrollment Year | Enrollment Day | Total time taken to finish |
|---|---|---|---|---|---|
| Mr. David | Sylhet | 254 | 2024 | 1 | 76 days |
| Mr. Karim | Dhaka | 271 | 2024 | 11 | 88 days |
| Ms. Salma | Khulna | 300 | 2024 | 1 | 113 days |

প্রতিটা group-এর **প্রথম row**-এর values (original order অনুযায়ী)।

```python
group.last()
```

Output:

| Instructor | Location | Total Marks | Enrollment Year | Enrollment Day | Total time taken to finish |
|---|---|---|---|---|---|
| Mr. David | Dhaka | 278 | 2024 | 23 | 89 days |
| Mr. Karim | Khulna | 253 | 2024 | 21 | 82 days |
| Ms. Salma | Rajshahi | 234 | 2024 | 23 | 90 days |

প্রতিটা group-এর শেষ row।

```python
df
```

Output:

|  | Instructor | Location | Total Marks | Enrollment Year | Enrollment Day | Total time taken to finish |
|---|---|---|---|---|---|---|
| 0 | Ms. Salma | Khulna | 300 | 2024 | 1 | 113 days |
| 1 | Mr. Karim | Dhaka | 271 | 2024 | 11 | 88 days |
| 2 | Ms. Salma | Dhaka | 269 | 2024 | 8 | 92 days |
| 3 | Mr. Karim | Khulna | 270 | 2024 | 5 | 80 days |
| 4 | Mr. David | Sylhet | 254 | 2024 | 1 | 76 days |
| ... | ... | ... | ... | ... | ... | ... |
| 18 | Mr. Karim | Sylhet | 277 | 2024 | 19 | 120 days |
| 19 | Mr. Karim | Khulna | 253 | 2024 | 21 | 82 days |

*20 rows × 6 columns*

### প্রতিটা group-এর Top N

```python
df.sort_values("Total Marks", ascending=False).groupby("Instructor").head(5)
```

Output:

|  | Instructor | Location | Total Marks | Enrollment Year | Enrollment Day | Total time taken to finish |
|---|---|---|---|---|---|---|
| 0 | Ms. Salma | Khulna | 300 | 2024 | 1 | 113 days |
| 8 | Mr. Karim | Dhaka | 291 | 2024 | 12 | 117 days |
| 14 | Mr. David | Rajshahi | 291 | 2024 | 22 | 84 days |
| 9 | Mr. David | Dhaka | 286 | 2024 | 19 | 61 days |
| 13 | Mr. David | Sylhet | 285 | 2024 | 4 | 79 days |
| ... | ... | ... | ... | ... | ... | ... |
| 7 | Ms. Salma | Khulna | 246 | 2024 | 22 | 40 days |
| 15 | Ms. Salma | Rajshahi | 234 | 2024 | 23 | 90 days |

*14 rows × 6 columns*

প্রথমে Total Marks দিয়ে descending sort, তারপর প্রতিটা instructor-এর top 5 student। (Ms. Salma-র মাত্র 4 জন student, তাই মোট 14 rows।) Leaderboard বানানোর classic pattern।

### Kernel restart-এর পর

Notebook-এ এরপর kernel restart হয়েছিল, তাই `df` চালাতেই error এসেছিল:

```python
df
```

```text
NameError: name 'df' is not defined
```

Kernel restart করলে memory-র সব variable মুছে যায় — আবার import ও load করতে হয়:

```python
import pandas as pd

df = pd.read_csv("student_completed_data.csv")
df
```

Output:

|  | StudentID | FullName | CompletionStatus | EnrollmentDate | FinishedDate | Instructor | Location | Total Marks |
|---|---|---|---|---|---|---|---|---|
| 0 | PH0001 | Alif Rahman | Completed | 2024-09-01 | 2024-12-23 | Ms. Salma | Khulna | 300 |
| 1 | PH0002 | Fatima Akhter | Completed | 2024-08-11 | 2024-11-07 | Mr. Karim | Dhaka | 271 |
| 2 | PH0003 | Imran Hossain | Completed | 2024-05-08 | 2024-08-08 | Ms. Salma | Dhaka | 269 |
| 3 | PH0004 | Jannatul Ferdous | Completed | 2024-07-05 | 2024-09-23 | Mr. Karim | Khulna | 270 |
| 4 | PH0005 | Kamal Uddin | Completed | 2024-02-01 | 2024-04-17 | Mr. David | Sylhet | 254 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 18 | PH0019 | Faria Rahman | Completed | 2024-04-19 | 2024-08-17 | Mr. Karim | Sylhet | 277 |
| 19 | PH0020 | Tariq Hasan | Completed | 2024-07-21 | 2024-10-11 | Mr. Karim | Khulna | 253 |

*20 rows × 8 columns*

### Condition count

```python
df["Total Marks"] > 250
```

Output:

```text
0      True
1      True
2      True
3      True
4      True
5      True
...
17     True
18     True
19     True
Name: Total Marks, Length: 20, dtype: bool
```

```python
(df["Total Marks"] > 250).sum()
```

Output:

```text
np.int64(15)
```

True = 1, False = 0 — তাই Boolean Series-এর `sum()` মানে **কয়টা True**। 20 জনের মধ্যে 15 জন 250-এর বেশি পেয়েছে — এক line-এ count।

> **ML connection:** `groupby()` দিয়ে EDA-তে category-wise pattern দেখা হয় (কোন instructor-এর students ভালো করছে), আর group-wise mean দিয়ে missing value fill করা যায়: `df["col"].fillna(df.groupby("Instructor")["col"].transform("mean"))`।

---

## Common Confusions

### `unique()` vs `nunique()`

```text
unique()   → values গুলো দেয় (array), NaN সহ
nunique()  → কয়টা আলাদা value (number), NaN বাদে
```

### `isnull()` vs `notnull()` vs `hasnans`

```text
isnull()   → প্রতিটা cell: missing হলে True
notnull()  → প্রতিটা cell: value থাকলে True
hasnans    → পুরো Series-এ অন্তত একটা NaN আছে? (একটা True/False)
```

### `dropna()` options

```text
dropna()                      → যেকোনো NaN থাকলেই row বাদ
dropna(how="all")             → পুরো row NaN হলে বাদ
dropna(subset=["col"])        → শুধু ওই column-এ NaN হলে বাদ
```

### `+` vs `sum(axis=1)` — NaN behavior

```python
df["a"] + df["b"]              # কোনো একটা NaN হলে → NaN
df[["a", "b"]].sum(axis=1)     # NaN skip করে বাকিগুলো যোগ
```

### Chained `inplace` — কাজ নাও করতে পারে

```python
df["col"].fillna(0, inplace=True)    # ❌ নতুন Pandas-এ df change হয় না
df["col"] = df["col"].fillna(0)      # ✅
```

### `duplicated()` — পুরো row vs subset

```text
duplicated()                  → সব column মিললে তবেই duplicate
duplicated(subset=["Name"])   → শুধু Name মিললেই duplicate
```

### `apply()` on Series vs DataFrame

```text
df["col"].apply(f)        → f(value)  প্রতিটা value-তে
df.apply(f, axis=1)       → f(row)    প্রতিটা row-তে
```

---

## Quick Practice

### Q1

```python
df["City"].str.contains(r"^New")
```

এটা কোন city গুলো match করবে — "New York", "Newark", "Old New Town"?

### Q2

```python
s = pd.Series([10, 20, None, 20, 30])
```

`s.unique()`-এর length আর `s.nunique()` কত?

### Q3

একটা DataFrame থেকে শুধু সেই rows বাদ দাও যেগুলোর **সব** column NaN।

### Q4

`Age` column-এর missing values median দিয়ে fill করার সঠিক code লেখো।

### Q5

```python
df = pd.DataFrame({"Name": ["A", "B", "A"], "Score": [1, 2, 3]})
df.drop_duplicates(subset=["Name"], keep="last")
```

কোন rows থাকবে?

### Q6

`Price` column-কে 0–1 range-এ scale করার জন্য `apply` + lambda দিয়ে code লেখো।

### Q7

`Department` অনুযায়ী average `Salary` বের করো।

### Answers

1. **"New York" আর "Newark"** — `^` মানে শুরুতে; "Old New Town"-এ New মাঝে আছে
2. **`len(unique())` = 4** (10, 20, NaN, 30), **`nunique()` = 3**
3. **`df.dropna(how="all")`**
4. **`df["Age"] = df["Age"].fillna(df["Age"].median())`**
5. **Index 1 (B, 2) আর index 2 (A, 3)** — শেষের A রাখা হয়েছে
6. **`mn, mx = df["Price"].min(), df["Price"].max()`** তারপর **`df["Price_scaled"] = df["Price"].apply(lambda x: (x - mn) / (mx - mn))`**
7. **`df.groupby("Department")["Salary"].mean()`**

---

## Final Cheat Sheet

| Task | Code |
|---|---|
| Text contains | `df["col"].str.contains("x", case=False)` |
| Regex start / end / OR | `r"^x"` / `r"x$"` / `r"a\|b"` |
| New constant column | `df["new"] = value` |
| Calculated column | `df["t"] = df["a"] + df["b"]` |
| Conditional column | `np.where(cond, "yes", "no")` |
| Split string | `df["col"].str.split(" ").str[0]` |
| Save CSV | `df.to_csv("file.csv", index=False)` |
| Unique values / count | `s.unique()` / `s.nunique()` |
| Null check | `df.isnull().sum()`, `s.hasnans` |
| Duplicates count | `df.duplicated().sum()` |
| Remove duplicates | `df.drop_duplicates(subset=[...], keep="first")` |
| Drop NaN | `df.dropna(how="any"/"all", subset=[...])` |
| Fill NaN | `df["c"] = df["c"].fillna(df["c"].mean())` |
| Stats | `sum()`, `min()`, `max()`, `mean()`, `median()`, `mode()`, `std()` |
| Correlation | `df[["a", "b"]].corr()` |
| Row-wise sum | `df[cols].sum(axis=1)` |
| Apply on values | `s.apply(lambda x: ...)` |
| Apply on rows | `df.apply(func, axis=1)` |
| String → date | `pd.to_datetime(df["col"])` |
| Date parts | `.dt.year`, `.dt.month`, `.dt.day` |
| Date difference | `df["end"] - df["start"]` → Timedelta |
| Group summary | `df.groupby("col").sum()` / `.mean()` / `.max()` |
| Top N per group | `df.sort_values(c, ascending=False).groupby(g).head(n)` |
| Count condition | `(df["col"] > x).sum()` |

### One-line Mental Model

> **Clean করো (null, duplicate) → নতুন feature বানাও (column, apply, datetime) → summarize করো (stats, groupby) — এটাই model-ready data-র pipeline।**
