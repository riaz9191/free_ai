> **Learning style:** Understand first, memorize later. Each concept includes intuition, examples, ML connection, and practice.

## Roadmap

1. Matrix basics
2. Rows, columns, shape
3. Elements and indexing
4. Matrix types
5. Addition and subtraction
6. Scalar multiplication
7. Matrix multiplication
8. Multiplication shape rule
9. Matrix multiplication properties
10. Transpose
11. Determinant
12. Matrix inverse
13. Linear equations as matrices
14. `AX = B`
15. Solving `AX = B`
16. Vector ↔ Matrix connection
17. Linear transformation
18. Determinant deeper meaning
19. Rank
20. Linear independence
21. Eigenvalues
22. Eigenvectors
23. Matrices in ML
24. Revision and practice

---

## 1. What is a Matrix?

A **matrix** is a rectangular arrangement of numbers organized into rows and columns.

```text
A =
[ 10  20  30 ]
[ 40  50  60 ]
[ 70  80  90 ]
```

This has:
- 3 rows
- 3 columns
- 9 elements

### ML example

House data:

```text
X =
[ 1000   2   40 ]
[ 1200   3   50 ]
[ 1500   4   65 ]
```

A dataset can often be represented as a matrix.

---

## 2. Rows, Columns, and Shape

```text
A =
[ 5   10   15   20 ]
[ 25  30   35   40 ]
[ 45  50   55   60 ]
```

Rows = 3
Columns = 4

Therefore:

```text
Shape = 3 × 4
```

Total elements:

```text
3 × 4 = 12
```

Remember:

```text
Shape = Rows × Columns
```

Shape and total number of elements are different things.

---

## 3. Matrix Elements and Indexing

Every number is an **element/entry**.

```text
A =
[ 5   8   2 ]
[ 7   4   9 ]
[ 1   6   3 ]
```

`Aᵢⱼ` means:

- `i` = row
- `j` = column

Therefore:

```text
A₂₃ = 9
```

because it is Row 2, Column 3.

Golden rule:

```text
Aᵢⱼ = Row i, Column j
```

ML example:

```text
X =
[ 1000   2   1 ]
[ 1200   3   2 ]
[ 1500   4   3 ]
```

`X₂₁ = 1200`.

---

## 4. Vector vs Matrix

A vector:

```text
[ 2  5  8  10 ]
```

can be viewed as a **row vector** and also represented as a `1 × 4` row matrix.

A column vector:

```text
[ 2 ]
[ 5 ]
[ 8 ]
[10 ]
```

is a `4 × 1` column matrix.

A vector and matrix are not conceptually identical, but vectors can be represented in matrix form.

---

## 5. Types of Matrix

### Row Matrix

One row:

```text
[ 2  5  8  10 ]
```

Shape: `1 × 4`

### Column Matrix

One column:

```text
[ 2 ]
[ 5 ]
[ 8 ]
```

Shape: `3 × 1`

### Square Matrix

Rows = columns:

```text
[ 1  2 ]
[ 3  4 ]
```

Shape: `2 × 2`

### Zero Matrix

Every element is zero:

```text
[ 0  0  0 ]
[ 0  0  0 ]
```

### Identity Matrix

Square matrix with `1` on the main diagonal and `0` elsewhere:

```text
I =
[ 1  0  0 ]
[ 0  1  0 ]
[ 0  0  1 ]
```

It behaves like `1` in matrix multiplication:

```text
AI = A
IA = A
```

when dimensions are compatible.

---

## 6. Matrix Addition

Add corresponding elements.

```text
A =
[ 1  2 ]
[ 3  4 ]

B =
[ 5  6 ]
[ 7  8 ]
```

```text
A + B =
[ 1+5  2+6 ]
[ 3+7  4+8 ]

=
[ 6   8 ]
[10  12 ]
```

### Condition

Both matrices must have the same shape.

