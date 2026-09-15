export const LANGUAGES = [
  "Python",
  "JavaScript",
  "TypeScript",
  "HTML",
  "CSS",
  "SQL",
  "Bash",
  "JSON",
  "Markdown",
] as const;
export type Language = (typeof LANGUAGES)[number];

export interface CodeSnippet {
  id: string;
  title: string;
  language: Language;
  code: string;
  description: string;
  tags: string[];
  createdAt: string;
}

export const SEED_SNIPPETS: CodeSnippet[] = [
  // ── Python ──────────────────────────────────────────────────────────────
  {
    id: "seed-py-1",
    title: "Hello World & Types",
    language: "Python",
    description: "Basic output and Python's built-in primitive types with type annotations.",
    tags: ["basics", "types", "beginner"],
    createdAt: "2024-01-01T00:00:00.000Z",
    code: `# Hello World
print("Hello, World!")

# Primitive types with annotations
name: str = "Alice"
age: int = 30
height: float = 5.7
is_active: bool = True

print(f"Name: {name}, Age: {age}, Height: {height}, Active: {is_active}")

# Type checking at runtime
print(type(name))    # <class 'str'>
print(type(age))     # <class 'int'>
print(type(height))  # <class 'float'>
print(type(is_active))  # <class 'bool'>

# None type
nothing: None = None
print(f"Nothing is: {nothing}")
`,
  },
  {
    id: "seed-py-2",
    title: "List Comprehension",
    language: "Python",
    description: "Concise list creation using comprehensions, including filtering and nested forms.",
    tags: ["list", "comprehension", "functional"],
    createdAt: "2024-01-02T00:00:00.000Z",
    code: `# Basic list comprehension
squares = [x ** 2 for x in range(1, 11)]
print("Squares:", squares)

# With condition (filter)
even_squares = [x ** 2 for x in range(1, 11) if x % 2 == 0]
print("Even squares:", even_squares)

# String transformation
words = ["hello", "world", "python"]
upper_words = [w.upper() for w in words]
print("Upper:", upper_words)

# Nested comprehension — flattening a 2D list
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [num for row in matrix for num in row]
print("Flat:", flat)

# Dict comprehension
word_lengths = {w: len(w) for w in words}
print("Lengths:", word_lengths)

# Set comprehension (unique values)
data = [1, 2, 2, 3, 3, 3, 4]
unique_evens = {x for x in data if x % 2 == 0}
print("Unique evens:", unique_evens)
`,
  },
  {
    id: "seed-py-3",
    title: "File I/O with Context Manager",
    language: "Python",
    description: "Reading and writing files safely using the `with` statement to ensure proper resource cleanup.",
    tags: ["file", "io", "context-manager"],
    createdAt: "2024-01-03T00:00:00.000Z",
    code: `import os

FILENAME = "example.txt"

# ── Writing a file ──────────────────────────────────────────────────────
lines = ["Line 1: Hello\n", "Line 2: World\n", "Line 3: Python\n"]

with open(FILENAME, "w", encoding="utf-8") as f:
    f.writelines(lines)
print(f"Written {len(lines)} lines to {FILENAME}")

# ── Reading the whole file ───────────────────────────────────────────────
with open(FILENAME, "r", encoding="utf-8") as f:
    content = f.read()
print("Full content:")
print(content)

# ── Reading line by line ─────────────────────────────────────────────────
with open(FILENAME, "r", encoding="utf-8") as f:
    for i, line in enumerate(f, start=1):
        print(f"  [{i}] {line.rstrip()}")

# ── Appending to a file ──────────────────────────────────────────────────
with open(FILENAME, "a", encoding="utf-8") as f:
    f.write("Line 4: Appended!\n")

# ── Cleanup ──────────────────────────────────────────────────────────────
os.remove(FILENAME)
print("File removed.")
`,
  },
  {
    id: "seed-py-4",
    title: "Class with __init__",
    language: "Python",
    description: "Defining a class with a constructor, instance methods, a class method, and a static method.",
    tags: ["class", "oop", "methods"],
    createdAt: "2024-01-04T00:00:00.000Z",
    code: `class BankAccount:
    """A simple bank account demonstrating OOP fundamentals."""

    interest_rate: float = 0.05  # class variable

    def __init__(self, owner: str, balance: float = 0.0) -> None:
        self.owner = owner
        self._balance = balance  # protected by convention

    # Instance method
    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Deposit amount must be positive.")
        self._balance += amount
        print(f"Deposited \${amount:.2f}. Balance: \${self._balance:.2f}")

    def withdraw(self, amount: float) -> None:
        if amount > self._balance:
            raise ValueError("Insufficient funds.")
        self._balance -= amount
        print(f"Withdrew \${amount:.2f}. Balance: \${self._balance:.2f}")

    # Property (getter)
    @property
    def balance(self) -> float:
        return self._balance

    # Class method — alternative constructor
    @classmethod
    def from_dict(cls, data: dict) -> "BankAccount":
        return cls(data["owner"], data.get("balance", 0.0))

    # Static method — pure utility
    @staticmethod
    def format_currency(value: float) -> str:
        return f"\${value:,.2f}"

    def __repr__(self) -> str:
        return f"BankAccount(owner={self.owner!r}, balance={self._balance:.2f})"


account = BankAccount("Alice", 1000)
account.deposit(250)
account.withdraw(100)
print(account)
print(BankAccount.format_currency(account.balance))
`,
  },
  {
    id: "seed-py-5",
    title: "Decorator Example",
    language: "Python",
    description: "Creating and applying function decorators for timing, logging, and retry logic.",
    tags: ["decorator", "functional", "advanced"],
    createdAt: "2024-01-05T00:00:00.000Z",
    code: `import time
import functools
from typing import Callable, Any

# ── Timing decorator ─────────────────────────────────────────────────────
def timer(func: Callable) -> Callable:
    @functools.wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__!r} took {elapsed:.4f}s")
        return result
    return wrapper

# ── Retry decorator with configurable attempts ───────────────────────────
def retry(attempts: int = 3, delay: float = 0.5):
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            for attempt in range(1, attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as exc:
                    print(f"Attempt {attempt} failed: {exc}")
                    if attempt < attempts:
                        time.sleep(delay)
            raise RuntimeError(f"{func.__name__} failed after {attempts} attempts.")
        return wrapper
    return decorator

# ── Usage ────────────────────────────────────────────────────────────────
@timer
def slow_sum(n: int) -> int:
    return sum(range(n))

result = slow_sum(1_000_000)
print(f"Sum: {result}")

call_count = 0

@retry(attempts=3, delay=0.1)
def flaky_operation() -> str:
    global call_count
    call_count += 1
    if call_count < 3:
        raise ConnectionError("Simulated transient error")
    return "Success!"

print(flaky_operation())
`,
  },

  // ── JavaScript ──────────────────────────────────────────────────────────
  {
    id: "seed-js-1",
    title: "Fetch API with async/await",
    language: "JavaScript",
    description: "Making HTTP GET and POST requests using the Fetch API with async/await and proper error handling.",
    tags: ["fetch", "async", "http", "api"],
    createdAt: "2024-01-06T00:00:00.000Z",
    code: `// ── GET request ─────────────────────────────────────────────────────────
async function getUser(id) {
  try {
    const response = await fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`);

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const user = await response.json();
    console.log("User:", user.name, "|", user.email);
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error.message);
    throw error;
  }
}

