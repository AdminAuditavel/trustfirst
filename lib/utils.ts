export const normalizePhone = (phone: string): string => {
    return phone.replace(/\D/g, '');
};

export const hashPhone = async (phone: string): Promise<string> => {
    const normalized = normalizePhone(phone);
    const msgBuffer = new TextEncoder().encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};