```text
2×3 + 2×3 → valid
2×3 + 3×2 → invalid
```

---

## 7. Matrix Subtraction

Subtract corresponding elements.

```text
A =
[ 10  8 ]
[  6  12 ]

B =
[ 3  2 ]
[ 1  5 ]
```

```text
A - B =
[ 7  6 ]
[ 5  7 ]
```

Shapes must match.

---

## 8. Scalar Multiplication

Multiply every element by the scalar.

```text
A =
[ 2  5 ]
[ 4  7 ]
```

```text
2A =
[ 4  10 ]
[ 8  14 ]
```

This is the same basic idea as scalar multiplication of vectors.

---

## 9. Matrix Multiplication

Core rule:

> **Row × Column → multiply corresponding values → add**

Example:

```text
A =
[ 1  2 ]
[ 3  4 ]

B =
[ 5  6 ]
[ 7  8 ]
```

First result element:

```text
(1×5) + (2×7) = 19
```

Second:

```text
(1×6) + (2×8) = 22
```

Third:

```text
(3×5) + (4×7) = 43
```

Fourth:

```text
(3×6) + (4×8) = 50
```

Therefore:

```text
AB =
[ 19  22 ]
[ 43  50 ]
```

---

## 10. Matrix Multiplication Shape Rule

If:

```text
A = m × n
B = n × p
```

then:

```text
AB = m × p
```

The **inner dimensions must match**.

Example:

```text
(2×3)(3×5) → valid → 2×5
```

But:

```text
(2×3)(2×5) → invalid
```

because `3 ≠ 2`.

### Shortcut

```text
(2×3)(3×5)
      ↑ ↑
     match

Result = 2×5
```

---

## 11. Matrix Multiplication Is Not Commutative

With ordinary numbers:

```text
2×3 = 3×2
```

But generally:

```text
AB ≠ BA
```

Also, `BA` may not even be possible if dimensions do not match.

---

## 12. Matrix Multiplication Properties

When dimensions are compatible:

### Associative

```text
(AB)C = A(BC)
```

### Distributive

```text
A(B+C) = AB + AC
```

```text
(A+B)C = AC + BC
```

### Identity

```text
AI = A
IA = A
```

---

## 13. Matrix Transpose

Transpose means:

> Rows become columns and columns become rows.

Example:

```text
A =
[ 1  2  3 ]
[ 4  5  6 ]
```

Then:

```text
Aᵀ =
[ 1  4 ]
[ 2  5 ]
[ 3  6 ]
```

Shape:

```text
2×3 → 3×2
```

Values do not change; positions change.

Important property:

```text
(Aᵀ)ᵀ = A
```

---

## 14. Determinant

The standard determinant is defined for **square matrices**.

For:

```text
A =
[ a  b ]
[ c  d ]
```

```text
det(A) = ad - bc
```

Example:

```text
A =
[ 2  3 ]
[ 1  4 ]
```

```text
det(A)
= (2×4) - (3×1)
= 8 - 3
= 5
```

---

## 15. Determinant and Inverse

The key condition:

```text
det(A) ≠ 0
```

means a square matrix has an inverse.

If:

```text
det(A) = 0
```

the matrix is **singular** and has no ordinary inverse.

Example:

```text
A =
[ 2  4 ]
[ 1  2 ]
```

```text
det(A)
= (2×2) - (4×1)
= 0
```

Therefore it has no inverse.

---

## 16. Deeper Meaning of Determinant

Determinant can be understood as a measure of how a linear transformation changes area (2D) or volume (3D), including orientation.

Intuition:

```text
|det(A)| > 1 → expansion
0 < |det(A)| < 1 → compression
det(A) = 0 → collapse / information loss
```

The most important practical connection:

```text
det(A) = 0
→ singular
→ no inverse
```

---

## 17. Matrix Inverse

The inverse is written:

```text
A⁻¹
```

Core property:

```text
A × A⁻¹ = I
```

