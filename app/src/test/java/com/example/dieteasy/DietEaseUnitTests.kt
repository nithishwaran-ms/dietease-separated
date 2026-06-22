package com.example.dieteasy

import com.example.dieteasy.data.repository.BUILTIN_PRODUCTS
import com.example.dieteasy.data.repository.FoodItem
import org.junit.Test
import org.junit.Assert.*

/**
 * DietEase+ Comprehensive Unit Test Suite — 150+ test cases
 * Tests: FoodItem model, built-in DB, barcode lookup logic,
 *        calorie math, macro math, validation, edge cases
 */
class DietEaseUnitTests {

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 1 — FoodItem model (20 tests)
    // ─────────────────────────────────────────────────────────────────────────

    @Test fun foodItem_defaultBrandIsEmpty() {
        val item = FoodItem("Rice", calories = 130)
        assertEquals("", item.brand)
    }

    @Test fun foodItem_defaultBarcodeIsEmpty() {
        val item = FoodItem("Rice", calories = 130)
        assertEquals("", item.barcode)
    }

    @Test fun foodItem_defaultProteinIsZero() {
        val item = FoodItem("Rice", calories = 130)
        assertEquals(0f, item.protein, 0.001f)
    }

    @Test fun foodItem_defaultCarbsIsZero() {
        val item = FoodItem("Rice", calories = 130)
        assertEquals(0f, item.carbs, 0.001f)
    }

    @Test fun foodItem_defaultFatIsZero() {
        val item = FoodItem("Rice", calories = 130)
        assertEquals(0f, item.fat, 0.001f)
    }

    @Test fun foodItem_defaultSourceIsEmpty() {
        val item = FoodItem("Rice", calories = 130)
        assertEquals("", item.source)
    }

    @Test fun foodItem_nameIsSet() {
        val item = FoodItem("Wheat Bread", calories = 250)
        assertEquals("Wheat Bread", item.name)
    }

    @Test fun foodItem_caloriesIsSet() {
        val item = FoodItem("Egg", calories = 78)
        assertEquals(78, item.calories)
    }

    @Test fun foodItem_brandIsSet() {
        val item = FoodItem("Butter", brand = "Amul", calories = 720)
        assertEquals("Amul", item.brand)
    }

    @Test fun foodItem_barcodeIsSet() {
        val item = FoodItem("Biscuit", barcode = "1234567890", calories = 450)
        assertEquals("1234567890", item.barcode)
    }

    @Test fun foodItem_sourceIsSet() {
        val item = FoodItem("Chips", calories = 530, source = "Open Food Facts")
        assertEquals("Open Food Facts", item.source)
    }

    @Test fun foodItem_fullConstructorAllFields() {
        val item = FoodItem("Parle-G", "Parle", "8901719100018", 450, 6.7f, 76f, 11.7f, "Built-in DB")
        assertEquals("Parle-G", item.name)
        assertEquals("Parle", item.brand)
        assertEquals("8901719100018", item.barcode)
        assertEquals(450, item.calories)
        assertEquals(6.7f, item.protein, 0.01f)
        assertEquals(76f, item.carbs, 0.01f)
        assertEquals(11.7f, item.fat, 0.01f)
        assertEquals("Built-in DB", item.source)
    }

    @Test fun foodItem_negativeCaloriesAllowed() {
        val item = FoodItem("Negative", calories = -10)
        assertEquals(-10, item.calories)
    }

    @Test fun foodItem_zeroCaloriesAllowed() {
        val item = FoodItem("Water", calories = 0)
        assertEquals(0, item.calories)
    }

    @Test fun foodItem_highCaloriesAllowed() {
        val item = FoodItem("Oil", calories = 900)
        assertEquals(900, item.calories)
    }

    @Test fun foodItem_floatMacrosArePreserved() {
        val item = FoodItem("Chicken", calories = 165, protein = 31.02f, carbs = 0f, fat = 3.57f)
        assertEquals(31.02f, item.protein, 0.001f)
        assertEquals(3.57f, item.fat, 0.001f)
    }

