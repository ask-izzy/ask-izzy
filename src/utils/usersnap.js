/* @flow */

export const openUserSnap = (event: SyntheticInputEvent<>): void => {
    event.preventDefault();
    window.Usersnap.logEvent("display_menu");
}