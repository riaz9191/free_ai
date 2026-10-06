*Bangla + English mixed notes.* — **Python Module 08**

> 📓 **Class notebook:** `module-08-oop.ipynb` — [👁️ View](/ai/ml/notebooks/module-08-oop) / [⬇️ Download](/notebooks/module-08-oop.ipynb)

> এই module-এ **Object-Oriented Programming (OOP)** শিখব — class আর object দিয়ে real-world জিনিসকে code-এ model করা, এবং OOP-এর 4টা pillar: **Inheritance, Polymorphism, Encapsulation, Abstraction**।

## Roadmap

1. 8.1 Class and Objects
2. 8.2 Single Inheritance
3. 8.3 Multiple Inheritance
4. 8.4 Polymorphism
5. 8.5 Encapsulation
6. 8.6 Abstraction

### 🎯 Module Goal

Class হলো **blueprint (নকশা)**, object হলো সেই নকশা থেকে বানানো **real জিনিস**।

```text
Class: Phone  (blueprint)
   ├── object: apple      ("Iphone17")
   ├── object: blueberry  ("B-17")
   └── object: motorola   ("M-17")
```

OOP-এর 4 pillar:

```text
Inheritance   → parent-এর জিনিস child পায়
Polymorphism  → একই method, ভিন্ন ভিন্ন behavior
Encapsulation → data লুকিয়ে রাখা, method দিয়ে access
Abstraction   → শুধু "কী করবে" বলা, "কীভাবে" child ঠিক করবে
```

Machine learning library (যেমন scikit-learn, PyTorch) পুরোটাই class দিয়ে বানানো — তাই OOP বোঝা খুব important।

---

## 8.1 — Class and Objects

### Class define করা

```python
# base class / parent class
class Phone:
    category = "Electronics"

    # constructor
    def __init__(self, model, battery, camera, battery_percentage=100):
        self.model = model
        self.battery = battery
        self.camera = camera
        self.battery_percentage = battery_percentage

    # methods
    def charge(self, hour):
        print(f"charge completed by {hour}")

    def capture(self, photo):
        if self.battery_percentage <= 0:
            print("No charge")
        else:
            self.battery_percentage -= photo
            print(f"photo captured in {self.model}")


class Cooling_Mechanism:
    def __init__(self, cooling_method):
        self.cooling_method = cooling_method

    # methods
    def cooling_on(self):
        print(f"the system is being cool by {self.cooling_method}")
```

Terms:

| Term | মানে | Example |
|---|---|---|
| Class attribute | সব object-এর জন্য common | `category = "Electronics"` |
| Constructor `__init__` | Object বানানোর সময় auto call হয় | `Phone("Iphone17", ...)` |
| `self` | যে object-এর উপর কাজ হচ্ছে সেটা | `self.model` |
| Instance attribute | প্রতিটা object-এর নিজস্ব data | `self.battery` |
| Method | Class-এর ভিতরের function | `charge()`, `capture()` |

### Object তৈরি করা

```python
# creating objects
apple = Phone("Iphone17", 3000, 40)
blueberry = Phone("B-17", 4000, 30)
motorola = Phone("M-17", 3500, 35)

apple.capture(10)
print(motorola.battery_percentage)
```

```text
photo captured in Iphone17
100
```

- `apple.capture(10)` শুধু **apple**-এর battery 10 কমিয়েছে (100 → 90)।
- `motorola`-এর battery আলাদা, তাই সেটা এখনো 100। প্রতিটা object-এর data independent।

---

## 8.2 — Single Inheritance

Child class parent class-এর সব attribute আর method **inherit** করে, আর নিজের নতুন জিনিসও যোগ করতে পারে।

```python
# child / derived class
class SmartPhone(Phone):
    def __init__(self, model, battery, camera, processor):
        super().__init__(model, battery, camera)
        self.processor = processor

    # modified method
    def charge(self, hour):
        print("fast charging in process")
        super().charge(hour)
```

- `class SmartPhone(Phone)` → SmartPhone হলো Phone-এর child।
- `super().__init__(...)` → parent-এর constructor call করে model, battery, camera set করে।
- `charge()` method modify (override) করা হয়েছে, আর ভিতরে `super().charge(hour)` দিয়ে parent-এর version-ও চালানো হয়েছে।

```python
pro = SmartPhone("X", 5000, 100, "SnapDragon")

print(pro.model)

pro.charge(1)
```

```text
X
fast charging in process
charge completed by 1
```

`model` Phone থেকে inherited। `charge()` আগে নিজের line print করে, তারপর parent-এর।