// ── POST request ─────────────────────────────────────────────────────────
async function createPost(title, body, userId) {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body, userId }),
  });

  if (!response.ok) throw new Error(\`POST failed: \${response.status}\`);
  const post = await response.json();
  console.log("Created post with id:", post.id);
  return post;
}

// ── Parallel requests ────────────────────────────────────────────────────
async function main() {
  const [user, post] = await Promise.all([
    getUser(1),
    createPost("My Title", "Hello world", 1),
  ]);
  console.log("Done:", user.name, "created post", post.id);
}

main();
`,
  },
  {
    id: "seed-js-2",
    title: "Array Methods (map/filter/reduce)",
    language: "JavaScript",
    description: "Practical use of higher-order array methods to transform, filter, and aggregate data.",
    tags: ["array", "functional", "map", "filter", "reduce"],
    createdAt: "2024-01-07T00:00:00.000Z",
    code: `const products = [
  { name: "Apple",  category: "Fruit",  price: 1.2,  qty: 50 },
  { name: "Carrot", category: "Veggie", price: 0.8,  qty: 100 },
  { name: "Banana", category: "Fruit",  price: 0.5,  qty: 80 },
  { name: "Onion",  category: "Veggie", price: 0.6,  qty: 60 },
  { name: "Mango",  category: "Fruit",  price: 2.0,  qty: 30 },
];

// map — transform each item
const names = products.map((p) => p.name.toUpperCase());
console.log("Names:", names);

// filter — keep only fruits
const fruits = products.filter((p) => p.category === "Fruit");
console.log("Fruits:", fruits.map((p) => p.name));

// reduce — total inventory value
const totalValue = products.reduce((acc, p) => acc + p.price * p.qty, 0);
console.log("Total inventory value: $" + totalValue.toFixed(2));

// Chaining: expensive fruits sorted by price desc
const expensiveFruits = products
  .filter((p) => p.category === "Fruit" && p.price > 1)
  .map((p) => ({ name: p.name, value: (p.price * p.qty).toFixed(2) }))
  .sort((a, b) => b.value - a.value);
console.log("Expensive fruits:", expensiveFruits);

// flatMap — split tags from a list of articles
const articles = [
  { title: "JS Tips", tags: "js,functional,array" },
  { title: "CSS Tricks", tags: "css,layout" },
];
const allTags = articles.flatMap((a) => a.tags.split(","));
console.log("All tags:", allTags);
`,
  },
  {
    id: "seed-js-3",
    title: "Event Listener & DOM",
    language: "JavaScript",
    description: "Adding, removing, and delegating DOM events with practical button-click and input examples.",
    tags: ["dom", "events", "browser"],
    createdAt: "2024-01-08T00:00:00.000Z",
    code: `// ── Basic click listener ────────────────────────────────────────────────
const btn = document.getElementById("myButton");

function handleClick(event) {
  console.log("Clicked!", event.target.textContent);
  event.target.disabled = true;
}

btn.addEventListener("click", handleClick);

// Remove after 5 seconds
setTimeout(() => btn.removeEventListener("click", handleClick), 5000);

// ── Input with debounce ──────────────────────────────────────────────────
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const searchInput = document.getElementById("search");
const debouncedSearch = debounce((e) => {
  console.log("Searching for:", e.target.value);
}, 300);

searchInput?.addEventListener("input", debouncedSearch);

// ── Event delegation (one listener for many children) ───────────────────
const list = document.getElementById("itemList");

list?.addEventListener("click", (e) => {
  const item = e.target.closest("li[data-id]");
  if (!item) return;
  const id = item.dataset.id;
  console.log("Item clicked:", id);
  item.classList.toggle("selected");
});

// ── Custom event ─────────────────────────────────────────────────────────
const customEvent = new CustomEvent("userAction", {
  detail: { action: "purchase", itemId: 42 },
  bubbles: true,
});
document.dispatchEvent(customEvent);
document.addEventListener("userAction", (e) => console.log("Action:", e.detail));
`,
  },

  // ── TypeScript ──────────────────────────────────────────────────────────
  {
    id: "seed-ts-1",
    title: "Generic Function",
    language: "TypeScript",
    description: "Writing reusable generic functions and classes with constraints and multiple type parameters.",
    tags: ["generics", "types", "reusable"],
    createdAt: "2024-01-09T00:00:00.000Z",
    code: `// ── Basic generic function ───────────────────────────────────────────────
function identity<T>(value: T): T {
  return value;
}

console.log(identity<string>("hello"));
console.log(identity<number>(42));

// ── Generic with constraint ──────────────────────────────────────────────
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 30, active: true };
console.log(getProperty(user, "name"));  // "Alice"
console.log(getProperty(user, "age"));   // 30

// ── Generic pair ─────────────────────────────────────────────────────────
function makePair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}
const pair = makePair("id", 99);

// ── Generic class ────────────────────────────────────────────────────────
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
numStack.push(3);
console.log(numStack.peek());  // 3
console.log(numStack.pop());   // 3
console.log(numStack.size);    // 2
`,
  },
  {
    id: "seed-ts-2",
    title: "Interface & Type Guard",
    language: "TypeScript",
    description: "Defining interfaces, union types, and runtime type guards to narrow types safely.",
    tags: ["interface", "type-guard", "union"],
    createdAt: "2024-01-10T00:00:00.000Z",
    code: `// ── Interfaces ───────────────────────────────────────────────────────────
interface Animal {
  name: string;
  sound(): string;
}

interface Dog extends Animal {
  breed: string;
  fetch(): void;
}

interface Cat extends Animal {
  indoor: boolean;
  purr(): void;
}

// ── Union type ────────────────────────────────────────────────────────────
type Pet = Dog | Cat;

// ── Type guards ───────────────────────────────────────────────────────────
function isDog(pet: Pet): pet is Dog {
  return "breed" in pet;
}

function isCat(pet: Pet): pet is Cat {
  return "indoor" in pet;
}

// ── Discriminated union (preferred pattern) ───────────────────────────────
interface Circle {
  kind: "circle";
  radius: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

type Shape = Circle | Rectangle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    default: {
      // Exhaustiveness check — TypeScript will error if a case is missing
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}

const c: Circle = { kind: "circle", radius: 5 };
const r: Rectangle = { kind: "rectangle", width: 4, height: 6 };
console.log("Circle area:", area(c).toFixed(2));
console.log("Rectangle area:", area(r));
`,
  },

  // ── HTML ─────────────────────────────────────────────────────────────────
  {
    id: "seed-html-1",
    title: "Responsive HTML Template",
    language: "HTML",
    description: "A minimal but complete HTML5 boilerplate with meta tags for responsiveness and SEO.",
    tags: ["boilerplate", "responsive", "seo"],
    createdAt: "2024-01-11T00:00:00.000Z",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="A responsive page description for SEO." />
  <meta property="og:title" content="Page Title" />
  <meta property="og:description" content="Open Graph description." />
  <meta property="og:image" content="https://example.com/og-image.png" />
  <title>My Responsive Page</title>
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header role="banner">
    <nav aria-label="Main navigation">
      <a href="/" aria-current="page">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
  </header>

  <main id="content">
    <article>
      <h1>Welcome</h1>
      <p>This is a semantic, accessible HTML5 template.</p>
    </article>
  </main>

  <footer role="contentinfo">
    <p>&copy; 2024 My Site. All rights reserved.</p>
  </footer>

  <script src="app.js" defer></script>
</body>
</html>
`,
  },
  {
    id: "seed-html-2",
    title: "Form with Validation",
    language: "HTML",
    description: "An accessible HTML form using native browser validation attributes and ARIA labels.",
    tags: ["form", "validation", "accessibility"],
    createdAt: "2024-01-12T00:00:00.000Z",
    code: `<form id="registrationForm" novalidate>
  <fieldset>
    <legend>Create Account</legend>

    <!-- Name -->
    <div class="field">
      <label for="fullName">Full Name <span aria-hidden="true">*</span></label>
      <input
        id="fullName"
        name="fullName"
        type="text"
        required
        minlength="2"
        maxlength="80"
        autocomplete="name"
        aria-required="true"
        aria-describedby="nameHint"
      />
      <span id="nameHint" class="hint">At least 2 characters.</span>
    </div>

    <!-- Email -->
    <div class="field">
      <label for="email">Email Address <span aria-hidden="true">*</span></label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autocomplete="email"
        aria-required="true"
      />
    </div>

    <!-- Password -->
    <div class="field">
      <label for="password">Password <span aria-hidden="true">*</span></label>
      <input
        id="password"
        name="password"
        type="password"
        required
        minlength="8"
        pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
        autocomplete="new-password"
        aria-describedby="pwHint"
        aria-required="true"
      />
      <span id="pwHint" class="hint">8+ chars, one uppercase, one number.</span>
    </div>

    <!-- Age range -->
    <div class="field">
      <label for="age">Age</label>
      <input id="age" name="age" type="number" min="13" max="120" />
    </div>
  </fieldset>

  <button type="submit">Register</button>
</form>
`,
  },

  // ── SQL ───────────────────────────────────────────────────────────────────
  {
    id: "seed-sql-1",
    title: "SELECT with JOINs",
    language: "SQL",
    description: "Querying related tables using INNER, LEFT, and aggregation with GROUP BY and HAVING.",
    tags: ["select", "join", "aggregation"],
    createdAt: "2024-01-13T00:00:00.000Z",
    code: `-- ── INNER JOIN: orders with their customers ─────────────────────────────
SELECT
    c.customer_id,
    c.full_name,
    o.order_id,
    o.created_at,
    o.total_amount
FROM customers AS c
INNER JOIN orders AS o ON c.customer_id = o.customer_id
WHERE o.created_at >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY o.created_at DESC;

-- ── LEFT JOIN: all customers, even those with no orders ──────────────────
SELECT
    c.full_name,
    COUNT(o.order_id) AS order_count,
    COALESCE(SUM(o.total_amount), 0) AS total_spent
FROM customers AS c
LEFT JOIN orders AS o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.full_name
HAVING COUNT(o.order_id) > 0
ORDER BY total_spent DESC
LIMIT 10;

-- ── Multi-table JOIN with subquery ───────────────────────────────────────
SELECT
    p.product_name,
    cat.category_name,
    SUM(oi.quantity) AS units_sold,
    SUM(oi.quantity * oi.unit_price) AS revenue
FROM order_items AS oi
INNER JOIN products   AS p   ON oi.product_id   = p.product_id
INNER JOIN categories AS cat ON p.category_id   = cat.category_id
INNER JOIN orders     AS o   ON oi.order_id      = o.order_id
WHERE o.status = 'completed'
GROUP BY p.product_id, p.product_name, cat.category_name
ORDER BY revenue DESC;
`,
  },
  {
    id: "seed-sql-2",
    title: "CREATE TABLE & INSERT",
    language: "SQL",
    description: "Defining a normalized schema with constraints and inserting sample rows.",
    tags: ["ddl", "dml", "schema", "constraints"],
    createdAt: "2024-01-14T00:00:00.000Z",
    code: `-- ── Schema definition ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
    category_id   SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
    product_id    SERIAL PRIMARY KEY,
    product_name  VARCHAR(200)   NOT NULL,
    category_id   INT            NOT NULL REFERENCES categories(category_id),
    price         NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    stock_qty     INT            NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    created_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);

