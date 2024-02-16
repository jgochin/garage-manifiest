export const objectSortAscPredicate = (propName: string, a: any, b: any): number => {
    if(a[propName] > b[propName]) return 1
    if (a[propName] < b[propName]) return -1

    return 0
}