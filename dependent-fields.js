BX.ready(function() {
  const deps = {
    "338": [ // IT
      {id: "it_1", text: "Сброс пароля"},
      {id: "it_2", text: "Не работает ПК"},
      {id: "it_3", text: "Доступ к системе"}
    ],
    "339": [ // HR
      {id: "hr_1", text: "Заявка на отпуск"},
      {id: "hr_2", text: "Командировка"},
      {id: "hr_3", text: "Новый сотрудник"}
    ],
    "340": [ // Маркетинг
      {id: "m_1", text: "Запуск кампании"},
      {id: "m_2", text: "Бриф на дизайн"},
      {id: "m_3", text: "Реклама"}
    ]
  };

  const depField = document.querySelector('select[name="UF_CRM_1759607241"]');
  const tplField = document.querySelector('select[name="UF_CRM_1759607274"]');

  if (depField && tplField) {
    depField.addEventListener("change", function() {
      const depVal = this.value;
      tplField.innerHTML = '<option value="">не выбрано</option>'; // очистка

      if (deps[depVal]) {
        deps[depVal].forEach(t => {
          const opt = document.createElement("option");
          opt.value = t.id;
          opt.textContent = t.text;
          tplField.appendChild(opt);
        });
      }
    });
  }
});
