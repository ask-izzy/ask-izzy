export function ReturnAfter<U>(
    milliseconds: number,
    result: U,
): Promise<U> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(result)
        }, milliseconds);
    });
}

function Infallible<U>(
    other: Promise<U>,
    defaultValue: U,
): Promise<U> {
    return new Promise((resolve) => {
        other
            .then(resolve)
            .catch(() => resolve(defaultValue));
    });
}

function FailAfter(milliseconds: number): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error(`Timed out after ${milliseconds}ms`));
        }, milliseconds);
    });
}

function TimeoutWithDefault<U>(
    milliseconds: number,
    other: Promise<U>,
    defaultValue: U,
): Promise<U> {
    return Promise.race([
        ReturnAfter(milliseconds, defaultValue),
        other,
    ]);
}

export function Timeout<U>(
    milliseconds: number,
    other: Promise<U>,
): Promise<U> {
    return Promise.race([
        FailAfter(milliseconds),
        other,
    ]);
}

export function TryWithDefault<U>(
    milliseconds: number,
    other: Promise<U>,
    defaultValue: U,
): Promise<U> {
    return TimeoutWithDefault(
        milliseconds,
        Infallible(other, defaultValue),
        defaultValue,
    );
}
