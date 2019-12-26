var I18n = function (lang) {
    this.lang = lang;
}

I18n.prototype.constructor = I18n;

I18n.prototype.t = function (property) {
    return TRANSLATION[this.lang][property];
}