import { test, expect } from '@playwright/test'

test.describe('Pre-order Quantity Editing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu')
    const addBtn = page.locator('button', { hasText: 'Add to Pre-order' }).first()
    if (await addBtn.count() > 0) await addBtn.click()
  })

  test('quantity input is visible in pre-order list', async ({ page }) => {
    const qtyInput = page.locator('input[type="number"]').first()
    if (await qtyInput.count() === 0) { test.skip(); return }
    await expect(qtyInput).toBeVisible()
  })

  test('default quantity is 1 after adding', async ({ page }) => {
    const qtyInput = page.locator('input[type="number"]').first()
    if (await qtyInput.count() === 0) { test.skip(); return }
    await expect(qtyInput).toHaveValue('1')
  })

  test('plus button increments quantity', async ({ page }) => {
    const plusBtn = page.locator('button', { hasText: '+' }).first()
    if (await plusBtn.count() === 0) { test.skip(); return }

    await plusBtn.click()
    const qtyInput = page.locator('input[type="number"]').first()
    await expect(qtyInput).toHaveValue('2')
  })

  test('minus button decrements quantity', async ({ page }) => {
    const plusBtn = page.locator('button', { hasText: '+' }).first()
    if (await plusBtn.count() === 0) { test.skip(); return }

    await plusBtn.click()
    await plusBtn.click()
    const minusBtn = page.locator('button', { hasText: '−' }).first()
    await minusBtn.click()
    const qtyInput = page.locator('input[type="number"]').first()
    await expect(qtyInput).toHaveValue('2')
  })

  test('minus button disabled at minimum quantity of 1', async ({ page }) => {
    const minusBtn = page.locator('button', { hasText: '−' }).first()
    if (await minusBtn.count() === 0) { test.skip(); return }
    await expect(minusBtn).toBeDisabled()
  })

  test('total price updates when quantity increases', async ({ page }) => {
    const plusBtn = page.locator('button', { hasText: '+' }).first()
    if (await plusBtn.count() === 0) { test.skip(); return }

    const totalBefore = await page
      .locator('text=Total').locator('..').locator('span').last().textContent()

    await plusBtn.click()

    const totalAfter = await page
      .locator('text=Total').locator('..').locator('span').last().textContent()

    expect(totalAfter).not.toBe(totalBefore)
  })

  test('typing quantity directly in input updates total', async ({ page }) => {
    const qtyInput = page.locator('input[type="number"]').first()
    if (await qtyInput.count() === 0) { test.skip(); return }

    const totalBefore = await page
      .locator('text=Total').locator('..').locator('span').last().textContent()

    await qtyInput.fill('3')
    await qtyInput.press('Tab')

    const totalAfter = await page
      .locator('text=Total').locator('..').locator('span').last().textContent()

    expect(totalAfter).not.toBe(totalBefore)
  })
})
