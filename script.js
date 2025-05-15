
function calculateHealthIndex() {

    const age = parseInt(document.getElementById('age').value);
    const pulseRate = document.getElementById('pulse').value;
    const bloodPressure = document.getElementById('bp').value;

    if (!age || age < 1 || age > 120) {
        alert("Please enter a valid age between 1 and 120.");
        return;
    }

    if (!pulseRate || isNaN(pulseRate)) {
        alert("Please enter a valid pulse rate.");
        return;
    }

    const bpPattern = /^\d+\/\d+$/;
    if (!bloodPressure || !bpPattern.test(bloodPressure)) {
        alert("Please enter blood pressure in the format systolic/diastolic (e.g., 120/80).");
        return;
    }


    const [systolic, diastolic] = bloodPressure.split('/').map(num => parseInt(num));

    let healthIndex = calculateHealthScore(age, parseInt(pulseRate), systolic, diastolic);


    localStorage.setItem('healthIndex', healthIndex.toFixed(2));
    localStorage.setItem('age', age);
    localStorage.setItem('pulseRate', pulseRate);
    localStorage.setItem('bloodPressure', bloodPressure);


    window.location.href = 'result.html';
}

function calculateHealthScore(age, pulseRate, systolic, diastolic) {
    let score = 100;

    if (age < 18) {
        if (pulseRate < 60) score -= 10;
        else if (pulseRate > 100) score -= (pulseRate - 100) * 0.2;
    } else if (age >= 18 && age < 60) {

        if (pulseRate < 50) score -= 15;
        else if (pulseRate < 60 && pulseRate > 50) score -= 5;
        else if (pulseRate > 90) score -= (pulseRate - 90) * 0.3;
    } else {

        if (pulseRate < 50) score -= 20;
        else if (pulseRate < 60) score -= 10;
        else if (pulseRate > 90) score -= (pulseRate - 90) * 0.25;
    }


    const systolicDeviation = Math.abs(systolic - 120);
    const diastolicDeviation = Math.abs(diastolic - 80);

    if (systolic < 90 || systolic > 140 || diastolic < 60 || diastolic > 90) {

        score -= (systolicDeviation * 0.3 + diastolicDeviation * 0.3);
    } else {

        score -= (systolicDeviation * 0.1 + diastolicDeviation * 0.1);
    }

    if (age > 40) {
        score -= (age - 40) * 0.1;
    }

    return Math.max(0, Math.min(100, score));
}


function loadResults() {

    const healthboxElement = document.getElementById('healthbox');
    if (!healthboxElement) return;


    const healthIndex = localStorage.getItem('healthIndex');
    const age = localStorage.getItem('age');
    const pulseRate = localStorage.getItem('pulseRate');
    const bloodPressure = localStorage.getItem('bloodPressure');


    healthboxElement.value = healthIndex;


    const descriptionElement = document.querySelector('.description');
    if (descriptionElement) {
        if (healthIndex >= 90) {
            descriptionElement.textContent = "Excellent! Your health indicators are in optimal range.";
        } else if (healthIndex >= 75) {
            descriptionElement.textContent = "Good. Your health indicators are within normal ranges.";
        } else if (healthIndex >= 60) {
            descriptionElement.textContent = "Fair. Consider lifestyle improvements to enhance your health metrics.";
        } else {
            descriptionElement.textContent = "Attention needed. Please consult with a healthcare professional.";
        }
    }


    const feedbackElement = document.getElementById('feedback');
    if (feedbackElement) {
        let feedback = "";


        const [systolic, diastolic] = bloodPressure.split('/').map(num => parseInt(num));


        if (age < 18) {
            feedback += "For your age group, regular physical activity and balanced nutrition are essential for healthy development.\n\n";
        } else if (age >= 65) {
            feedback += "For seniors, regular check-ups, staying active, and monitoring blood pressure are particularly important.\n\n";
        }


        if (pulseRate < 60) {
            feedback += "Your pulse rate is low. This could be normal for athletes, but consider consulting a doctor if you experience dizziness or fatigue.\n\n";
        } else if (pulseRate > 90) {
            feedback += "Your pulse rate is elevated. Try relaxation techniques and consider reducing caffeine intake.\n\n";
        }


        if (systolic > 130 || diastolic > 85) {
            feedback += "Your blood pressure is higher than optimal. Consider reducing sodium intake, maintaining a healthy weight, and regular exercise.\n\n";
        } else if (systolic < 100 || diastolic < 65) {
            feedback += "Your blood pressure is on the lower side. Stay hydrated and rise slowly from sitting or lying positions.\n\n";
        }


        feedback += "General recommendations:\n- Stay hydrated (8 glasses of water daily)\n- Get 7-9 hours of quality sleep\n- Exercise for at least 30 minutes daily\n- Maintain a balanced diet rich in fruits and vegetables";

        feedbackElement.value = feedback;
    }
}


window.addEventListener('DOMContentLoaded', loadResults);