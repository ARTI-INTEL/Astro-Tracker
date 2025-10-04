// Declaring variables
let workouts = [];
let meals = [];
let caloriesBurnt = 0;
let caloriesConsumed = 0; 
let calorieGoal = 2000; // Default daily calorie goal
let sleepHours = 0;
let sleepHoursGoal = 8; // Default daily sleep goal
let waterIntake = 0; // in Litres
let waterIntakeGoal = 2; // Default daily water intake goal in liters
let weight; // in kg
let height; // in cm
let age; // in years

// Function to set weight, height, and age
function setUserMetrics(userWeight, userHeight, userAge) {
    weight = userWeight;
    height = userHeight;
    age = userAge;
}

// Function to Set goals
function setGoals(calorieGoalInput, sleepGoalInput, waterGoalInput) {
    calorieGoal = calorieGoalInput;
    sleepHoursGoal = sleepGoalInput;
    waterIntakeGoal = waterGoalInput;
}

// Function to add a meal (updated for diet.html)
function addMeal() {
    const mealInput = document.getElementById('meal');
    const caloriesInput = document.getElementById('calories');
    if (!mealInput || !caloriesInput) return; // Only run on diet.html

    const mealName = mealInput.value.trim();
    const calories = parseInt(caloriesInput.value, 10);

    if (mealName && !isNaN(calories)) {
        meals.push({ mealName, calories });
        caloriesConsumed += calories;
        mealInput.value = '';
        caloriesInput.value = '';
        updateMealList();
        saveData();
    }
}

// Function to update meal list and total calories
function updateMealList() {
    const mealList = document.getElementById('mealList');
    const totalCalories = document.getElementById('totalCalories');
    if (!mealList || !totalCalories) return; // Only run on diet.html

    mealList.innerHTML = meals.map(meal => 
        `<li>${meal.mealName}: ${meal.calories} Cal</li>`
    ).join('');
    totalCalories.innerText = `Total Calories Consumed: ${caloriesConsumed}`;
}

// On diet.html, update meal list on load
window.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('mealList')) {
        updateMealList();
    }
});

