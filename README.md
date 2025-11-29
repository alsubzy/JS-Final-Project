
#  **Health Planner – Complete Web App**

A modern, minimalist, and user-friendly Health Planner built using **pure JavaScript**, designed to help users track their daily health routines and improve well-being through simple, intuitive features.

---

#  **Overview**

**Health Planner** is a lightweight, fast, and fully responsive health-tracking web application.
It provides essential daily health management tools including BMI calculation, water intake tracking, sleep tracking, mood logging, and meal plan generation using an external API.

The app uses **JavaScript, Local Storage, Fetch API, and Responsive UI techniques** to deliver a smooth, premium user experience.
---

#  **Features**

###  **1. Home Page**

* Overview of the app
* Quick access cards
* BMI calculator
* Today’s stats summary

###  **2. Dashboard Page**

* Daily/weekly progress
* Water intake tracker
* Sleep tracker
* Mood selector
* Dynamic progress bars
* Saved data displayed from Local Storage
* Reset button

###  **3. Meals Page**

* Fetches meal suggestions from TheMealDB API
* Shows:

  * Image
  * Meal Name
  * Instructions
  * Ingredients
* Includes loading state + error handling

###  **4. Local Storage Integration**

App saves automatically:

* BMI
* Water intake
* Sleep hours
* Mood
* Light/Dark theme

###  **5. Responsive UI**

Built with:

* Flexbox
* Grid
* Media queries
* Mobile-first philosophy

UI supports all screen sizes: phone, tablet, laptop.

---

# 🛠 **Technologies Used**

| Tool                  | Purpose                      |
| --------------------- | ---------------------------- |
| **HTML5**             | Structure + clean semantics  |
| **CSS3**              | Responsive design, flat UI   |
| **JavaScript (ES6+)** | Core logic, DOM manipulation |
| **Fetch API**         | Meal API integration         |
| **Local Storage**     | Persistent user data         |
| **TheMealDB API**     | Dynamic meal suggestions     |

---

# 🌐 **API Documentation**

### **TheMealDB – Meal Suggestions API**

**Endpoint:**
`https://www.themealdb.com/api/json/v1/1/random.php`

**Returns:**

* Meal name
* Instructions
* Image
* Ingredients
* Category
* Area

### **Error Handling**

The app includes:

* Network failure checks
* Loading animations
* Graceful fallback messages

---

# 📁 **Project Folder Structure**

```
/assets  
   /css  
      styles.css  
   /js  
      app.js  
      dashboard.js  
      api.js  
   /images  
   

/pages  
   index.html  
   dashboard.html  
   meals.html  

README.md  
```

---

#  **How to Run the Project**

1. Download the project folder
2. Open any of the pages in a browser

   * `pages/index.html` (Home)
   * `pages/dashboard.html` (Dashboard)
   * `pages/meals.html` (Meals)
3. No server needed — everything runs on client-side JavaScript
4. Ensure you have internet to load the API meals

---

# 🖼 **Screenshots (Placeholders)**

### 📌 Home Page

`![Home Page](screenshots/home-page.png)`

### 📌 Dashboard

`![Dashboard](screenshots/dashboard.png)`

### 📌 Meals Page

`![Meals Page](screenshots/meals-page.png)`

---

