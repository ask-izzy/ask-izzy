/*
 * Keeps the answers a "People also searched for" suggestion changes tied to
 * the browser history entries they were used on, so going back shows the
 * search the user had before clicking the suggestion (and going forward again
 * shows the suggestion's search).
 *
 * Answers are saved globally, not per page of history, and the results page
 * builds its search from them each time it's shown. So without this, going
 * back after a suggestion changed an answer would show the old page with the
 * suggestion's answers.
 *
 * Each history entry Next creates has a unique key in history.state. Before a
 * suggestion saves its answers we snapshot the current values of the answers
 * it's about to change against the current entry. When the user moves through
 * their history to an entry with a snapshot, we snapshot the same answers
 * against the entry they're leaving and then restore the one they're going
 * to, before Next renders it.
 *
 * Snapshots go in the same session store as the rest of the app's session
 * data so they're removed when the user clears their answers.
 *
 * See docs/other-services-panel.md § "Going back after clicking a suggestion"
 */

import type {NextRouter} from "next/router"

import storage from "@/src/storage"
import {sessionStore} from "@/src/storage/polyfill"

const SNAPSHOT_KEY_PREFIX = "answers-for-history-entry:"

// The raw saved value of each answer (null when unanswered)
type AnswersSnapshot = {[pageName: string]: string | null}

// The key and path of the history entry being shown. Tracked here because the
// browser has already switched to the new entry when popstate fires.
let currentHistoryEntryKey: string | null = null
let currentPath: string | null = null

// Pages built from the answers which need to know when they're restored
// without the URL changing (eg going back after a suggestion for the current
// category), since nothing else tells them to rebuild
const inPlaceRestoreListeners = new Set<() => void>()

function getCurrentPath(): string {
    return window.location.pathname + window.location.search +
        window.location.hash
}

function getHistoryEntryKey(): string | null {
    if (typeof window === "undefined") {
        return null
    }
    const key = window.history.state?.key
    return typeof key === "string" ? key : null
}

function readSnapshot(historyEntryKey: string): AnswersSnapshot | null {
    try {
        return JSON.parse(
            sessionStore.getItem(SNAPSHOT_KEY_PREFIX + historyEntryKey) ||
                "null"
        )
    } catch {
        return null
    }
}

function writeSnapshot(
    historyEntryKey: string,
    snapshot: AnswersSnapshot,
): void {
    try {
        sessionStore.setItem(
            SNAPSHOT_KEY_PREFIX + historyEntryKey,
            JSON.stringify(snapshot),
        )
    } catch {
        // Going back just won't restore answers if storage is full or blocked
    }
}

function takeSnapshot(pageNames: Iterable<string>): AnswersSnapshot {
    const snapshot: AnswersSnapshot = {}
    for (const pageName of pageNames) {
        snapshot[pageName] = storage.getItem(pageName) ?? null
    }
    return snapshot
}

function restoreSnapshot(snapshot: AnswersSnapshot): void {
    for (const [pageName, value] of Object.entries(snapshot)) {
        if (storage.getItem(pageName) === value) {
            continue
        }
        if (value === null) {
            storage.removeItem(pageName)
        } else {
            // Restoring isn't the user answering so isn't tracked
            storage.setItem(pageName, value, false)
        }
    }
}

// Snapshot the given answers against an entry, along with any answers already
// in its snapshot, so they all reflect what the entry shows now
function updateSnapshot(
    historyEntryKey: string,
    pageNames: Iterable<string>,
): void {
    const existing = readSnapshot(historyEntryKey) ?? {}
    writeSnapshot(
        historyEntryKey,
        takeSnapshot(new Set([...Object.keys(existing), ...pageNames])),
    )
}

/*
 * Remember the current values of answers which are about to be changed, so
 * they're restored if the user comes back to the page they're on now.
 */
export function rememberAnswersForCurrentPage(
    pageNames: Array<string>,
): void {
    const historyEntryKey = currentHistoryEntryKey ?? getHistoryEntryKey()
    if (historyEntryKey && pageNames.length > 0) {
        updateSnapshot(historyEntryKey, pageNames)
    }
}

/*
 * Restore remembered answers when the user goes back or forward. Returns a
 * function which stops doing so.
 *
 * This listens for popstate itself rather than using Next's beforePopState,
 * since Next ignores the first popstate event when the URL hasn't changed
 * (for Safari). Next's own listener is added first, when the router is
 * created, but only renders the new page after awaiting, so the answers are
 * restored before then.
 */
export function restoreAnswersOnHistoryNavigation(
    router: NextRouter,
): () => void {
    const updateCurrentEntry = () => {
        currentHistoryEntryKey = getHistoryEntryKey()
        currentPath = getCurrentPath()
    }
    updateCurrentEntry()
    router.events.on("routeChangeComplete", updateCurrentEntry)
    router.events.on("hashChangeComplete", updateCurrentEntry)

    const onPopState = () => {
        const fromKey = currentHistoryEntryKey
        const fromPath = currentPath
        updateCurrentEntry()
        const toKey = currentHistoryEntryKey
        const toSnapshot = toKey && readSnapshot(toKey)

        if (!toSnapshot || !fromKey || fromKey === toKey) {
            return
        }
        // So coming forward/back to this entry again shows what it shows now
        updateSnapshot(fromKey, Object.keys(toSnapshot))
        restoreSnapshot(toSnapshot)

        // When the path is the same nothing else tells the page to rebuild
        if (currentPath === fromPath) {
            inPlaceRestoreListeners.forEach(listener => listener())
        }
    }
    window.addEventListener("popstate", onPopState)

    return () => {
        router.events.off("routeChangeComplete", updateCurrentEntry)
        router.events.off("hashChangeComplete", updateCurrentEntry)
        window.removeEventListener("popstate", onPopState)
    }
}

/*
 * Call the listener when going back or forward restores answers but leaves
 * the URL the same. Returns a function which stops calling it.
 */
export function onAnswersRestoredInPlace(listener: () => void): () => void {
    inPlaceRestoreListeners.add(listener)
    return () => {
        inPlaceRestoreListeners.delete(listener)
    }
}
