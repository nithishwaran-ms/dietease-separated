package com.example.dieteasy.data.remote

import com.google.gson.annotations.SerializedName
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Url

// ── Open Food Facts API Response ─────────────────────────────────────────────
data class OFFResponse(
    val status: Int,
    val product: OFFProduct?
)

data class OFFProduct(
    @SerializedName("product_name")     val name: String?,
    @SerializedName("brands")           val brand: String?,
    @SerializedName("nutriments")       val nutriments: OFFNutriments?,
    @SerializedName("image_url")        val imageUrl: String?
)

data class OFFNutriments(
    @SerializedName(value = "energy-kcal_100g", alternate = ["energy-kcal", "energy-kcal_serving", "energy-kcal_value"])
    val calories: Float?,
    
    @SerializedName(value = "energy_100g", alternate = ["energy", "energy_serving", "energy-kj", "energy-kj_100g", "energy-kj_serving", "energy_value"])
    val energyKj: Float?,
    
    @SerializedName(value = "proteins_100g", alternate = ["proteins", "proteins_serving", "proteins_value"])
    val protein: Float?,
    
    @SerializedName(value = "carbohydrates_100g", alternate = ["carbohydrates", "carbohydrates_serving", "carbohydrates_value"])
    val carbs: Float?,
    
    @SerializedName(value = "fat_100g", alternate = ["fat", "fat_serving", "fat_value"])
    val fat: Float?
)

// ── Retrofit interface ────────────────────────────────────────────────────────
interface OpenFoodFactsApi {
    @GET("api/v0/product/{barcode}.json")
    suspend fun getProduct(@Path("barcode") barcode: String): OFFResponse

    @GET
    suspend fun getProductByUrl(@Url url: String): OFFResponse
}
