*Bangla + English mixed notes.* — **Python Module 16**

> 📓 **Class notebook:** `module-16-seaborn-plotly.ipynb` — [👁️ View](/ai/ml/notebooks/module-16-seaborn-plotly) / [⬇️ Download](/notebooks/module-16-seaborn-plotly.ipynb)

> Matplotlib দিয়ে chart বানানো শিখেছি। এই module-এ **Seaborn** (matplotlib-এর উপর বানানো, কম code-এ সুন্দর statistical chart) আর **Plotly** (interactive chart — hover, zoom, pan) শিখব।

## Roadmap

1. Setup — libraries + data load
2. Axes-level vs Figure-level — seaborn-এর সবচেয়ে important concept
3. Lineplot using Seaborn — `lineplot`, `relplot(kind='line')`
4. Scatter Plot using Seaborn — `scatterplot`, `relplot(kind='scatter')`, `hue` / `style` / `size`
5. Facet Plot — `col`, `row`, `col_wrap`
6. Histogram using Seaborn — `histplot`, `displot(kind='hist')`
7. KDE Plot — `kdeplot`, `displot(kind='kde')`
8. Countplot — category count
9. Bar Plot — category-wise mean / median / max
10. Regplot and lmplot — regression line
11. Pairplot — সব numeric column-এর pairwise relation
12. Joint Plot — scatter + distribution একসাথে
13. Plotly — Scatter, Line, Histogram (interactive)

### 🎯 Module Goal

```text
DataFrame
   ↓
sns.<chart>(data=df, x='col', y='col', hue='col')
   ↓
Column-এর নাম দিলেই seaborn নিজে group, color, legend, statistics handle করে
   ↓
Interactive দরকার? → plotly.express (px)
```

Matplotlib vs Seaborn vs Plotly:

```text
Matplotlib → low-level, সব কিছু নিজে control করো
Seaborn    → high-level, DataFrame + column name দিলেই সুন্দর statistical plot
Plotly     → interactive (hover করলে value দেখায়, zoom করা যায়), HTML হিসেবে save করা যায়
```

### 📂 Dataset

এই lesson-এ এই CSV files লাগবে — download করে notebook-এর same folder-এ রাখো:

- [sns_data.csv](/datasets/sns_data.csv) — student-দের weekly study hours, test score, attendance, gender, class level
- [student_dataset_complete.csv](/datasets/student_dataset_complete.csv) — 100 জন student-এর Marks, study hours, attendance, gender, hostel, week
- [enrollment_data.csv](/datasets/enrollment_data.csv) — বছর অনুযায়ী Programming ও Digital Marketing enrollment (plotly line plot-এর জন্য)

আর `tips` dataset seaborn-এর built-in — `sns.load_dataset("tips")` দিয়ে load হয় (internet connection লাগে)।

---

## Setup — Import and Load Data

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
```

Convention: `seaborn` → `sns`, `plotly.express` → `px`।

```python
student = pd.read_csv('sns_data.csv')
student.head()
```

```text
   student_id class_level   subject  study_hours  test_score  week  attendance_rate  gender  hostel  Tshirt_size
0           1    Freshman      Math            5          78     1               90    Male    True           30
1           2    Freshman   Science            3          65     1               80  Female   False           20
2           3    Freshman   History            4          70     1               85    Male    True           20
3           4    Freshman  Language            2          60     1               75  Female    True           40
4           5   Sophomore      Math            6          82     1               92    Male    True           20
```

---

## Axes-level vs Figure-level

Seaborn-এর প্রায় প্রতিটা chart-এর **দুইটা version** আছে:

| | Axes-level | Figure-level |
|---|---|---|
| কী আঁকে | একটা single plot (একটা matplotlib Axes) | পুরো figure (FacetGrid) — একাধিক subplot সম্ভব |
| Return | `<Axes ...>` | `<FacetGrid ...>` |
| `col` / `row` (facet) | ✘ নেই | ✔ আছে |
| Legend | Plot-এর ভিতরে | Plot-এর বাইরে, ডান পাশে |
| Example | `lineplot`, `scatterplot`, `histplot`, `kdeplot`, `regplot` | `relplot`, `displot`, `lmplot` |

Family mapping:

```text
relplot (relational)       → kind='line'    = lineplot
                             kind='scatter' = scatterplot
