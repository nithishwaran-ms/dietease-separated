package com.example.dieteasy.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.dieteasy.ui.theme.*
import com.example.dieteasy.viewmodel.MainViewModel

@Composable
fun ProfileScreen(viewModel: MainViewModel) {
    val email          by viewModel.currentUserEmail.collectAsState()
    val todayLog       by viewModel.todayLog.collectAsState()
    val totalCalories  by viewModel.totalCalories.collectAsState()
    val dailyGoal      by viewModel.dailyGoal.collectAsState()
    val historyDates   by viewModel.historyDates.collectAsState()

    var showLogoutDialog by remember { mutableStateOf(false) }
    var showGoalDialog   by remember { mutableStateOf(false) }
    var goalInput        by remember { mutableStateOf(dailyGoal.toString()) }

    // Derived stats
    val displayName = email?.substringBefore("@")?.replaceFirstChar { it.uppercase() } ?: "User"
    val initials    = displayName.take(2).uppercase()
    val progress    = if (dailyGoal > 0) (totalCalories.toFloat() / dailyGoal).coerceIn(0f, 1f) else 0f
    val totalDays   = historyDates.size

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg)
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // ── Header ────────────────────────────────────────────────────────────
        Text(
            "DietEase+",
            style = MaterialTheme.typography.titleSmall.copy(
                brush = Brush.horizontalGradient(listOf(AccentGreen, AccentCyan)),
                fontWeight = FontWeight.ExtraBold
            )
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text("👤 My Profile", style = MaterialTheme.typography.headlineMedium)

        Spacer(modifier = Modifier.height(24.dp))

        // ── Avatar + Name Card ────────────────────────────────────────────────
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color    = DarkCard,
            shape    = RoundedCornerShape(20.dp),
            border   = BorderStroke(1.dp, AccentGreen.copy(alpha = 0.25f))
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Avatar circle with initials
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.radialGradient(listOf(AccentGreen.copy(0.3f), AccentCyan.copy(0.15f)))
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        initials,
                        fontSize = 30.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = AccentGreen
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    displayName,
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                    color = TextPrimary
                )
                Text(
                    email ?: "",
                    color = TextMuted,
                    fontSize = 13.sp,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Today's calorie progress bar
                Column(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Today's Calories", color = TextMuted, fontSize = 12.sp)
                        Text(
                            "$totalCalories / $dailyGoal kcal",
                            color = if (totalCalories >= dailyGoal) DangerRed else AccentGreen,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    LinearProgressIndicator(
                        progress = { progress },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(8.dp)
                            .clip(RoundedCornerShape(4.dp)),
                        color = if (totalCalories >= dailyGoal) DangerRed else AccentGreen,
                        trackColor = DarkBorder
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // ── Stats Row ─────────────────────────────────────────────────────────
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            StatCard(
                modifier = Modifier.weight(1f),
                label    = "Days Logged",
                value    = "$totalDays",
                icon     = Icons.Default.CalendarMonth,
                color    = AccentCyan
            )
            StatCard(
                modifier = Modifier.weight(1f),
                label    = "Items Today",
                value    = "${todayLog.size}",
                icon     = Icons.Default.Restaurant,
                color    = WarnOrange
            )
            StatCard(
                modifier = Modifier.weight(1f),
                label    = "Daily Goal",
                value    = "$dailyGoal",
                icon     = Icons.Default.Flag,
                color    = AccentGreen
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // ── Settings Section ──────────────────────────────────────────────────
        Text(
            "Settings",
            color = TextMuted,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp, start = 2.dp)
        )

        Surface(
            modifier = Modifier.fillMaxWidth(),
            color    = DarkCard,
            shape    = RoundedCornerShape(16.dp),
            border   = BorderStroke(1.dp, DarkBorder)
        ) {
            Column {
                SettingsRow(
                    icon  = Icons.Default.Flag,
                    label = "Daily Calorie Goal",
                    value = "$dailyGoal kcal",
                    color = AccentGreen,
                    onClick = {
                        goalInput = dailyGoal.toString()
                        showGoalDialog = true
                    }
                )
                Divider(color = DarkBorder, thickness = 0.5.dp)
                SettingsRow(
                    icon  = Icons.Default.Email,
                    label = "Email",
                    value = email ?: "",
                    color = AccentCyan,
                    onClick = {}
                )
                Divider(color = DarkBorder, thickness = 0.5.dp)
                SettingsRow(
                    icon  = Icons.Default.Shield,
                    label = "Data Backup",
                    value = "Auto (Google Drive)",
                    color = WarnOrange,
                    onClick = {}
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // ── Logout Button ─────────────────────────────────────────────────────
        Button(
            onClick  = { showLogoutDialog = true },
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = DangerRed.copy(alpha = 0.15f)),
            shape  = RoundedCornerShape(14.dp),
            border = BorderStroke(1.dp, DangerRed.copy(alpha = 0.4f))
        ) {
            Icon(Icons.Default.Logout, contentDescription = null, tint = DangerRed)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Log Out", color = DangerRed, fontWeight = FontWeight.Bold, fontSize = 16.sp)
        }

        Spacer(modifier = Modifier.height(24.dp))
    }

    // ── Logout Confirmation Dialog ─────────────────────────────────────────────
    if (showLogoutDialog) {
        AlertDialog(
            onDismissRequest = { showLogoutDialog = false },
            title = {
                Text("Log Out?", color = TextPrimary, fontWeight = FontWeight.Bold)
            },
            text = {
                Text(
                    "Your login details are backed up. You can sign back in anytime with the same email and password.",
                    color = TextMuted
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        showLogoutDialog = false
                        viewModel.logoutUser()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = DangerRed)
                ) {
                    Text("Log Out", color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = { showLogoutDialog = false }) {
                    Text("Cancel", color = TextMuted)
                }
            },
            containerColor = DarkCard
        )
    }

    // ── Goal Edit Dialog ───────────────────────────────────────────────────────
    if (showGoalDialog) {
        AlertDialog(
            onDismissRequest = { showGoalDialog = false },
            title = {
                Text("🎯 Set Daily Goal", color = TextPrimary, fontWeight = FontWeight.Bold)
            },
            text = {
                Column {
                    Text("Enter your daily calorie target:", color = TextMuted, fontSize = 13.sp)
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value         = goalInput,
                        onValueChange = { goalInput = it.filter { c -> c.isDigit() } },
                        label         = { Text("Calories (kcal)") },
                        singleLine    = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor   = AccentGreen,
                            unfocusedBorderColor = DarkBorder,
                            focusedTextColor     = TextPrimary,
                            unfocusedTextColor   = TextPrimary,
                            cursorColor          = AccentGreen,
                            focusedLabelColor    = AccentGreen
                        )
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val goal = goalInput.toIntOrNull()
                        if (goal != null && goal in 500..10000) {
                            viewModel.setDailyGoal(goal)
                        }
                        showGoalDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = AccentGreen, contentColor = DarkBg)
                ) {
                    Text("Save")
                }
            },
            dismissButton = {
                TextButton(onClick = { showGoalDialog = false }) {
                    Text("Cancel", color = TextMuted)
                }
            },
            containerColor = DarkCard
        )
    }
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
@Composable
fun StatCard(
    modifier: Modifier = Modifier,
    label: String,
    value: String,
    icon: ImageVector,
    color: Color
) {
    Surface(
        modifier = modifier,
        color    = DarkCard,
        shape    = RoundedCornerShape(14.dp),
        border   = BorderStroke(1.dp, color.copy(alpha = 0.25f))
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(22.dp))
            Spacer(modifier = Modifier.height(6.dp))
            Text(value, color = color, fontWeight = FontWeight.ExtraBold, fontSize = 20.sp)
            Text(label, color = TextMuted, fontSize = 10.sp, textAlign = TextAlign.Center)
        }
    }
}

// ── Settings Row ──────────────────────────────────────────────────────────────
@Composable
fun SettingsRow(
    icon: ImageVector,
    label: String,
    value: String,
    color: Color,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(0.dp),
        color = Color.Transparent,
        onClick = onClick
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.width(12.dp))
            Text(label, color = TextPrimary, modifier = Modifier.weight(1f), fontSize = 14.sp)
            Text(value, color = TextMuted, fontSize = 13.sp)
            Spacer(modifier = Modifier.width(4.dp))
            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = TextMuted, modifier = Modifier.size(18.dp))
        }
    }
}
