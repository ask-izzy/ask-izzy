/* @flow */

export default function Timeout<U>(
    milliseconds: number,
    other: Promise<U>
): Promise<U> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(`Timed out after ${milliseconds}ms`)
        }, milliseconds);
        other.then(resolve);
    });
}
