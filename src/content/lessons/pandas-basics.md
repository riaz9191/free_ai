*Bangla + English mixed notes.* — **Python Module 12**

> 📓 **Class notebook:** `module-12-pandas-basics.ipynb` — [👁️ View](/ai/ml/notebooks/module-12-pandas-basics) / [⬇️ Download](/notebooks/module-12-pandas-basics.ipynb)

> এই module-এ আমরা **Pandas** শিখব — Python-এ table-shaped data (rows + columns) নিয়ে কাজ করার সবচেয়ে popular library। ML-এর প্রায় প্রতিটা project শুরু হয় `pd.read_csv()` দিয়ে, তাই এই module-টা পুরো Data Science journey-এর foundation।

### 📂 Dataset

এই lesson-এর সব code এই CSV file দিয়ে চলে। Download করে তোমার notebook-এর একই folder-এ রাখো:

- [student_data.csv](/datasets/student_data.csv) — 20 জন student-এর marks, status, enrollment date, instructor, location

> Notebook-এ `phitron_student_marks.xlsx`, `students.parquet`, `data.json` file-ও read করা হয়েছে — এগুলো শুধু "different file format কিভাবে load করে" দেখানোর জন্য। এই files দেওয়া নেই, তাই ওই অংশে notebook-এর real output দেখানো হয়েছে।

## Roadmap

1. Pandas Intro — DataFrame vs Series
2. Different File Loading in Pandas (CSV, Excel, Parquet, JSON)
3. Pandas Basic Functionalities (`head`, `tail`, `info`, `sample`, `describe`)
4. Transforming Built-in Data to DataFrame (list, tuple, dict)
5. Accessing Values from DataFrame (`[]`, `loc`)
6. Changing Index & Columns, `iloc`
7. Changing Values & Iteration (`drop`, update, `iterrows`, `itertuples`)
8. Sorting (`sort_values`)
9. Filtering Data Based on Condition

### 🎯 Module Goal

Raw data সাধারণত এরকম একটা file-এ থাকে:

```text
student_data.csv
StudentID,FullName,Data Structure Marks,...
PH1001,Alif Rahman,85,...
PH1002,Fatima Akhter,92,...
```

Pandas এটাকে একটা **table (DataFrame)** বানিয়ে দেয়, যেটা নিয়ে আমরা:

```text
Load → Explore → Select → Modify → Sort → Filter
```

সব করতে পারি — মাত্র কয়েক line code দিয়ে।

Main concepts:

- `DataFrame` (পুরো table) vs `Series` (একটা column / row)
- `read_csv`, `read_excel`, `read_parquet`, `read_json`
- `head()`, `tail()`, `info()`, `describe()`, `sample()`
- `loc` (label দিয়ে) vs `iloc` (position দিয়ে)
- `drop`, `rename`, `set_index`
- `sort_values`
- Boolean filtering — `df.loc[condition]`

---

## 1. Pandas Intro — DataFrame vs Series

### Pandas কী?

Pandas হলো একটা Python library যেটা দিয়ে **tabular data** (Excel sheet-এর মতো data) সহজে load, clean, analyze করা যায়। Convention হলো `pd` নামে import করা।

Pandas-এর দুইটা main structure:

| Structure | কী | Example |
|---|---|---|
| `DataFrame` | 2D table — rows + columns | পুরো student sheet |
| `Series` | 1D — একটা column (বা একটা row) | শুধু `StudentID` column |

```text
DataFrame
┌──────────┬──────────────┬─────────┐
│ StudentID│ FullName     │ ...     │
├──────────┼──────────────┼─────────┤
│ PH1001   │ Alif Rahman  │ ...     │   ← row (index 0)
│ PH1002   │ Fatima Akhter│ ...     │   ← row (index 1)
└──────────┴──────────────┴─────────┘
     ↑
  প্রতিটা column = একটা Series
```

### CSV load করা

```python
import pandas as pd

df = pd.read_csv("student_data.csv")
print(df)
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

`pd.read_csv()` file পড়ে একটা DataFrame return করে। বাম পাশের `0, 1, 2...` হলো **index** (row label)।

> **খেয়াল করো:** শেষ row (index `20`) পুরোটা `NaN`! কারণ CSV file-এর একদম শেষ line-এ শুধু commas আছে (`,,,,,,,,`) — মানে একটা ফাঁকা row। Real-world data-তে এরকম "dirty" row প্রায়ই থাকে। এই module-এ আমরা এটা রেখেই কাজ করব; পরের module (Data Cleaning)-এ `dropna(how="all")` দিয়ে এটা পরিষ্কার করব।

```python
print(type(df))
```

Output:

```text
<class 'pandas.core.frame.DataFrame'>
```

পুরো table-টা হলো `DataFrame` type।

```python
student_id = df["StudentID"]

# print(student_id)

print(type(student_id))
```

Output:

```text
<class 'pandas.core.series.Series'>
```

একটা column বের করলে সেটা হয় `Series` — মানে DataFrame = অনেকগুলো Series পাশাপাশি।

---

## 2. Different File Loading in Pandas

Real world-এ data সব সময় CSV-তে থাকে না। Pandas প্রায় সব common format পড়তে পারে — সব function-এর নাম `pd.read_<format>()`।

| Format | Function | কোথায় দেখা যায় |
|---|---|---|
| CSV | `pd.read_csv()` | সবচেয়ে common, Kaggle datasets |
| Excel | `pd.read_excel()` | Office/business data |
| Parquet | `pd.read_parquet()` | Big data, fast & compressed |
| JSON | `pd.read_json()` | Web API response |

### CSV file

```python
# csv file
csv_data = pd.read_csv("student_data.csv")