displot (distribution)     → kind='hist'    = histplot
                             kind='kde'     = kdeplot
lmplot  (regression)       → figure-level version of regplot
```

> Simple rule: একটা plot লাগলে axes-level; data-কে category অনুযায়ী ভাগ করে **পাশাপাশি অনেকগুলো plot** (facet) লাগলে figure-level।

---

## Lineplot using Seaborn

### কখন?

সময় (week, year) অনুযায়ী একটা value-এর **trend**। Seaborn-এর বিশেষত্ব: একই x-এ একাধিক row থাকলে সেগুলোর **mean** নিয়ে line আঁকে।

### Axes-level — `sns.lineplot()`

```python
# axes level
sns.lineplot(data=student, x='week', y='attendance_rate', errorbar=None)
```

![Seaborn lineplot of average attendance rate across weeks](/lessons/seaborn-plotly/cell-03-1.png)

- `data=student` → কোন DataFrame
- `x`, `y` → column-এর **নাম** (string)
- `errorbar=None` → default-এ seaborn mean-এর চারপাশে confidence interval-এর shaded area দেখায়; `None` দিলে শুধু line।

### `hue` — group অনুযায়ী আলাদা line

```python
sns.lineplot(data=student, x='week', y='attendance_rate', errorbar=None, hue='gender')
```

![Lineplot with separate Male and Female attendance lines across weeks](/lessons/seaborn-plotly/cell-04-1.png)

`hue='gender'` → gender অনুযায়ী আলাদা রঙের line + automatic legend। Matplotlib-এ এটা করতে নিজে filter করে দুইবার `plot()` লাগত!

### Figure-level — `sns.relplot(kind='line')`

```python
# figure level
sns.relplot(kind='line', data=student, x='week', y='attendance_rate', errorbar=None, hue='gender')
```

![relplot line chart — Male attendance higher than Female every week, legend outside on the right](/lessons/seaborn-plotly/cell-05-1.png)

একই chart, কিন্তু legend plot-এর বাইরে — এটা figure-level-এর চিহ্ন।

```python
sns.relplot(kind='line', data=student, x='week', y='test_score', errorbar=None, hue='gender')
```

![relplot of average test score per week by gender](/lessons/seaborn-plotly/cell-06-1.png)

```python
sns.relplot(kind='line', data=student, x='week', y='test_score', errorbar=None, hue='class_level')
```

![Test score trend per week with four lines — Freshman lowest, Junior and Senior highest](/lessons/seaborn-plotly/cell-07-1.png)

Class level যত উপরে (Freshman → Senior), test score তত বেশি — chart দেখলেই বোঝা যায়।

```python
sns.relplot(kind='line', data=student, x='week', y='attendance_rate', errorbar=None, hue='class_level')
```

> এই cell-এর output notebook-এ save করা ছিল না। Run করলে class level অনুযায়ী ৪টা attendance line দেখাবে।

---

## Scatter Plot using Seaborn

### কখন?

দুইটা numeric column-এর **relation** দেখতে (matplotlib-এর `plt.scatter()`-এর মতো)। Seaborn-এ extra বোনাস: `hue`, `style`, `size` দিয়ে একই chart-এ আরও ৩টা variable দেখানো যায়।

### Basic

```python
sns.scatterplot(data=student, x='study_hours', y='test_score')
```

![Scatter of study hours vs test score — strong upward pattern](/lessons/seaborn-plotly/cell-09-1.png)

Study hours বাড়লে test score বাড়ছে → strong positive correlation।

### `hue` + `style` + `size`

```python
sns.scatterplot(data=student, x='study_hours', y='test_score',
                hue='gender', style='subject', size='Tshirt_size')
