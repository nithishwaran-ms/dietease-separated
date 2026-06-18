package com.example.dieteasy.data.repository

import android.content.Context
import com.example.dieteasy.data.local.FoodLogEntry
import com.example.dieteasy.data.local.FoodLogStorage
import com.example.dieteasy.data.remote.OFFProduct
import com.example.dieteasy.data.remote.OpenFoodFactsApi
import kotlinx.coroutines.flow.Flow
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.time.LocalDate

// ── Food item model ───────────────────────────────────────────────────────────
data class FoodItem(
    val name: String,
    val brand: String = "",
    val barcode: String = "",
    val calories: Int,
    val protein: Float = 0f,
    val carbs: Float = 0f,
    val fat: Float = 0f,
    val source: String = ""
)

// ── Built-in Indian product database ─────────────────────────────────────────
val BUILTIN_PRODUCTS = mapOf(
    "8901719100018" to FoodItem("Parle-G Biscuits",      "Parle",      "8901719100018", 450, 6.7f, 76f, 11.7f, "⚡ Built-in DB"),
    "8901719110017" to FoodItem("Parle Hide & Seek",      "Parle",      "8901719110017", 496, 6.2f, 66f, 23f,   "⚡ Built-in DB"),
    "8901030810054" to FoodItem("Parle-G Gold",           "Parle",      "8901030810054", 450, 6.7f, 76f, 11.7f, "⚡ Built-in DB"),
    "8901063032019" to FoodItem("Britannia Good Day",     "Britannia",  "8901063032019", 503, 7f,   64f, 24f,   "⚡ Built-in DB"),
    "8901063030015" to FoodItem("Britannia Marie Gold",   "Britannia",  "8901063030015", 416, 8f,   74f, 9f,    "⚡ Built-in DB"),
    "8901058851336" to FoodItem("Maggi 2-Min Noodles",    "Nestlé",     "8901058851336", 375, 9.4f, 57f, 12.2f, "⚡ Built-in DB"),
    "8901088002230" to FoodItem("Amul Butter",            "Amul",       "8901088002230", 720, 0.5f, 0f,  80f,   "⚡ Built-in DB"),
    "8901088000885" to FoodItem("Amul Taaza Milk",        "Amul",       "8901088000885", 58,  3.2f, 4.8f,3f,    "⚡ Built-in DB"),
    "8901088012007" to FoodItem("Amul Cheese Slice",      "Amul",       "8901088012007", 300, 18f,  4f,  24f,   "⚡ Built-in DB"),
    "8902045000018" to FoodItem("Haldirams Bhujia",       "Haldirams",  "8902045000018", 536, 12f,  56f, 28f,   "⚡ Built-in DB"),
    "8901491502759" to FoodItem("Lay's Classic Salted",   "Lay's",      "8901491502759", 536, 6.2f, 52.3f,34f,  "⚡ Built-in DB"),
    "8901491107474" to FoodItem("Lay's Magic Masala",     "Lay's",      "8901491107474", 547, 6.4f, 54f, 33f,   "⚡ Built-in DB"),
    "8901491100109" to FoodItem("Kurkure Masala Munch",   "PepsiCo",    "8901491100109", 537, 6.7f, 58f, 30f,   "⚡ Built-in DB"),
    "8904004400019" to FoodItem("Sunfeast Dark Fantasy",  "ITC",        "8904004400019", 517, 6.5f, 64f, 26f,   "⚡ Built-in DB"),
    "8901499000018" to FoodItem("Kellogg's Cornflakes",   "Kellogg's",  "8901499000018", 357, 8f,   79f, 1f,    "⚡ Built-in DB"),
    "7622210449283" to FoodItem("Cadbury Dairy Milk",     "Cadbury",    "7622210449283", 534, 7.7f, 57.6f,29.7f,"⚡ Built-in DB"),
    "7622210979063" to FoodItem("Cadbury 5 Star",         "Cadbury",    "7622210979063", 462, 4f,   70f, 18f,   "⚡ Built-in DB"),
    "8901058501203" to FoodItem("KitKat 4 Finger",        "Nestlé",     "8901058501203", 518, 6.3f, 63f, 27f,   "⚡ Built-in DB"),
    "8901552004123" to FoodItem("Coca-Cola 250ml",        "Coca-Cola",  "8901552004123", 44,  0f,   11f, 0f,    "⚡ Built-in DB"),
    "8901012000016" to FoodItem("Pepsi 250ml",            "PepsiCo",    "8901012000016", 42,  0f,   10.6f,0f,   "⚡ Built-in DB"),
    "049000050103"  to FoodItem("Coca-Cola Classic",      "Coca-Cola",  "049000050103",  42,  0f,   10.6f,0f,   "⚡ Built-in DB"),
    "038000845321"  to FoodItem("Kellogg's Corn Flakes",  "Kellogg's",  "038000845321",  357, 8f,   79f, 0.5f,  "⚡ Built-in DB"),
    "037600164801"  to FoodItem("Oreo Cookies",           "Nabisco",    "037600164801",  471, 5f,   70f, 20f,   "⚡ Built-in DB"),
    "990000000001"  to FoodItem("Mock Apple",             "Mock Farms", "990000000001",  52,  0.3f, 14f,  0.2f, "⚡ Built-in DB"),
    "990000000002"  to FoodItem("Mock Banana",            "Mock Farms", "990000000002",  89,  1.1f, 22.8f,0.3f, "⚡ Built-in DB"),
    "990000000003"  to FoodItem("Mock Orange",            "Mock Farms", "990000000003",  47,  0.9f, 11.8f,0.1f, "⚡ Built-in DB"),
    "990000000004"  to FoodItem("Mock Strawberry",        "Mock Farms", "990000000004",  32,  0.7f, 7.7f, 0.3f, "⚡ Built-in DB"),
    "990000000005"  to FoodItem("Mock Grape",             "Mock Farms", "990000000005",  69,  0.7f, 18.1f,0.2f, "⚡ Built-in DB"),
    "990000000006"  to FoodItem("Mock Pineapple",         "Mock Farms", "990000000006",  50,  0.5f, 13.1f,0.1f, "⚡ Built-in DB"),
    "990000000007"  to FoodItem("Mock Blueberry",         "Mock Farms", "990000000007",  57,  0.7f, 14.5f,0.3f, "⚡ Built-in DB"),
    "990000000008"  to FoodItem("Mock Watermelon",        "Mock Farms", "990000000008",  30,  0.6f, 7.6f, 0.2f, "⚡ Built-in DB"),
    "990000000009"  to FoodItem("Mock Peach",             "Mock Farms", "990000000009",  39,  0.9f, 9.5f, 0.3f, "⚡ Built-in DB"),
    "990000000010"  to FoodItem("Mock Cherry",            "Mock Farms", "990000000010",  50,  1f,   12f,  0.3f, "⚡ Built-in DB")
)

