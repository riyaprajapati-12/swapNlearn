require("dotenv").config();
const mongoose = require("mongoose");
const config = require("../config.json");
const Roadmap = require("../Models/roadMapSchema");

const connectionString = process.env.MONGO_URI || config.connectionString;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const roadmapData = [
  {
    skillName: "web development",
    steps: [
      "Learn HTML",
      "Master CSS",
      "Understand JavaScript",
      "Practice DOM Manipulation",
      "Learn Git & GitHub",
      "Build Projects",
      "Learn Node.js & Express",
      "Understand MongoDB",
      "Learn React.js",
      "Build Full Stack Projects",
      "Deploy on Vercel / Netlify / Render"
    ]
  },
  {
    skillName: "java",
    steps: [
      "Install JDK & Set Up IDE",
      "Learn Java Syntax",
      "OOP Concepts (Class, Object, Inheritance)",
      "Collections Framework",
      "Exception Handling",
      "Multithreading",
      "File I/O",
      "Build Console & GUI Apps",
      "Learn JDBC",
      "Build Projects"
    ]
  },
  {
    skillName: "c",
    steps: [
      "Install GCC / CodeBlocks",
      "Basic Syntax and Data Types",
      "Control Statements",
      "Arrays and Strings",
      "Functions",
      "Pointers",
      "Structures & Unions",
      "File Handling",
      "Build Mini Projects"
    ]
  },
  {
    skillName: "cpp",
    steps: [
      "Install IDE (VS Code / CodeBlocks)",
      "Basic C++ Syntax",
      "Object-Oriented Programming",
      "STL (Standard Template Library)",
      "Pointers & References",
      "File Handling",
      "Competitive Programming Practice",
      "Build Projects"
    ]
  },
  {
    skillName: "python",
    steps: [
      "Learn Python Syntax",
      "Understand Variables and Data Types",
      "Work with Loops and Conditionals",
      "Functions and Modules",
      "Data Structures: Lists, Dicts, Sets",
      "Object-Oriented Programming",
      "Use Libraries (NumPy, Pandas)",
      "Web Development with Flask/Django",
      "Build Projects"
    ]
  },
  {
    skillName: "data structures and algorithms",
    steps: [
      "Learn Time and Space Complexity",
      "Arrays and Strings",
      "Stacks and Queues",
      "Linked Lists",
      "Trees and Binary Search Trees",
      "Heaps and HashMaps",
      "Graphs and DFS/BFS",
      "Dynamic Programming",
      "Practice on LeetCode/HackerRank",
      "Solve 100+ DSA Problems"
    ]
  },
  {
    skillName: "machine learning",
    steps: [
      "Understand Python & Libraries (NumPy, Pandas)",
      "Learn Linear Algebra & Statistics Basics",
      "Supervised vs Unsupervised Learning",
      "Work with Scikit-Learn",
      "Train Linear and Logistic Regression Models",
      "Explore Decision Trees and Random Forests",
      "Use K-Means, SVMs, Naive Bayes",
      "Understand Model Evaluation (accuracy, recall, etc.)",
      "Mini Projects (e.g., Spam Detector)",
      "Learn Deep Learning Basics (TensorFlow/Keras)"
    ]
  },
  {
    skillName: "react",
    steps: [
      "Understand JSX and Components",
      "Props and State Management",
      "React Hooks (useState, useEffect, etc.)",
      "React Router for Navigation",
      "Form Handling and Validation",
      "Context API and useContext",
      "State Management with Redux",
      "Reusable Components & Styling",
      "React Query / SWR for API Handling",
      "Build and Deploy React Projects"
    ]
  },
  {
    skillName: "node.js",
    steps: [
      "Understand Node.js Basics",
      "Learn NPM and Package.json",
      "File System and Core Modules",
      "Build REST APIs with Express",
      "Routing and Middleware",
      "Work with MongoDB (Mongoose)",
      "Authentication with JWT",
      "Error Handling & Validation",
      "Build Full Stack Projects",
      "Deploy with Render or Railway"
    ]
  },
  {
    skillName: "next.js",
    steps: [
      "Understand SSR vs CSR",
      "Pages and Routing",
      "Dynamic Routing",
      "API Routes",
      "Data Fetching (getServerSideProps, getStaticProps)",
      "Authentication with NextAuth.js",
      "Deploy on Vercel",
      "Use SWR / React Query",
      "Add Tailwind for Styling",
      "Build Full Stack Next.js Apps"
    ]
  },
  {
    skillName: "cybersecurity",
    steps: [
      "Understand Networking Basics",
      "Linux Fundamentals",
      "Encryption & Hashing",
      "Learn OWASP Top 10",
      "Vulnerabilities & Attacks (XSS, SQLi, CSRF)",
      "Penetration Testing Tools (Wireshark, Nmap, Burp Suite)",
      "Web Application Security",
      "Ethical Hacking Basics",
      "Bug Bounty Practice",
      "CTFs and Labs (TryHackMe / HackTheBox)"
    ]
  },
  {
    skillName: "ui/ux design",
    steps: [
      "Understand UI vs UX",
      "Learn Design Principles",
      "Color Theory and Typography",
      "Wireframing Tools (Figma, Adobe XD)",
      "User Research & Personas",
      "Prototyping",
      "Usability Testing",
      "Responsive Design",
      "Accessibility (a11y)",
      "Design Real-world Projects"
    ]
  },
  {
    skillName: "devops",
    steps: [
      "Understand DevOps Culture",
      "Linux and Shell Scripting",
      "Version Control with Git",
      "CI/CD with Jenkins or GitHub Actions",
      "Containers with Docker",
      "Container Orchestration with Kubernetes",
      "Infrastructure as Code (Terraform)",
      "Monitoring with Prometheus & Grafana",
      "Cloud Services (AWS/GCP/Azure)",
      "Build Deployment Pipelines"
    ]
  },
  {
    skillName: "android development",
    steps: [
      "Install Android Studio",
      "Learn Java/Kotlin Basics",
      "Understand Activity and Fragment Lifecycle",
      "Build UI with XML",
      "Working with Intents",
      "Using RecyclerView",
      "Firebase Integration",
      "Build Full Apps",
      "Publish to Play Store"
    ]
  },
  {
    skillName: "sql",
    steps: [
      "Understand RDBMS Concepts",
      "Write Basic Queries (SELECT, WHERE, JOIN)",
      "Create and Modify Tables",
      "Aggregate Functions",
      "Indexes and Views",
      "Stored Procedures",
      "Normalization",
      "Subqueries",
      "Use MySQL / PostgreSQL",
      "Build Real Data Projects"
    ]
  },
  {
    skillName: "data analysis",
    steps: [
      "Python Basics & Jupyter Notebook",
      "Load and Clean Data with Pandas",
      "Data Visualization with Matplotlib & Seaborn",
      "EDA (Exploratory Data Analysis)",
      "Work with Real Datasets (CSV, APIs)",
      "GroupBy and Aggregations",
      "Handle Missing Data",
      "Correlation & Trends",
      "Mini Projects",
      "Build Dashboards"
    ]
  },
  {
    skillName: "blockchain basics",
    steps: [
      "Understand What is Blockchain",
      "Cryptography Basics",
      "Learn Ethereum and Smart Contracts",
      "Intro to Solidity",
      "Use Remix IDE",
      "Deploy Contracts on Testnet",
      "Interact using Web3.js / Ethers.js",
      "Build Dapps (Decentralized Apps)",
      "Understand NFTs and Token Standards (ERC20, ERC721)"
    ]
  },
  {
    skillName: "aws cloud",
    steps: [
      "Understand AWS Global Infrastructure",
      "Learn EC2, S3, IAM",
      "RDS and DynamoDB",
      "CloudWatch and Monitoring",
      "Deploy a Website on S3",
      "Lambda Functions",
      "API Gateway",
      "Security Best Practices",
      "Build & Deploy Real AWS Project"
    ]
  }
];

const seedDB = async () => {
  try {
    const count = await Roadmap.countDocuments();
    if (count === 0) {
      await Roadmap.insertMany(roadmapData);
      console.log("✅ Roadmap data seeded successfully!");
    } else {
      console.log("ℹ️ Roadmap data already exists, skipping.");
    }
  } catch (err) {
    console.error("❌ Error seeding roadmap data:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