```

![Scatter with color by gender, marker shape by subject and point size by T-shirt size; legend inside the plot](/lessons/seaborn-plotly/cell-10-1.png)

```text
hue   → color দিয়ে group (gender)
style → marker shape দিয়ে group (subject: ●, ✖, ■, +)
size  → point-এর size দিয়ে একটা numeric value (Tshirt_size)
```

Legend plot-এর ভিতরে বসে data ঢেকে দিচ্ছে — axes-level-এর একটা সমস্যা।

### Figure-level — `sns.relplot(kind='scatter')`

```python
sns.relplot(kind='scatter', data=student, x='study_hours', y='test_score',
            hue='gender', style='subject', size='Tshirt_size')
```

![Same scatter via relplot — legend moved outside on the right](/lessons/seaborn-plotly/cell-11-1.png)

Figure-level হওয়ায় legend বাইরে, chart পরিষ্কার।

### Built-in `tips` dataset

```python
tips_data = sns.load_dataset("tips")

tips_data.head()
```

```text
   total_bill   tip     sex smoker  day    time  size
0       16.99  1.01  Female     No  Sun  Dinner     2
1       10.34  1.66    Male     No  Sun  Dinner     3
2       21.01  3.50    Male     No  Sun  Dinner     3
3       23.68  3.31    Male     No  Sun  Dinner     2
4       24.59  3.61  Female     No  Sun  Dinner     4
```

```python
sns.relplot(kind='scatter', data=tips_data, x='total_bill', y='tip',
            hue='sex', style='time', size='size')
```

![relplot of total bill vs tip — colored by sex, shaped by time, sized by party size](/lessons/seaborn-plotly/cell-13-1.png)

```python
sns.scatterplot(data=tips_data, x='total_bill', y='tip',
                hue='sex', style='time', size='size')
```

![Same tips scatter with axes-level scatterplot, legend inside the plot](/lessons/seaborn-plotly/cell-14-1.png)

Bill বেশি হলে tip-ও বেশি — positive relation।

### নতুন dataset load (বাকি lesson-এ এটাই ব্যবহার হবে)

```python
student = pd.read_csv('student_dataset_complete.csv')
student.head()
```

```text
   number_courses  time_study   Marks  student_id  class_level  subject  study_hours  test_score  week  attendance_rate gender  hostel  Tshirt_size class_name