// Function to add a workout
function addWorkout(workoutName, workoutDescription, calories) {
    table = document.getElementById('workoutTable');
    workouts.push({ workoutName, workoutDescription, calories });
    caloriesBurnt += calories;
     
    num = table.rows.length; // Get the current number of rows to use as call number

    const tbody = document.getElementById('calls-body');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${workoutName}</td>
        <td>${workoutDescription}</td>
        <td>${calories}</td>
    `;
    tbody.appendChild(row);

    console.log(workouts);
}

function calculateCalories() {
    const name = document.getElementById('workoutName').value.trim();
    const description = document.getElementById('workoutDescription').value.trim();
    const calories = parseInt(document.getElementById('workoutCalories').value, 10);
    const result = document.getElementById('calorieResult');

    if (name && description && !isNaN(calories)) {
        addWorkout(name, description, calories);
        saveData();
        result.textContent = `✅ Added ${name}: ${calories} calories burned.`;
    } else {
        result.textContent = "⚠️ Please fill in all workout details.";
    }
}

// Function to log sleep hours
function logSleep(hours) {
    sleepHours += hours;
}

// Function to calculate sleep duration based on bedtime and wake time inputs
function calculateSleep() {
    const bedtime = document.getElementById('bedtime').value;
    const waketime = document.getElementById('waketime').value;
    const result = document.getElementById('sleepResult');

    if (bedtime && waketime) {
        const bed = new Date(`1970-01-01T${bedtime}:00`);
        const wake = new Date(`1970-01-01T${waketime}:00`);
        let diff = (wake - bed) / (1000 * 60 * 60); // in hours

        if (diff < 0) diff += 24; // handle next-day wake time
        logSleep(diff); // use your existing function
        saveData(); // store it

        result.textContent = `You slept for ${diff.toFixed(1)} hours.`;
    } else {
        result.textContent = "Please enter both bedtime and wake time.";
    }
}


// Function to log water intake
function logWaterIntake(liters) {
    waterIntake += liters;
}   

// Function to calculate BMI
function calculateBMI() {
    if (weight && height) {
        let heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(2);
    } else {
        return null;
    }
}

// Function to get daily summary
function getDailySummary() {
    return {
        caloriesConsumed,
        caloriesBurnt,
        netCalories: caloriesConsumed - caloriesBurnt,
        calorieGoal,
        sleepHours,
        sleepHoursGoal,
        waterIntake,
        waterIntakeGoal,
        bmi: calculateBMI(),
        workouts,
        meals
    };
}

// store data in local storage
function saveData() {
    const data = {
        workouts,
        meals,
        caloriesBurnt,
        caloriesConsumed,
        calorieGoal,
        sleepHours,
        sleepHoursGoal,
        waterIntake,
        waterIntakeGoal,
        weight,
        height,
        age
    };
    localStorage.setItem('healthTrackerData', JSON.stringify(data));
}

// load data from local storage
function loadData() {
    const data = JSON.parse(localStorage.getItem('healthTrackerData'));
    if (data) {
        workouts = data.workouts || [];
        meals = data.meals || [];   
        caloriesBurnt = data.caloriesBurnt || 0;
        caloriesConsumed = data.caloriesConsumed || 0;
        calorieGoal = data.calorieGoal || 2000;
        sleepHours = data.sleepHours || 0;
        sleepHoursGoal = data.sleepHoursGoal || 8;
        waterIntake = data.waterIntake || 0;
        waterIntakeGoal = data.waterIntakeGoal || 2;
        weight = data.weight;
        height = data.height;
        age = data.age;
    }
}

// Main execution
// Load data on initialization
loadData();
window.onload = function() {
    loadData();
    document.getElementById('bmiValue').innerText = calculateBMI() || 'N/A';

    const summary = getDailySummary();
    document.getElementById('caloriesConsumed').innerText = summary.caloriesConsumed;
    document.getElementById('caloriesBurnt').innerText = summary.caloriesBurnt;
    document.getElementById('netCalories').innerText = summary.netCalories;
    document.getElementById('calorieGoal').innerText = summary.calorieGoal;
    document.getElementById('sleepHours').innerText = summary.sleepHours;
    document.getElementById('sleepHoursGoal').innerText = summary.sleepHoursGoal;
    document.getElementById('waterIntake').innerText = summary.waterIntake;
    document.getElementById('waterIntakeGoal').innerText = summary.waterIntakeGoal;
}  

// Save data before unloading the page
window.onbeforeunload = saveData();
// Save data when the page is hidden (e.g., switching tabs)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        saveData();
    } else {
        loadData();
        const summary = getDailySummary();
        document.getElementById('caloriesConsumed').innerText = summary.caloriesConsumed;
        document.getElementById('caloriesBurnt').innerText = summary.caloriesBurnt;
        document.getElementById('netCalories').innerText = summary.netCalories;
        document.getElementById('calorieGoal').innerText = summary.calorieGoal;
        document.getElementById('sleepHours').innerText = summary.sleepHours;
        document.getElementById('sleepHoursGoal').innerText = summary.sleepHoursGoal;
        document.getElementById('waterIntake').innerText = summary.waterIntake;
        document.getElementById('waterIntakeGoal').innerText = summary.waterIntakeGoal;
        document.getElementById('bmiValue').innerText = calculateBMI() || 'N/A';
    }
});

// Switch between Earth Mode & Astronaut Mode
document.addEventListener("DOMContentLoaded", () => {
  const earthBtn = document.getElementById("earthBtn");
  const astroBtn = document.getElementById("astroBtn");
  const cycleInfo = document.getElementById("cycleInfo");

  earthBtn.addEventListener("click", () => {
    earthBtn.classList.add("active");
    astroBtn.classList.remove("active");
    cycleInfo.innerHTML = `
      <p><em>🌍 Earth Light Cycle: 7am – 11pm</em></p>
      <ul>
        <li>☀️ Light Exposure: Morning sunlight (7–9am)</li>
        <li>🌙 Sleep Window: 11pm – 7am</li>
        <li>💡 Evening: Reduce blue light after 9pm</li>
      </ul>
    `;
  });

  astroBtn.addEventListener("click", () => {
    astroBtn.classList.add("active");
    earthBtn.classList.remove("active");
    cycleInfo.innerHTML = `
      <p><em>🚀 ISS Light Cycle: 16 sunrises & sunsets every 24h</em></p>
      <ul>
        <li>☀️ Light Exposure: Strategic use of bright white/blue light</li>
        <li>🌙 Sleep Window: 10pm – 6am (station time)</li>
        <li>💡 Evening: Switch to dim red/orange lights</li>
        <li>🛰️ NASA Lighting: LED spectrum tuned for circadian alignment</li>
      </ul>
    `;
  });
});

  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const closeMenu = document.getElementById('closeMenu');

  // Open the menu
  menuToggle.addEventListener('click', () => {
    navMenu.classList.add('active');
  });

  // Close the menu
  closeMenu.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });

  // Optional: close if you click outside menu
  window.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && e.target !== menuToggle) {
      navMenu.classList.remove('active');
    }
  });
/* End of script.js */