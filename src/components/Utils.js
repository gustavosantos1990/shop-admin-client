export function isValid(value) {
    return value !== undefined && value !== null
};

export function isInvalid(value) {
    return value === undefined || value === null
};

export function formatToBRCurrency(value, minFractionDigits, maxFractionDigits) {
    var brlCurrencyOptions = {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: minFractionDigits,
        maximumFractionDigits: maxFractionDigits
    };
    return new Intl.NumberFormat('pt-BR', brlCurrencyOptions).format(value)
};

export function formatToBRDateTime(value) {
    if (!value || value === null) return null;

    var brDateTimeOptions = {
        timezone: "America/Sao_Paulo",
        timeStyle: "short",
        dateStyle: "short"
    };
    return new Intl.DateTimeFormat('pt-BR', brDateTimeOptions).format(new Date(value))
}

export function formatToBRDate(date) {
    if (!date || date === null) return null;
    var brDateTimeOptions = { dateStyle: "short" };
    return new Intl.DateTimeFormat('pt-BR', brDateTimeOptions).format(convertDate(date))
}

export function convertDate(dateAsString) {
    var date = new Date(dateAsString);
    date.setDate(date.getDate() + 1);
    return date;
};

export function convertAndFormatDate(dateAsString) {
    var date = convertDate(dateAsString);
    return formatToBRDate(date);
};

export function parseDate(dateAsString) {
    var date = new Date(dateAsString);
    date.setDate(date.getDate() + 1);
    return date;
};

export function extractDigitsFromString(str) {
    return str.replace(/\D/g, '');
}

export function createWhatsAppLink(number) {
    var onlyNumbers = extractDigitsFromString(number);
    return "https://api.whatsapp.com/send?phone=55" + onlyNumbers;
};

export function applyPhoneMask(phone) {
    return phone.length > 10
        ? phone.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
        : phone.replace(/^(\d{2})(\d{4;})(\d{4}).*/, '($1) $2-$3')
};

export const currencyProperties = {
    mode: "currency",
    currency: "BRL",
    locale: "pt-BR",
    minFractionDigits: 2,
    maxFractionDigits: 2
};