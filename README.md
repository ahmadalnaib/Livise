# Living Room - Room Rental Platform

A modern Laravel application for room rentals with landlord and tenant matching.

## Requirements

- PHP 8.4 or higher
- Composer
- Node.js 18+ and pnpm
- SQLite (default) or MySQL/PostgreSQL

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Living-room
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install JavaScript Dependencies

```bash
npm install
```

### 4. Environment Setup

```bash
cp .env.example .env
php artisan key:generate
```

### 5. Database Setup

The project uses SQLite by default. Create the database file and run migrations:

```bash
touch database/database.sqlite
php artisan migrate
```

For MySQL/PostgreSQL, update your `.env` file with your database credentials before running migrations.

### 6. Start Development Server

```bash
php artisan serve
```

The application will be available at `http://localhost:8000`

### 7. Build Frontend Assets

In a separate terminal:

```bash
pnpm run dev
```

Or build for production:

```bash
pnpm run build
```

## Development Commands

### Run Development Environment

```bash
composer run dev
```

This typically runs both the backend and frontend development servers.

### Code Formatting

Format PHP code using Laravel Pint:

```bash
vendor/bin/pint
```

### Testing

Run the test suite:

```bash
php artisan test
```

Or with compact output:

```bash
php artisan test --compact
```

### Generate Wayfinder Routes

After modifying routes:

```bash
php artisan wayfinder:generate
```

## Project Structure

- `app/` - Core application code
- `resources/js/pages/` - Inertia.js React pages
- `resources/js/components/` - Reusable React components
- `routes/web.php` - Web routes
- `database/migrations/` - Database migrations
- `tests/` - Pest PHP tests

## Tech Stack

- **Backend**: Laravel 13, PHP 8.4
- **Frontend**: React 19, Inertia.js v3, Tailwind CSS v4
- **Auth**: Laravel Fortify
- **Testing**: Pest PHP
- **Build**: Vite

## Deployment

This application can be deployed to [Laravel Cloud](https://cloud.laravel.com/) for the fastest deployment experience.

## License

This project is proprietary software.
