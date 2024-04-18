export function extractRGB(rgbString) {
    // Используем регулярное выражение для поиска чисел внутри скобок
    const regex = /(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})/;
    const matches = rgbString.match(regex);

    if (matches && matches.length === 4) {
        // matches[0] содержит весь найденный текст, а matches[1], matches[2], matches[3]
        // содержат значения R, G и B соответственно
        const R = parseInt(matches[1]);
        const G = parseInt(matches[2]);
        const B = parseInt(matches[3]);
        return [R, G, B];
    } else {
        // Если нет совпадений или формат не соответствует ожидаемому, возвращаем null
        return null;
    }
}

// Функция для конвертирования RGB в XYZ
export function rgbToXyz(rgb) {
    let r = rgb[0] / 255;
    let g = rgb[1] / 255;
    let b = rgb[2] / 255;

    // Применяем обратное гамма-преобразование sRGB
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    // Преобразование в XYZ
    const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
    const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

    // Возвращаем строку с округленными значениями и пробелами между ними
    return `${Math.round(x * 100)} ${Math.round(y * 100)} ${Math.round(z * 100)}`;
}

// Функция для конвертирования RGB в Lab
export function rgbToLab(rgb) {
    const [x, y, z] = rgbToXyz(rgb);

    const xRef = 95.0489;
    const yRef = 100.0000;
    const zRef = 108.8840;

    const fx = x / xRef > 0.008856 ? Math.cbrt(x / xRef) : 7.787 * (x / xRef) + 16 / 116;
    const fy = y / yRef > 0.008856 ? Math.cbrt(y / yRef) : 7.787 * (y / yRef) + 16 / 116;
    const fz = z / zRef > 0.008856 ? Math.cbrt(z / zRef) : 7.787 * (z / zRef) + 16 / 116;

    const L = 116 * fy - 16;
    const a = 500 * (fx - fy);
    const b = 200 * (fy - fz);

    return `${Math.round(L * 100) / 100} ${Math.round(a * 100) / 100} ${Math.round(b * 100) / 100}`;}

    export function calculateContrast(color1, color2) {
        const rgb1 = color1.map(channel => channel / 255);
        const rgb2 = color2.map(channel => channel / 255);
        const L1 = calculateLuminance(rgb1);
        const L2 = calculateLuminance(rgb2);
        const contrast = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        return contrast >= 4.5 ? `${contrast.toFixed(2)}:1` : `${contrast.toFixed(2)}:1 (недостаточный)`;
    }
    
    export function calculateLuminance(rgb) {
        const [R, G, B] = rgb.map(channel => {
            channel = channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
            return channel;
        });
    
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    }