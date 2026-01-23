export const normalizePhone = (phone: string): string => {
    let cleaned = phone.replace(/\D/g, '');

    // Remove leading zeros (e.g. 011...)
    cleaned = cleaned.replace(/^0+/, '');

    // Brazil logic: If 10 or 11 digits, assume BR and prepend 55
    if (cleaned.length === 10 || cleaned.length === 11) {
        cleaned = '55' + cleaned;
    }

    return cleaned;
};

export const hashPhone = async (phone: string): Promise<string> => {
    const normalized = normalizePhone(phone);
    const msgBuffer = new TextEncoder().encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};
