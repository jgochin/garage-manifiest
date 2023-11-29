export function buildUrl(baseUrl: string, routeParams: string[] = [], queryStringParams: object = {}): string {
    const route: string = routeParams.join('/')
    const query: string = buildQueryStringFromObject(queryStringParams)

    return `${baseUrl}${route ? '/' + route : ''}${query}`
}

export function buildQueryStringFromObject(queryStringParams:object = {}): string {
    const tuples: [string, any][] = Object.entries(queryStringParams)
    const queryString: string = tuples.reduce((qs: string[], qp: string[]) => {
        const [key, value] = qp
        const queryParam = `${key}=${value}`
        
        qs.push(queryParam)
        
        return qs
    }, []).join('&')

    return queryString ? `?${queryString}` : ''
}