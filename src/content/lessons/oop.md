*Bangla + English mixed notes.* — **Python Module 09** (course lesson-by-lesson notes)

> 📓 **Class notebook:** `module-08-oop.ipynb` — [👁️ View](/ai/ml/notebooks/module-08-oop) / [⬇️ Download](/notebooks/module-08-oop.ipynb)

**Course duration:** 1 hr 36 min | **13 units**

> Screenshot-এ visible lesson titles অনুযায়ী এই note তৈরি করা হয়েছে। Header-এ 13 units দেখা গেলেও screenshot-এ শেষের সব unit দেখা যায়নি; তাই missing lesson title বা duration invent করা হয়নি।

---

## 📚 Exact Course Roadmap

1. **Text Instructions Module 09** — Post content
2. **9.0 Module Introduction** — 4 min
3. **9.1 Introduction to OOP** — 5 min
4. **9.2 Class and Objects Theory** — 5 min
5. **9.3 Class and Object implementation** — 21 min
6. **9.4 OOP Inheritance** — duration not visible
7. **9.5 OOP Polymorphism** — 9 min
8. **(Optional) 9.6 OOP Encapsulation** — 12 min
9. **(Optional) 9.7 OOP Abstraction** — 10 min
10. **9.8 Module Overview** — 11 min
11. **Quiz Module 09** — Quiz
12. **Quiz Explanation and Extra Practice Problem (Module 09)** — lower part not fully visible
13. **One additional unit** — title not visible in provided screenshots

---

## 9.0 Module Introduction

আগের Python modules-এ আমরা variables, conditions, loops, lists, dictionaries এবং functions শিখেছি।

এখন শিখব **OOP — Object-Oriented Programming**।

OOP-তে code-কে শুধু function বা instruction হিসেবে না দেখে **object** হিসেবে organize করি।

Real-life example:

একটা Car-এর:
- Data/attributes: brand, color, speed
- Actions/methods: start, stop, accelerate

Python-এ এই ধারণা দিয়ে reusable এবং organized code তৈরি করা যায়।

---

## 9.1 Introduction to OOP

### OOP কী?

OOP হলো programming paradigm যেখানে program-কে objects এবং তাদের interaction দিয়ে organize করা হয়।

একটা object-এর সাধারণত দুইটি অংশ থাকে:

```text
Object
  ├── Attributes (data/state)
  └── Methods (behavior/actions)
```

Example — একটি mobile phone:

| Attributes | Methods |
|---|---|
| brand | call() |
| model | take_photo() |
| battery | charge() |

Python-এ OOP ব্যবহার করলে related data এবং behavior এক জায়গায় রাখা যায়।

### কেন OOP দরকার?

- Code organize করা
- Reuse করা
- বড় project maintain করা
- Real-world entities model করা
- Related data এবং behavior একসাথে রাখা

OOP সব problem-এর একমাত্র solution নয়; problem অনুযায়ী procedural বা functional style-ও ভালো হতে পারে।

---

## 9.2 Class and Objects Theory

### Class কী?

Class হলো object তৈরির **blueprint/template**।

ধরো, Car-এর design হলো class। সেই design থেকে অনেকগুলো আলাদা car object তৈরি করা যায়।

```text
             Car Class
          /      |      \
       Car 1   Car 2   Car 3
```

### Object কী?

Object হলো class থেকে তৈরি actual instance।

Example:
- `Car` = class
- Red Toyota = একটি object
- Blue Honda = আরেকটি object

প্রতিটি object-এর নিজস্ব attribute value থাকতে পারে।

### Attribute vs Method

- **Attribute:** object-এর data/property
- **Method:** object-এর action/behavior; class-এর ভিতরে define করা function

Example concept:

```text
Student
  ├── name      → attribute
  ├── age       → attribute
  └── introduce → method
```

---

## 9.3 Class and Object Implementation

### Basic class

```python
class Student:
    pass
```

`class` keyword দিয়ে class তৈরি হয়। `pass` আপাতত empty body রাখার জন্য।

### Object তৈরি

```python
class Student:
    pass

student1 = Student()
student2 = Student()
```

`student1` এবং `student2` হলো আলাদা object/instance।

### `__init__()` — Constructor

Object তৈরি হওয়ার সময় initial data set করতে `__init__()` ব্যবহার করি।

```python
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

student1 = Student("Riaz", 27)
student2 = Student("Hasib", 25)

print(student1.name)  # Riaz
print(student2.age)   # 25
```

এখানে:
- `__init__()` object initialize করে।
- `self` current object-কে refer করে।
- `name`, `age` হলো parameters।
- `self.name`, `self.age` হলো object attributes।

### `self` সহজভাবে

যখন `student1` দিয়ে method call করি, `self` সেই `student1` object-কে refer করে।