print(csv_data)

print(type(csv_data))
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

```text
<class 'pandas.core.frame.DataFrame'>
```

### Excel file

```python
# excel file
excel_file = pd.read_excel("phitron_student_marks.xlsx")

print(excel_file)
print(type(excel_file))
```

Output (notebook থেকে):

```text
   StudentID          FullName  ...  Instructor    Location
0     PH1001       Alif Rahman  ...   Mr. Karim       Dhaka
1     PH1002     Fatima Akhter  ...   Ms. Salma  Chattogram
2     PH1003     Imran Hossain  ...   Mr. Karim       Dhaka
3     PH1004  Jannatul Ferdous  ...   Ms. Salma      Sylhet
4     PH1005       Kamal Uddin  ...   Mr. Karim  Chattogram
...
18    PH1019      Faria Rahman  ...   Mr. David  Chattogram
19    PH1020        Nasir Khan  ...   Ms. Salma       Dhaka

[20 rows x 9 columns]
<class 'pandas.core.frame.DataFrame'>
```

একই data Excel format-এ — result একই DataFrame। (`.xlsx` পড়তে `openpyxl` package install থাকা লাগে।)

### Parquet file

```python
# parquet file
parquet_file = pd.read_parquet("students.parquet")

print(parquet_file)

print(type(parquet_file))
```

Output (notebook থেকে):

```text
   StudentID          FullName  ...  Instructor    Location
0     PH1001       Alif Rahman  ...   Mr. Karim       Dhaka
1     PH1002     Fatima Akhter  ...   Ms. Salma  Chattogram
2     PH1003     Imran Hossain  ...   Mr. Karim       Dhaka
...
19    PH1020        Nasir Khan  ...   Ms. Salma       Dhaka

[20 rows x 9 columns]
<class 'pandas.core.frame.DataFrame'>
```

Parquet হলো column-based binary format — বড় dataset-এ CSV-এর চেয়ে অনেক fast ও ছোট size। (`pyarrow` লাগে।)

### JSON file

```python
# json file
json_file = pd.read_json("data.json")

print(json_file)

print(type(json_file))
```

Output (notebook থেকে):

```text
  StudentID          FullName  ...  Algorithm Marks  Python Marks
0    PH1001       Alif Rahman  ...               85            88
1    PH1002     Fatima Akhter  ...               92            90
2    PH1004  Jannatul Ferdous  ...               78            82

[3 rows x 5 columns]
<class 'pandas.core.frame.DataFrame'>
```

JSON-এর list of objects সরাসরি rows হয়ে যায়। Format যেটাই হোক, শেষে সবই **DataFrame** — এটাই Pandas-এর power।

---

## 3. Pandas Basic Functionalities

Data load করার পর প্রথম কাজ: **data-টা দেখতে কেমন?** — এটাকে বলে data exploration / EDA-এর প্রথম step।

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

Notebook-এ cell-এর শেষ line-এ শুধু `df` লিখলে সুন্দর table হিসেবে দেখায় (`print` লাগে না)।

### `head()` — প্রথম কিছু rows

```python
# প্রথম কিছু row (default 5)
df.head(4)
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | NaN | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |

`head(n)` প্রথম `n` টা row দেয়। বড় dataset-এ পুরোটা print না করে এভাবে peek করা হয়।

### `tail()` — শেষের কিছু rows

```python
# শেষের কিছু row (default 5)
df.tail()
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 16 | PH1017 | Afsana Mimi | 90.0 | 90.0 | 93.0 | Completed | 2025-09-01 | Mr. Karim | Dhaka |
| 17 | PH1018 | Babul Ahmed | 88.0 | 88.0 | 85.0 | Completed | 2025-09-05 | Ms. Salma | Sylhet |
| 18 | PH1019 | Faria Rahman | NaN | NaN | NaN | Not Started | 2025-09-15 | Mr. David | Chattogram |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

### `columns` — column names

```python
import numpy as np

df.columns
col = np.array(df.columns)

print(col)
print(col.dtype)
```

Output:

```text
['StudentID' 'FullName' 'Data Structure Marks' 'Algorithm Marks'
 'Python Marks' 'CompletionStatus' 'EnrollmentDate' 'Instructor'
 'Location']
object
```

`df.columns` সব column-এর নাম দেয়। String হওয়ায় NumPy array-তে dtype `object`।

### `index` — row labels

```python
# index
df.index
ind = np.array(df.index)
print(ind)
print(ind.dtype)
```

Output:

```text
[ 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20]
int64
```

Default index হলো `0` থেকে `n-1` integer (`RangeIndex`)।

### `info()` — data-র summary

```python
df.info()
```

Output:

```text
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 21 entries, 0 to 20
Data columns (total 9 columns):
 #   Column                Non-Null Count  Dtype  
---  ------                --------------  -----  
 0   StudentID             20 non-null     object 
 1   FullName              20 non-null     object 
 2   Data Structure Marks  16 non-null     float64
 3   Algorithm Marks       16 non-null     float64
 4   Python Marks          15 non-null     float64
 5   CompletionStatus      20 non-null     object 
 6   EnrollmentDate        20 non-null     object 
 7   Instructor            20 non-null     object 
 8   Location              20 non-null     object 
dtypes: float64(3), object(6)
memory usage: 1.6+ KB
```

