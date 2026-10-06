*Class-এর সব Jupyter notebook আর CSV dataset — এক জায়গায়।*

> **👁️ View** — browser-এই notebook দেখো (code, output, chart সহ)। **⬇️ Download** — `.ipynb` file নামিয়ে নাও। তারপর **Jupyter Notebook**-এ খোলো, অথবা **Google Colab**-এ: `File → Upload notebook`।
>
> Notebook-এ CSV লাগলে, CSV file-টাও notebook-এর সাথে একই folder-এ রাখো (Colab-এ বাম পাশের 📁 Files panel-এ upload করো)।

## Notebooks

| Module | Notebook | Lesson |
|---|---|---|
| 01 — Python Basics | [👁️ View](/ai/ml/notebooks/module-01-python-basics) · [⬇️ Download](/notebooks/module-01-python-basics.ipynb) | [Python Basics](/ai/ml/lessons/python-basics) |
| 02 — Control Flow | [👁️ View](/ai/ml/notebooks/module-02-control-flow) · [⬇️ Download](/notebooks/module-02-control-flow.ipynb) | [Control Flow](/ai/ml/lessons/control-flow) |
| 03 — String | [👁️ View](/ai/ml/notebooks/module-03-string) · [⬇️ Download](/notebooks/module-03-string.ipynb) | [String & List](/ai/ml/lessons/string-list) |
| 03 — List | [👁️ View](/ai/ml/notebooks/module-03-list) · [⬇️ Download](/notebooks/module-03-list.ipynb) | [String & List](/ai/ml/lessons/string-list) |
| 05 — Tuple, Set, Dictionary | [👁️ View](/ai/ml/notebooks/module-05-tuple-set-dictionary) · [⬇️ Download](/notebooks/module-05-tuple-set-dictionary.ipynb) | [Tuple, Set & Dictionary](/ai/ml/lessons/tuple-set-dictionary) |
| 06 — Functions | [👁️ View](/ai/ml/notebooks/module-06-functions) · [⬇️ Download](/notebooks/module-06-functions.ipynb) | [Functions](/ai/ml/lessons/functions) |
| 07 — File & Exceptions | [👁️ View](/ai/ml/notebooks/module-07-file-handling-exceptions) · [⬇️ Download](/notebooks/module-07-file-handling-exceptions.ipynb) | [File Handling & Exceptions](/ai/ml/lessons/file-handling-exceptions) |
| 08 — OOP | [👁️ View](/ai/ml/notebooks/module-08-oop) · [⬇️ Download](/notebooks/module-08-oop.ipynb) | [OOP](/ai/ml/lessons/oop) |
| 10 — NumPy Basics | [👁️ View](/ai/ml/notebooks/module-10-numpy-basics) · [⬇️ Download](/notebooks/module-10-numpy-basics.ipynb) | [NumPy Basics](/ai/ml/lessons/numpy-basics) |
| 11 — NumPy Operations | [👁️ View](/ai/ml/notebooks/module-11-numpy-operations) · [⬇️ Download](/notebooks/module-11-numpy-operations.ipynb) | [NumPy Operations](/ai/ml/lessons/numpy-operations) |
| 12 — Pandas Basics | [👁️ View](/ai/ml/notebooks/module-12-pandas-basics) · [⬇️ Download](/notebooks/module-12-pandas-basics.ipynb) | [Pandas Basics](/ai/ml/lessons/pandas-basics) |
| 14 — Pandas Data Cleaning | [👁️ View](/ai/ml/notebooks/module-14-pandas-data-cleaning) · [⬇️ Download](/notebooks/module-14-pandas-data-cleaning.ipynb) | [Pandas Data Cleaning](/ai/ml/lessons/pandas-data-cleaning) |
| 15 — Matplotlib | [👁️ View](/ai/ml/notebooks/module-15-matplotlib) · [⬇️ Download](/notebooks/module-15-matplotlib.ipynb) | [Matplotlib](/ai/ml/lessons/matplotlib) |
| 16 — Seaborn & Plotly | [👁️ View](/ai/ml/notebooks/module-16-seaborn-plotly) · [⬇️ Download](/notebooks/module-16-seaborn-plotly.ipynb) | [Seaborn & Plotly](/ai/ml/lessons/seaborn-plotly) |

> Module 04, 09, 13-এর notebook folder-এ ছিল না।

---

## Datasets (CSV)

| File | কী আছে | Rows |
|---|---|---|
| [student_data.csv](/datasets/student_data.csv) | Student-দের marks (DS, Algorithm, Python), status, instructor, location — কিছু value missing | 21 |
| [student_completed_data.csv](/datasets/student_completed_data.csv) | Course completion status, enrollment/finish date, total marks | 20 |
| [student_scores.csv](/datasets/student_scores.csv) | Math, Science, English score | 20 |
| [student_iqdata.csv](/datasets/student_iqdata.csv) | Shoe size, study hour, chilling hours, IQ score | 38 |
| [student_dataset_complete.csv](/datasets/student_dataset_complete.csv) | Study time, marks, attendance, gender, class ইত্যাদি | 100 |
| [sns_data.csv](/datasets/sns_data.csv) | Weekly study hours, test score, attendance — Seaborn practice | 95 |
| [enrollment_data.csv](/datasets/enrollment_data.csv) | বছরভিত্তিক Programming vs Digital Marketing enrollment | 10 |
| [final-employee-ds.csv](/datasets/final-employee-ds.csv) | Employee department, salary, experience, performance | 100 |
| [practice-day.csv](/datasets/practice-day.csv) | Employee age, salary, price, marks — practice dataset | 11 |

> Notebook-এ কিছু CSV-এর নাম আলাদা ছিল: `student_data (2).csv` → `student_data.csv`, `Practice Day (1).csv` → `practice-day.csv`, `student_IQdata.csv` → `student_iqdata.csv`। Notebook-এ `read_csv(...)`-এর নাম সেই অনুযায়ী মিলিয়ে নিও।
