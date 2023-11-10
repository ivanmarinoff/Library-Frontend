const { test, expect } = require('@playwright/test');
const pageUrl = 'http://localhost:3000';

test('Verrifi "All Books" is visible', async ({ page }) => {
    await page.goto(pageUrl);
    await page.waitForSelector('nav.navbar');
    const allBooksLink = await page.$('a[href="/catalog"]');
    const isAllBookLinkVisible = await allBooksLink.isVisible();
    expect(isAllBookLinkVisible).toBe(true);})

test('Verrifi Login button is visible', async ({ page }) => {
    await page.goto(pageUrl);
    await page.waitForSelector('nav.navbar');
    const loginButton = await page.$('a[href="/login"]');
    const isLoginButtonVisible = await loginButton.isVisible();
    expect(isLoginButtonVisible).toBe(true);})

test('Verrifi Register button is visible', async ({ page }) => {
    await page.goto(pageUrl);
    await page.waitForSelector('nav.navbar');
    const registerButton = await page.$('a[href="/register"]');
    const isRegisterButtonVisible = await registerButton.isVisible();
    expect(isRegisterButtonVisible).toBe(true);})

test('Verrifi "All Books" link is visible after user login', async ({ page }) => {
    await page.goto('http://localhost:3000/login'); 

    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');
    const allBooksLink = await page.$('a[href="/catalog"]');
    const isAllBookLinkVisible = await allBooksLink.isVisible();
    expect(isAllBookLinkVisible).toBe(true);})

test('Login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login'); 

    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');
    await page.$('a[href="/catalog"]');
    expect(page.url()).toBe('http://localhost:3000/catalog');})

test('Login with empty credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login'); 
    await page.click('input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required');
        await dialog.accept();
    });
        await page.$('a[href="/login"]');
        expect(page.url()).toBe('http://localhost:3000/login');
});

test('Add book with correct data', async ({ page }) => {
    await page.goto('http://localhost:3000/login'); 

    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ])
    await page.click('a[href="/create"]');
    await page.waitForSelector('#create-form');
    await page.fill("#title", 'Test Book');
    await page.fill("#description", 'This is a test book Description');
    await page.fill("#image", 'http://example.com/book-image.jpg');
    await page.selectOption('#type', 'Fiction');
    await page.click('#create-form input[type="submit"]');
    await page.waitForURL('http://localhost:3000/catalog');
    expect(page.url()).toBe('http://localhost:3000/catalog');
})

test('Add book with empty field', async ({ page }) => {
    await page.goto('http://localhost:3000/login'); 

    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ])
    await page.click('a[href="/create"]');
    await page.waitForSelector('#create-form');
    // await page.fill("#title", 'Test Book');
    await page.fill("#description", 'This is a test book Description');
    await page.fill("#image", 'http://example.com/book-image.jpg');
    await page.selectOption('#type', 'Fiction');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required');
        await dialog.accept();
    });

    await page.$('a[href="/create"]');
    
    expect(page.url()).toBe('http://localhost:3000/create');
});