`info()` খুব important — এক নজরে দেখায়:

- কয়টা row (`21 entries` — 20 জন student + ওই ফাঁকা row)
- প্রতিটা column-এ কয়টা **non-null** value — `StudentID`-এ 20 (শুধু ফাঁকা row-টা missing), কিন্তু `Python Marks`-এ মাত্র 15 মানে আরও 5 জন student-এর marks missing!
- Data type (`float64`, `object` = string)

> **ML connection:** Model train করার আগে `info()` দিয়ে missing values আর wrong dtype ধরা হয়। Missing value handle করা পরের module-এ (Data Cleaning) শিখব।

### `sample()` — random rows

```python
df.sample(10)
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | NaN | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 5 | PH1006 | Laila Begum | 75.0 | 75.0 | 78.0 | Completed | 2024-03-08 | Ms. Salma | Rajshahi |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 18 | PH1019 | Faria Rahman | NaN | NaN | NaN | Not Started | 2025-09-15 | Mr. David | Chattogram |
| 11 | PH1012 | Sadia Chowdhury | 85.0 | 85.0 | 87.0 | Completed | 2024-06-14 | Ms. Salma | Chattogram |
| 13 | PH1014 | Urmi Akter | NaN | NaN | NaN | Not Started | 2024-07-09 | Ms. Salma | Rajshahi |
| 0 | PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |
| 6 | PH1007 | Mahmudul Hasan | 80.0 | 80.0 | NaN | In Progress | 2024-04-01 | Mr. Karim | Dhaka |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

`sample(n)` random `n` টা row দেয় — প্রতিবার run করলে আলাদা rows আসে।

```python
df.sample(10)
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 18 | PH1019 | Faria Rahman | NaN | NaN | NaN | Not Started | 2025-09-15 | Mr. David | Chattogram |
| 15 | PH1016 | Ziaur Rahman | 94.0 | 94.0 | NaN | In Progress | 2024-08-21 | Ms. Salma | Chattogram |
| 11 | PH1012 | Sadia Chowdhury | 85.0 | 85.0 | 87.0 | Completed | 2024-06-14 | Ms. Salma | Chattogram |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | NaN | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| 10 | PH1011 | Rahim Sheikh | NaN | NaN | 91.0 | In Progress | 2024-06-11 | Mr. Karim | Khulna |
| 17 | PH1018 | Babul Ahmed | 88.0 | 88.0 | 85.0 | Completed | 2025-09-05 | Ms. Salma | Sylhet |
| 14 | PH1015 | Wahiduzzaman | 86.0 | 86.0 | 84.0 | Completed | 2024-08-18 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 7 | PH1008 | Nadia Islam | 81.0 | 81.0 | 85.0 | Completed | 2024-04-22 | Ms. Salma | Chattogram |

দেখো, দ্বিতীয়বার আলাদা rows এসেছে। Fixed result চাইলে `df.sample(10, random_state=42)` লেখো।

### `describe()` — statistical summary

```python
# statistical values
df.describe()
```

Output:

|  | Data Structure Marks | Algorithm Marks | Python Marks |
|---|---|---|---|
| count | 16.0 | 16.0 | 15.0 |
| mean | 84.0 | 84.0 | 85.666667 |
| std | 6.501282 | 6.501282 | 5.394 |
| min | 72.0 | 72.0 | 76.0 |
| 25% | 79.5 | 79.5 | 83.0 |
| 50% | 85.5 | 85.5 | 85.0 |
| 75% | 88.25 | 88.25 | 88.5 |
| max | 94.0 | 94.0 | 95.0 |

শুধু numeric columns-এর জন্য count, mean, std, min, quartiles (25%, 50% = median, 75%), max দেয়।

> **Statistics connection:** Statistics Intro lesson-এ যে mean, median, std শিখেছিলে — `describe()` সব একসাথে দেয়। `count` কম হলে বুঝবে missing value আছে।

---

## 4. Transforming Built-in Data to DataFrame

শুধু file থেকে না — Python-এর list, tuple, dict থেকেও DataFrame বানানো যায়।

### List of lists থেকে

```python
my_list = [["Alice", 25], ["Bob", 30], ["Charlie", 28]]

list_df = pd.DataFrame(my_list, columns=["Name", "Age"], index=[1, 2, 3])

print(type(list_df))

list_df
```

Output:

```text
<class 'pandas.core.frame.DataFrame'>
```

|  | Name | Age |
|---|---|---|
| 1 | Alice | 25 |
| 2 | Bob | 30 |
| 3 | Charlie | 28 |

প্রতিটা inner list = একটা row। `columns=` দিয়ে column name, `index=` দিয়ে custom row label দেওয়া যায়।

### Tuple of tuples থেকে

```python
my_tuple = (("Alice", 25), ("Bob", 30), ("Charlie", 28))

tuple_df = pd.DataFrame(my_tuple, columns=["Name", "Age"])

tuple_df
```

Output:

|  | Name | Age |
|---|---|---|
| 0 | Alice | 25 |
| 1 | Bob | 30 |
| 2 | Charlie | 28 |

Tuple-ও list-এর মতোই কাজ করে। Index না দিলে default `0, 1, 2`।

### Dictionary of lists থেকে

