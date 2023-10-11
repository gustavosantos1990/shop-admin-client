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
}

export function createWhatsAppLink(number) {
    var onlyNumbers = number.replace(/\D/g, '');
    return "https://api.whatsapp.com/send?phone=55" + onlyNumbers;
}