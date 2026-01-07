document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const modeSelect = document.getElementById('conversion-type');
    const inputWrapperMarks = document.getElementById('wrapper-marks-obtained');
    const inputWrapperCgpa = document.getElementById('wrapper-cgpa');
    const inputWrapperMaxMarks = document.getElementById('wrapper-max-marks');

    const inputMarks = document.getElementById('marks-obtained');
    const inputCgpa = document.getElementById('cgpa-input');
    const inputMaxMarks = document.getElementById('max-marks');

    const resultValue = document.getElementById('result-value');
    const resetBtn = document.getElementById('reset-btn');

    // Modes
    const MODE_MARKS_TO_CGPA = 'marks-to-cgpa';
    const MODE_CGPA_TO_PERCENTAGE = 'cgpa-to-percentage';
    const MODE_CGPA_TO_MARKS = 'cgpa-to-marks';

    function updateLayout() {
        const mode = modeSelect.value;

        // Hide all first
        inputWrapperMarks.classList.add('hidden');
        inputWrapperCgpa.classList.add('hidden');
        inputWrapperMaxMarks.classList.add('hidden');

        // Show relevant
        if (mode === MODE_MARKS_TO_CGPA) {
            inputWrapperMarks.classList.remove('hidden');
            inputWrapperMaxMarks.classList.remove('hidden');
            inputMarks.placeholder = "e.g. 450";
        } else if (mode === MODE_CGPA_TO_PERCENTAGE) {
            inputWrapperCgpa.classList.remove('hidden');
            // Percentage mode only needs CGPA
        } else if (mode === MODE_CGPA_TO_MARKS) {
            inputWrapperCgpa.classList.remove('hidden');
            inputWrapperMaxMarks.classList.remove('hidden');
        }

        // Trigger calculation to clear or update result based on new visibility
        calculate();
    }

    function calculate() {
        const mode = modeSelect.value;
        let result = 0;
        let suffix = '';

        const maxMarks = parseFloat(inputMaxMarks.value);
        const marks = parseFloat(inputMarks.value);
        const cgpa = parseFloat(inputCgpa.value);

        if (mode === MODE_MARKS_TO_CGPA) {
            if (isValid(marks) && isValid(maxMarks) && maxMarks !== 0) {
                result = (marks / maxMarks) * 10;
                suffix = ' CGPA';
                // Cap at 10 if logical, but formula is raw. 
                // Usually CGPA is out of 10. Let's just output the math.
            } else {
                showResult('--');
                return;
            }
        } else if (mode === MODE_CGPA_TO_PERCENTAGE) {
            if (isValid(cgpa)) {
                result = cgpa * 9.5;
                suffix = '%';
            } else {
                showResult('--');
                return;
            }
        } else if (mode === MODE_CGPA_TO_MARKS) {
            if (isValid(cgpa) && isValid(maxMarks)) {
                result = (cgpa / 10) * maxMarks;
                suffix = ' Marks';
            } else {
                showResult('--');
                return;
            }
        }

        // Formatting
        // If result is integer, no decimals. Else 2 decimals.
        const formatted = Number.isInteger(result) ? result : result.toFixed(2);
        showResult(formatted + suffix);
    }

    function isValid(num) {
        return !isNaN(num) && num >= 0;
    }

    function showResult(text) {
        resultValue.textContent = text;
    }

    function reset() {
        inputMarks.value = '';
        inputCgpa.value = '';
        inputMaxMarks.value = '500'; // Default
        modeSelect.value = MODE_MARKS_TO_CGPA;
        updateLayout();
        showResult('--');
    }

    // Listeners
    modeSelect.addEventListener('change', updateLayout);

    [inputMarks, inputCgpa, inputMaxMarks].forEach(input => {
        input.addEventListener('input', calculate);
    });

    resetBtn.addEventListener('click', reset);

    // Init
    updateLayout();
});