This is analogous to:

```text
5 × (1/5) = 1
```

where `I` is the matrix equivalent of the multiplicative identity.

---

## 18. 2×2 Matrix Inverse

For:

```text
A =
[ a  b ]
[ c  d ]
```

```text
A⁻¹ =
1/(ad-bc) ×

[  d  -b ]
[ -c   a ]
```

Practical pattern:

1. Swap `a` and `d`.
2. Change signs of `b` and `c`.
3. Divide by the determinant.

Example:

```text
A =
[ 2  1 ]
[ 1  1 ]
```

Determinant:

```text
(2×1)-(1×1)=1
```

So:

```text
A⁻¹ =
[ 1  -1 ]
[ -1  2 ]
```

Verification:

```text
AA⁻¹ = I
```

---

## 19. Linear Equations as Matrices

Suppose:

```text
2x + y = 7
x + y = 5
```

Coefficients:

```text
2  1
1  1
```

So:

```text
A =
[ 2  1 ]
[ 1  1 ]
```

Variables:

```text
X =
[ x ]
[ y ]
```

Right side:

```text
B =
[ 7 ]
[ 5 ]
```

Therefore:

```text
AX = B
```

This is simply a compact representation of the same equations.

---

## 20. Understanding AX = B

Given:

```text
A =
[ 5  3 ]
[ 2  7 ]

X =
[ x ]
[ y ]
```

Multiply:

First row:

```text
(5×x)+(3×y) = 5x+3y
```

Second row:

```text
(2×x)+(7×y) = 2x+7y
```

Therefore:

```text
AX =
[ 5x+3y ]
[ 2x+7y ]
```

If:

```text
B =
[20]
[15]
```

then:

```text
AX=B
```

means:

```text
5x+3y=20
2x+7y=15
```

So `AX=B` is not magic. It is the matrix form of a system of linear equations.

---

## 21. Solving AX = B

If `A⁻¹` exists:

```text
AX = B
```

Multiply both sides by `A⁻¹`:

```text
A⁻¹AX = A⁻¹B
```

Because:

```text
A⁻¹A = I
```

we get:

```text
IX = A⁻¹B
```

Therefore:

```text
X = A⁻¹B
```

This is one matrix-based way to solve a linear system.

---

## 22. Vector ↔ Matrix Connection

A vector can be written as a column matrix:

```text
v =
[ 4 ]
[ 5 ]
```

A matrix can transform it:

```text
Av
```

Example:

```text
A =
[ 2  1 ]
[ 1  3 ]

v =
[ 4 ]
[ 5 ]
```

Then:

```text
Av =
[ (2×4)+(1×5) ]
[ (1×4)+(3×5) ]

=
[13]
[19]
```

This operation is fundamental in ML.

---

## 23. Linear Transformation

A matrix can be thought of as a transformation machine:

```text
Vector
   ↓
Matrix
   ↓
New Vector
```

A transformation can:

- stretch
- compress
- rotate
- reflect
- shear
- change direction

Symbolically:

```text
v → Av
```

The matrix controls how the vector changes.

---

## 24. Determinant as Transformation Scaling

For a 2D transformation:

```text
|det(A)|
```

tells us how area is scaled.

Examples:

```text
det(A)=2   → area doubles
det(A)=0.5 → area halves
det(A)=0   → area collapses
```

The sign can also represent an orientation flip.

---

## 25. Rank

Rank is a measure of the number of independent directions/information contained in a matrix.

Example:

```text
A =
[ 1  2 ]
[ 2  4 ]
```

The second row is:

```text
2 × first row
```

So it adds no new independent information.

Therefore:

```text
rank(A)=1
```

But:

```text
B =
[ 1  2 ]
[ 3  4 ]
```

has two independent rows:

```text
rank(B)=2
```

General rule:

```text
rank(A) ≤ min(number of rows, number of columns)
```

---

## 26. Linear Independence