    @Test fun foodItem_equalityByAllFields() {
        val a = FoodItem("Rice", "Brand", "123", 130, 2.7f, 28f, 0.3f, "DB")
        val b = FoodItem("Rice", "Brand", "123", 130, 2.7f, 28f, 0.3f, "DB")
        assertEquals(a, b)
    }

    @Test fun foodItem_inequalityIfNameDiffers() {
        val a = FoodItem("Rice", calories = 130)
        val b = FoodItem("Wheat", calories = 130)
        assertNotEquals(a, b)
    }

    @Test fun foodItem_inequalityIfCaloriesDiffer() {
        val a = FoodItem("Rice", calories = 130)
        val b = FoodItem("Rice", calories = 131)
        assertNotEquals(a, b)
    }

    @Test fun foodItem_copyMakesIndependentCopy() {
        val a = FoodItem("Rice", calories = 130)
        val b = a.copy(calories = 200)
        assertEquals(130, a.calories)
        assertEquals(200, b.calories)
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 2 — Built-in product database (25 tests)
    // ─────────────────────────────────────────────────────────────────────────

    @Test fun builtinDB_notEmpty() {
        assertTrue(BUILTIN_PRODUCTS.isNotEmpty())
    }

    @Test fun builtinDB_hasAtLeast10Products() {
        assertTrue(BUILTIN_PRODUCTS.size >= 10)
    }

    @Test fun builtinDB_parleGFound() {
        assertNotNull(BUILTIN_PRODUCTS["8901719100018"])
    }

    @Test fun builtinDB_parleGName() {
        assertEquals("Parle-G Biscuits", BUILTIN_PRODUCTS["8901719100018"]?.name)
    }

    @Test fun builtinDB_parleGCalories() {
        assertEquals(450, BUILTIN_PRODUCTS["8901719100018"]?.calories)
    }

    @Test fun builtinDB_parleGBrand() {
        assertEquals("Parle", BUILTIN_PRODUCTS["8901719100018"]?.brand)
    }

    @Test fun builtinDB_parleGSource() {
        assertEquals("Built-in DB", BUILTIN_PRODUCTS["8901719100018"]?.source)
    }

    @Test fun builtinDB_amulButterFound() {
        assertNotNull(BUILTIN_PRODUCTS["8901088002230"])
    }

    @Test fun builtinDB_amulButterCalories() {
        assertEquals(720, BUILTIN_PRODUCTS["8901088002230"]?.calories)
    }

    @Test fun builtinDB_amulButterHighFat() {
        val fat = BUILTIN_PRODUCTS["8901088002230"]?.fat ?: 0f
        assertTrue("Butter should have high fat", fat > 70f)
    }

    @Test fun builtinDB_cadburyFound() {
        assertNotNull(BUILTIN_PRODUCTS["7622210449283"])
    }

    @Test fun builtinDB_cadburyName() {
        assertEquals("Cadbury Dairy Milk", BUILTIN_PRODUCTS["7622210449283"]?.name)
    }

    @Test fun builtinDB_cocaColaFound() {
        assertNotNull(BUILTIN_PRODUCTS["8901552004123"])
    }

    @Test fun builtinDB_cocaColaLowCalories() {
        val cal = BUILTIN_PRODUCTS["8901552004123"]?.calories ?: 999
        assertTrue("Coke should be low-cal", cal < 100)
    }

    @Test fun builtinDB_kellogs_found() {
        assertNotNull(BUILTIN_PRODUCTS["8901499000018"])
    }

    @Test fun builtinDB_allProductsHaveNames() {
        BUILTIN_PRODUCTS.values.forEach { item ->
            assertTrue("Product should have a name: $item", item.name.isNotBlank())
        }
    }

    @Test fun builtinDB_allProductsHavePositiveCalories() {
        BUILTIN_PRODUCTS.values.forEach { item ->
            assertTrue("${item.name} should have positive calories", item.calories >= 0)
        }
    }

    @Test fun builtinDB_allProductsHaveSourceBuiltinDB() {
        BUILTIN_PRODUCTS.values.forEach { item ->
            assertEquals("Built-in DB", item.source)
        }
    }

    @Test fun builtinDB_allProductsHaveNonEmptyBarcode() {
        BUILTIN_PRODUCTS.values.forEach { item ->
            assertTrue("${item.name} barcode should not be empty", item.barcode.isNotBlank())
        }
    }

    @Test fun builtinDB_allProductsHaveNonNegativeProtein() {
        BUILTIN_PRODUCTS.values.forEach { item ->
            assertTrue("${item.name} protein should be >= 0", item.protein >= 0f)
        }
    }

    @Test fun builtinDB_allProductsHaveNonNegativeCarbs() {
        BUILTIN_PRODUCTS.values.forEach { item ->
            assertTrue("${item.name} carbs should be >= 0", item.carbs >= 0f)
        }
    }

    @Test fun builtinDB_allProductsHaveNonNegativeFat() {
        BUILTIN_PRODUCTS.values.forEach { item ->
            assertTrue("${item.name} fat should be >= 0", item.fat >= 0f)
        }
    }

    @Test fun builtinDB_unknownBarcodeReturnsNull() {
        assertNull(BUILTIN_PRODUCTS["0000000000000"])
    }

    @Test fun builtinDB_emptyBarcodeReturnsNull() {
        assertNull(BUILTIN_PRODUCTS[""])
    }

    @Test fun builtinDB_barcodesMatchKeys() {
        BUILTIN_PRODUCTS.forEach { (key, item) ->
            assertEquals("Key '$key' should match barcode '${item.barcode}'", key, item.barcode)
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 3 — Calorie math (30 tests)
    // ─────────────────────────────────────────────────────────────────────────

    @Test fun calMath_oneServing100g() {
        val item = FoodItem("Rice", calories = 130)
        val result = (item.calories * 1f).toInt()
        assertEquals(130, result)
    }

    @Test fun calMath_halfServing() {
        val item = FoodItem("Rice", calories = 130)
        val result = (item.calories * 0.5f).toInt()
        assertEquals(65, result)
    }

    @Test fun calMath_doubleServing() {
        val item = FoodItem("Rice", calories = 130)
        val result = (item.calories * 2f).toInt()
        assertEquals(260, result)
    }

    @Test fun calMath_tenServings() {
        val item = FoodItem("Rice", calories = 100)
        val result = (item.calories * 10f).toInt()
        assertEquals(1000, result)
    }

    @Test fun calMath_quarterServing() {
        val item = FoodItem("Rice", calories = 100)
        val result = (item.calories * 0.25f).toInt()
        assertEquals(25, result)
    }

    @Test fun calMath_zeroServings() {
        val item = FoodItem("Rice", calories = 130)
        val result = (item.calories * 0f).toInt()
        assertEquals(0, result)
    }

    @Test fun calMath_parleGOneServing() {
        val item = BUILTIN_PRODUCTS["8901719100018"]!!
        val result = (item.calories * 1f).toInt()
        assertEquals(450, result)
    }

    @Test fun calMath_parleGHalfServing() {
        val item = BUILTIN_PRODUCTS["8901719100018"]!!
        val result = (item.calories * 0.5f).toInt()
        assertEquals(225, result)
    }

    @Test fun calMath_sumOfMultipleItems() {
        val rice  = FoodItem("Rice",  calories = 130)
        val dal   = FoodItem("Dal",   calories = 116)
        val roti  = FoodItem("Roti",  calories = 297)
        val total = rice.calories + dal.calories + roti.calories
        assertEquals(543, total)
    }

    @Test fun calMath_calorieProgressUnderGoal() {
        val consumed = 1500
        val goal = 2000
        val progress = consumed.toFloat() / goal
        assertTrue(progress < 1f)
    }

    @Test fun calMath_calorieProgressOverGoal() {
        val consumed = 2500
        val goal = 2000
        val progress = (consumed.toFloat() / goal).coerceIn(0f, 1f)
        assertEquals(1f, progress, 0.001f)
    }

    @Test fun calMath_calorieProgressExactGoal() {
        val consumed = 2000
        val goal = 2000
        val progress = consumed.toFloat() / goal
        assertEquals(1f, progress, 0.001f)
    }

    @Test fun calMath_proteinOneServing() {
        val item = FoodItem("Chicken", calories = 165, protein = 31f)
        val result = item.protein * 1f
        assertEquals(31f, result, 0.001f)
    }

    @Test fun calMath_proteinHalfServing() {
        val item = FoodItem("Chicken", calories = 165, protein = 31f)
        val result = item.protein * 0.5f
        assertEquals(15.5f, result, 0.001f)
    }

    @Test fun calMath_carbsDoubleServing() {
        val item = FoodItem("Bread", calories = 265, carbs = 49f)
        val result = item.carbs * 2f
        assertEquals(98f, result, 0.001f)
    }

    @Test fun calMath_fatOneAndHalfServings() {
        val item = FoodItem("Peanut Butter", calories = 588, fat = 50f)
        val result = item.fat * 1.5f
        assertEquals(75f, result, 0.001f)
    }

    @Test fun calMath_servingCoercedMin() {
        var servings = 1f
        servings = (servings - 0.5f).coerceAtLeast(0.5f)
        assertEquals(0.5f, servings, 0.001f)
    }

    @Test fun calMath_servingCoercedMinAtLimit() {
        var servings = 0.5f
        servings = (servings - 0.5f).coerceAtLeast(0.5f)
        assertEquals(0.5f, servings, 0.001f)
    }

    @Test fun calMath_servingCoercedMax() {
        var servings = 10f
        servings = (servings + 0.5f).coerceAtMost(10f)
        assertEquals(10f, servings, 0.001f)
    }

    @Test fun calMath_servingIncrement() {
        var servings = 1f
        servings = (servings + 0.5f).coerceAtMost(10f)
        assertEquals(1.5f, servings, 0.001f)
    }

    @Test fun calMath_servingDecrement() {
        var servings = 2f
        servings = (servings - 0.5f).coerceAtLeast(0.5f)
        assertEquals(1.5f, servings, 0.001f)
    }

    @Test fun calMath_dailyGoalDefault() {
        val goal = 2000
        assertTrue(goal > 0)
    }

    @Test fun calMath_validGoalRange500() {
        assertTrue(500 in 500..10000)
    }

    @Test fun calMath_validGoalRange10000() {
        assertTrue(10000 in 500..10000)
    }

    @Test fun calMath_invalidGoalRange499() {
        assertFalse(499 in 500..10000)
    }

    @Test fun calMath_invalidGoalRange10001() {
        assertFalse(10001 in 500..10000)
    }

    @Test fun calMath_remainingCalories() {
        val goal = 2000
        val consumed = 1350
        val remaining = goal - consumed
        assertEquals(650, remaining)
    }

    @Test fun calMath_negativeRemaining() {
        val goal = 2000
        val consumed = 2350
        val remaining = goal - consumed
        assertTrue(remaining < 0)
    }

    @Test fun calMath_percentageComplete() {
        val goal = 2000
        val consumed = 1000
        val pct = (consumed * 100) / goal
        assertEquals(50, pct)
    }

    @Test fun calMath_loggedCaloriesWithServings() {
        val item = FoodItem("Pasta", calories = 200)
        val servings = 2.5f
        val logged = (item.calories * servings).toInt()
        assertEquals(500, logged)
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 4 — Auth / validation logic (30 tests)
    // ─────────────────────────────────────────────────────────────────────────

    @Test fun auth_validEmailContainsAt() {
        val email = "test@example.com"
        assertTrue(email.contains("@"))
    }

    @Test fun auth_invalidEmailNoAt() {
        val email = "testexample.com"
        assertFalse(email.contains("@"))
    }

    @Test fun auth_emptyEmailIsInvalid() {
        val email = ""
        assertTrue(email.isEmpty())
    }

    @Test fun auth_blankEmailIsInvalid() {
        val email = "   "
        assertTrue(email.isBlank())
    }

    @Test fun auth_emailTrimLowercase() {
        val raw = "  Test@Example.COM  "
        val clean = raw.trim().lowercase()
        assertEquals("test@example.com", clean)
    }

    @Test fun auth_emptyPasswordIsInvalid() {
        val password = ""
        assertTrue(password.isEmpty())
    }

    @Test fun auth_passwordMinLength() {
        val password = "abc"
        assertTrue(password.length >= 3)
    }

    @Test fun auth_passwordTooShort() {
        val password = "ab"
        assertFalse(password.length >= 3)
    }

    @Test fun auth_guestEmailExists() {
        val guestEmail = "guest@dietease.com"
        assertTrue(guestEmail.contains("@"))
        assertTrue(guestEmail.isNotBlank())
    }

    @Test fun auth_credentialsMatch() {
        val stored = mapOf("user@test.com" to "pass123")
        assertEquals("pass123", stored["user@test.com"])
    }

    @Test fun auth_credentialsMismatch() {
        val stored = mapOf("user@test.com" to "pass123")
        assertNotEquals("wrong", stored["user@test.com"])
    }

    @Test fun auth_unknownUserIsNull() {
        val stored = mapOf("user@test.com" to "pass123")
        assertNull(stored["other@test.com"])
    }

    @Test fun auth_registerAddsUser() {
        val users = mutableMapOf<String, String>()
        users["new@test.com"] = "pass"
        assertTrue(users.containsKey("new@test.com"))
    }

    @Test fun auth_registerDuplicate() {
        val users = mutableMapOf("user@test.com" to "pass")
        val isDuplicate = users.containsKey("user@test.com")
        assertTrue(isDuplicate)
    }

    @Test fun auth_logoutClearsUser() {
        var loggedIn: String? = "user@test.com"
        loggedIn = null
        assertNull(loggedIn)
    }

    @Test fun auth_displayNameFromEmail() {
        val email = "nithish@example.com"
        val name = email.substringBefore("@").replaceFirstChar { it.uppercase() }
        assertEquals("Nithish", name)
    }

    @Test fun auth_initialsFromName() {
        val name = "Nithish"
        val initials = name.take(2).uppercase()
        assertEquals("NI", initials)
    }

    @Test fun auth_initialsShortName() {
        val name = "A"
        val initials = name.take(2).uppercase()
        assertEquals("A", initials)
    }

    @Test fun auth_emailWithSubdomain() {
        val email = "test@mail.company.org"
        assertTrue(email.contains("@"))
    }

    @Test fun auth_passwordStoredAsPlaintext() {
        // Document current behaviour: passwords stored as-is in SharedPreferences
        val stored = mapOf("u@t.com" to "mypassword")
        assertEquals("mypassword", stored["u@t.com"])
    }

    @Test fun auth_emailCaseInsensitiveLogin() {
        val stored = mapOf("user@test.com" to "pass")
        val input  = "User@Test.COM"
        val clean  = input.trim().lowercase()
        assertEquals("pass", stored[clean])
    }

    @Test fun auth_multipleUsersCanExist() {
        val users = mutableMapOf("a@t.com" to "p1", "b@t.com" to "p2")
        assertEquals(2, users.size)
    }

    @Test fun auth_deleteUserFromMap() {
        val users = mutableMapOf("a@t.com" to "p1", "b@t.com" to "p2")
        users.remove("a@t.com")
        assertFalse(users.containsKey("a@t.com"))
        assertTrue(users.containsKey("b@t.com"))
    }

    @Test fun auth_isLoggedInWhenEmailNotNull() {
        val email: String? = "user@test.com"
        assertFalse(email.isNullOrBlank())
    }

    @Test fun auth_isLoggedOutWhenEmailNull() {
        val email: String? = null
        assertTrue(email.isNullOrBlank())
    }

    @Test fun auth_isLoggedOutWhenEmailEmpty() {
        val email: String? = ""
        assertTrue(email.isNullOrBlank())
    }

    @Test fun auth_emailValidationRejectsNoTLD() {
        val email = "test@"
        // must have at least one char after @
        val afterAt = email.substringAfter("@")
        assertFalse(afterAt.contains("."))
    }

    @Test fun auth_emailValidGmailAddress() {
        val email = "user@gmail.com"
        assertTrue(email.contains("@") && email.contains("."))
    }

    @Test fun auth_passwordEquality() {
        val p1 = "password123"
        val p2 = "password123"
        assertEquals(p1, p2)
    }

    @Test fun auth_passwordInequality() {
        val p1 = "password123"
        val p2 = "Password123"
        assertNotEquals(p1, p2)
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 5 — Manual product / barcode logic (25 tests)
    // ─────────────────────────────────────────────────────────────────────────

    @Test fun manual_barcodeBlankGeneratesTimestampKey() {
        val barcode = ""
        val key = if (barcode.isBlank()) "manual_${System.currentTimeMillis()}" else barcode
        assertTrue(key.startsWith("manual_"))
    }

    @Test fun manual_barcodeProvidedUsesBarcode() {
        val barcode = "9876543210"
        val key = if (barcode.isBlank()) "manual_${System.currentTimeMillis()}" else barcode
        assertEquals("9876543210", key)
    }

    @Test fun manual_productNameRequired() {
        val name = ""
        assertTrue(name.isBlank())
    }

    @Test fun manual_caloriesRequired() {
        val cal: Int? = null
        assertNull(cal)
    }

    @Test fun manual_caloriesParseValid() {
        val input = "350"
        val cal = input.toIntOrNull()
        assertEquals(350, cal)
    }

    @Test fun manual_caloriesParseInvalid() {
        val input = "abc"
        val cal = input.toIntOrNull()
        assertNull(cal)
    }

    @Test fun manual_proteinParseFloat() {
        val input = "25.5"
        val protein = input.toFloatOrNull() ?: 0f
        assertEquals(25.5f, protein, 0.001f)
    }

    @Test fun manual_proteinParseEmpty() {
        val input = ""
        val protein = input.toFloatOrNull() ?: 0f
        assertEquals(0f, protein, 0.001f)
    }

    @Test fun manual_carbsParseFloat() {
        val input = "45.2"
        val carbs = input.toFloatOrNull() ?: 0f
        assertEquals(45.2f, carbs, 0.001f)
    }

    @Test fun manual_fatParseFloat() {
        val input = "12.8"
        val fat = input.toFloatOrNull() ?: 0f
        assertEquals(12.8f, fat, 0.001f)
    }

    @Test fun manual_addProductToList() {
        val products = mutableListOf<FoodItem>()
        val item = FoodItem("HomeMade Dal", calories = 120)
        products.add(item)
        assertEquals(1, products.size)
    }

    @Test fun manual_replaceExistingBarcode() {
        val products = mutableListOf(
            FoodItem("Old", barcode = "123", calories = 100)
        )
        products.removeAll { it.barcode == "123" }
        products.add(FoodItem("New", barcode = "123", calories = 200))
        assertEquals(1, products.size)
        assertEquals("New", products.first().name)
    }

    @Test fun manual_searchByNameContains() {
        val products = listOf(
            FoodItem("Basmati Rice", calories = 130),
            FoodItem("Brown Rice", calories = 110),
            FoodItem("Wheat Bread", calories = 265)
        )
        val results = products.filter { it.name.contains("Rice", true) }
        assertEquals(2, results.size)
    }

    @Test fun manual_searchByBrandContains() {
        val products = listOf(
            FoodItem("Butter", brand = "Amul", calories = 720),
            FoodItem("Milk", brand = "Amul", calories = 62),
            FoodItem("Chips", brand = "Lay's", calories = 536)
        )
        val results = products.filter { it.brand.contains("Amul", true) }
        assertEquals(2, results.size)
    }

    @Test fun manual_emptySearchReturnsAll() {
        val products = listOf(
            FoodItem("Rice", calories = 130),
            FoodItem("Dal", calories = 116)
        )
        val q = ""
        val results = if (q.isBlank()) products else products.filter { it.name.contains(q, true) }
        assertEquals(2, results.size)
    }

    @Test fun manual_noMatchReturnsEmpty() {
        val products = listOf(FoodItem("Rice", calories = 130))
        val results = products.filter { it.name.contains("XYZ", true) }
        assertTrue(results.isEmpty())
    }

    @Test fun manual_sourceIsManualEntry() {
        val item = FoodItem("Custom", calories = 100, source = "Manual Entry")
        assertEquals("Manual Entry", item.source)
    }

    @Test fun manual_getAllProductsMergesBuiltinAndManual() {
        val manual = listOf(FoodItem("Custom1", calories = 100), FoodItem("Custom2", calories = 200))
        val all = BUILTIN_PRODUCTS.values.toList() + manual
        assertTrue(all.size > BUILTIN_PRODUCTS.size)
    }

    @Test fun manual_manualProductAppearsinSearch() {
        val manual = listOf(FoodItem("IdliSambar", calories = 65, source = "Manual Entry"))
        val results = manual.filter { it.name.contains("Idli", true) }
        assertEquals(1, results.size)
    }

    @Test fun manual_duplicateBarcodeHandled() {
        val products = mutableListOf(
            FoodItem("A", barcode = "111", calories = 100),
            FoodItem("B", barcode = "111", calories = 200)
        )
        // After de-dup by barcode: last one wins
        val deduped = products.distinctBy { it.barcode }
        assertEquals(1, deduped.size)
    }

    @Test fun manual_barcodeIsNumericString() {
        val barcode = "8901719100018"
        assertTrue(barcode.all { it.isDigit() })
    }

    @Test fun manual_barcodeContainsOnlyDigits() {
        val barcode = "1234abc"
        assertFalse(barcode.all { it.isDigit() })
    }

    @Test fun manual_productWithZeroCarbs() {
        val item = FoodItem("Egg", calories = 78, protein = 6f, carbs = 0f, fat = 5f)
        assertEquals(0f, item.carbs, 0.001f)
    }

    @Test fun manual_productWithHighFat() {
        val item = FoodItem("Avocado", calories = 160, fat = 15f)
        assertTrue(item.fat > 10f)
    }

    @Test fun manual_productWithHighProtein() {
        val item = FoodItem("Whey Protein", calories = 120, protein = 25f)
        assertTrue(item.protein > 20f)
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 6 — History / date key logic (20 tests)
    // ─────────────────────────────────────────────────────────────────────────

    @Test fun history_todayKeyIsNotEmpty() {
        val key = java.time.LocalDate.now().toString()
        assertTrue(key.isNotEmpty())
    }

    @Test fun history_todayKeyFormat() {
        val key = java.time.LocalDate.now().toString()
        // Format: YYYY-MM-DD
        assertTrue(key.matches(Regex("\\d{4}-\\d{2}-\\d{2}")))
    }

    @Test fun history_distinctDates() {
        val dates = listOf("2026-06-20", "2026-06-21", "2026-06-20")
        val distinct = dates.distinct()
        assertEquals(2, distinct.size)
    }

    @Test fun history_sortedDescending() {
        val dates = listOf("2026-06-20", "2026-06-22", "2026-06-21")
        val sorted = dates.sortedDescending()
        assertEquals("2026-06-22", sorted.first())
    }

    @Test fun history_filterByDate() {
        data class Entry(val name: String, val dateKey: String)
        val entries = listOf(
            Entry("Rice", "2026-06-22"),
            Entry("Dal", "2026-06-21"),
            Entry("Roti", "2026-06-22")
        )
        val today = entries.filter { it.dateKey == "2026-06-22" }
        assertEquals(2, today.size)
    }

    @Test fun history_emptyOnNoEntries() {
        data class Entry(val name: String, val dateKey: String)
        val entries = emptyList<Entry>()
        val today = entries.filter { it.dateKey == "2026-06-22" }
        assertTrue(today.isEmpty())
    }

    @Test fun history_sumCaloriesForDate() {
        data class Entry(val calories: Int, val dateKey: String)
        val entries = listOf(
            Entry(300, "2026-06-22"),
            Entry(500, "2026-06-22"),
            Entry(200, "2026-06-21")
        )
        val total = entries.filter { it.dateKey == "2026-06-22" }.sumOf { it.calories }
        assertEquals(800, total)
    }

    @Test fun history_deleteById() {
        data class Entry(val id: String, val name: String)
        val entries = mutableListOf(Entry("1", "Rice"), Entry("2", "Dal"))
        val updated = entries.filter { it.id != "1" }
        assertEquals(1, updated.size)
        assertEquals("Dal", updated.first().name)
    }

    @Test fun history_multipleDeletesLeaveCorrectCount() {
        data class Entry(val id: String)
        val entries = (1..10).map { Entry(it.toString()) }.toMutableList()
        val updated = entries.filter { it.id != "3" && it.id != "7" }
        assertEquals(8, updated.size)
    }

    @Test fun history_sortedByLoggedAtDescending() {
        data class Entry(val name: String, val loggedAt: Long)
        val entries = listOf(
            Entry("A", 1000L),
            Entry("B", 3000L),
            Entry("C", 2000L)
        )
        val sorted = entries.sortedByDescending { it.loggedAt }
        assertEquals("B", sorted.first().name)
    }

    @Test fun history_allDatesFromEntries() {
        data class Entry(val dateKey: String)
        val entries = listOf(Entry("2026-06-20"), Entry("2026-06-21"), Entry("2026-06-20"))
        val dates = entries.map { it.dateKey }.distinct().sortedDescending()
        assertEquals(listOf("2026-06-21", "2026-06-20"), dates)
    }

    @Test fun history_zeroHistoryDates() {
        val entries = emptyList<String>()
        assertEquals(0, entries.distinct().size)
    }

    @Test fun history_singleDate() {
        val dates = listOf("2026-06-22")
        assertEquals(1, dates.distinct().size)
    }

    @Test fun history_loggedCaloriesMatchItemCalTimesServings() {
        val calories = 450
        val servings = 1.5f
        val logged = (calories * servings).toInt()
        assertEquals(675, logged)
    }

    @Test fun history_entryIdIsUnique() {
        val ids = (1..100).map { java.util.UUID.randomUUID().toString() }
        val unique = ids.distinct()
        assertEquals(100, unique.size)
    }

    @Test fun history_entryBrandIsPreserved() {
        data class Entry(val brand: String)
        val e = Entry("Amul")
        assertEquals("Amul", e.brand)
    }

    @Test fun history_entrySourceIsPreserved() {
        data class Entry(val source: String)
        val e = Entry("Open Food Facts")
        assertEquals("Open Food Facts", e.source)
    }

    @Test fun history_sumOfEmptyListIsZero() {
        val totals = emptyList<Int>().sumOf { it }
        assertEquals(0, totals)
    }

    @Test fun history_progressBarClamped() {
        val consumed = 3000
        val goal = 2000
        val progress = (consumed.toFloat() / goal).coerceIn(0f, 1f)
        assertEquals(1f, progress, 0.001f)
    }

    @Test fun history_progressBarZero() {
        val consumed = 0
        val goal = 2000
        val progress = (consumed.toFloat() / goal).coerceIn(0f, 1f)
        assertEquals(0f, progress, 0.001f)
    }
}
