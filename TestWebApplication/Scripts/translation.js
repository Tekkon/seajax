var I18n = function (lang) {
    this.lang = lang;
}

I18n.prototype.constructor = I18n;

I18n.prototype.t = function (property) {
    return TRANSLATION[this.lang][property];
}
var TRANSLATION = {}

var i18n = new I18n("ru");
TRANSLATION.en = {
    sort: "Sort:",
    sort1: "Sort: ",
    sortQuantity: "Sort: Quantity",
    sortAZ: "Sort: A-Z",
    unrecognizedFacet: "Unrecognized facet type in details pane: ",
    unrecognizedFacet1: "Unrecognized facet type ",
    search: "Search...",
    noInfo: "(no info)",
    parsingJsonError: "Error in parsing JSON from content endpoint",
    receivedFailureCode: "Received failure code from server-side renderer",
    parsingJsonFailed: "Failed to parse JSON response from server.",
    postCollectionDataFailed: "Failed to post collection data. Status text: ",
    unrecognizedTemplateType: "updateTemplate: unrecognized template type",
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",
    notApplicable: "Not Currently Applicable",
    under: "Under ",
    over: "Over ",
    exactly: "Exactly "
}
TRANSLATION.ru = {
    sort: "Сортировка:",
    sort1: "Сортировка: ",
    sortQuantity: "Сортировка: Количество",
    sortAZ: "Сортировка: А-Я",
    unrecognizedFacet: "Неопознанный тип фасета в панели деталей: ",
    unrecognizedFacet1: "Неопознанный тип фасета ",
    search: "Поиск...",
    noInfo: "(нет данных)",
    parsingJsonError: "Ошибка в парсинге JSON",
    receivedFailureCode: "Получен код ошибки со стороны сервера",
    parsingJsonFailed: "Не удалось распарсить JSON-ответ от сервера.",
    postCollectionDataFailed: "Не удалось отправить данные коллекции. Текст ошибки: ",
    unrecognizedTemplateType: "updateTemplate: не опознан тип шаблона",
    january: "Январь",
    february: "February",
    march: "Март",
    april: "Апрель",
    may: "Май",
    june: "Июнь",
    july: "Июль",
    august: "Август",
    september: "Сентябрь",
    october: "Октябрь",
    november: "Ноябрь",
    december: "Декабрь",
    notApplicable: "Не применимо в данный момент",
    under: "Менее ",
    over: "Более ",
    exactly: "Ровно "
}