-- ── Seed data ────────────────────────────────────────────────────────────
INSERT INTO categories (category_name) VALUES
    ('Electronics'),
    ('Books'),
    ('Clothing')
ON CONFLICT (category_name) DO NOTHING;

INSERT INTO products (product_name, category_id, price, stock_qty) VALUES
    ('Wireless Headphones', 1, 79.99,  150),
    ('USB-C Hub',           1, 34.50,  200),
    ('Clean Code',          2, 29.99,  85),
    ('The Pragmatic Programmer', 2, 34.99, 60),
    ('Classic T-Shirt',     3, 19.99, 500)
ON CONFLICT DO NOTHING;

-- ── Verify ───────────────────────────────────────────────────────────────
SELECT p.product_name, c.category_name, p.price, p.stock_qty
FROM products p
JOIN categories c USING (category_id)
ORDER BY c.category_name, p.price;
`,
  },

  // ── Bash ──────────────────────────────────────────────────────────────────
  {
    id: "seed-bash-1",
    title: "Loop & Conditional",
    language: "Bash",
    description: "Common Bash patterns: for/while loops, if/case conditionals, and functions with return codes.",
    tags: ["loop", "conditional", "function", "scripting"],
    createdAt: "2024-01-15T00:00:00.000Z",
    code: `#!/usr/bin/env bash