0               3       4.508  19.202           1           10  Science        4.508      19.202     2             0.89      F       0            2  Sophomore
1               4       0.096   7.734           2           12     Math        0.096       7.734     3             0.98      M       0            3     Senior
2               4       3.133  13.811           3           11  Science        3.133      13.811     5             0.83      F       0            3     Junior
3               6       7.909  53.018           4           10  Science        7.909      53.018     4             0.92      F       1            4  Sophomore
4               8       7.811  55.299           5           11  English        7.811      55.299     3             0.80      M       1            4     Junior
```

---

## Facet Plot

### Facet কী?

Data-কে একটা category অনুযায়ী **ভাগ করে আলাদা আলাদা subplot**-এ দেখানো। একটা chart-এ সব রঙ মিশে গেলে পড়া কঠিন — facet করলে প্রতিটা group আলাদা panel-এ। এটা শুধু **figure-level** function-এ (`relplot`, `displot`, `lmplot`) পাওয়া যায়।

### আগে — hue দিয়ে এক chart-এ

```python
sns.scatterplot(data=student, x='study_hours', y='test_score', hue='gender')
```

![Scatter of study hours vs test score colored by gender (F, M)](/lessons/seaborn-plotly/cell-17-1.png)

```python
sns.relplot(kind='scatter', data=student, x='study_hours', y='test_score', hue='gender')
```

![relplot scatter colored by gender with legend outside](/lessons/seaborn-plotly/cell-18-1.png)

### `col` — column-wise ভাগ

```python
sns.relplot(kind='scatter', data=student, x='study_hours', y='test_score', col='gender')
```

![Two side-by-side scatter panels — gender = F and gender = M](/lessons/seaborn-plotly/cell-19-1.png)

### `col` + `row` — grid

```python
sns.relplot(kind='scatter', data=student, x='study_hours', y='test_score', col='gender', row='hostel')
```

![2×2 grid of scatter plots — rows hostel 0/1, columns gender F/M](/lessons/seaborn-plotly/cell-20-1.png)

```text
row = hostel (0, 1)  ×  col = gender (F, M)  →  2 × 2 = 4 panel
```

### `col_wrap` — এক row-তে কয়টা

`week`-এ 5টা value — 5টা panel এক লাইনে রাখলে অনেক চওড়া হবে। `col_wrap=2` → প্রতি row-তে 2টা, তারপর নিচে নামবে।

```python
sns.relplot(kind='scatter', data=student, x='study_hours', y='test_score', col='week', col_wrap=2)
```

![Five scatter panels for week 1 to 5, arranged two per row](/lessons/seaborn-plotly/cell-21-1.png)

> `col_wrap` শুধু `col`-এর সাথে কাজ করে, `row`-এর সাথে একসাথে ব্যবহার করা যায় না।

---

## Histogram using Seaborn

### কখন?

একটা numeric column-এর **distribution** — কোন range-এ কত value। (Matplotlib-এর `plt.hist()`-এর seaborn version।)

### Axes-level — `sns.histplot()`

```python
# axes level
sns.histplot(data=student, x='attendance_rate', hue='gender', bins=10, element='step')
```

![Step histogram of attendance rate with overlapping F (blue) and M (orange) distributions](/lessons/seaborn-plotly/cell-23-1.png)

- `bins=10` → 10টা bin
- `hue='gender'` → দুইটা gender-এর histogram overlap করে
- `element='step'` → bars-এর বদলে step outline, overlap হলেও দুইটা পড়া যায়

### Figure-level — `sns.displot(kind='hist')`

```python
# figure level
sns.displot(kind='hist', data=student, x='attendance_rate')
```

![displot histogram of attendance rate between 0.80 and 1.00](/lessons/seaborn-plotly/cell-24-1.png)

```python
sns.displot(kind='hist', data=student, x='attendance_rate', col='gender')
```

![Two histogram panels of attendance rate — gender F and gender M](/lessons/seaborn-plotly/cell-25-1.png)

```python
sns.displot(kind='hist', data=student, x='study_hours', col='gender')
```

![Two histogram panels of study hours split by gender](/lessons/seaborn-plotly/cell-26-1.png)

Figure-level বলে `col='gender'` দিয়ে facet করা গেল।

### `tips` dataset-এ histogram

```python
tips_data = sns.load_dataset("tips")

tips_data.head()
```

```text
   total_bill   tip     sex smoker  day    time  size
