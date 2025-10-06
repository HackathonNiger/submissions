const assessmentQuestions = {
  htmlNcss: [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: [
        "Hyper Trainer Marking Language",
        "Hyper Text Marketing Language",
        "Hyper Text Markup Language",
        "Hyperlinking Text Management Language"
      ],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "Which HTML tag is used to create a hyperlink?",
      options: ["<link>", "<a>", "<href>", "<hyperlink>"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "What is the correct HTML element for inserting a line break?",
      options: ["<lb>", "<br>", "<break>", "<linebreak>"],
      correctAnswer: 1
    },
    {
      id: 4,
      question: "Which of the following tags is used to define a table row?",
      options: ["<td>", "<tr>", "<th>", "<table>"],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "What does the alt attribute in an image tag do?",
      options: [
        "Sets the alignment",
        "Changes the color",
        "Provides alternative text",
        "Specifies animation"
      ],
      correctAnswer: 2
    },
    {
      id: 6,
      question: "Which tag is used to define the largest heading in HTML?",
      options: ["<head>", "<h6>", "<heading>", "<h1>"],
      correctAnswer: 3
    },
    {
      id: 7,
      question: "What is the purpose of the <form> element in HTML?",
      options: [
        "To display formulas",
        "To create structure",
        "To collect user input",
        "To style text"
      ],
      correctAnswer: 2
    },
    {
      id: 8,
      question: "Which attribute specifies the destination of a link in the <a> tag?",
      options: ["src", "href", "link", "target"],
      correctAnswer: 1
    },
    {
      id: 9,
      question: "How can you make a numbered list in HTML?",
      options: ["<ul>", "<dl>", "<ol>", "<list>"],
      correctAnswer: 2
    },
    {
      id: 10,
      question: "Which tag is used to embed an image in HTML?",
      options: ["<img>", "<image>", "<src>", "<pic>"],
      correctAnswer: 0
    },
     {
      id: 11,
      question: "What does CSS stand for?",
      options: [
        "Creative Style Sheets",
        "Cascading Style Sheets",
        "Computer Style Sheets",
        "Colorful Style Syntax"
      ],
      correctAnswer: 1
    },
    {
      id: 12,
      question: "Where in an HTML document is the correct place to link an external CSS file?",
      options: [
        "At the bottom of the body",
        "In the footer",
        "In the <head> section",
        "Inside the <style> tag"
      ],
      correctAnswer: 2
    },
    {
      id: 13,
      question: "Which property is used to change the background color of an element?",
      options: ["color", "bgcolor", "background-color", "background"],
      correctAnswer: 2
    },
    {
      id: 14,
      question: "How do you select an element with id main in CSS?",
      options: ["main {}", ".main {}", "#main {}", "*main {}"],
      correctAnswer: 2
    },
    {
      id: 15,
      question: "Which CSS property controls the text size?",
      options: ["font-style", "text-size", "font-size", "text-style"],
      correctAnswer: 2
    },
    {
      id: 16,
      question: "Which value is used to make an element invisible but still take up space?",
      options: [
        "display: none",
        "hide: true",
        "visibility: hidden",
        "opacity: 0"
      ],
      correctAnswer: 2
    },
    {
      id: 17,
      question: "How do you apply a style to all <p> elements in CSS?",
      options: ["p {}", "#p {}", ".p {}", "*p {}"],
      correctAnswer: 0
    },
    {
      id: 18,
      question: "Which property is used to center text horizontally in CSS?",
      options: [
        "align-text: center",
        "font-align: center",
        "text-align: center",
        "horizontal-align: center"
      ],
      correctAnswer: 2
    },
    {
      id: 19,
      question: "How do you add a comment in CSS?",
      options: ["// comment", "<!-- comment -->", "# comment", "/* comment */"],
      correctAnswer: 3
    },
    {
      id: 20,
      question: "Which property is used to make the text bold in CSS?",
      options: [
        "font-weight: bold",
        "font-style: bold",
        "text-bold: true",
        "font-weight: strong"
      ],
      correctAnswer: 0
    }
  ],
  javascript: [
    {
      id: 1,
      question: "What is the correct way to declare a constant in JavaScript?",
      options: ["let", "var", "const", "static"],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "Which symbol is used for strict equality in JavaScript?",
      options: ["==", "!=", "===", "!=="],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "Which method is used to convert a JSON string into a JavaScript object?",
      options: ["JSON.parse()", "JSON.stringify()", "JSON.toObject()", "parse.JSON()"],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "What will `typeof null` return in JavaScript?",
      options: ["object", "null", "undefined", "number"],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "Which keyword is used to define an arrow function?",
      options: ["function", "=>", "define", "arrow"],
      correctAnswer: 1
    },
    {
      id: 6,
      question: "What is the difference between `let` and `var`?",
      options: ["No difference", "let has block scope, var has function scope", "var has block scope, let has function scope", "let is older than var"],
      correctAnswer: 1
    },
    {
      id: 7,
      question: "Which method adds an element to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      correctAnswer: 0
    },
    {
      id: 8,
      question: "What does the `this` keyword refer to in JavaScript?",
      options: ["The current function", "The global object", "The current object context", "The parent element"],
      correctAnswer: 2
    },
    {
      id: 9,
      question: "Which operator is used to check if a property exists in an object?",
      options: ["has", "in", "exists", "contains"],
      correctAnswer: 1
    },
    {
      id: 10,
      question: "What is a closure in JavaScript?",
      options: ["A way to close the browser", "A function with access to outer scope variables", "A method to end loops", "A type of error"],
      correctAnswer: 1
    },
    {
      id: 11,
      question: "Which method is used to iterate over array elements?",
      options: ["for()", "iterate()", "forEach()", "loop()"],
      correctAnswer: 2
    },
    {
      id: 12,
      question: "What does `NaN` stand for?",
      options: ["Not a Number", "Null and Null", "New Array Number", "No Assigned Name"],
      correctAnswer: 0
    },
    {
      id: 13,
      question: "Which keyword is used to handle exceptions in JavaScript?",
      options: ["catch", "handle", "error", "exception"],
      correctAnswer: 0
    },
    {
      id: 14,
      question: "What is the result of `'5' + 3` in JavaScript?",
      options: ["8", "53", "'53'", "Error"],
      correctAnswer: 2
    },
    {
      id: 15,
      question: "Which method converts a string to lowercase?",
      options: ["toLower()", "toLowerCase()", "lower()", "downCase()"],
      correctAnswer: 1
    },
    {
      id: 16,
      question: "What is the purpose of the `async` keyword?",
      options: ["To make functions run faster", "To declare asynchronous functions", "To stop code execution", "To handle errors"],
      correctAnswer: 1
    },
    {
      id: 17,
      question: "Which method removes the last element from an array?",
      options: ["pop()", "push()", "shift()", "slice()"],
      correctAnswer: 0
    },
    {
      id: 18,
      question: "What does the spread operator (...) do?",
      options: ["Multiplies numbers", "Spreads array/object elements", "Creates functions", "Handles errors"],
      correctAnswer: 1
    },
    {
      id: 19,
      question: "Which method creates a new array with filtered elements?",
      options: ["map()", "filter()", "reduce()", "find()"],
      correctAnswer: 1
    },
    {
      id: 20,
      question: "What is the output of `Boolean('')`?",
      options: ["true", "false", "undefined", "null"],
      correctAnswer: 1
    }
  ],
  react: [
    {
      id: 1,
      question: "What hook is used to manage state in functional components?",
      options: ["useEffect", "useRef", "useState", "useContext"],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "JSX allows us to write ___?",
      options: ["HTML in JS", "CSS in JS", "XML in JS", "JSON in JS"],
      correctAnswer: 0
    },
    {
      id: 3,
      question: "What prop should you pass to list items for better performance?",
      options: ["name", "id", "key", "value"],
      correctAnswer: 2
    },
    {
      id: 4,
      question: "Which React method is used to update the DOM?",
      options: ["render()", "componentDidMount()", "repaint()", "setDOM()"],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "Which file extension is commonly used for React components?",
      options: [".jsx", ".js", ".react", ".tsx"],
      correctAnswer: 0
    },
    {
      id: 6,
      question: "What hook is used for side effects in functional components?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correctAnswer: 1
    },
    {
      id: 7,
      question: "Which method is used to create a React component class?",
      options: ["React.Component", "React.createClass", "extends React.Component", "React.makeComponent"],
      correctAnswer: 2
    },
    {
      id: 8,
      question: "What is the virtual DOM in React?",
      options: ["A fake DOM", "A JavaScript representation of the real DOM", "A testing tool", "A browser extension"],
      correctAnswer: 1
    },
    {
      id: 9,
      question: "Which hook is used to access React context?",
      options: ["useContext", "useRef", "useState", "useEffect"],
      correctAnswer: 0
    },
    {
      id: 10,
      question: "What is the purpose of React fragments?",
      options: ["To break components", "To group elements without extra DOM nodes", "To handle errors", "To manage state"],
      correctAnswer: 1
    },
    {
      id: 11,
      question: "Which lifecycle method is called after component mounts?",
      options: ["componentDidMount", "componentWillMount", "componentDidUpdate", "componentWillUnmount"],
      correctAnswer: 0
    },
    {
      id: 12,
      question: "What is props drilling in React?",
      options: ["Creating holes in components", "Passing props through multiple component layers", "Debugging props", "Optimizing props"],
      correctAnswer: 1
    },
    {
      id: 13,
      question: "Which hook is used for performance optimization?",
      options: ["useState", "useMemo", "useRef", "useContext"],
      correctAnswer: 1
    },
    {
      id: 14,
      question: "What is the default export syntax in React?",
      options: ["module.exports", "export default", "exports", "return"],
      correctAnswer: 1
    },
    {
      id: 15,
      question: "Which method is used to handle form submissions in React?",
      options: ["onSubmit", "onSend", "onPost", "onForm"],
      correctAnswer: 0
    },
    {
      id: 16,
      question: "What is the purpose of useRef hook?",
      options: ["Managing state", "Accessing DOM elements", "Handling effects", "Managing context"],
      correctAnswer: 1
    },
    {
      id: 17,
      question: "Which method prevents the default behavior of an event?",
      options: ["stopPropagation()", "preventDefault()", "stopDefault()", "cancelEvent()"],
      correctAnswer: 1
    },
    {
      id: 18,
      question: "What is conditional rendering in React?",
      options: ["Rendering components based on conditions", "Rendering only once", "Rendering in loops", "Rendering with delays"],
      correctAnswer: 0
    },
    {
      id: 19,
      question: "Which hook is used for complex state management?",
      options: ["useState", "useReducer", "useEffect", "useContext"],
      correctAnswer: 1
    },
    {
      id: 20,
      question: "What is the purpose of React.StrictMode?",
      options: ["To make code stricter", "To highlight potential problems in development", "To optimize performance", "To handle errors"],
      correctAnswer: 1
    }
  ],
  nodejs: [
    {
      id: 1,
      question: "What module is built into Node.js for creating servers?",
      options: ["http", "net", "url", "fs"],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Which command initializes a new Node.js project?",
      options: ["npm create", "node init", "npm init", "node setup"],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "What does the 'require' keyword do in Node.js?",
      options: ["Include external modules", "Define variables", "Run async functions", "Connect to DB"],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "Which framework is popular for building APIs with Node.js?",
      options: ["Vue", "Express", "Angular", "Svelte"],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "What is the extension of a JavaScript file executed by Node.js?",
      options: [".node", ".njs", ".js", ".json"],
      correctAnswer: 2
    },
    {
      id: 6,
      question: "What is the global object in Node.js?",
      options: ["window", "document", "global", "process"],
      correctAnswer: 2
    },
    {
      id: 7,
      question: "Which module is used to work with file systems in Node.js?",
      options: ["fs", "file", "system", "path"],
      correctAnswer: 0
    },
    {
      id: 8,
      question: "What is the purpose of package.json?",
      options: ["Store user data", "Define project metadata and dependencies", "Configure the server", "Handle routing"],
      correctAnswer: 1
    },
    {
      id: 9,
      question: "Which method is used to read files asynchronously in Node.js?",
      options: ["fs.readFile()", "fs.read()", "fs.open()", "fs.get()"],
      correctAnswer: 0
    },
    {
      id: 10,
      question: "What is middleware in Express.js?",
      options: ["A database layer", "Functions that execute during request-response cycle", "A templating engine", "A testing framework"],
      correctAnswer: 1
    },
    {
      id: 11,
      question: "Which command installs a package globally in npm?",
      options: ["npm install -g", "npm global install", "npm add global", "npm set global"],
      correctAnswer: 0
    },
    {
      id: 12,
      question: "What is the event loop in Node.js?",
      options: ["A debugging tool", "Mechanism for handling asynchronous operations", "A package manager", "A testing framework"],
      correctAnswer: 1
    },
    {
      id: 13,
      question: "Which module is used to create file paths in Node.js?",
      options: ["url", "path", "fs", "os"],
      correctAnswer: 1
    },
    {
      id: 14,
      question: "What does npm stand for?",
      options: ["New Package Manager", "Node Package Manager", "Network Protocol Manager", "Native Program Manager"],
      correctAnswer: 1
    },
    {
      id: 15,
      question: "Which method is used to create an HTTP server?",
      options: ["http.server()", "http.create()", "http.createServer()", "http.newServer()"],
      correctAnswer: 2
    },
    {
      id: 16,
      question: "What is the purpose of the process object in Node.js?",
      options: ["Handle file operations", "Provide information about current process", "Manage databases", "Handle HTTP requests"],
      correctAnswer: 1
    },
    {
      id: 17,
      question: "Which method is used to handle POST requests in Express?",
      options: ["app.post()", "app.get()", "app.send()", "app.receive()"],
      correctAnswer: 0
    },
    {
      id: 18,
      question: "What is a callback function in Node.js?",
      options: ["A function that calls back to server", "A function passed as argument to another function", "A function that handles errors", "A function that creates loops"],
      correctAnswer: 1
    },
    {
      id: 19,
      question: "Which tool is commonly used to restart Node.js applications during development?",
      options: ["nodemon", "node-dev", "supervisor", "forever"],
      correctAnswer: 0
    },
    {
      id: 20,
      question: "What is the purpose of module.exports in Node.js?",
      options: ["Import modules", "Export functions/objects from module", "Delete modules", "Update modules"],
      correctAnswer: 1
    }
  ],
  databases: [
    {
      id: 1,
      question: "What does SQL stand for?",
      options: ["Structured Query Language", "Simple Query Language", "System Query List", "Standard Queue Logic"],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Which command is used to retrieve data from a database?",
      options: ["GET", "RETRIEVE", "SELECT", "FETCH"],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "Which of the following is a NoSQL database?",
      options: ["MySQL", "PostgreSQL", "Oracle", "MongoDB"],
      correctAnswer: 3
    },
    {
      id: 4,
      question: "Which SQL clause is used to filter results?",
      options: ["ORDER BY", "WHERE", "GROUP BY", "LIMIT"],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "Which tool is commonly used to interact with MongoDB?",
      options: ["pgAdmin", "MongoShell", "DBVisualizer", "Workbench"],
      correctAnswer: 1
    },
    {
      id: 6,
      question: "What is a primary key in a database?",
      options: ["The first column", "A unique identifier for each record", "The largest value", "A foreign reference"],
      correctAnswer: 1
    },
    {
      id: 7,
      question: "Which command is used to add new data to a table?",
      options: ["INSERT", "ADD", "CREATE", "PUT"],
      correctAnswer: 0
    },
    {
      id: 8,
      question: "What does CRUD stand for in database operations?",
      options: ["Create, Read, Update, Delete", "Copy, Remove, Undo, Deploy", "Connect, Run, Upload, Download", "Call, Return, Use, Define"],
      correctAnswer: 0
    },
    {
      id: 9,
      question: "Which SQL command is used to modify existing data?",
      options: ["MODIFY", "CHANGE", "UPDATE", "ALTER"],
      correctAnswer: 2
    },
    {
      id: 10,
      question: "What is normalization in databases?",
      options: ["Making data normal", "Organizing data to reduce redundancy", "Converting to lowercase", "Sorting data"],
      correctAnswer: 1
    },
    {
      id: 11,
      question: "Which clause is used to sort query results?",
      options: ["SORT BY", "ORDER BY", "ARRANGE BY", "GROUP BY"],
      correctAnswer: 1
    },
    {
      id: 12,
      question: "What is a foreign key?",
      options: ["A key from another country", "A reference to primary key in another table", "An encrypted key", "A backup key"],
      correctAnswer: 1
    },
    {
      id: 13,
      question: "Which command creates a new table in SQL?",
      options: ["MAKE TABLE", "CREATE TABLE", "NEW TABLE", "ADD TABLE"],
      correctAnswer: 1
    },
    {
      id: 14,
      question: "What is an index in databases?",
      options: ["A table of contents", "A data structure to improve query speed", "A backup copy", "A user account"],
      correctAnswer: 1
    },
    {
      id: 15,
      question: "Which SQL function counts the number of rows?",
      options: ["COUNT()", "NUMBER()", "SIZE()", "LENGTH()"],
      correctAnswer: 0
    },
    {
      id: 16,
      question: "What is a transaction in databases?",
      options: ["A money transfer", "A sequence of operations treated as single unit", "A data backup", "A user login"],
      correctAnswer: 1
    },
    {
      id: 17,
      question: "Which command removes data from a table?",
      options: ["REMOVE", "DELETE", "DROP", "CLEAR"],
      correctAnswer: 1
    },
    {
      id: 18,
      question: "What does ACID stand for in database properties?",
      options: ["Atomic, Consistent, Isolated, Durable", "Add, Create, Insert, Delete", "Always, Check, Include, Define", "Access, Control, Identity, Data"],
      correctAnswer: 0
    },
    {
      id: 19,
      question: "Which type of join returns all records from both tables?",
      options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
      correctAnswer: 3
    },
    {
      id: 20,
      question: "What is a view in databases?",
      options: ["A way to see data", "A virtual table based on query results", "A backup system", "A user interface"],
      correctAnswer: 1
    }
  ],
  git: [
    {
      id: 1,
      question: "Which command shows the current Git branch and status?",
      options: ["git log", "git status", "git branch", "git check"],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Which command stages all modified files?",
      options: ["git push .", "git stage *", "git add .", "git commit *"],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "Which command creates a new branch in Git?",
      options: ["git make-branch", "git new", "git branch", "git create"],
      correctAnswer: 2
    },
    {
      id: 4,
      question: "Which site is most commonly used for Git repository hosting?",
      options: ["Bitbucket", "GitHub", "GitLab", "Azure DevOps"],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "What does `git commit -m` do?",
      options: ["Push changes", "Track changes", "Commit changes with message", "Create new repo"],
      correctAnswer: 2
    },
    {
      id: 6,
      question: "Which command switches to a different branch?",
      options: ["git switch", "git checkout", "git change", "git move"],
      correctAnswer: 1
    },
    {
      id: 7,
      question: "What does `git clone` do?",
      options: ["Copy files", "Create identical repository copy", "Backup data", "Merge branches"],
      correctAnswer: 1
    },
    {
      id: 8,
      question: "Which command shows the commit history?",
      options: ["git history", "git log", "git commits", "git show"],
      correctAnswer: 1
    },
    {
      id: 9,
      question: "What does `git pull` do?",
      options: ["Download and merge changes", "Upload changes", "Create branch", "Delete files"],
      correctAnswer: 0
    },
    {
      id: 10,
      question: "Which command uploads changes to remote repository?",
      options: ["git upload", "git send", "git push", "git sync"],
      correctAnswer: 2
    },
    {
      id: 11,
      question: "What is a Git repository?",
      options: ["A file storage", "A project folder with version control", "A backup system", "A code editor"],
      correctAnswer: 1
    },
    {
      id: 12,
      question: "Which command initializes a new Git repository?",
      options: ["git start", "git init", "git create", "git new"],
      correctAnswer: 1
    },
    {
      id: 13,
      question: "What does `git merge` do?",
      options: ["Delete branches", "Combine branches together", "Create new files", "Rename branches"],
      correctAnswer: 1
    },
    {
      id: 14,
      question: "Which command undoes the last commit?",
      options: ["git undo", "git reverse", "git reset", "git back"],
      correctAnswer: 2
    },
    {
      id: 15,
      question: "What is a merge conflict?",
      options: ["A server error", "When Git can't automatically merge changes", "A deleted file", "A network issue"],
      correctAnswer: 1
    },
    {
      id: 16,
      question: "Which command shows differences between files?",
      options: ["git compare", "git diff", "git changes", "git delta"],
      correctAnswer: 1
    },
    {
      id: 17,
      question: "What does `git stash` do?",
      options: ["Delete changes", "Temporarily save changes", "Create backup", "Merge files"],
      correctAnswer: 1
    },
    {
      id: 18,
      question: "Which command adds a remote repository?",
      options: ["git remote add", "git add remote", "git connect", "git link"],
      correctAnswer: 0
    },
    {
      id: 19,
      question: "What is the main branch typically called in Git?",
      options: ["master", "main", "primary", "Both A and B"],
      correctAnswer: 3
    },
    {
      id: 20,
      question: "Which command shows all branches?",
      options: ["git list", "git branch -a", "git show branches", "git branches"],
      correctAnswer: 1
    }
  ]
};

export default assessmentQuestions;