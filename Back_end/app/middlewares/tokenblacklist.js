const blacklist = new Set();

module.exports = {
    addToken: (token) => blacklist.add(token),
    isBlacklisted: (token) => blacklist.has(token),
};