Vectors are linearly independent when none can be constructed from the others using linear combinations.

Independent:

```text
v1 = [1]
     [0]

v2 = [0]
     [1]
```

Dependent:

```text
v1 = [1]
     [2]

v2 = [2]
     [4]
```

because:

```text
v2 = 2v1
```

Intuition:

```text
Independent → new information
Dependent   → redundant information
```

Rank and independence are closely connected.

---

## 27. Eigenvectors and Eigenvalues

A matrix transforms vectors:

```text
Av
```

Usually direction can change.

But some special vectors keep their direction:

```text
Av = λv
```

where:

- `v` = eigenvector
- `λ` = eigenvalue

Intuition:

```text
Normal vector
v → matrix → different direction

Eigenvector
v → matrix → same direction, only scaled
```

The eigenvalue tells how much it is scaled.

---

## 28. Simple Eigenvalue/Eigenvector Example

```text
A =
[ 2  0 ]
[ 0  3 ]
```

Take:

```text
v =
[1]
[0]
```

Then:

```text
Av =
[2 0][1]
[0 3][0]

=
[2]
[0]
```

So:

```text
Av = 2v
```

Therefore:

```text
v = [1,0] → eigenvector
λ = 2      → eigenvalue
```

Likewise `[0,1]` is an eigenvector with eigenvalue `3`.

---

## 29. Why Eigenvalues/Eigenvectors Matter in ML

They appear in:

- PCA
- dimensionality reduction
- covariance analysis
- spectral methods
- transformation analysis
- some optimization and numerical methods

Remember the intuition:

```text
Eigenvector = special direction
Eigenvalue = scaling factor
```

---

## 30. Matrices in Machine Learning

Suppose a dataset has:

| Sample | Size | Bedrooms | Age |
|---|---:|---:|---:|
| 1 | 1000 | 2 | 5 |
| 2 | 1200 | 3 | 4 |
| 3 | 1500 | 4 | 2 |

Matrix representation:

```text
X =
[ 1000   2   5 ]
[ 1200   3   4 ]
[ 1500   4   2 ]
```

Rows often represent samples.

Columns often represent features.

A model can combine inputs and weights through matrix operations:

```text
Input
  ↓
Matrix multiplication
  ↓
Bias
  ↓
Activation
  ↓
Next layer
```

This pattern is central to neural networks.

---

## 31. Matrix Multiplication as Dot Products

Matrix multiplication is built from row-column dot products.

Example:

```text
A =
[1 2]
[3 4]

B =
[5 6]
[7 8]
```

First result:

```text
[1,2] · [5,7]
= (1×5)+(2×7)
= 19
```

So:

> Matrix multiplication is essentially many dot-product calculations arranged into a matrix.

This directly connects Module 2 (vectors/dot product) to Module 3.

---

## 32. Common Confusions

### Shape vs elements

```text
3×4 matrix
```

means 3 rows and 4 columns, not "the number 12".

### Addition vs multiplication

Addition:

```text
same shape
```

Multiplication:

```text
inner dimensions match
```

### Transpose

Transpose changes positions, not numerical values.

### Determinant

Standard determinant is for square matrices.

### Inverse

```text
det=0 → no inverse
det≠0 → inverse exists for a square matrix
```

### Matrix multiplication order

Generally:

```text
AB ≠ BA
```

---

## 33. Master Cheat Sheet

```text
Matrix
= organized rows + columns

Shape
= rows × columns

Element
= Aᵢⱼ
= row i, column j

Addition
= corresponding elements add

Subtraction
= corresponding elements subtract

Scalar multiplication
= scalar × every element

Transpose
= rows ↔ columns

Matrix multiplication
= row × column

Multiplication shape
(m×n)(n×p) = m×p

2×2 determinant
= ad - bc

Inverse
A × A⁻¹ = I

2×2 inverse
= 1/det(A) × [ d  -b ]
             [ -c  a ]

Linear system
AX = B

If A is invertible:
X = A⁻¹B

Rank
= amount of independent information

Eigenvector
= special direction

Eigenvalue
= scaling factor for that direction
```

