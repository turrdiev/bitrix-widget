console.log("Custom script for Bitrix24 loaded...");

(function() {
    // Подождём, пока карточка сделки полностью загрузится
    document.addEventListener("DOMContentLoaded", function () {
        console.log("Bitrix24 DOM ready...");

        // Находим селекты
        const depSelect = document.querySelector("select[name='UF_CRM_1759346943503']"); // департамент
        const reqSelect = document.querySelector("select[name='UF_CRM_1759347755474']"); // тип заявки

        if (!depSelect || !reqSelect) {
            console.error("Не найдены селекты!");
            return;
        }

        // Сохраняем все опции заявок
        const allOptions = Array.from(reqSelect.options);

        function filterRequests() {
            const dep = depSelect.options[depSelect.selectedIndex].text.trim();
            console.log("Выбран департамент:", dep);

            // очищаем заявки
            reqSelect.innerHTML = "";

            // добавляем "не выбрано"
            reqSelect.appendChild(new Option("не выбрано", ""));

            // фильтруем по департаменту
            allOptions.forEach(opt => {
                if (opt.value === "") return; // пропускаем пустую
                if (opt.text.startsWith(dep)) {
                    reqSelect.appendChild(opt.cloneNode(true));
                }
            });
        }

        // запускаем при выборе департамента
        depSelect.addEventListener("change", filterRequests);

        // запускаем сразу при загрузке (если уже выбран департамент)
        filterRequests();
    });
})();