0       16.99  1.01  Female     No  Sun  Dinner     2
1       10.34  1.66    Male     No  Sun  Dinner     3
2       21.01  3.50    Male     No  Sun  Dinner     3
3       23.68  3.31    Male     No  Sun  Dinner     2
4       24.59  3.61  Female     No  Sun  Dinner     4
```

```python
sns.displot(kind='hist', data=tips_data, x='total_bill', bins=20)
```

![Histogram of total bill with 20 bins — right-skewed, most bills between 10 and 20](/lessons/seaborn-plotly/cell-28-1.png)

```python
sns.displot(kind='hist', data=tips_data, x='tip', bins=20)
```

![Histogram of tip with 20 bins — most tips around 2–3, long tail to 10](/lessons/seaborn-plotly/cell-29-1.png)

দুইটাই **right-skewed** — বেশিরভাগ value ছোট, ডান দিকে কিছু বড় value-এর লম্বা লেজ।

---

## KDE Plot

### KDE কী?

**KDE = Kernel Density Estimate** — histogram-এর **smooth curve version**। Bars-এর বদলে একটা মসৃণ curve দিয়ে distribution-এর shape দেখায়। y-axis-এ count না, **Density** (curve-এর নিচের মোট area = 1)।

```text
Histogram → bins-এর উপর depend করে, ধাপ ধাপ
KDE       → smooth, shape (peak, skew) সহজে বোঝা যায়, কয়েকটা group compare করতে সুবিধা
```

### Axes-level — `sns.kdeplot()`

```python
# axes level
sns.kdeplot(data=student, x='attendance_rate')
```

![KDE curve of attendance rate](/lessons/seaborn-plotly/cell-31-1.png)

```python
sns.kdeplot(data=tips_data, x='tip', hue='sex', fill=True)
```

![Filled KDE curves of tip for Male and Female, both peaking around 2](/lessons/seaborn-plotly/cell-32-1.png)

`fill=True` → curve-এর নিচের area রঙ করা। Male curve বড় কারণ dataset-এ Male row বেশি (default-এ density group-এর size অনুযায়ী scale হয়)।

### Figure-level — `sns.displot(kind='kde')`

```python
# figure level
sns.displot(kind='kde', data=student, x='attendance_rate', col='gender')
```

![Two KDE panels of attendance rate — gender F and gender M](/lessons/seaborn-plotly/cell-33-1.png)

---

## Countplot

### কখন?

একটা **categorical column**-এ প্রতিটা category কতবার আছে — সেটার bar chart। Matplotlib-এ আগে `groupby().size()` করে তারপর `plt.bar()` লাগত; seaborn-এ শুধু column-এর নাম দিলেই হয়, count নিজে করে।

```python
student
```

```text
    number_courses  time_study   Marks  student_id  class_level  subject  ...  gender  hostel  Tshirt_size class_name
0                3       4.508  19.202           1           10  Science  ...       F       0            2  Sophomore
1                4       0.096   7.734           2           12     Math  ...       M       0            3     Senior
..             ...         ...     ...         ...          ...      ...  ...     ...     ...          ...        ...
99               3       6.335  32.357         100           12  Science  ...       M       ...

