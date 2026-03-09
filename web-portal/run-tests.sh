#!/bin/bash

# SwiftPulse E2E Test Runner Script
# This script provides a convenient way to run different types of tests

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -d "tests" ]; then
    print_error "Please run this script from the web-portal directory"
    exit 1
fi

# Function to check if services are running
check_services() {
    print_status "Checking if SwiftPulse services are running..."
    
    # Check if React app is running
    if ! curl -s http://localhost:3000 > /dev/null; then
        print_error "React app is not running on port 3000"
        print_status "Please start the app with: npm start"
        exit 1
    fi
    
    # Check if API Gateway is running
    if ! curl -s http://localhost:8080 > /dev/null; then
        print_error "API Gateway is not running on port 8080"
        print_status "Please start the microservices"
        exit 1
    fi
    
    print_success "All services are running"
}

# Function to install dependencies
install_deps() {
    print_status "Installing dependencies..."
    npm install
    
    print_status "Installing Playwright browsers..."
    npx playwright install
    
    print_success "Dependencies installed"
}

# Function to run all tests
run_all_tests() {
    print_status "Running all E2E tests..."
    npm run test:e2e
}

# Function to run specific test suite
run_test_suite() {
    local suite=$1
    print_status "Running $suite test suite..."
    
    case $suite in
        "auth")
            npx playwright test tests/e2e/auth/
            ;;
        "orders")
            npx playwright test tests/e2e/orders/
            ;;
        "tracking")
            npx playwright test tests/e2e/tracking/
            ;;
        "api")
            npx playwright test tests/api/
            ;;
        "visual")
            npx playwright test tests/visual/
            ;;
        *)
            print_error "Unknown test suite: $suite"
            print_status "Available suites: auth, orders, tracking, api, visual"
            exit 1
            ;;
    esac
}

# Function to run tests with UI
run_ui_tests() {
    print_status "Running tests with Playwright UI..."
    npm run test:e2e:ui
}

# Function to run tests in headed mode
run_headed_tests() {
    print_status "Running tests in headed mode..."
    npm run test:e2e:headed
}

# Function to run tests in debug mode
run_debug_tests() {
    print_status "Running tests in debug mode..."
    npm run test:e2e:debug
}

# Function to generate test report
generate_report() {
    print_status "Generating HTML test report..."
    npx playwright show-report
}

# Function to run tests with coverage
run_coverage_tests() {
    print_status "Running tests with coverage..."
    npm run test:e2e -- --coverage
}

# Function to run performance tests
run_performance_tests() {
    print_status "Running performance tests..."
    npx playwright test --grep "Performance" --workers 1
}

# Function to run mobile tests only
run_mobile_tests() {
    print_status "Running mobile tests..."
    npx playwright test --project="Mobile Chrome" --project="Mobile Safari"
}

# Function to run accessibility tests
run_accessibility_tests() {
    print_status "Running accessibility tests..."
    npx playwright test --grep "Accessibility"
}

# Function to clean up test results
clean_results() {
    print_status "Cleaning up test results..."
    rm -rf test-results/
    rm -rf playwright-report/
    rm -rf .nyc_output/
    print_success "Test results cleaned"
}

# Function to update snapshots
update_snapshots() {
    print_status "Updating visual snapshots..."
    npx playwright test --update-snapshots
}

# Function to run smoke tests
run_smoke_tests() {
    print_status "Running smoke tests..."
    npx playwright test --grep "smoke" --max-failures=1
}

# Function to show help
show_help() {
    echo "SwiftPulse E2E Test Runner"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  install              Install dependencies and Playwright browsers"
    echo "  check                Check if services are running"
    echo "  all                  Run all tests"
    echo "  auth                 Run authentication tests"
    echo "  orders               Run order management tests"
    echo "  tracking             Run tracking tests"
    echo "  api                  Run API integration tests"
    echo "  visual               Run visual regression tests"
    echo "  ui                   Run tests with Playwright UI"
    echo "  headed               Run tests in headed mode"
    echo "  debug                Run tests in debug mode"
    echo "  mobile               Run mobile tests only"
    echo "  accessibility        Run accessibility tests"
    echo "  performance          Run performance tests"
    echo "  smoke                Run smoke tests"
    echo "  coverage             Run tests with coverage"
    echo "  report               Show HTML test report"
    echo "  update-snapshots     Update visual snapshots"
    echo "  clean                Clean up test results"
    echo "  help                 Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install           # Install dependencies"
    echo "  $0 check             # Check services"
    echo "  $0 all               # Run all tests"
    echo "  $0 auth              # Run auth tests only"
    echo "  $0 ui                # Run tests with UI"
    echo "  $0 mobile            # Run mobile tests"
}

# Main script logic
case "${1:-help}" in
    "install")
        install_deps
        ;;
    "check")
        check_services
        ;;
    "all")
        check_services
        run_all_tests
        ;;
    "auth"|"orders"|"tracking"|"api"|"visual")
        check_services
        run_test_suite "$1"
        ;;
    "ui")
        check_services
        run_ui_tests
        ;;
    "headed")
        check_services
        run_headed_tests
        ;;
    "debug")
        check_services
        run_debug_tests
        ;;
    "mobile")
        check_services
        run_mobile_tests
        ;;
    "accessibility")
        check_services
        run_accessibility_tests
        ;;
    "performance")
        check_services
        run_performance_tests
        ;;
    "smoke")
        check_services
        run_smoke_tests
        ;;
    "coverage")
        check_services
        run_coverage_tests
        ;;
    "report")
        generate_report
        ;;
    "update-snapshots")
        check_services
        update_snapshots
        ;;
    "clean")
        clean_results
        ;;
    "help"|*)
        show_help
        ;;
esac

print_success "Done!"
