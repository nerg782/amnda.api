module.exports = {
	stores: {
		mongo: {
			connection: { uri: process.env.MONGODB_URI },
			adapter: 'mongoose',
			options: {
				poolSize: 10,
				reconnectTries: 30,
				reconnectInterval: 1000,
			},
		},
	},
	storeDefault: 'mongo',
};
