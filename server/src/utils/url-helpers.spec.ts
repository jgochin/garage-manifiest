import { buildUrl, buildQueryStringFromObject } from './url-helpers'

describe('Testing url-helpers', () => {
    describe('buildUrl', () => {
        test('should build a URL with route params and query string params', () => {
            const baseUrl = 'https://example.com'
            const routeParams = ['users', '123']
            const queryStringParams = {
                name: 'John',
                age: 25
            }
            const expectedUrl = 'https://example.com/users/123?name=John&age=25'
            const actualUrl = buildUrl(baseUrl, routeParams, queryStringParams)

            expect(actualUrl).toBe(expectedUrl)
        })

        test('should build a URL with only route params', () => {
            const baseUrl = 'https://example.com'
            const routeParams = ['users', '123']
            const expectedUrl = 'https://example.com/users/123'
            const actualUrl = buildUrl(baseUrl, routeParams)

            expect(actualUrl).toBe(expectedUrl)
        })

        test('should build a URL with only query string params', () => {
            const baseUrl = 'https://example.com'
            const queryStringParams = {
                name: 'John',
                age: 25
            }
            const expectedUrl = 'https://example.com?name=John&age=25'
            const actualUrl = buildUrl(baseUrl, [], queryStringParams)

            expect(actualUrl).toBe(expectedUrl)
        })

        test('should return the base URL when no route params or query string params are provided', () => {
            const baseUrl = 'https://example.com'
            const expectedUrl = 'https://example.com'
            const actualUrl = buildUrl(baseUrl)

            expect(actualUrl).toBe(expectedUrl)
        })


    })

    describe('buildQueryStringFromObject', () => {
        test('should build a query string from an object', () => {
            const queryStringParams = {
                name: 'John',
                age: 25
            }

            const expectedQueryString = '?name=John&age=25'
            const actualQueryString = buildQueryStringFromObject(queryStringParams)

            expect(actualQueryString).toBe(expectedQueryString)
        })

        test('should return an empty string when no query string params are provided', () => {
            const expectedQueryString = ''
            const actualQueryString = buildQueryStringFromObject()

            expect(actualQueryString).toBe(expectedQueryString)
        })
    })
})