```python
my_dict = {
    "Name": ["Alice", "Bob", "Charlie"],
    "Age": [25, 29, 28]
}

dict_df = pd.DataFrame(my_dict)

dict_df
```

Output:

|  | Name | Age |
|---|---|---|
| 0 | Alice | 25 |
| 1 | Bob | 29 |
| 2 | Charlie | 28 |

এখানে **key = column name**, value list = ওই column-এর values। এটাই সবচেয়ে common way।

### List of dictionaries থেকে

```python
my_data = [
    {"Name": "Alice", "Age": 25, "City": "New York"},
    {"Name": "Bob", "Age": 30, "City": "Paris"},
    {"Name": "Charlie", "Age": 28}
]

data_df = pd.DataFrame(my_data)

data_df
```

Output:

|  | Name | Age | City |
|---|---|---|---|
| 0 | Alice | 25 | New York |
| 1 | Bob | 30 | Paris |
| 2 | Charlie | 28 | NaN |

প্রতিটা dict = একটা row। Charlie-র `City` নেই, তাই Pandas automatically `NaN` (missing value) বসিয়ে দিয়েছে।

```python
print(type(data_df["Name"]))
```

Output:

```text
<class 'pandas.core.series.Series'>
```

আবারও — একটা column মানেই Series।

| Input | প্রতিটা item মানে |
|---|---|
| List of lists / tuples | একটা row |
| Dict of lists | key = column, list = values |
| List of dicts | একটা row (key = column) |

---

## 5. Accessing Values from DataFrame

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

### একটা column

```python
# accessing a column
df["FullName"]

type(df["FullName"])
```

Output:

```text
<class 'pandas.core.series.Series'>
```

`df["column_name"]` → Series।

### `loc` — label দিয়ে access

Syntax:

```text
df.loc[row_label, column_label]
df.loc[row_start:row_end, col_start:col_end]
```

```python
# df.loc[row_start:row_end, col_start:col_end]

df.loc[0]

type(df.loc[0])
```

Output:

```text
<class 'pandas.core.series.Series'>
```

`df.loc[0]` → index label `0` এর পুরো row, সেটাও একটা Series (column names হয়ে যায় Series-এর index)।

### Multiple rows (list দিয়ে)

```python
# multiple row (normal list)
df.loc[[2, 3, 19]]
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |

Double bracket `[[...]]` — ভিতরের list-এ যে labels দাও শুধু সেগুলো আসবে।

### Multiple rows (range দিয়ে)

```python
# multiple row (range)
df.loc[3:7]
```

Output:

|  | StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Mr. Karim | Chattogram |
| 5 | PH1006 | Laila Begum | 75.0 | 75.0 | 78.0 | Completed | 2024-03-08 | Ms. Salma | Rajshahi |
| 6 | PH1007 | Mahmudul Hasan | 80.0 | 80.0 | NaN | In Progress | 2024-04-01 | Mr. Karim | Dhaka |
| 7 | PH1008 | Nadia Islam | 81.0 | 81.0 | 85.0 | Completed | 2024-04-22 | Ms. Salma | Chattogram |

⚠️ `loc`-এ slice-এর **end inclusive** — `3:7` মানে 3, 4, 5, 6, **7** (5 rows)। Normal Python slicing-এর মতো না!

### Single column (সব rows)

```python
# single column
df.loc[:, "Python Marks"]
```

Output:

```text
0     88.0
1      NaN
2     85.0
3     82.0
4     95.0
5     78.0
...
18     NaN
19    89.0
20     NaN
Name: Python Marks, Length: 21, dtype: float64
```

`:` মানে "সব rows"। `NaN` গুলো missing marks।

### Multiple columns

```python
# multiple column
df.loc[:, ["Python Marks", "Algorithm Marks"]]

type(df.loc[:, ["Python Marks", "Algorithm Marks"]])
```

Output:

```text
<class 'pandas.core.frame.DataFrame'>
```

একাধিক column নিলে result আবার DataFrame।

### Rows + column একসাথে

```python
# row with columns
df.loc[3:7, "CompletionStatus"]
```

Output:

```text
3      Completed
4    In Progress
5      Completed
6    In Progress
7      Completed
Name: CompletionStatus, dtype: object
```

Row 3–7 এর শুধু `CompletionStatus` column।

---

## 6. Changing Index & Columns, `iloc`

### `set_index()` — একটা column-কে index বানানো

```python
df_index = df.set_index("StudentID")

df_index
```

Output:

| StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|
| PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed | 2024-01-15 | Mr. Karim | Dhaka |
| PH1002 | Fatima Akhter | 92.0 | 92.0 | NaN | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Mr. Karim | Chattogram |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

*21 rows × 8 columns*

এখন row label হলো `PH1001`, `PH1002`... — `df_index.loc["PH1005"]` দিয়ে student ID দিয়েই row পাওয়া যাবে। Original `df` বদলায়নি (নতুন DataFrame return করেছে)।

### `iloc` — position দিয়ে access

```python
df_index.iloc[:, 0:5]
```

Output:

| StudentID | FullName | Data Structure Marks | Algorithm Marks | Python Marks | CompletionStatus |
|---|---|---|---|---|---|
| PH1001 | Alif Rahman | 85.0 | 85.0 | 88.0 | Completed |
| PH1002 | Fatima Akhter | 92.0 | 92.0 | NaN | In Progress |
| PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed |
| PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed |
| PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress |
| ... | ... | ... | ... | ... | ... |
| PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed |
| NaN | NaN | NaN | NaN | NaN | NaN |

*21 rows × 5 columns*

`iloc` = **integer location**। Label যাই হোক, position (0, 1, 2...) দিয়ে কাজ করে। `0:5` মানে column position 0–4 (**end exclusive**, normal Python-এর মতো)।

| | `loc` | `iloc` |
|---|---|---|
| কী দিয়ে | Label/name | Integer position |
| Slice end | **Inclusive** | **Exclusive** |
| Example | `df.loc[3:7, "Location"]` | `df.iloc[3:8, 8]` |

### `rename()` — column-এর নাম পরিবর্তন

```python
df.rename(columns={"FullName": "Full Name", "Algorithm Marks": "Algo Marks"}, inplace=True)