```text
Phone (parent)
   ↑
SmartPhone (child) → + processor, modified charge()
```

---

## 8.3 — Multiple Inheritance

একটা class একাধিক parent থেকে inherit করতে পারে।

```python
class SmartPhone_CoolingMode(SmartPhone, Cooling_Mechanism):
    def __init__(self, model, battery, camera, processor, cooling_method):
        SmartPhone.__init__(self, model, battery, camera, processor)
        Cooling_Mechanism.__init__(self, cooling_method)
```

দুইটা parent-এর constructor আলাদা আলাদা নাম ধরে call করা হয়েছে, যাতে দুই দিকের attributes-ই set হয়।

```python
pro_cooling = SmartPhone_CoolingMode("Y", 5000, 100, "SD", "Nitrogen")

print(pro_cooling.processor)       # SmartPhone class থেকে
print(pro_cooling.battery)         # Phone class থেকে
print(pro_cooling.cooling_method)  # Cooling_Mechanism class থেকে
pro_cooling.cooling_on()           # Cooling_Mechanism class-এর method
pro_cooling.charge(1)              # SmartPhone-এর modified charge (Phone থেকে inherited)
```

```text
SD
5000
Nitrogen
the system is being cool by Nitrogen
fast charging in process
charge completed by 1
```

একটা object তিনটা class-এর জিনিস ব্যবহার করছে:

```text
        Phone
          ↑
     SmartPhone      Cooling_Mechanism
            ↖          ↗
        SmartPhone_CoolingMode
```

---

## 8.4 — Polymorphism

Polymorphism মানে **"many forms"** — একই নামের method, কিন্তু different class-এ different behavior।

### Parent class

```python
class Camera:
    def __init__(self, name):
        self.name = name

    # method
    def capture(self):
        print("a photo is captured")
```

### Child classes — method overriding

```python
class Smart_Phone(Camera):
    def __init__(self, name, resolution):
        super().__init__(name)
        self.resolution = resolution

    # method overriding
    def capture(self):
        print("Photo is captured by a Phone")


class DSLR(Camera):
    def __init__(self, name, resolution):
        super().__init__(name)
        self.resolution = resolution

    def capture(self):
        print("Photo is captured by DSLR")


class Drone(Camera):
    def __init__(self, name, resolution):
        super().__init__(name)
        self.resolution = resolution

    def capture(self):
        print("Photo is captured by Drone")


phone = Smart_Phone("Phone", 30)
dslr = DSLR("DSLR", 200)
drone = Drone("Drone", 150)

phone.capture()
dslr.capture()
drone.capture()
```

```text
Photo is captured by a Phone
Photo is captured by DSLR
Photo is captured by Drone
```

তিনটাই `capture()` call করেছে, কিন্তু প্রতিটা নিজের মতো কাজ করেছে। Child class parent-এর method **override** করেছে।

```text
camera.capture()
   ├── Smart_Phone → "by a Phone"
   ├── DSLR        → "by DSLR"
   └── Drone       → "by Drone"
```

---

## 8.5 — Encapsulation

Encapsulation মানে data-কে **class-এর ভিতরে লুকিয়ে (private)** রাখা, এবং শুধু নির্দিষ্ট method (getter/setter) দিয়ে access করতে দেওয়া।

Python-এ attribute-এর নামের আগে **`__` (double underscore)** দিলে সেটা private হয় — বাইরে থেকে সরাসরি access করা যায় না।

```python
# design
class Mobile:
    def __init__(self, name, model, imei):
        self.__name = name
        self.__model = model
        self.__imei = imei  # private

    def charge(self):
        print("phone is charging")

    # getter methods — private data পড়ার উপায়
    def imei_getter(self):
        return self.__imei

    def model_getter(self):
        return self.__model

    def name_getter(self):
        return self.__name

    # setter method — private data change করার উপায়
    def name_setter(self, name):
        self.__name = name


# outside world (user)

# registration
iphone = Mobile("Phone", "17", "1xkaf1")

print(iphone.name_getter())

iphone.name_setter("Phitron")

print(iphone.name_getter())
```

```text
Phone
Phitron
```

- `iphone.__name` সরাসরি লিখলে `AttributeError` আসবে।
- Getter দিয়ে পড়া যায়, setter দিয়ে change করা যায়।
- `imei`-এর কোনো setter নেই — মানে IMEI বাইরে থেকে change করা যাবে না। এভাবেই data protect হয়।

```text
Outside world  →  getter / setter  →  __private data
```

---

## 8.6 — Abstraction