set -euo pipefail   # exit on error, undefined var, pipe failure

# ── For loop over array ──────────────────────────────────────────────────
FRUITS=("apple" "banana" "cherry")
for fruit in "\${FRUITS[@]}"; do
  echo "Fruit: \$fruit"
done

# ── C-style for loop ─────────────────────────────────────────────────────
for ((i = 1; i <= 5; i++)); do
  echo "Count: \$i"
done

# ── While loop reading a file line by line ───────────────────────────────
# while IFS= read -r line; do
#   echo "Line: \$line"
# done < input.txt

# ── If / elif / else ─────────────────────────────────────────────────────
check_number() {
  local n=\$1
  if   (( n > 0 )); then echo "\$n is positive"
  elif (( n < 0 )); then echo "\$n is negative"
  else                    echo "\$n is zero"
  fi
}
check_number 5
check_number -3
check_number 0

# ── Case statement ───────────────────────────────────────────────────────
classify_file() {
  local file=\$1
  case "\${file##*.}" in
    sh|bash) echo "\$file is a shell script" ;;
    py)      echo "\$file is Python" ;;
    js|ts)   echo "\$file is JavaScript/TypeScript" ;;
    *)       echo "\$file has an unknown extension" ;;
  esac
}
classify_file "deploy.sh"
classify_file "app.py"

