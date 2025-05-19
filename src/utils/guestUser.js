export const ensureGuestId = () => {
    let guestId = localStorage.getItem('guest_id');

    if (!guestId) {
        guestId = 'guest_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('guest_id', guestId);
    }

    return guestId;
};