df
```

Output:

|  | StudentID | Full Name | Data Structure Marks | Algo Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
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

`columns={old: new}` dict দিয়ে rename। `inplace=True` মানে original `df`-ই change হবে (নতুন copy return না করে)।

---

## 7. Changing Values & Iteration

```python
df
```

Output:

|  | StudentID | Full Name | Data Structure Marks | Algo Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
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

### Row delete — `drop()`

```python
# row deletion
df.drop(0, inplace=True)

df
```

Output:

|  | StudentID | Full Name | Data Structure Marks | Algo Marks | Python Marks | CompletionStatus | EnrollmentDate | Instructor | Location |
|---|---|---|---|---|---|---|---|---|---|
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | NaN | In Progress | 2024-01-20 | Ms. Salma | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Mr. Karim | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Ms. Salma | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Mr. Karim | Chattogram |
| 5 | PH1006 | Laila Begum | 75.0 | 75.0 | 78.0 | Completed | 2024-03-08 | Ms. Salma | Rajshahi |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Ms. Salma | Dhaka |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

*20 rows × 9 columns*

Index label `0` (Alif Rahman) এর row মুছে গেছে। Index আর `0` থেকে শুরু হচ্ছে না — Pandas automatically re-number করে না।

### Column delete

```python
# column deletion
df.drop("Instructor", axis=1, inplace=True)

df
```

Output:

|  | StudentID | Full Name | Data Structure Marks | Algo Marks | Python Marks | CompletionStatus | EnrollmentDate | Location |
|---|---|---|---|---|---|---|---|---|
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | NaN | In Progress | 2024-01-20 | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Chattogram |
| 5 | PH1006 | Laila Begum | 75.0 | 75.0 | 78.0 | Completed | 2024-03-08 | Rajshahi |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Dhaka |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

*20 rows × 8 columns*

`axis=1` মানে column (default `axis=0` = row)। এখন 8 টা column।

```text
axis=0 → rows ↓
axis=1 → columns →
```

### Single value update

```python
df.loc[1, "Python Marks"] = 90

df.loc[1, "CompletionStatus"] = "Completed"
df.head(5)
```

Output:

|  | StudentID | Full Name | Data Structure Marks | Algo Marks | Python Marks | CompletionStatus | EnrollmentDate | Location |
|---|---|---|---|---|---|---|---|---|
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | 90.0 | Completed | 2024-01-20 | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 85.0 | Completed | 2024-02-10 | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 82.0 | Completed | 2024-02-12 | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Chattogram |
| 5 | PH1006 | Laila Begum | 75.0 | 75.0 | 78.0 | Completed | 2024-03-08 | Rajshahi |

`df.loc[row, column] = value` — Fatima-র missing Python Marks এখন 90, status Completed।

### Multiple values update

```python
df.loc[1:3, "Python Marks"] += 2
df.head()
```

Output:

|  | StudentID | Full Name | Data Structure Marks | Algo Marks | Python Marks | CompletionStatus | EnrollmentDate | Location |
|---|---|---|---|---|---|---|---|---|
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | 92.0 | Completed | 2024-01-20 | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 87.0 | Completed | 2024-02-10 | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 84.0 | Completed | 2024-02-12 | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Chattogram |
| 5 | PH1006 | Laila Begum | 75.0 | 75.0 | 78.0 | Completed | 2024-03-08 | Rajshahi |

Row 1–3 সবার Python Marks-এ 2 যোগ হয়েছে (90→92, 85→87, 82→84)। Grace marks দেওয়ার মতো!

### `iterrows()` — row by row loop

```python
for i, series in df.iterrows():
    print(f"{i} : {series}")
```

Output:

```text
1 : StudentID                      PH1002
Full Name               Fatima Akhter
Data Structure Marks             92.0
Algo Marks                       92.0
Python Marks                     92.0
CompletionStatus            Completed
EnrollmentDate             2024-01-20
Location                   Chattogram
Name: 1, dtype: object
2 : StudentID                      PH1003
Full Name               Imran Hossain
Data Structure Marks             88.0
Algo Marks                       88.0
Python Marks                     87.0
CompletionStatus            Completed
EnrollmentDate             2024-02-10
Location                        Dhaka
...
CompletionStatus        NaN
EnrollmentDate          NaN
Location                NaN
Name: 20, dtype: object
```

`iterrows()` প্রতিটা row-কে `(index, Series)` হিসেবে দেয়। Output অনেক বড়, তাই মাঝখানে কাটা হয়েছে।

### `itertuples()` — faster loop

```python
for i in df.itertuples(index=False):
    print(i)
