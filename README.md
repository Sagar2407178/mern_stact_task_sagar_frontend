# 🖥 Frontend — MERN Inventory System UI

> A production-ready inventory management dashboard built with **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, and **Redux Toolkit (RTK Query)**.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Pages & Routes](#-pages--routes)
- [State Management](#-state-management)
- [API Integration (RTK Query)](#-api-integration-rtk-query)
- [Form Handling](#-form-handling)
- [Theming](#-theming)
- [Available Scripts](#-available-scripts)
- [Architecture & Design Decisions](#-architecture--design-decisions)

---

## 🛠 Tech Stack

| Technology            | Version | Purpose                                              |
| --------------------- | ------- | ---------------------------------------------------- |
| Next.js               | 16.2.9  | React framework with App Router & file-based routing |
| React                 | 19.2.4  | UI rendering                                         |
| TypeScript            | ^5      | Static type safety                                   |
| Tailwind CSS          | ^4      | Utility-first CSS framework                          |
| shadcn/ui             | ^4.12.0 | Accessible, customizable component library           |
| @reduxjs/toolkit      | ^2.12.0 | Redux state management + RTK Query                   |
| react-redux           | ^9.3.0  | React bindings for Redux                             |
| @tanstack/react-table | ^8.21.3 | Headless table (sorting, pagination, column defs)    |
| react-hook-form       | ^7.80.0 | Performant, uncontrolled form management             |
| zod                   | ^4.4.3  | Schema-based form validation                         |
| @hookform/resolvers   | ^5.4.0  | Connects Zod schemas to react-hook-form              |
| next-themes           | ^0.4.6  | Dark / light theme switching                         |
| lucide-react          | ^1.21.0 | Icon library                                         |
| sonner                | ^2.0.7  | Animated toast notifications                         |
| date-fns              | ^4.4.0  | Date formatting utilities                            |
| clsx + tailwind-merge | ^2 / ^3 | Conditional class merging                            |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                            # Next.js App Router root
│   │   ├── layout.tsx                  # Root layout: providers, fonts, metadata
│   │   ├── page.tsx                    # Root page — redirects to /products or /login
│   │   ├── globals.css                 # Tailwind base + CSS custom properties
│   │   ├── favicon.ico
│   │   ├── not-found.tsx               # Custom 404 page
│   │   │
│   │   ├── AuthProvider.tsx            # Client component — reads token & guards routes
│   │   ├── StoreProvider.tsx           # Wraps children with Redux <Provider>
│   │   │
│   │   ├── (auth)/                     # Route group: minimal centered layout
│   │   │   ├── layout.tsx              # Auth shell (no sidebar/header)
│   │   │   ├── login/
│   │   │   │   └── page.tsx            # /login — renders <LoginForm>
│   │   │   └── register/
│   │   │       └── page.tsx            # /register — renders <RegisterForm>
│   │   │
│   │   └── (dashboard)/                # Route group: full sidebar + header shell
│   │       ├── layout.tsx              # Dashboard shell with sidebar navigation
│   │       └── products/
│   │           ├── page.tsx            # /products — product list with filters
│   │           ├── add/
│   │           │   └── page.tsx        # /products/add — create product form
│   │           └── [id]/
│   │               └── edit/
│   │                   └── page.tsx    # /products/:id/edit — edit product form
│   │
│   ├── components/
│   │   ├── ThemeProvider.tsx           # next-themes <ThemeProvider> wrapper
│   │   ├── ThemeToggle.tsx             # Sun/Moon icon toggle button
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx           # Controlled login form
│   │   │   └── RegisterForm.tsx        # Controlled registration form
│   │   │
│   │   ├── products/
│   │   │   ├── ProductsList.tsx        # Data table: filters, sort, pagination
│   │   │   ├── ProductForm.tsx         # Reusable create/edit form component
│   │   │   ├── AddProduct.tsx          # Thin wrapper — "Add" page heading + form
│   │   │   ├── EditProduct.tsx         # Thin wrapper — fetches product, "Edit" heading + form
│   │   │   └── columns.tsx             # TanStack Table column definitions
│   │   │
│   │   └── ui/                         # shadcn/ui components (owned, not a dependency)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       ├── dialog.tsx
│   │       ├── confirm-dialog.tsx
│   │       ├── badge.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── card.tsx
│   │       ├── separator.tsx
│   │       ├── skeleton.tsx
│   │       └── ... (other shadcn components)
│   │
│   ├── hooks/                          # Custom React hooks
│   │
│   ├── lib/
│   │   └── utils.ts                    # cn() helper (clsx + tailwind-merge)
│   │
│   └── store/
│       ├── index.ts                    # Redux store configuration + RootState / AppDispatch types
│       ├── hooks.ts                    # Typed useAppDispatch / useAppSelector
│       ├── slices/
│       │   └── authSlice.ts            # Auth state: token, user, isAuthenticated
│       └── api/
│           ├── apiSlice.ts             # RTK Query base API (baseUrl, prepareHeaders)
│           ├── authApi.ts              # Endpoints: login, register, getMe
│           ├── productApi.ts           # Endpoints: getProducts, getProductById, createProduct, updateProduct, deleteProduct
│           └── categoryApi.ts          # Endpoints: getCategories
│
├── public/                             # Static assets
├── .env                                # Environment variables
├── components.json                     # shadcn/ui CLI configuration
├── next.config.ts                      # Next.js configuration
├── postcss.config.mjs                  # PostCSS (Tailwind CSS v4)
├── tsconfig.json                       # TypeScript configuration
├── eslint.config.mjs                   # ESLint configuration
└── package.json
```

---

## ✅ Prerequisites

| Tool            | Minimum Version                    |
| --------------- | ---------------------------------- |
| **Node.js**     | v18.0.0                            |
| **npm**         | v9.0.0                             |
| **Backend API** | Running at `http://localhost:5000` |

> Make sure the [backend server](../backend/README.md) is running before starting the frontend.

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the `frontend/` root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at: **`http://localhost:3000`**

---

## 🔑 Environment Variables

| Variable              | Required | Description                      | Default                     |
| --------------------- | -------- | -------------------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | ✅       | Base URL of the backend REST API | `http://localhost:5000/api` |

> Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser bundle. **Never** put secrets here.

---

## 🗺 Pages & Routes

The app uses **Next.js App Router** with two route groups to isolate layouts:

### `(auth)` Route Group — Minimal centered layout, no sidebar

| URL         | Component      | Description                               |
| ----------- | -------------- | ----------------------------------------- |
| `/login`    | `LoginForm`    | Email + password login form               |
| `/register` | `RegisterForm` | Name + email + password registration form |

### `(dashboard)` Route Group — Full sidebar + header shell

| URL                  | Component                     | Description                                   |
| -------------------- | ----------------------------- | --------------------------------------------- |
| `/products`          | `ProductsList`                | Paginated product table with filters and sort |
| `/products/add`      | `AddProduct` + `ProductForm`  | Create a new product                          |
| `/products/:id/edit` | `EditProduct` + `ProductForm` | Edit an existing product                      |

### Auth Guard

`AuthProvider.tsx` runs on the client and:

- Reads the JWT from `localStorage` on mount and dispatches it to the Redux auth slice
- Redirects unauthenticated users away from dashboard routes to `/login`
- Redirects already-authenticated users away from `/login` and `/register` to `/products`

---

## 🗄 State Management

Redux Toolkit is used for global state, split into two categories:

### Client State — `store/slices/`

| Slice       | State Shape                        | Actions                                   |
| ----------- | ---------------------------------- | ----------------------------------------- |
| `authSlice` | `{ token, user, isAuthenticated }` | `setCredentials(token, user)`, `logout()` |

### Server State — `store/api/` (RTK Query)

RTK Query manages all async API calls with automatic caching, background refetching, and tag-based cache invalidation.

**Base API** (`apiSlice.ts`):

- `baseUrl` is read from `NEXT_PUBLIC_API_URL`
- `prepareHeaders` automatically attaches `Authorization: Bearer <token>` to every request when a token exists in the Redux store

---

## 🔌 API Integration (RTK Query)

### `authApi.ts`

| Hook                  | Type     | Backend Endpoint      | Description                  |
| --------------------- | -------- | --------------------- | ---------------------------- |
| `useLoginMutation`    | mutation | `POST /auth/login`    | Returns `{ token, user }`    |
| `useRegisterMutation` | mutation | `POST /auth/register` | Creates a new account        |
| `useGetMeQuery`       | query    | `GET /auth/me`        | Fetches current user profile |

**Example:**

```tsx
const [login, { isLoading, error }] = useLoginMutation();

const onSubmit = async (data: LoginFormValues) => {
  const result = await login(data).unwrap();
  dispatch(setCredentials({ token: result.token, user: result.user }));
  router.push("/products");
};
```

---

### `productApi.ts`

| Hook                       | Type     | Backend Endpoint       | Cache Tag              | Description               |
| -------------------------- | -------- | ---------------------- | ---------------------- | ------------------------- |
| `useGetProductsQuery`      | query    | `GET /products`        | `Products`             | Paginated + filtered list |
| `useGetProductByIdQuery`   | query    | `GET /products/:id`    | `Products`             | Single product            |
| `useCreateProductMutation` | mutation | `POST /products`       | invalidates `Products` | Create product            |
| `useUpdateProductMutation` | mutation | `PUT /products/:id`    | invalidates `Products` | Update product            |
| `useDeleteProductMutation` | mutation | `DELETE /products/:id` | invalidates `Products` | Delete product            |

**Cache invalidation:** Any successful `create`, `update`, or `delete` mutation automatically invalidates the `Products` tag, triggering an automatic refetch of the product list — no manual state updates needed.

**Example — paginated & filtered query:**

```tsx
const { data, isLoading, isFetching } = useGetProductsQuery({
  page: 1,
  limit: 10,
  sortBy: "price",
  sortOrder: "desc",
  categoryIds: "1,3",
});
// data.products, data.total, data.totalPages
```

---

### `categoryApi.ts`

| Hook                    | Type  | Backend Endpoint  | Description                         |
| ----------------------- | ----- | ----------------- | ----------------------------------- |
| `useGetCategoriesQuery` | query | `GET /categories` | All categories for select dropdowns |

---

## 📝 Form Handling

All forms use **react-hook-form** + **zod** via `@hookform/resolvers/zod`.

**Why this combination?**

- `react-hook-form` uses uncontrolled inputs — only the changed field re-renders, not the whole form tree
- `zod` provides a single schema that drives both TypeScript types and runtime validation
- `@hookform/resolvers/zod` connects them with a single `resolver: zodResolver(schema)` option

**Pattern used in every form:**

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Must be positive"),
});

type FormValues = z.infer<typeof schema>;

const form = useForm<FormValues>({ resolver: zodResolver(schema) });
```

---

## 🎨 Theming

Dark/light mode is implemented with `next-themes`:

- `ThemeProvider.tsx` wraps the root layout and reads `localStorage` for the saved preference on mount
- `ThemeToggle.tsx` renders a Sun/Moon icon button
- CSS custom properties in `globals.css` define color tokens for both themes
- Tailwind's `dark:` variant is used throughout for dark mode overrides

**Switching programmatically:**

```tsx
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();
setTheme("dark"); // 'light' | 'dark' | 'system'
```

---

## 📜 Available Scripts

| Script  | Command         | Description                                      |
| ------- | --------------- | ------------------------------------------------ |
| `dev`   | `npm run dev`   | Start Next.js development server with HMR        |
| `build` | `npm run build` | Build optimized production bundle to `.next/`    |
| `start` | `npm run start` | Start production server (requires `build` first) |
| `lint`  | `npm run lint`  | Run ESLint across the entire project             |

---

## 🏗 Architecture & Design Decisions

### Next.js App Router with Route Groups

Route groups `(auth)` and `(dashboard)` separate layouts without affecting URLs:

- `(auth)` pages → minimal centered layout (no sidebar, no header)
- `(dashboard)` pages → full sidebar + header shell
- No extra URL segments are added — `/login` stays `/login`, not `/auth/login`

### RTK Query vs. plain `useEffect` + `fetch`

| Feature                | RTK Query                        | Manual fetch         |
| ---------------------- | -------------------------------- | -------------------- |
| Caching                | ✅ Automatic per query key       | ❌ Manual            |
| Loading / error states | ✅ `isLoading`, `isError` flags  | ❌ Manual `useState` |
| Cache invalidation     | ✅ Tag-based, automatic          | ❌ Manual refetch    |
| Request deduplication  | ✅ Same request won't fire twice | ❌ No                |
| Background refetching  | ✅ Configurable                  | ❌ Manual            |

### TanStack Table (Headless)

`@tanstack/react-table` v8 manages all table logic (column sorting, pagination state) but renders nothing itself — giving full control over markup and styles while outsourcing complex stateful logic.

### shadcn/ui (Owned Components)

shadcn/ui components are **copied** into `src/components/ui/` rather than installed as a package. This means:

- Components are fully owned and freely customizable
- No dependency version conflicts
- Built on **Radix UI** accessibility primitives (keyboard navigation, ARIA roles, focus management)

### Performance

- `useCallback` / `useMemo` in `ProductsList` memoize filter/sort handlers to prevent unnecessary re-renders of the table
- RTK Query deduplication prevents duplicate network requests when navigating back to a cached page
- `react-hook-form`'s uncontrolled model means the form only re-renders when validation state changes, not on every keystroke