---

## 34. Full Mental Model

```text
Scalar
  ↓
Vector
  ↓
Matrix
  ↓
Rows + Columns
  ↓
Shape
  ↓
Matrix Operations
  ├─ Addition
  ├─ Subtraction
  ├─ Scalar multiplication
  ├─ Transpose
  └─ Matrix multiplication
          ↓
      Linear equations
          ↓
        AX = B
          ↓
      Determinant
          ↓
        Inverse
          ↓
      X = A⁻¹B
          ↓
  Linear Transformation
          ↓
      Rank / Independence
          ↓
  Eigenvalues / Eigenvectors
          ↓
    Machine Learning
```

---

## 35. Practice Test

### Q1

Find the shape:

```text
[1 2 3]
[4 5 6]
```

### Q2

Find `A₂₃`:

```text
A =
[1 2 3]
[4 5 6]
[7 8 9]
```

### Q3

What type of matrix?

```text
[1 0]
[0 1]
```

### Q4

```text
A=[1 2]    B=[5 6]
  [3 4]      [7 8]
```

Find `A+B`.

### Q5

```text
A=[8 7]    B=[2 3]
  [6 5]      [1 4]
```

Find `A-B`.

### Q6

```text
A=[2 4]
  [3 5]
```

Find `3A`.

### Q7

Can `(2×3)(3×4)` be multiplied? What is the result shape?

### Q8

Transpose:

```text
A=[1 2 3]
  [4 5 6]
```

### Q9

Find determinant:

```text
A=[5 2]
  [3 4]
```

### Q10

Can this matrix have an inverse?

```text
A=[2 4]
  [1 2]
```

### Q11

Write as `AX=B`:

```text
2x+3y=10
x+4y=12
```

### Q12

What does `A₂₃` mean?

### Answers

1. `2×3`
2. `6`
3. Identity Matrix
4. `[6 8; 10 12]`
5. `[6 4; 5 1]`
6. `[6 12; 9 15]`
7. Yes, result is `2×4`
8. `[1 4; 2 5; 3 6]`
9. `14`
10. No, determinant is `0`
11.

   ```text
   A=[2 3]
     [1 4]

   X=[x]
     [y]

   B=[10]
     [12]

   AX=B
   ```

12. Row 2, Column 3.

---

## 36. Completion Checklist

Before considering Module 3 complete, you should be able to explain:

- [ ] What a matrix is
- [ ] Row vs column
- [ ] Matrix shape
- [ ] Matrix indexing
- [ ] Row, column, square, zero, identity matrices
- [ ] Matrix addition
- [ ] Matrix subtraction
- [ ] Scalar multiplication
- [ ] Matrix multiplication
- [ ] Multiplication shape rule
- [ ] Why `AB` and `BA` are generally different
- [ ] Transpose
- [ ] Determinant
- [ ] Why determinant zero means no inverse
- [ ] Matrix inverse
- [ ] `AX=B`
- [ ] `X=A⁻¹B`
- [ ] Vector-matrix connection
- [ ] Linear transformation
- [ ] Rank
- [ ] Linear independence
- [ ] Eigenvalue
- [ ] Eigenvector
- [ ] Matrix use in ML

---

## 37. What Comes Next

A natural ML learning progression is:

```text
Math Foundations
      ↓
Vectors
      ↓
Matrices
      ↓
Linear Algebra
      ↓
Probability & Statistics
      ↓
Python for ML
      ↓
NumPy / Pandas
      ↓
Data Preparation
      ↓
Machine Learning Algorithms
      ↓
Model Training
      ↓
Evaluation
      ↓
Neural Networks
```

**End of Module 3 — Matrices & Linear Algebra for ML**
