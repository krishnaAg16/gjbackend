const upiIds = [
    'upi1@okaxis',
    'upi2@okhdfcbank',
    'upi3@oksbi',
    'upi4@okicici'
];

const upiUsage = {}; // In-memory usage tracker

const selectUPI = (amount) => {
    if (!amount || isNaN(amount) || amount <= 0) return upiIds[0];

    let sortedUpis = [...upiIds].sort((a, b) => {
        const totalA = upiUsage[a]?.total || 0;
        const totalB = upiUsage[b]?.total || 0;
        return totalA - totalB;
    });

    for (let upi of sortedUpis) {
        const usage = upiUsage[upi] || { count: 0, total: 0 };
        if (usage.count < 5 && usage.total + amount <= 1000) {
            usage.count += 1;
            usage.total += amount;
            upiUsage[upi] = usage;
            return upi;
        }
    }

    const fallback = sortedUpis[0];
    upiUsage[fallback] = upiUsage[fallback] || { count: 0, total: 0 };
    upiUsage[fallback].count += 1;
    upiUsage[fallback].total += amount;
    return fallback;
};

export const generateQR = async ({ name, amount, note }) => {
    const selectedUPI = selectUPI(amount);
    const upi = `upi://pay?pa=${selectedUPI}&pn=${name}&am=${amount}&cu=INR&tn=${note}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upi)}&size=30x30`;
    return {
        qrUrl,
        selectedUPI
    };
};
