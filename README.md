# Twitch UI Clone with SQL Practice

## Introduction

I wanted to expand my SQL knowledge by recreating the Twitch UI and implementing a database backend. This project uses Supabase as the database to practice SQL queries in a real-world application context.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Database Client**: psycopg2
- **Styling**: Tailwind CSS, Shadcn UI

## Features

- Twitch-like UI interface
- Real database integration with Supabase
- Custom SQL query execution
- Stream information display
- Mock data generation

## Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- Supabase account
- pip (Python package installer)
- npm (Node package manager)

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd twitch_
```

### 2. Install Dependencies

Frontend Dependencies:

```bash
npm install
```

Python Dependencies:

```bash
cd test_db
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
DATABASE_URL=your_database_connection_string
```

### 4. Database Configuration

1. Create a new project in Supabase
2. Create necessary tables using the provided SQL scripts
3. Update the connection string in your `.env` file

## Running the Application

1. Start the Next.js development server:

```bash
npm run dev
```

2. Execute SQL queries:

```bash
cd test_db
python query.py
```

## Project Structure

```
twitch_/
├── app/                  # Next.js pages and components
├── components/          # React components
├── lib/                 # Utilities and helpers
├── test_db/            # Python SQL scripts
│   ├── queries.sql     # SQL queries
│   └── query.py        # Query executor
└── public/             # Static assets
```

## Learning Objectives

- Practice writing complex SQL queries
- Understand database relationships
- Learn about database optimization
- Implement real-world UI patterns
- Work with database clients in Python

## Contributing

Feel free to contribute to this project by submitting pull requests or creating issues for bugs and feature requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