[100 rows x 15 columns]
```

```python
sns.countplot(data=student, x='gender')
```

![Countplot of gender — roughly equal F and M counts](/lessons/seaborn-plotly/cell-36-1.png)

```python
sns.countplot(data=student, x='subject', hue='gender')
```

![Grouped countplot by subject (Science, Math, English) with F and M bars side by side](/lessons/seaborn-plotly/cell-37-1.png)

`hue='gender'` → প্রতিটা subject-এর ভিতরে gender অনুযায়ী পাশাপাশি bar (grouped bar chart)।

---

## Bar Plot

### Countplot vs Barplot

```text
countplot → শুধু x (category) দাও → প্রতিটা category-র COUNT
barplot   → x (category) + y (numeric) দাও → প্রতিটা category-র y-এর একটা STATISTIC (default = mean)
```

### Default — mean

```python
sns.barplot(data=student, x='gender', y='Marks', errorbar=None)  # mean
```

![Barplot of average Marks by gender — F about 22, M about 27](/lessons/seaborn-plotly/cell-39-1.png)

প্রতিটা gender-এর **average Marks**। `errorbar=None` → bar-এর উপরের error line বাদ।

### `estimator` — অন্য statistic

```python
sns.barplot(data=student, x='gender', y='Marks', errorbar=None, estimator=np.median)  # median
```

![Barplot of median Marks by gender — F about 19, M about 24](/lessons/seaborn-plotly/cell-40-1.png)

```python
sns.barplot(data=student, x='gender', y='Marks', errorbar=None, estimator=np.max)  # max
```

![Barplot of maximum Marks by gender — both around 54–55](/lessons/seaborn-plotly/cell-41-1.png)

`estimator=` এ যেকোনো aggregate function দেওয়া যায়: `np.mean` (default), `np.median`, `np.max`, `np.min`, `np.sum` ইত্যাদি।

---

## Regplot and lmplot

### কখন?

Scatter plot + তার উপর একটা **best-fit regression line** — relation কতটা linear সেটা বোঝার জন্য। Machine Learning-এর Linear Regression-এর visual preview!

### Axes-level — `sns.regplot()`

```python
# axes level
sns.regplot(data=student, x='study_hours', y='test_score')
```

![Regplot — scatter of study hours vs test score with a fitted regression line and shaded confidence band](/lessons/seaborn-plotly/cell-43-1.png)

Line-এর চারপাশের হালকা shaded area = **confidence interval** (line কতটা নিশ্চিত)।

### Figure-level — `sns.lmplot()`

```python
# figure level
sns.lmplot(data=student, x='study_hours', y='test_score', hue='gender')
```

![lmplot with separate regression lines for F and M, nearly overlapping](/lessons/seaborn-plotly/cell-44-1.png)

`hue='gender'` → প্রতিটা gender-এর জন্য আলাদা regression line। দুইটা line প্রায় একই → gender relation-টা change করছে না। `lmplot` figure-level, তাই `col=` দিয়ে facet-ও করা যায়।

---

## Pairplot

### কখন?

Dataset-এ অনেকগুলো numeric column থাকলে **সবগুলোর pairwise relation এক নজরে** দেখতে। EDA (Exploratory Data Analysis)-এর শুরুতে খুব useful।

```text
Diagonal      → প্রতিটা column-এর নিজের distribution (KDE/hist)
Off-diagonal  → দুইটা column-এর scatter plot
```

```python
student
```

```text
(100 rows x 15 columns — উপরের মতোই)
```

প্রথমে দরকারি column গুলো বেছে নিই:

```python
student_marks = student[['Marks', 'study_hours', 'attendance_rate', 'gender']]
student_marks
```

```text
     Marks  study_hours  attendance_rate gender
0   19.202        4.508             0.89      F
1    7.734        0.096             0.98      M
2   13.811        3.133             0.83      F
3   53.018        7.909             0.92      F
4   55.299        7.811             0.80      M
..     ...          ...              ...    ...
95  19.128        3.561             0.94      F
96   5.609        0.301             0.83      M
97  41.444        7.163             0.97      M
98  12.027        0.309             0.98      F
99  32.357        6.335             0.95      M

[100 rows x 4 columns]
```

```python
sns.pairplot(data=student_marks, hue='gender')
```

![3×3 pairplot of Marks, study_hours, attendance_rate colored by gender — KDE on diagonal, scatter elsewhere](/lessons/seaborn-plotly/cell-48-1.png)

Pattern পড়া:
- `Marks` vs `study_hours` → strong positive (dots একটা curve বরাবর)
- `attendance_rate` vs অন্যগুলো → dots ছড়ানো, তেমন relation নেই

`gender` non-numeric, তাই এটা axis-এ আসেনি — শুধু `hue` হিসেবে color দিয়েছে।

```python
sns.pairplot(data=student_marks, kind='hist')
```

![3×3 pairplot with histograms on the diagonal and 2D histogram heatmaps elsewhere](/lessons/seaborn-plotly/cell-49-1.png)

`kind='hist'` → off-diagonal-এ dots-এর বদলে 2D histogram (গাঢ় রঙ = বেশি data point)।

---

## Joint Plot

### কখন?

দুইটা variable-এর **relation (মাঝে)** আর প্রতিটার **আলাদা distribution (উপরে ও ডানে)** একসাথে দেখতে।

```python
sns.jointplot(data=student_marks, x='study_hours', y='Marks', hue='gender')
```

![Jointplot — center scatter of study hours vs Marks by gender, with KDE distributions on top and right margins](/lessons/seaborn-plotly/cell-51-1.png)

```python
sns.jointplot(data=student_marks, x='study_hours', y='Marks', kind='kde')
```

![Jointplot with kind kde — contour lines in center showing density, KDE curves on margins](/lessons/seaborn-plotly/cell-52-1.png)

`kind='kde'` → মাঝে contour lines (মানচিত্রের উচ্চতার রেখার মতো) — রেখা যত ঘন, data তত বেশি। অন্য option: `'scatter'` (default), `'hist'`, `'reg'`, `'hex'`।

---

## Scatter Plot with Plotly

### Plotly কেন?

Plotly chart **interactive** — mouse hover করলে exact value দেখায়, zoom/pan করা যায়, legend-এ click করে group hide/show করা যায়। Dashboard আর presentation-এর জন্য দারুণ।

> ⚠️ নিচের plotly chart গুলোর ছবি শুধু **static snapshot**। আসল plotly chart interactive — সেটা শুধু Jupyter Notebook / Google Colab-এ code run করলে দেখা যাবে (hover, zoom সহ)।

```python
student
```

```text
(100 rows x 15 columns — উপরের মতোই)
```

```python
fig = px.scatter(student, x='time_study', y='Marks',
                 color='gender',
                 size='Tshirt_size',
                 hover_data=['hostel'])

