const bcr = require('bcryptjs');

const hashingPassword = (password) => {
    let salt = bcr.genSaltSync(10);
    let newPassword = bcr.hashSync(password, salt);
    return newPassword;
};

const checkPassword = (password, hashPassword) => {
    return bcr.compareSync(password, hashPassword);
}

module.exports = {
    hashingPassword, checkPassword
}