```

Output:

```text
Pandas(StudentID='PH1002', _1='Fatima Akhter', _2=92.0, _3=92.0, _4=92.0, CompletionStatus='Completed', EnrollmentDate='2024-01-20', Location='Chattogram')
Pandas(StudentID='PH1003', _1='Imran Hossain', _2=88.0, _3=88.0, _4=87.0, CompletionStatus='Completed', EnrollmentDate='2024-02-10', Location='Dhaka')
Pandas(StudentID='PH1004', _1='Jannatul Ferdous', _2=78.0, _3=78.0, _4=84.0, CompletionStatus='Completed', EnrollmentDate='2024-02-12', Location='Sylhet')
Pandas(StudentID='PH1005', _1='Kamal Uddin', _2=nan, _3=nan, _4=95.0, CompletionStatus='In Progress', EnrollmentDate='2024-03-05', Location='Chattogram')
Pandas(StudentID='PH1006', _1='Laila Begum', _2=75.0, _3=75.0, _4=78.0, CompletionStatus='Completed', EnrollmentDate='2024-03-08', Location='Rajshahi')
Pandas(StudentID='PH1007', _1='Mahmudul Hasan', _2=80.0, _3=80.0, _4=nan, CompletionStatus='In Progress', EnrollmentDate='2024-04-01', Location='Dhaka')
...
Pandas(StudentID='PH1020', _1='Nasir Khan', _2=86.0, _3=86.0, _4=89.0, CompletionStatus='Completed', EnrollmentDate='2025-10-02', Location='Dhaka')
Pandas(StudentID=nan, _1=nan, _2=nan, _3=nan, _4=nan, CompletionStatus=nan, EnrollmentDate=nan, Location=nan)
```

`itertuples()` প্রতিটা row-কে namedtuple হিসেবে দেয় — `iterrows()`-এর চেয়ে অনেক fast। Column name-এ space থাকলে (`Full Name`) সেটা valid Python name না, তাই `_1`, `_2` এরকম নাম পায়।

> **Tip:** Pandas-এ loop সাধারণত শেষ option। Column-wise operation (`df["a"] + df["b"]`) বা `apply()` অনেক fast — এটা পরের module-এ দেখব।

---

## 8. Sorting

```python
df
```

Output:

|  | StudentID | Full Name | Data Structure Marks | Algo Marks | Python Marks | CompletionStatus | EnrollmentDate | Location |
|---|---|---|---|---|---|---|---|---|
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | 92.0 | Completed | 2024-01-20 | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 87.0 | Completed | 2024-02-10 | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 84.0 | Completed | 2024-02-12 | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Chattogram |
| 5 | PH1006 | Laila Begum | 75.0 | 75.0 | 78.0 | Completed | 2024-03-08 | Rajshahi |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Dhaka |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

*20 rows × 8 columns*

### একটা column দিয়ে sort (ascending)

```python
copy = df.sort_values("Data Structure Marks")

copy
```

Output:

|  | StudentID | Full Name | Data Structure Marks | Algo Marks | Python Marks | CompletionStatus | EnrollmentDate | Location |
|---|---|---|---|---|---|---|---|---|
| 8 | PH1009 | Omar Faruq | 72.0 | 72.0 | 76.0 | Completed | 2024-05-16 | Dhaka |
| 5 | PH1006 | Laila Begum | 75.0 | 75.0 | 78.0 | Completed | 2024-03-08 | Rajshahi |
| 12 | PH1013 | Tanvir Ahmed | 75.0 | 75.0 | 79.0 | Completed | 2024-07-02 | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 84.0 | Completed | 2024-02-12 | Sylhet |
| 6 | PH1007 | Mahmudul Hasan | 80.0 | 80.0 | NaN | In Progress | 2024-04-01 | Dhaka |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 18 | PH1019 | Faria Rahman | NaN | NaN | NaN | Not Started | 2025-09-15 | Chattogram |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

*20 rows × 8 columns*

Default ছোট থেকে বড়। `NaN` গুলো সব সময় শেষে যায়। `inplace` না দেওয়ায় নতুন sorted copy পাওয়া গেছে, `df` unchanged।

### Descending

```python
copy = df.sort_values(["Data Structure Marks"], ascending=False)

copy
```

Output:

|  | StudentID | Full Name | Data Structure Marks | Algo Marks | Python Marks | CompletionStatus | EnrollmentDate | Location |
|---|---|---|---|---|---|---|---|---|
| 15 | PH1016 | Ziaur Rahman | 94.0 | 94.0 | NaN | In Progress | 2024-08-21 | Chattogram |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | 92.0 | Completed | 2024-01-20 | Chattogram |
| 16 | PH1017 | Afsana Mimi | 90.0 | 90.0 | 93.0 | Completed | 2025-09-01 | Dhaka |
| 9 | PH1010 | Priya Sharma | 89.0 | 89.0 | 88.0 | Completed | 2024-05-20 | Sylhet |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 87.0 | Completed | 2024-02-10 | Dhaka |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 18 | PH1019 | Faria Rahman | NaN | NaN | NaN | Not Started | 2025-09-15 | Chattogram |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

*20 rows × 8 columns*

`ascending=False` → বড় থেকে ছোট। Topper সবার উপরে।

### একাধিক column দিয়ে sort

```python
copy = df.sort_values(["Data Structure Marks", "Python Marks"], ascending=False)