fig.show()
```

![Plotly scatter of time_study vs Marks, colored by gender, bubble size by T-shirt size (static snapshot)](/lessons/seaborn-plotly/cell-55-1.png)

```text
color      → seaborn-এর hue-এর মতো
size       → bubble size
hover_data → hover করলে extra কোন column দেখাবে
fig.show() → chart render
```

---

## Line Plot using Plotly

```python
enrollment = pd.read_csv('enrollment_data.csv')

fig = px.line(enrollment, x='Year', y='Programming')

fig.show()
```

![Plotly line chart of Programming enrollment by year (static snapshot)](/lessons/seaborn-plotly/cell-57-1.png)

```python
fig = px.line(enrollment, x='Year', y='Digital Marketing', markers=True)

fig.show()
```

![Plotly line chart of Digital Marketing enrollment with point markers (static snapshot)](/lessons/seaborn-plotly/cell-58-1.png)

`markers=True` → প্রতিটা data point-এ dot।

### Chart HTML হিসেবে save

```python
fig.write_html('digital_marketing_data.html')
```

এটা একটা `.html` file বানায় — browser-এ খুললেই interactive chart, Python ছাড়াই কাউকে share করা যায়। (কোনো output দেখায় না, শুধু file save হয়।)

---

## Histogram using Plotly

```python
student_marks
```

```text
     Marks  study_hours  attendance_rate gender
0   19.202        4.508             0.89      F
1    7.734        0.096             0.98      M
..     ...          ...              ...    ...
99  32.357        6.335             0.95      M

[100 rows x 4 columns]
```

```python
fig = px.histogram(student_marks, x='attendance_rate')

fig.show()
```

![Plotly histogram of attendance rate between 0.80 and 1.00 (static snapshot)](/lessons/seaborn-plotly/cell-62-1.png)

```python
fig = px.histogram(student_marks, x='attendance_rate', color='gender', nbins=5)