// ── Repository ────────────────────────────────────────────────────────────────
class FoodRepository(context: Context) {

    private val storage = FoodLogStorage(context)

    private val api: OpenFoodFactsApi by lazy {
        Retrofit.Builder()
            .baseUrl("https://world.openfoodfacts.org/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(OpenFoodFactsApi::class.java)
    }

    fun todayKey(): String = LocalDate.now().toString()

    // ── Barcode lookup ────────────────────────────────────────────────────────
    suspend fun lookupBarcode(barcode: String): Result<FoodItem> {
        BUILTIN_PRODUCTS[barcode]?.let { return Result.success(it) }
        return try {
            val resp = api.getProduct(barcode)
            if (resp.status == 1 && resp.product != null)
                Result.success(resp.product.toFoodItem(barcode))
            else
                Result.failure(Exception("Not found"))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // ── Log access ────────────────────────────────────────────────────────────
    fun getTodayLog(): Flow<List<FoodLogEntry>> = storage.getLogForDate(todayKey())
    fun getLogForDate(date: String): Flow<List<FoodLogEntry>> = storage.getLogForDate(date)
    fun getAllDates(): Flow<List<String>> = storage.getAllDates()

    fun logFood(item: FoodItem, servings: Float) {
        storage.insertEntry(
            FoodLogEntry(
                name           = item.name,
                brand          = item.brand,
                barcode        = item.barcode,
                calories       = item.calories,
                protein        = item.protein,
                carbs          = item.carbs,
                fat            = item.fat,
                servings       = servings,
                loggedCalories = (item.calories * servings).toInt(),
                source         = item.source,
                dateKey        = todayKey()
            )
        )
    }

    fun deleteEntry(id: String) = storage.deleteById(id)

    fun getAllProducts(): List<FoodItem> = BUILTIN_PRODUCTS.values.toList()

    private fun OFFProduct.toFoodItem(barcode: String) = FoodItem(
        name     = name?.ifBlank { "Unknown" } ?: "Unknown",
        brand    = brand?.split(",")?.firstOrNull()?.trim() ?: "",
        barcode  = barcode,
        calories = nutriments?.calories?.toInt() ?: 0,
        protein  = nutriments?.protein ?: 0f,
        carbs    = nutriments?.carbs ?: 0f,
        fat      = nutriments?.fat ?: 0f,
        source   = "Open Food Facts"
    )
}
