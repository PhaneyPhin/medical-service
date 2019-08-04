var connectionString = {
    host: '203.150.210.26',
    port: '5432',
    user: 'postgres',
    password: 'db@tcp26',
    database: 'medical_center'
}

exports.secret = 'worldisfullofdevelopers'
// exports.secret = 'wefFv940jke#'

exports.connectionString = () => {
    return connectionString;
};

