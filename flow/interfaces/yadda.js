/* @flow */

declare function featureFile(): void;
declare function scenarios(): void;
declare function steps(): void;

declare module "yadda" {

    declare export type LibraryEnglish = {
        ['given' | 'when' | 'then']: (signature: string, fn: Function) => LibraryEnglish
    }
    declare type Dictionary = {
        define: (term, pattern, converters) => Dictionary
    }
    declare class Yadda {
        FeatureFileSearch(): void;
    }
    declare module.exports: {
        Yadda: Yadda,
        Dictionary: () => Dictionary,
        localisation: {
            English: {
                library: (dictionary?: Dictionary) => LibraryEnglish
            }
        },
        types: {
            LibraryEnglish: LibraryEnglish,
            Dictionary: Dictionary,
        }
    };
}
