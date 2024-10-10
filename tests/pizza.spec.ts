import { test, expect } from 'playwright-test-coverage'

test('home page', async ({ page }) => {
	await page.goto('/')

	expect(await page.title()).toBe('JWT Pizza')
})

test('purchase with login', async ({ page }) => {
	await page.route('*/**/api/order/menu', async (route) => {
		const menuRes = [
			{ id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
			{ id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
		]
		expect(route.request().method()).toBe('GET')
		await route.fulfill({ json: menuRes })
	})

	await page.route('*/**/api/franchise', async (route) => {
		const franchiseRes = [
			{
				id: 2,
				name: 'LotaPizza',
				stores: [
					{ id: 4, name: 'Lehi' },
					{ id: 5, name: 'Springville' },
					{ id: 6, name: 'American Fork' },
				],
			},
			{ id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
			{ id: 4, name: 'topSpot', stores: [] },
		]
		expect(route.request().method()).toBe('GET')
		await route.fulfill({ json: franchiseRes })
	})

	await page.route('*/**/api/auth', async (route) => {
		const loginReq = { email: 'd@jwt.com', password: 'a' }
		const loginRes = {
			user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] },
			token: 'abcdef',
		}
		expect(route.request().method()).toBe('PUT')
		expect(route.request().postDataJSON()).toMatchObject(loginReq)
		await route.fulfill({ json: loginRes })
	})

	await page.route('*/**/api/order', async (route) => {
		const orderReq = {
			items: [
				{ menuId: 1, description: 'Veggie', price: 0.0038 },
				{ menuId: 2, description: 'Pepperoni', price: 0.0042 },
			],
			storeId: '4',
			franchiseId: 2,
		}
		const orderRes = {
			order: {
				items: [
					{ menuId: 1, description: 'Veggie', price: 0.0038 },
					{ menuId: 2, description: 'Pepperoni', price: 0.0042 },
				],
				storeId: '4',
				franchiseId: 2,
				id: 23,
			},
			jwt: 'eyJpYXQ',
		}
		expect(route.request().method()).toBe('POST')
		expect(route.request().postDataJSON()).toMatchObject(orderReq)
		await route.fulfill({ json: orderRes })
	})

	await page.goto('/')

	// Go to order page
	await page.getByRole('button', { name: 'Order now' }).click()

	// Create order
	await expect(page.locator('h2')).toContainText('Awesome is a click away')
	await page.getByRole('combobox').selectOption('4')
	await page.getByRole('link', { name: 'Image Description Veggie A' }).click()
	await page.getByRole('link', { name: 'Image Description Pepperoni' }).click()
	await expect(page.locator('form')).toContainText('Selected pizzas: 2')
	await page.getByRole('button', { name: 'Checkout' }).click()

	// Login
	await page.getByPlaceholder('Email address').click()
	await page.getByPlaceholder('Email address').fill('d@jwt.com')
	await page.getByPlaceholder('Email address').press('Tab')
	await page.getByPlaceholder('Password').fill('a')
	await page.getByRole('button', { name: 'Login' }).click()

	// Pay
	await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!')
	await expect(page.locator('tbody')).toContainText('Veggie')
	await expect(page.locator('tbody')).toContainText('Pepperoni')
	await expect(page.locator('tfoot')).toContainText('0.008 ₿')
	await page.getByRole('button', { name: 'Pay now' }).click()

	// Check balance
	await expect(page.getByText('0.008')).toBeVisible()
})

test('test routes', async ({ page }) => {
	await page.goto('http://localhost:5173/')
	await page.getByRole('contentinfo').getByRole('link', { name: 'Franchise' }).click()
	await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?')
	await page.getByRole('link', { name: 'About' }).click()
	await expect(page.getByRole('main')).toContainText('The secret sauce')
	await page.getByRole('link', { name: 'History' }).click()
	await expect(page.getByRole('heading')).toContainText('Mama Rucci, my my')
})

test('admin login create store', async ({ page }) => {
	await page.route('*/**/api/auth', async (route) => {
		const loginReq = { email: 'a@jwt.com', password: 'admin' }
		const loginRes = {
			user: {
				id: 1,
				name: '常用名字',
				email: 'a@jwt.com',
				roles: [
					{
						objectId: 18,
						role: 'franchisee',
					},
					{
						role: 'admin',
					},
				],
			},
			token:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IuW4uOeUqOWQjeWtlyIsImVtYWlsIjoiYUBqd3QuY29tIiwicm9sZXMiOlt7Im9iamVjdElkIjoxOCwicm9sZSI6ImZyYW5jaGlzZWUifSx7InJvbGUiOiJhZG1pbiJ9XSwiaWF0IjoxNzI4NTIyNjE4fQ.pQ-e6gPJUkuJ1xTIqGg_FWNV1h3iwyPoqxDyNVzX6W0',
		}
		expect(route.request().method()).toBe('PUT')
		expect(route.request().postDataJSON()).toMatchObject(loginReq)
		await route.fulfill({ json: loginRes })
	})
	let getCounter = 0
	await page.route('*/**/api/franchise', async (route) => {
		if (route.request().method() == 'POST') {
			const loginReq = {
				stores: [],
				name: 'Bropkyasd',
				admins: [
					{
						email: 'a@jwt.com',
					},
				],
			}
			const loginRes = {
				stores: [],
				name: 'Bropkyasd',
				admins: [
					{
						email: 'a@jwt.com',
						id: 1,
						name: '常用名字',
					},
				],
				id: 58,
			}
			expect(route.request().method()).toBe('POST')
			expect(route.request().postDataJSON()).toMatchObject(loginReq)
			await route.fulfill({ json: loginRes })
		}
		if (route.request().method() == 'GET') {
			const loginRes = [
				{
					id: 58,
					name: 'Bropkyasd',
					admins: [
						{
							id: 1,
							name: '常用名字',
							email: 'a@jwt.com',
						},
					],
					stores: [],
				},
			]
			await route.fulfill({ json: getCounter == 2 ? loginRes : [] })
			getCounter++
		}
	})

	await page.goto('http://localhost:5173/')
	await page.getByRole('link', { name: 'Login' }).click()
	await page.getByPlaceholder('Email address').click()
	await page.getByPlaceholder('Email address').fill('a@jwt.com')
	await page.getByPlaceholder('Password').click()
	await page.getByPlaceholder('Password').fill('admin')
	await page.getByRole('button', { name: 'Login' }).click()
	await page.getByRole('link', { name: 'Admin' }).click()
	await page.getByRole('button', { name: 'Add Franchise' }).click()
	await page.getByPlaceholder('franchise name').click()
	await page.getByPlaceholder('franchise name').fill('Bropkyasd')
	await page.getByPlaceholder('franchisee admin email').click()
	await page.getByPlaceholder('franchisee admin email').fill('a@jwt.com')
	await page.getByRole('button', { name: 'Create' }).click()
})

test('docs test', async ({ page }) => {
	await page.goto('http://localhost:5173/docs')

	await expect(page.getByRole('main')).toContainText('factory: https://pizza-factory.cs329.click')
})

test('diner dash test', async ({ page }) => {
	await page.goto('http://localhost:5173')
	await page.getByRole('link', { name: 'Register' }).click()
	await page.getByPlaceholder('Full name').fill('sd')
	await page.getByPlaceholder('Full name').click()
	await page.getByPlaceholder('Full name').fill('sdfdssdf')
	await page.getByPlaceholder('Email address').click()
	await page.getByPlaceholder('Email address').fill('ds@gma.com')
	await page.getByPlaceholder('Password').click()
	await page.getByPlaceholder('Password').fill('1234556')
	await page.getByRole('button', { name: 'Register' }).click()
	await page.getByRole('link', { name: 's', exact: true }).click()
	await expect(page.getByRole('heading')).toContainText('Your pizza kitchen')
})

test('register exists already test', async ({ page }) => {
	await page.goto('http://localhost:5173')
	await page.getByRole('link', { name: 'Register' }).click()
	await page.getByPlaceholder('Full name').fill('test')
	await page.getByPlaceholder('Email address').click()
	await page.getByPlaceholder('Email address').fill('a@jwt.com')
	await page.getByPlaceholder('Password').click()
	await page.getByPlaceholder('Password').fill('admin')
	await page.getByRole('button', { name: 'Register' }).click()
	await page.getByRole('link', { name: 't', exact: true }).click()
	await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click()
	await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?')
	await page.getByRole('link', { name: 'login' }).click()
	await page.getByPlaceholder('Email address').fill('a@jwt.com')
	await page.getByPlaceholder('Password').click()
	await page.getByPlaceholder('Password').fill('admin')
	await page.getByRole('button', { name: 'Login' }).click()
	await page.getByRole('button', { name: 'Create store' }).click()
	await page.getByPlaceholder('store name').click()
	await page.getByPlaceholder('store name').fill('borke')
	await page.getByRole('button', { name: 'Create' }).click()
	await page.getByRole('button', { name: 'Close' }).click()
	await page.getByRole('button', { name: 'Close' }).click()
})

test('register and not found test', async ({ page }) => {
	await page.route('*/**/api/auth', async (route) => {
		if (route.request().method() == 'DELETE') {
			const loginRes = {
				message: 'logout successful',
			}
			await route.fulfill({ json: loginRes })
		}
		if (route.request().method() == 'POST') {
			const loginRes = {
				user: {
					name: 'asd',
					email: 'ads@gmail.com',
					roles: [
						{
							role: 'diner',
						},
					],
					id: 151,
				},
				token:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYXNkIiwiZW1haWwiOiJhZHNAZ21haWwuY29tIiwicm9sZXMiOlt7InJvbGUiOiJkaW5lciJ9XSwiaWQiOjE1MSwiaWF0IjoxNzI4NTk3OTkzfQ.PRTKuygPLTloMxyQ_dqO4NLGK_aOpiR-RavyaO-yZ6k',
			}
			await route.fulfill({ json: loginRes })
		}
	})
	await page.goto('http://localhost:5173/docs2')
	await expect(page.getByRole('main')).toContainText(
		'It looks like we have dropped a pizza on the floor. Please try another page.'
	)
	await page.getByRole('link', { name: 'Register' }).click()
	await page.getByPlaceholder('Full name').click()
	await page.getByPlaceholder('Full name').fill('asd')
	await page.getByPlaceholder('Email address').click()
	await page.getByPlaceholder('Email address').fill('ads@gmail.com')
	await page.getByPlaceholder('Password').click()
	await page.getByPlaceholder('Password').fill('12345')
	await page.getByRole('button', { name: 'Register' }).click()
	await expect(page.getByRole('heading')).toContainText("The web's best pizza")
	await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click()
	await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?')
	await page.getByRole('link', { name: 'Order' }).click()
	await page.getByRole('link', { name: 'Logout' }).click()
	await expect(page.getByRole('heading')).toContainText("The web's best pizza")
})
