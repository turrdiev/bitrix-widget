BX.ready(function() {
    var departmentField = document.querySelector('select[name="UF_CRM_1759346943503"]'); // Департамент
    var requestTypeField = document.querySelector('select[name="UF_CRM_1759347755474"]'); // Тип заявки

    if (!departmentField || !requestTypeField) return;

    // Сохраняем все варианты
    var allOptions = Array.from(requestTypeField.options);

    // Словарь: ID департамента → префикс
    var deptMap = {
        "294": "IT",
        "295": "HR",
        "296": "RND"
    };

    function filterOptions() {
        var selectedDept = departmentField.value;
        var prefix = deptMap[selectedDept];
        var newOptions = [allOptions[0]]; // "не выбрано"

        if (prefix) {
            allOptions.forEach(function(opt) {
                if (!opt.value) return;
                var text = opt.textContent.trim();
                if (text.startsWith(prefix)) {
                    newOptions.push(opt);
                }
            });
        }

        // Перерисовываем список
        requestTypeField.innerHTML = "";
        newOptions.forEach(function(opt) {
            requestTypeField.appendChild(opt.cloneNode(true));
        });
        requestTypeField.value = "";
    }

    // Первичный запуск
    filterOptions();

    // На смену департамента
    departmentField.addEventListener('change', filterOptions);
});
