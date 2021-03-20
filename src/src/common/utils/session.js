module.exports = {
	get: function (key) {
		return uni.getStorageSync(key) || null;
	},

	set: function (key, value) {
		uni.setStorageSync(key, value);
	},

	clear: function (key) {
		uni.removeStorageSync(key);
	},

	clearAll: function () {
		uni.clearStorage()
	},
	/**
	 * 
	 * @param {String} key 键
	 * @param {*} value 值
	 * @param {Number} seconds 过期时间 s
	 * @returns 
	 */
	cache: function (key, value, seconds) {
		var timestamp = Date.parse(new Date()) / 1000
		//console.log(timestamp + "===" + key)
		if (key && value === null || value === undefined) {
			//删除缓存
			//获取缓存
			var val = uni.getStorageSync(key);
			var tmp = val.split("|")
			if (!tmp[1] || timestamp >= tmp[1]) {
				// console.log("key已失效")
				uni.removeStorageSync(key)
				return null
			} else {
				// console.log("key未失效")
				return tmp[0]
			}
		} else if (key && value) {
			//设置缓存
			if (!seconds) {
				var expire = timestamp + (3600 * 24 )
			} else {
				var expire = timestamp + seconds
			}
			value = value + "|" + expire
			uni.setStorageSync(key, value);
		} else {
			console.log("key不能空")
		}
	}
}