```python
class Student:
    def __init__(self, name):
        self.name = name

    def introduce(self):
        print("My name is", self.name)

student1 = Student("Riaz")
student2 = Student("Hasib")

student1.introduce()  # My name is Riaz
student2.introduce()  # My name is Hasib
```

একই method, কিন্তু object আলাদা বলে output আলাদা।

### Instance method

Class-এর ভিতরে `self` parameter-সহ define করা function-কে সাধারণত instance method বলে।

```python
class Calculator:
    def add(self, a, b):
        return a + b

calc = Calculator()
print(calc.add(10, 20))  # 30
```

### Attribute update

```python
student1.age = 28
print(student1.age)  # 28
```

Object-এর attribute update করা যায়।

---

## 9.4 OOP Inheritance

### Inheritance কী?

একটি class অন্য class-এর attributes এবং methods inherit করতে পারে।

যে class inherit করে:
- Child class / subclass

যে class থেকে inherit করে:
- Parent class / base class

Real-life example:

```text
             Vehicle (Parent)
              /          \
           Car            Bike
```

Car এবং Bike — দুটোই Vehicle-এর common behavior reuse করতে পারে।

### Basic example

```python
class Vehicle:
    def start(self):
        print("Vehicle started")

class Car(Vehicle):
    def drive(self):
        print("Car is moving")

my_car = Car()

my_car.start()  # inherited from Vehicle
my_car.drive()  # defined in Car
```

`Car(Vehicle)` মানে Car class, Vehicle class থেকে inherit করছে।

### Method overriding

Child class চাইলে parent class-এর method নিজের মতো redefine করতে পারে।

```python
class Animal:
    def sound(self):
        print("Some sound")

class Dog(Animal):
    def sound(self):
        print("Bark")

dog = Dog()
dog.sound()  # Bark
```

এটাকে method overriding বলে।

### `super()`

Parent class-এর method বা initializer call করতে `super()` ব্যবহার করা যায়।

```python
class Person:
    def __init__(self, name):
        self.name = name

class Developer(Person):
    def __init__(self, name, language):
        super().__init__(name)
        self.language = language

dev = Developer("Riaz", "Python")

print(dev.name)      # Riaz
print(dev.language)  # Python
```

**কখন inheritance?** যখন child class সত্যিই parent class-এর একটি specialized type — অর্থাৎ meaningful “is-a” relationship আছে। শুধু code reuse করার জন্য সবসময় inheritance দরকার হয় না।

---

## 9.5 OOP Polymorphism

### Polymorphism কী?

Poly = many, morph = forms।

একই interface/method name বিভিন্ন object-এর জন্য different behavior দিতে পারে।

Example:

```python
class Dog:
    def sound(self):
        print("Bark")

class Cat:
    def sound(self):
        print("Meow")

animals = [Dog(), Cat()]

for animal in animals:
    animal.sound()
```

Output:

```text
Bark
Meow
```

একই `sound()` call, কিন্তু object অনুযায়ী behavior আলাদা।

### Function polymorphism-এর simple example

```python
print(len("Python"))       # 6
print(len([10, 20, 30]))   # 3
```

একই `len()` function string এবং list—দুটোর length বের করতে পারে।

### Method overriding এবং polymorphism

Inheritance-এ child class method override করলে object অনুযায়ী একই method call-এর different behavior পাওয়া যায়।

---

## 9.6 (Optional) OOP Encapsulation

### Encapsulation কী?

Data এবং সেই data-র উপর কাজ করা methods-কে class-এর মধ্যে organize করা এবং internal details-এ controlled access দেওয়া—এটাই encapsulation-এর মূল ধারণা।

Example:

```python
class BankAccount:
    def __init__(self, balance):
        self._balance = balance

    def deposit(self, amount):
        if amount > 0:
            self._balance += amount

    def get_balance(self):
        return self._balance

account = BankAccount(1000)
account.deposit(500)

print(account.get_balance())  # 1500
```

এখানে balance update করার জন্য method ব্যবহার করছি।

### Public, protected convention, private name mangling

Python-এ access modifier-এর ধারণা একটু আলাদা:

```python
self.name       # public
self._balance   # internal/protected-style convention
self.__pin      # name mangling
```

- `name`: public; সাধারণভাবে access করা যায়।
- `_balance`: underscore convention—এটিকে internal detail হিসেবে treat করতে বলা হয়; strict restriction নয়।
- `__pin`: double underscore name mangling করে; এটি complete security/private lock নয়।

**মনে রাখবে:** Python-এ underscore convention মানে programmer-দের জন্য signal; Java/C++-এর মতো strict private enforcement নয়।

---

## 9.7 (Optional) OOP Abstraction

### Abstraction কী?

Complex system-এর internal details hide করে user-কে প্রয়োজনীয় interface দেখানো।

Real-life example:

গাড়ি চালানোর সময় accelerator চাপলে car speed বাড়ে। Engine-এর ভিতরে প্রতিটি mechanical step driver-কে জানতে হয় না।

