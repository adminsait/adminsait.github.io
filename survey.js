// survey.js – обработка анкеты

document.addEventListener('DOMContentLoaded', function() {
    // Показ поля "Другое"
    const otherCheckbox = document.getElementById('info7');
    const otherText = document.getElementById('infoOtherText');
    if (otherCheckbox && otherText) {
        otherCheckbox.addEventListener('change', function() {
            otherText.style.display = this.checked ? 'block' : 'none';
        });
    }

    const form = document.getElementById('osteoporosisSurvey');
    const hiddenJsonField = document.getElementById('answersJson');

    if (!form || !hiddenJsonField) return;

    // Сбор ответов в JSON перед отправкой формы
    form.addEventListener('submit', function(e) {
        const result = {};
        const formData = new FormData(form);
        
        // Одиночные значения (radio, select, text)
        for (let [key, value] of formData.entries()) {
            if (key === 'answersJson') continue;
            if (['diagnostics', 'prevention', 'symptoms', 'consequences', 'drugs', 'fractures', 'infoSource'].includes(key)) {
                continue;
            }
            result[key] = value;
        }

        // Множественные чекбоксы
        const collectMultiple = (name) => {
            const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
            return Array.from(checkboxes).map(cb => cb.value);
        };
        result.diagnostics = collectMultiple('diagnostics');
        result.prevention = collectMultiple('prevention');
        result.symptoms = collectMultiple('symptoms');
        result.consequences = collectMultiple('consequences');
        result.drugs = collectMultiple('drugs');
        result.fractures = collectMultiple('fractures');
        let infoSource = collectMultiple('infoSource');
        if (otherCheckbox && otherCheckbox.checked && otherText && otherText.value.trim() !== '') {
            infoSource.push(`Другое: ${otherText.value.trim()}`);
        }
        result.infoSource = infoSource;
        result.timestamp = new Date().toISOString();

        hiddenJsonField.value = JSON.stringify(result, null, 2);
    });

    // Скачивание локального отчёта (без отправки)
    const downloadBtn = document.getElementById('downloadReportBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const result = {};
            const formData = new FormData(form);
            for (let [key, value] of formData.entries()) {
                if (key === 'answersJson') continue;
                if (['diagnostics', 'prevention', 'symptoms', 'consequences', 'drugs', 'fractures', 'infoSource'].includes(key)) continue;
                result[key] = value;
            }
            result.diagnostics = Array.from(document.querySelectorAll('input[name="diagnostics"]:checked')).map(cb => cb.value);
            result.prevention = Array.from(document.querySelectorAll('input[name="prevention"]:checked')).map(cb => cb.value);
            result.symptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked')).map(cb => cb.value);
            result.consequences = Array.from(document.querySelectorAll('input[name="consequences"]:checked')).map(cb => cb.value);
            result.drugs = Array.from(document.querySelectorAll('input[name="drugs"]:checked')).map(cb => cb.value);
            result.fractures = Array.from(document.querySelectorAll('input[name="fractures"]:checked')).map(cb => cb.value);
            let infoSrc = Array.from(document.querySelectorAll('input[name="infoSource"]:checked')).map(cb => cb.value);
            if (otherCheckbox && otherCheckbox.checked && otherText && otherText.value.trim() !== '') {
                infoSrc.push(`Другое: ${otherText.value.trim()}`);
            }
            result.infoSource = infoSrc;
            result.timestamp = new Date().toISOString();

            const jsonStr = JSON.stringify(result, null, 2);
            const blob = new Blob([jsonStr], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `osteoporosis_survey_${new Date().toISOString().slice(0,19)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
});