export default function batchesOf(arr, batchLength) {
    return arr.reduce(
        (acc, item) => {
            if (acc[acc.length - 1].length === batchLength) acc.push([item])
            else acc[acc.length - 1].push(item)

            return acc
        },
        [[]]
    )
}