copy
```

Output:

|  | StudentID | Full Name | Data Structure Marks | Algo Marks | Python Marks | CompletionStatus | EnrollmentDate | Location |
|---|---|---|---|---|---|---|---|---|
| 15 | PH1016 | Ziaur Rahman | 94.0 | 94.0 | NaN | In Progress | 2024-08-21 | Chattogram |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | 92.0 | Completed | 2024-01-20 | Chattogram |
| 16 | PH1017 | Afsana Mimi | 90.0 | 90.0 | 93.0 | Completed | 2025-09-01 | Dhaka |
| 9 | PH1010 | Priya Sharma | 89.0 | 89.0 | 88.0 | Completed | 2024-05-20 | Sylhet |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 87.0 | Completed | 2024-02-10 | Dhaka |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 18 | PH1019 | Faria Rahman | NaN | NaN | NaN | Not Started | 2025-09-15 | Chattogram |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

*20 rows × 8 columns*

প্রথমে DS Marks দিয়ে sort; DS Marks সমান হলে (যেমন দুইজনের 88, দুইজনের 86) তখন Python Marks দিয়ে tie break।

### Column-wise আলাদা order

```python
copy = df.sort_values(["Data Structure Marks", "Python Marks"], ascending=[False, True])

copy
```

Output:

|  | StudentID | Full Name | Data Structure Marks | Algo Marks | Python Marks | CompletionStatus | EnrollmentDate | Location |
|---|---|---|---|---|---|---|---|---|
| 15 | PH1016 | Ziaur Rahman | 94.0 | 94.0 | NaN | In Progress | 2024-08-21 | Chattogram |
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | 92.0 | Completed | 2024-01-20 | Chattogram |
| 16 | PH1017 | Afsana Mimi | 90.0 | 90.0 | 93.0 | Completed | 2025-09-01 | Dhaka |
| 9 | PH1010 | Priya Sharma | 89.0 | 89.0 | 88.0 | Completed | 2024-05-20 | Sylhet |
| 17 | PH1018 | Babul Ahmed | 88.0 | 88.0 | 85.0 | Completed | 2025-09-05 | Sylhet |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 18 | PH1019 | Faria Rahman | NaN | NaN | NaN | Not Started | 2025-09-15 | Chattogram |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

*20 rows × 8 columns*

DS Marks descending, কিন্তু tie হলে Python Marks **ascending**। (Notebook-এ `ascending=[0, 1]` লেখা ছিল — কাজ করে কারণ 0 = False, 1 = True, কিন্তু `[False, True]` বেশি readable।)

---

## 9. Filtering Data Based on Condition

Filtering = শুধু সেই rows রাখা যেগুলো একটা condition মানে। Data analysis-এর সবচেয়ে বেশি ব্যবহৃত কাজ।

```python
df
```

Output:

|  | StudentID | Full Name | Data Structure Marks | Algo Marks | Python Marks | CompletionStatus | EnrollmentDate | Location |
|---|---|---|---|---|---|---|---|---|
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | 92.0 | Completed | 2024-01-20 | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 87.0 | Completed | 2024-02-10 | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 84.0 | Completed | 2024-02-12 | Sylhet |
| 4 | PH1005 | Kamal Uddin | NaN | NaN | 95.0 | In Progress | 2024-03-05 | Chattogram |
| 5 | PH1006 | Laila Begum | 75.0 | 75.0 | 78.0 | Completed | 2024-03-08 | Rajshahi |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Dhaka |
| 20 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

*20 rows × 8 columns*

### Condition কীভাবে কাজ করে?

```text
df["CompletionStatus"] == "Not Started"
        ↓
[False, False, ..., True, ..., True, False]   ← Boolean Series (mask)
        ↓
df.loc[mask]  →  শুধু True rows
```

### Not Started students

```python
not_started = df.loc[df["CompletionStatus"] == "Not Started"]

not_started
```

Output:

|  | StudentID | Full Name | Data Structure Marks | Algo Marks | Python Marks | CompletionStatus | EnrollmentDate | Location |
|---|---|---|---|---|---|---|---|---|
| 13 | PH1014 | Urmi Akter | NaN | NaN | NaN | Not Started | 2024-07-09 | Rajshahi |
| 18 | PH1019 | Faria Rahman | NaN | NaN | NaN | Not Started | 2025-09-15 | Chattogram |

### Completed students

```python
completed = df.loc[df["CompletionStatus"] == "Completed"]

