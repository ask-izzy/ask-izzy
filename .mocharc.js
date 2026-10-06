/* $FlowIgnore */
module.exports = {
	require: [
		'test/mocha.env.js',
		'./babel-register.js',
		'regenerator-runtime/runtime'
	],
	exit: true,
	bail: true,
	timeout: 1000 * 20
}