Abstraction মানে শুধু **"কী করতে হবে"** define করা, **"কীভাবে করবে"** সেটা child class-কে ঠিক করতে দেওয়া।

Python-এ `abc` module-এর `ABC` আর `@abstractmethod` দিয়ে abstract class বানানো হয়।

```python
from abc import ABC, abstractmethod

class Telephone(ABC):

    @abstractmethod
    def make_call(self):
        pass


class Sphone(Telephone):
    def make_call(self):
        print("Making a call using SPhone")


class Iphone(Telephone):
    def make_call(self):
        print("Making a call using IPhone")
```

- `Telephone` হলো abstract class — এটা শুধু বলে "প্রতিটা telephone-এর `make_call()` থাকতে হবে"।
- `Telephone()` সরাসরি object বানানো যায় না (`TypeError`)।
- Child class `make_call()` implement না করলে তার object-ও বানানো যাবে না।

```python
ip = Iphone()

ip.make_call()
```

```text
Making a call using IPhone
```

`Iphone` নিজের মতো `make_call()` implement করেছে, তাই object বানানো ও call করা গেছে।

---

## Common Confusions

### Class vs Object

```text
Class  → blueprint (Phone)
Object → blueprint থেকে বানানো জিনিস (apple, motorola)
```

### Class attribute vs Instance attribute

```text
category = "Electronics"   → সব Phone-এর জন্য same
self.model = model         → প্রতিটা object-এর আলাদা
```

### `self` কেন লাগে?

Method-কে জানাতে হয় কোন object-এর data নিয়ে কাজ করবে। `apple.capture(10)` আসলে `Phone.capture(apple, 10)`।

### `super()` কী করে?

Parent class-এর method/constructor call করে — parent-এর code আবার লিখতে হয় না।

### `print(obj.method())` → extra `None`

Method যদি শুধু `print` করে আর কিছু `return` না করে, তাহলে `print(obj.method())` লিখলে method-এর output-এর পরে একটা `None` print হয়। শুধু `obj.method()` call করো।

### Overriding vs Overloading

```text
Overriding → child class parent-এর same-name method নতুন করে লেখে (Python-এ এটাই common)
Overloading → same নামে ভিন্ন parameter-এর একাধিক method (Python সরাসরি support করে না)
```

### Encapsulation vs Abstraction

```text
Encapsulation → data লুকানো (__private + getter/setter)
Abstraction   → implementation লুকানো (abstract method, child implement করে)
```

---

## Quick Practice

### Q1

```python
class Dog:
    def __init__(self, name):
        self.name = name

d = Dog("Tommy")
print(d.name)
```

Output?

### Q2

```python
class A:
    def hi(self):
        print("A")

class B(A):
    def hi(self):
        print("B")

B().hi()
```

Output? এটা কোন concept?

### Q3

```python
class A:
    def hi(self):
        print("A")

class B(A):
    pass

B().hi()
```

Output?

### Q4

```python
class Bank:
    def __init__(self):
        self.__balance = 100

b = Bank()
print(b.__balance)
```

কী হবে?

### Q5

Abstract class থেকে সরাসরি object বানালে কী হয়?

### Q6

```python
class Phone:
    category = "Electronics"

p1 = Phone()
p2 = Phone()
print(p1.category == p2.category)
```

Output?

### Answers

1. **`Tommy`**
2. **`B`** — Method overriding / Polymorphism
3. **`A`** — Inheritance (parent-এর method পেয়েছে)
4. **`AttributeError`** — `__balance` private (Encapsulation)
5. **`TypeError`** — abstract class instantiate করা যায় না
6. **`True`** — class attribute সবার জন্য same

---

## Final Cheat Sheet

| Concept | Core idea |
|---|---|
| `class` | Blueprint |
| Object | Class-এর instance |
| `__init__` | Constructor — object বানানোর সময় চলে |
| `self` | Current object |
| Class attribute | সব object-এ common |
| Instance attribute | `self.x` — object-এর নিজস্ব |
| Method | Class-এর ভিতরের function |
| Inheritance | `class Child(Parent)` |
| `super()` | Parent-এর method/constructor call |
| Multiple inheritance | `class C(A, B)` |
| Polymorphism | Same method, different behavior |
| Method overriding | Child-এ same-name method নতুন করে লেখা |
| Encapsulation | `__private` + getter/setter |
| Abstraction | `ABC` + `@abstractmethod` |

### One-line Mental Model

> **OOP = class (blueprint) থেকে object বানানো; inheritance দিয়ে reuse, polymorphism দিয়ে flexibility, encapsulation দিয়ে protection, abstraction দিয়ে simplicity।**