completed
```

Output:

|  | StudentID | Full Name | Data Structure Marks | Algo Marks | Python Marks | CompletionStatus | EnrollmentDate | Location |
|---|---|---|---|---|---|---|---|---|
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | 92.0 | Completed | 2024-01-20 | Chattogram |
| 2 | PH1003 | Imran Hossain | 88.0 | 88.0 | 87.0 | Completed | 2024-02-10 | Dhaka |
| 3 | PH1004 | Jannatul Ferdous | 78.0 | 78.0 | 84.0 | Completed | 2024-02-12 | Sylhet |
| 5 | PH1006 | Laila Begum | 75.0 | 75.0 | 78.0 | Completed | 2024-03-08 | Rajshahi |
| 7 | PH1008 | Nadia Islam | 81.0 | 81.0 | 85.0 | Completed | 2024-04-22 | Chattogram |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 17 | PH1018 | Babul Ahmed | 88.0 | 88.0 | 85.0 | Completed | 2025-09-05 | Sylhet |
| 19 | PH1020 | Nasir Khan | 86.0 | 86.0 | 89.0 | Completed | 2025-10-02 | Dhaka |

*13 rows × 8 columns*

### Multiple conditions — `&` (AND)

```python
# completed এবং DS marks >= 90
completed_ds90 = df.loc[(df["CompletionStatus"] == "Completed") & (df["Data Structure Marks"] >= 90)]
completed_ds90
```

Output:

|  | StudentID | Full Name | Data Structure Marks | Algo Marks | Python Marks | CompletionStatus | EnrollmentDate | Location |
|---|---|---|---|---|---|---|---|---|
| 1 | PH1002 | Fatima Akhter | 92.0 | 92.0 | 92.0 | Completed | 2024-01-20 | Chattogram |
| 16 | PH1017 | Afsana Mimi | 90.0 | 90.0 | 93.0 | Completed | 2025-09-01 | Dhaka |

দুইটা condition-ই True হতে হবে। Rules:

- `and` না, **`&`** ব্যবহার করো (OR এর জন্য `|`, NOT এর জন্য `~`)
- প্রতিটা condition **parentheses `()`** এর মধ্যে রাখো — না হলে operator precedence-এর কারণে error

> **ML connection:** Filtering দিয়ে outliers বাদ দেওয়া, নির্দিষ্ট class-এর data আলাদা করা, বা train/test-এর আগে invalid rows remove করা হয়।

---

## Common Confusions

### DataFrame vs Series

```text
df["col"]          → Series     (single bracket)
df[["col"]]        → DataFrame  (double bracket)
df[["a", "b"]]     → DataFrame
```

### `loc` vs `iloc`

```text
loc  → label দিয়ে,    slice end INCLUDED   → df.loc[3:7]  = 5 rows
iloc → position দিয়ে, slice end EXCLUDED   → df.iloc[3:7] = 4 rows
```

`drop(0)` করার পর `df.loc[0]` → KeyError (label 0 নেই), কিন্তু `df.iloc[0]` → প্রথম row (যেটার label এখন 1)।

### `inplace=True` vs assignment

```python
df.drop("col", axis=1, inplace=True)   # df নিজেই change, return None
df = df.drop("col", axis=1)            # same result, modern style
new = df.drop("col", axis=1)           # df unchanged, new-এ result
```

⚠️ `df = df.drop(..., inplace=True)` লিখলে `df` হয়ে যাবে `None`!

### `axis=0` vs `axis=1`

```text
axis=0 → row (default)
axis=1 → column
```

### `and` vs `&`

```python
df.loc[(cond1) and (cond2)]   # ❌ ValueError
df.loc[(cond1) & (cond2)]     # ✅
```

---

## Quick Practice

### Q1

```python
df = pd.read_csv("student_data.csv")
x = df["Location"]
```

`type(x)` কী হবে?

A. DataFrame  
B. Series  
C. list

### Q2

`df.loc[2:5]` কয়টা row দিবে? আর `df.iloc[2:5]`?

### Q3

কোন function দিয়ে প্রতিটা column-এ কয়টা non-null value আছে এবং dtype কী — এক নজরে দেখা যায়?

### Q4

`Location` column delete করার code লেখো (original df change হবে)।

### Q5

Python Marks অনুযায়ী বড় থেকে ছোট sort করার code কী?

### Q6

যেসব student `Dhaka`-র এবং `Python Marks > 85` — তাদের filter করো।

### Q7

```python
data = [{"a": 1, "b": 2}, {"a": 3}]
pd.DataFrame(data)
```

Row 1-এর `b` column-এ কী থাকবে?

### Answers

1. **B — Series**
2. **`loc` → 4 rows (2, 3, 4, 5)**, **`iloc` → 3 rows (position 2, 3, 4)**
3. **`df.info()`**
4. **`df.drop("Location", axis=1, inplace=True)`**
5. **`df.sort_values("Python Marks", ascending=False)`**
6. **`df.loc[(df["Location"] == "Dhaka") & (df["Python Marks"] > 85)]`**
7. **`NaN`** — missing key automatically NaN হয়

---

## Final Cheat Sheet

| Task | Code |
|---|---|
| Import | `import pandas as pd` |
| CSV load | `pd.read_csv("file.csv")` |
| Excel / Parquet / JSON | `pd.read_excel()` / `pd.read_parquet()` / `pd.read_json()` |
| প্রথম / শেষ rows | `df.head(n)` / `df.tail(n)` |
| Random rows | `df.sample(n)` |
| Structure + nulls | `df.info()` |
| Stats summary | `df.describe()` |
| Column names / index | `df.columns` / `df.index` |
| Dict → DataFrame | `pd.DataFrame({"col": [..]})` |
| একটা column | `df["col"]` |
| Label দিয়ে | `df.loc[rows, cols]` |
| Position দিয়ে | `df.iloc[rows, cols]` |
| Index set | `df.set_index("col")` |
| Rename | `df.rename(columns={"old": "new"})` |
| Row / column delete | `df.drop(label)` / `df.drop("col", axis=1)` |
| Value update | `df.loc[row, "col"] = value` |
| Loop | `df.iterrows()` / `df.itertuples()` |
| Sort | `df.sort_values("col", ascending=False)` |
| Filter | `df.loc[df["col"] == value]` |
| Multi-condition | `df.loc[(c1) & (c2)]`, `\|` for OR |

### One-line Mental Model

> **DataFrame = Series-এর collection; `loc` = name দিয়ে, `iloc` = position দিয়ে; filter = Boolean mask দিয়ে rows বাছাই।**