Programming-এ abstraction:
- কী কাজ করা যাবে তা interface-এ define করে
- কীভাবে কাজটি হয় তার internal detail hide/আলাদা রাখে

### Abstract class-এর basic idea

Python-এর `abc` module দিয়ে abstract class তৈরি করা যায়।

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

rectangle = Rectangle(5, 3)
print(rectangle.area())  # 15
```

`Shape` বলে দিচ্ছে, subclass-কে `area()` implement করতে হবে।

Abstract class নিজে থেকে incomplete অবস্থায় instantiate করা যায় না।

### Encapsulation vs Abstraction

| Encapsulation | Abstraction |
|---|---|
| Data + methods organize এবং access control | Unnecessary implementation details hide |
| “কীভাবে data access/manage হবে?” | “কোন interface ব্যবহার করব?” |

---

## 9.8 Module Overview

OOP-এর core concepts:

```text
Class
  ↓
Object
  ↓
Attributes + Methods
  ↓
Inheritance
  ↓
Polymorphism
  ↓
Encapsulation
  ↓
Abstraction
```

চারটি বহুল পরিচিত OOP pillars:
1. Encapsulation
2. Abstraction
3. Inheritance
4. Polymorphism

Class এবং object হলো OOP-এর foundation।

---

## 🔗 ML / Data Science Connection

OOP ML project-এ useful হতে পারে।

Example: একটি simple model class

```python
class SimpleModel:
    def __init__(self, weight):
        self.weight = weight

    def predict(self, x):
        return self.weight * x

model = SimpleModel(2)
print(model.predict(5))  # 10
```

এখানে:
- `weight` = model-এর state/attribute
- `predict()` = model-এর behavior/method

বড় ML libraries-এ model, dataset, transformer ইত্যাদি অনেক সময় object/class দিয়ে represent করা হয়।

---

## ❗ Common Confusions

| Concept | মনে রাখবে |
|---|---|
| Class | Blueprint/template |
| Object | Class থেকে তৈরি instance |
| Attribute | Object-এর data |
| Method | Object-এর behavior/function |
| `self` | Current instance |
| `__init__()` | Object initialize করে |
| Inheritance | Parent-এর feature child-এ পাওয়া |
| Overriding | Child-এর method দিয়ে parent method replace করা |
| Polymorphism | Same interface, different behavior |
| Encapsulation | Data এবং methods organize; access convention/control |
| Abstraction | Interface দেখানো, implementation details hide |

---

## 📝 Quick Practice

#### Q1
OOP-তে class কী?

A. Object-এর blueprint  
B. শুধু variable  
C. শুধু loop

#### Q2
Class থেকে তৈরি actual instance-কে কী বলে?

A. Method  
B. Object  
C. Parameter

#### Q3
`self` কী refer করে?

A. Parent class সবসময়  
B. Current object/instance  
C. Python interpreter

#### Q4
```python
class Animal:
    def sound(self):
        print("Sound")

class Dog(Animal):
    pass

dog = Dog()
dog.sound()
```

এখানে `Dog` কোন class থেকে inherit করছে?

#### Q5
Child class parent-এর method নিজের মতো redefine করলে তাকে কী বলে?

A. Slicing  
B. Overriding  
C. Indexing

#### Q6
একই method call-এ different object different behavior দেখালে সেটা কোন concept?

A. Polymorphism  
B. File handling  
C. Looping

#### Q7
Python-এ `_balance` সাধারণত কী বোঝায়?

A. Internal use-এর convention  
B. Fully secure private variable  
C. Integer variable

#### Q8
Abstract class-এর জন্য কোন module ব্যবহার করা যায়?

A. `math`  
B. `abc`  
C. `random`

### Answers

1. **A — Blueprint**
2. **B — Object**
3. **B — Current instance**
4. **Animal**
5. **B — Overriding**
6. **A — Polymorphism**
7. **A — Internal-use convention**
8. **B — `abc`**

---

## 🎯 Final Cheat Sheet

| Topic | Core idea |
|---|---|
| OOP | Object-based programming style |
| Class | Blueprint |
| Object | Instance |
| Attribute | Data/state |
| Method | Behavior/action |
| `__init__()` | Initialize object |
| `self` | Current instance |
| Inheritance | Reuse/extend parent class |
| `super()` | Parent implementation access |
| Overriding | Child redefines inherited method |
| Polymorphism | Same interface, different behavior |
| Encapsulation | Bundle data + behavior; controlled access |
| Abstraction | Expose interface, hide details |

### One-line Mental Model

> **Class হলো blueprint, object হলো তৈরি instance; আর OOP-এর চার pillar—Encapsulation, Abstraction, Inheritance, Polymorphism—code-কে organized, reusable এবং extensible করতে সাহায্য করে।**
