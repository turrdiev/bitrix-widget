(function(){
  BX.ready(function(){
    // Справочник: значение поля Департамент -> список шаблонов
    var templatesMap = {
      "IT": ["Сброс пароля", "Не работает ПК", "Настройка VPN"],
      "HR": ["Отпуск", "Командировка", "Новый сотрудник"],
      "Маркетинг": ["Рекламная кампания", "Подготовка презентации"]
    };

    function setTemplateOptions(editorInstance, depValue){
      try {
        // Попытка получить контрол поля по ID (код пользовательского поля)
        var tplControl = null;

        // Если передан объект field/editor стандартного формата - попробовать разные варианты
        if (editorInstance && typeof editorInstance.getControlById === 'function') {
          tplControl = editorInstance.getControlById("UF_CRM_TEMPLATE");
        }

        // Если не нашли через editorInstance — пробуем пройтись по глобальным редакторам
        if (!tplControl && window.BX && BX.Crm && BX.Crm.EntityEditor && BX.Crm.EntityEditor.items) {
          for (var k in BX.Crm.EntityEditor.items) {
            var ed = BX.Crm.EntityEditor.items[k];
            if (!ed) continue;
            try {
              var c = ed.getControlById && ed.getControlById("UF_CRM_TEMPLATE");
              if (c) { tplControl = c; break; }
            } catch(e){}
          }
        }

        if (!tplControl) {
          console.warn("dependent-lists: не найден контрол UF_CRM_TEMPLATE");
          return;
        }

        // Сброс значения
        try {
          if (tplControl._model && typeof tplControl._model.setField === 'function') {
            tplControl._model.setField("VALUE", "");
            // Некоторым версиям требуется именно так:
            tplControl._model.setField("ufValue", "");
          }
        } catch(e){}

        // Подготовка новых опций
        var items = (templatesMap[depValue] || []).map(function(v){
          return { VALUE: v, NAME: v };
        });

        // Вставляем в схему (в большинстве реализаций это работает)
        if (tplControl._schemeElement) {
          tplControl._schemeElement._items = items;
        } else if (tplControl.setItems) {
          try { tplControl.setItems(items); } catch(e){}
        }

        // Принудительно перерисовать контрол
        if (typeof tplControl.refreshLayout === 'function') {
          tplControl.refreshLayout();
        } else {
          // В крайнем случае вызвать обновление редактора целиком
          if (tplControl._editor && typeof tplControl._editor.refresh === 'function') {
            tplControl._editor.refresh();
          }
        }
      } catch (err) {
        console.error("dependent-lists error:", err);
      }
    }

    // Главный слушатель: получение изменения поля
    BX.addCustomEvent("BX.Crm.EntityEditor:onFieldChange", function(editor, field){
      try {
        // 1) Некоторые версии дают (editor, field)
        if (field && (field._id === "UF_CRM_DEPARTMENT" || field.getId && field.getId() === "UF_CRM_DEPARTMENT")) {
          var depVal = "";
          if (field._model && typeof field._model.getField === 'function') {
            // попробовать получить значение через модель
            depVal = field._model.getField("UF_CRM_DEPARTMENT") || field._model.getField("VALUE") || "";
          }
          // fallback: если есть getValue
          if (!depVal && typeof field.getValue === 'function') {
            depVal = field.getValue();
          }
          setTemplateOptions(editor, depVal);
          return;
        }

        // 2) Некоторые реализации передают один аргумент — объект event
        if (editor && editor.field && editor.field._id === "UF_CRM_DEPARTMENT") {
          var dv = editor.field._model && editor.field._model.getField ? editor.field._model.getField("UF_CRM_DEPARTMENT") : "";
          setTemplateOptions(null, dv);
          return;
        }
      } catch(e){
        console.error(e);
      }
    });
  });
})();
