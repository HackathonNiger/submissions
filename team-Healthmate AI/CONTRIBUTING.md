# Contributing to HealthMate AI

Thank you for considering contributing to HealthMate AI! This document outlines the process for contributing to the project and how to set up your development environment.

## Code of Conduct

By participating in this project, you agree to abide by its terms and to treat all contributors with respect.

## How Can I Contribute?

### Reporting Bugs

- **Check if the bug has already been reported** by searching the existing issues.
- If the bug hasn't been reported, create a new issue using the bug report template.
- Include as much detail as possible: steps to reproduce, expected behavior, actual behavior, and environment details.

### Suggesting Enhancements

- Check if the enhancement has already been suggested.
- Provide a clear description of the enhancement, with examples of how it would be used and why it would be valuable.

### Pull Requests

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes.
4. Test your changes thoroughly.
5. Commit your changes with a descriptive commit message.
6. Push to your fork: `git push origin feature/your-feature-name`.
7. Open a pull request.

## Development Setup

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/healthmate-ai.git
cd healthmate-ai
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example` and add your API keys.

5. Start the backend server:
```bash
cd backend
python app.py
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend server:
```bash
node server.js
```

## Testing

- Write tests for your code changes.
- Ensure all tests pass before submitting a pull request.
- For backend testing, run: `pytest` from the backend directory.

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
- Limit the first line to 72 characters or less.
- Reference issues and pull requests liberally after the first line.

### Python Styleguide

- Follow PEP 8 style guidelines.
- Use 4 spaces for indentation (not tabs).
- Use docstrings for functions and classes.

### JavaScript Styleguide

- Use 2 spaces for indentation.
- Prefer `const` over `let` when possible.
- Use camelCase for variable and function names.

## Adding New Language Support

If you're adding support for a new language:

1. Update the `SUPPORTED_LANGUAGES` dictionary in `health_analysis_service.py`.
2. Ensure the language is supported by the translation services.
3. Test thoroughly with different health queries in the new language.

## API Documentation

When adding or modifying API endpoints, make sure to update the API documentation in `API_DOCS.md`.

## License

By contributing to HealthMate AI, you agree that your contributions will be licensed under the project's MIT License.
