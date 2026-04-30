/**
 * Fetches address autocomplete suggestions from Nominatim (OpenStreetMap).
 * Free, no API key required. Results filtered to Missouri, USA.
 */
export async function fetchAddressSuggestions(query) {
    if (!query || query.trim().length < 3) return [];

    const params = new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        countrycodes: 'us',
        limit: '8',
        dedupe: '1',
    });

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?${params}`,
            {
                signal: AbortSignal.timeout(6000),
                headers: {
                    'User-Agent': 'mo-healthnet-medicaid-app/1.0',
                    'Accept-Language': 'en',
                },
            }
        );
        if (!response.ok) return [];

        const data = await response.json();

        return data
            .filter((item) => {
                const addr = item.address || {};
                return (
                    addr.state === 'Missouri' &&
                    (addr.road || addr.house_number) &&
                    (addr.city || addr.town || addr.village || addr.municipality) &&
                    addr.postcode
                );
            })
            .map((item) => {
                const addr = item.address;
                const streetParts = [addr.house_number, addr.road].filter(Boolean);
                const city = addr.city || addr.town || addr.village || addr.municipality || '';
                const zip = (addr.postcode || '').split('-')[0].trim().slice(0, 5);
                const street = streetParts.join(' ');
                return {
                    streetAddress: street,
                    city,
                    state: 'MO',
                    zipCode: zip,
                    displayLabel: [street, city, 'MO', zip].filter(Boolean).join(', '),
                };
            })
            .filter((item) => item.streetAddress && item.city && item.zipCode)
            // Deduplicate by displayLabel
            .filter((item, idx, arr) => arr.findIndex((x) => x.displayLabel === item.displayLabel) === idx)
            .slice(0, 6);
    } catch {
        return [];
    }
}

