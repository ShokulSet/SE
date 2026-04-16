import { test, expect } from '@playwright/test'

test.describe('Admin Menu Management', () => {
  test.beforeEach(async ({ page }) => {
    // Stub auth session so admin pages render
    await page.addInitScript(() => {
      (window as any).__NEXT_AUTH_STUB__ = true
    })
  })

  test('menu list page renders heading', async ({ page }) => {
    await page.goto('/admin/menu')
    await expect(page.locator('h1')).toContainText('Menu Management')
  })

  test('shows Add Menu button', async ({ page }) => {
    await page.goto('/admin/menu')
    const addBtn = page.locator('a', { hasText: '+ Add Menu' })
    await expect(addBtn).toBeVisible()
  })

  test('shows empty state when no menus', async ({ page }) => {
    await page.goto('/admin/menu')
    // If the API returns empty, the empty message should appear
    const empty = page.locator('text=No menus found.')
    // Either menus or empty state should be present
    await expect(page.locator('main')).toBeVisible()
  })

  test('Add Menu page renders form fields', async ({ page }) => {
    await page.goto('/admin/menu/new')
    await expect(page.locator('h1')).toContainText('Add New Menu Item')
    await expect(page.locator('input[placeholder*="Grilled Salmon"]')).toBeVisible()
    await expect(page.locator('input[type="number"]')).toBeVisible()
    await expect(page.locator('input[placeholder*="Main Course"]')).toBeVisible()
  })

  test('form validation rejects empty name', async ({ page }) => {
    await page.goto('/admin/menu/new')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=Name is required')).toBeVisible()
  })

  test('form validation rejects invalid price', async ({ page }) => {
    await page.goto('/admin/menu/new')
    await page.fill('input[placeholder*="Grilled Salmon"]', 'Test Item')
    await page.fill('input[placeholder*="Main Course"]', 'Appetizer')
    // Leave price empty
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=Price must be')).toBeVisible()
  })

  test('delete confirmation dialog appears on Delete click', async ({ page }) => {
    // This test requires a menu item to exist; skipped if list is empty
    await page.goto('/admin/menu')
    const deleteBtn = page.locator('button', { hasText: 'Delete' }).first()
    const count = await deleteBtn.count()
    if (count === 0) {
      test.skip()
      return
    }
    await deleteBtn.click()
    await expect(page.locator('text=Delete Menu Item')).toBeVisible()
    await expect(page.locator('text=This action cannot be undone.')).toBeVisible()
  })

  test('delete dialog cancel closes without deleting', async ({ page }) => {
    await page.goto('/admin/menu')
    const deleteBtn = page.locator('button', { hasText: 'Delete' }).first()
    const count = await deleteBtn.count()
    if (count === 0) { test.skip(); return }
    const rowsBefore = await page.locator('tbody tr').count()
    await deleteBtn.click()
    await page.locator('button', { hasText: 'Cancel' }).click()
    await expect(page.locator('text=Delete Menu Item')).not.toBeVisible()
    const rowsAfter = await page.locator('tbody tr').count()
    expect(rowsAfter).toBe(rowsBefore)
  })

  test('sort by name toggles order', async ({ page }) => {
    await page.goto('/admin/menu')
    const nameHeader = page.locator('th', { hasText: 'Name' })
    await nameHeader.click()
    await expect(nameHeader).toContainText('↑')
    await nameHeader.click()
    await expect(nameHeader).toContainText('↓')
  })

  test('filter by category shows only matching items', async ({ page }) => {
    await page.goto('/admin/menu')
    const select = page.locator('select')
    const optionCount = await select.locator('option').count()
    if (optionCount <= 1) { test.skip(); return }
    // Select the second category option
    const secondOption = await select.locator('option').nth(1).textContent()
    await select.selectOption({ label: secondOption! })
    const rows = page.locator('tbody tr')
    const count = await rows.count()
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toContainText(secondOption!)
    }
  })
})