fig.show()
```

![Plotly histogram with 5 bins, F and M stacked by color (static snapshot)](/lessons/seaborn-plotly/cell-63-1.png)

- `color='gender'` → gender অনুযায়ী **stacked** bars
- `nbins=5` → bin সংখ্যা (plotly-তে `nbins`, seaborn/matplotlib-এ `bins`)

---

## Common Confusions

### Axes-level vs Figure-level

```text
lineplot / scatterplot / histplot / kdeplot / regplot → axes-level → col/row নেই
relplot / displot / lmplot                            → figure-level → col/row/col_wrap আছে
```

### `relplot` vs `displot`

```text
relplot → relation (x vs y)       → kind='scatter' / 'line'
displot → distribution (একটা x)   → kind='hist' / 'kde'
```

### `countplot` vs `barplot`

```text
countplot(x='gender')             → কতজন (count)
barplot(x='gender', y='Marks')    → Marks-এর mean (বা estimator যা দাও)
```

### `hue` vs `col`

```text
hue='gender' → একই plot-এ আলাদা color
col='gender' → আলাদা আলাদা panel (facet)
```

### `errorbar=None`

```text
Seaborn default-এ mean-এর uncertainty (confidence interval) দেখায় — shaded band বা bar-এর উপর line।
errorbar=None → সেটা বাদ।
```

### `bins` vs `nbins`

```text
matplotlib / seaborn → bins=10
plotly express       → nbins=10
```

### Seaborn-এ column নাম string-এ

```text
sns.scatterplot(data=df, x='study_hours', y='Marks')       ✔
sns.scatterplot(data=df, x=study_hours, y=Marks)           ✘ NameError
```

---

## Quick Practice

### Q1

`sns.lineplot`-এর figure-level version কোনটা, আর কী `kind` দিতে হবে?

### Q2

Gender অনুযায়ী দুইটা আলাদা panel-এ scatter plot চাই। নিচের কোনটা কাজ করবে?

A. `sns.scatterplot(data=df, x='a', y='b', col='gender')`  
B. `sns.relplot(kind='scatter', data=df, x='a', y='b', col='gender')`

### Q3

প্রতিটা subject-এ কতজন student আছে দেখাতে কোন seaborn function?

### Q4

`sns.barplot(data=df, x='gender', y='Marks')` default-এ কোন value দেখায়? Median দেখাতে কী যোগ করবে?

### Q5

সব numeric column-এর pairwise scatter এক command-এ দেখতে কোন function?

### Q6

Histogram আর KDE plot-এর মূল পার্থক্য কী?

### Q7

Plotly chart-কে এমনভাবে save করতে চাই যাতে Python ছাড়াই browser-এ interactive দেখা যায় — কোন method?

### Answers

1. **`sns.relplot(kind='line', ...)`**
2. **B** — `col` শুধু figure-level function-এ আছে।
3. **`sns.countplot(data=df, x='subject')`**
4. **Mean**। Median-এর জন্য `estimator=np.median`।
5. **`sns.pairplot()`**
6. Histogram → bins-এ count-এর bars; KDE → smooth density curve।
7. **`fig.write_html('file.html')`**

---

## Final Cheat Sheet

| Chart | কখন ব্যবহার করবে | Function |
|---|---|---|
| Line plot | সময় অনুযায়ী trend (mean) | `sns.lineplot()` / `sns.relplot(kind='line')` |
| Scatter plot | দুইটা numeric-এর relation | `sns.scatterplot()` / `sns.relplot(kind='scatter')` |
| Facet | Category অনুযায়ী আলাদা panel | `relplot` / `displot` / `lmplot` + `col`, `row`, `col_wrap` |
| Histogram | একটা numeric-এর distribution | `sns.histplot()` / `sns.displot(kind='hist')` |
| KDE plot | Smooth distribution shape | `sns.kdeplot()` / `sns.displot(kind='kde')` |
| Countplot | Category-র count | `sns.countplot(x=...)` |
| Bar plot | Category-wise mean/median/max | `sns.barplot(x=..., y=..., estimator=...)` |
| Regression | Scatter + best-fit line | `sns.regplot()` / `sns.lmplot()` |
| Pairplot | সব numeric column-এর pairwise view | `sns.pairplot()` |
| Joint plot | Relation + দুই পাশে distribution | `sns.jointplot()` |
| Interactive scatter | Hover/zoom সহ relation | `px.scatter()` |
| Interactive line | Hover/zoom সহ trend | `px.line(..., markers=True)` |
| Interactive histogram | Hover/zoom সহ distribution | `px.histogram(..., nbins=...)` |
| Save interactive | HTML file হিসেবে share | `fig.write_html()` |

### One-line Mental Model

> **Seaborn = DataFrame + column name দিলেই statistical chart (একটা plot → axes-level, অনেক panel → figure-level); Plotly = একই chart, কিন্তু interactive।**
