module.exports = {
	require: [
		'test/mocha.env.js',
		'@babel/register',
		'regenerator-runtime/runtime'
	],
	exit: true,
	bail: true,
	timeout: 1000 * 20,
    "node-option": [
        "experimental-specifier-resolution=node",
        "loader=ts-node/esm"
    ]
}
