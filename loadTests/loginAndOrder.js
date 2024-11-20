import { sleep, check, group, fail } from 'k6'
import http from 'k6/http'

export const options = {
	cloud: {
		distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
		apm: [],
	},
	thresholds: {},
	scenarios: {
		Scenario_1: {
			executor: 'ramping-vus',
			gracefulStop: '30s',
			stages: [
				{ target: 5, duration: '30s' },
				{ target: 15, duration: '1m' },
				{ target: 10, duration: '30s' },
				{ target: 0, duration: '30s' },
			],
			gracefulRampDown: '30s',
			exec: 'scenario_1',
		},
	},
}

export function scenario_1() {
	let response
	const vars = {}

	group('Login and order - https://pizza.trakkup.com/', function () {
		// Homepage
		response = http.get('https://pizza.trakkup.com/', {
			headers: {
				accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
				'accept-encoding': 'gzip, deflate, br, zstd',
				'accept-language': 'en-US,en;q=0.9,da;q=0.8',
				'cache-control': 'max-age=0',
				dnt: '1',
				'if-modified-since': 'Wed, 30 Oct 2024 20:02:13 GMT',
				'if-none-match': '"96eef54ca1c2f663e2444bdb110da588"',
				priority: 'u=0, i',
				'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'document',
				'sec-fetch-mode': 'navigate',
				'sec-fetch-site': 'same-origin',
				'sec-fetch-user': '?1',
				'upgrade-insecure-requests': '1',
			},
		})
		sleep(24.5)

		// Login
		response = http.put('https://pizza-service.trakkup.com/api/auth', '{"email":"a@jwt.com","password":"admin"}', {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br, zstd',
				'accept-language': 'en-US,en;q=0.9,da;q=0.8',
				'content-type': 'application/json',
				dnt: '1',
				origin: 'https://pizza.trakkup.com',
				priority: 'u=1, i',
				'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-site',
			},
		})
		if (!check(response, { 'status equals 200': (response) => response.status.toString() === '200' })) {
			console.log(response.body)
			fail('Login was *not* 200')
		}
		vars['token1'] = jsonpath.query(response.json(), '$.token')[0]

		response = http.options('https://pizza-service.trakkup.com/api/auth', null, {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br, zstd',
				'accept-language': 'en-US,en;q=0.9,da;q=0.8',
				'access-control-request-headers': 'content-type',
				'access-control-request-method': 'PUT',
				origin: 'https://pizza.trakkup.com',
				priority: 'u=1, i',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-site',
			},
		})
		sleep(8.7)

		// Menu
		response = http.get('https://pizza-service.trakkup.com/api/order/menu', {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br, zstd',
				'accept-language': 'en-US,en;q=0.9,da;q=0.8',
				'content-type': 'application/json',
				dnt: '1',
				origin: 'https://pizza.trakkup.com',
				priority: 'u=1, i',
				'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-site',
			},
		})

		response = http.options('https://pizza-service.trakkup.com/api/order/menu', null, {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br, zstd',
				'accept-language': 'en-US,en;q=0.9,da;q=0.8',
				'access-control-request-headers': 'authorization,content-type',
				'access-control-request-method': 'GET',
				origin: 'https://pizza.trakkup.com',
				priority: 'u=1, i',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-site',
			},
		})

		// Franchise
		response = http.get('https://pizza-service.trakkup.com/api/franchise', {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br, zstd',
				'accept-language': 'en-US,en;q=0.9,da;q=0.8',
				'content-type': 'application/json',
				dnt: '1',
				origin: 'https://pizza.trakkup.com',
				priority: 'u=1, i',
				'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-site',
			},
		})

		response = http.options('https://pizza-service.trakkup.com/api/franchise', null, {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br, zstd',
				'accept-language': 'en-US,en;q=0.9,da;q=0.8',
				'access-control-request-headers': 'authorization,content-type',
				'access-control-request-method': 'GET',
				origin: 'https://pizza.trakkup.com',
				priority: 'u=1, i',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-site',
			},
		})
		sleep(12.8)

		// Purchase pizza
		response = http.post(
			'https://pizza-service.trakkup.com/api/order',
			'{"items":[{"menuId":2,"description":"Pepperoni","price":0.0042}],"storeId":"1","franchiseId":1}',
			{
				headers: {
					accept: '*/*',
					'accept-encoding': 'gzip, deflate, br, zstd',
					'accept-language': 'en-US,en;q=0.9,da;q=0.8',
					'content-type': 'application/json',
					dnt: '1',
					origin: 'https://pizza.trakkup.com',
					priority: 'u=1, i',
					'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'same-site',
				},
			}
		)

		response = http.options('https://pizza-service.trakkup.com/api/order', null, {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br, zstd',
				'accept-language': 'en-US,en;q=0.9,da;q=0.8',
				'access-control-request-headers': 'authorization,content-type',
				'access-control-request-method': 'POST',
				origin: 'https://pizza.trakkup.com',
				priority: 'u=1, i',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-site',
			},
		})
		sleep(2.2)

		// Verify pizza
		response = http.post('https://pizza-factory.cs329.click/api/order/verify', `{"jwt":"${vars['token1']}"}`, {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br, zstd',
				'accept-language': 'en-US,en;q=0.9,da;q=0.8',
				'content-type': 'application/json',
				dnt: '1',
				origin: 'https://pizza.trakkup.com',
				priority: 'u=1, i',
				'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'cross-site',
			},
		})

		response = http.options('https://pizza-factory.cs329.click/api/order/verify', null, {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br, zstd',
				'accept-language': 'en-US,en;q=0.9,da;q=0.8',
				'access-control-request-headers': 'authorization,content-type',
				'access-control-request-method': 'POST',
				origin: 'https://pizza.trakkup.com',
				priority: 'u=1, i',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'cross-site',
			},
		})
	})
}