# ── Function with return code ─────────────────────────────────────────────
file_exists() {
  [[ -f "\$1" ]] && return 0 || return 1
}
if file_exists "/etc/hostname"; then
  echo "Hostname file exists"
fi
`,
  },
];

const STORAGE_KEY = "knowledgeos_snippets_v1";

export function generateId(): string {
  return `snip-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getSnippets(): CodeSnippet[] {
  const seedMap = new Map(SEED_SNIPPETS.map((s) => [s.id, s]));

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...SEED_SNIPPETS];

    const stored: CodeSnippet[] = JSON.parse(raw);
    // Merge: stored items override seeds with the same id; seeds not in stored are appended
    const storedMap = new Map(stored.map((s) => [s.id, s]));
    const merged = [...stored];
    for (const seed of SEED_SNIPPETS) {
      if (!storedMap.has(seed.id)) merged.push(seed);
    }
    return merged;
  } catch {
    return [...SEED_SNIPPETS];
  }
  void seedMap; // suppress unused warning; seedMap used for clarity
}

export function saveSnippet(snippet: CodeSnippet): void {
  const all = getSnippets();
  const idx = all.findIndex((s) => s.id === snippet.id);
  if (idx >= 0) {
    all[idx] = snippet;
  } else {
    all.unshift(snippet);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deleteSnippet(id: string): void {
  const all = getSnippets().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
