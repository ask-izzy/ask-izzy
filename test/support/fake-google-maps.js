/* eslint-env browser */
/*
 * A fake of the parts of the Google Maps JavaScript API that Ask Izzy uses,
 * served in place of the real script in the e2e tests so they never depend on
 * Google (see fakeGoogleMaps() in test/e2e/run-features.ts).
 *
 * Services answer like a keyless real API does (REQUEST_DENIED). Scenarios
 * that need results register mocks in window.googleMocks, which the app merges
 * over this (see src/maps.ts), eg "googles directions matrix will return".
 *
 * Map and Marker are plain constructor functions rather than classes since
 * the map steps wrap them with RealMap.apply(this, args) (see instrumentMap()
 * in test/e2e/steps/maps.ts).
 */
(function() {
    const listeners = new WeakMap()

    const event = {
        addListener(instance, eventName, handler) {
            if (!listeners.has(instance)) {
                listeners.set(instance, [])
            }
            const listener = {
                instance,
                eventName,
                handler,
                remove() {
                    const instanceListeners = listeners.get(instance) || []
                    const index = instanceListeners.indexOf(listener)
                    if (index !== -1) {
                        instanceListeners.splice(index, 1)
                    }
                },
            }
            listeners.get(instance).push(listener)
            return listener
        },
        addListenerOnce(instance, eventName, handler) {
            const listener = event.addListener(instance, eventName, (...args) => {
                listener.remove()
                handler(...args)
            })
            return listener
        },
        addDomListener(element, eventName, handler) {
            element.addEventListener(eventName, handler)
            return {remove: () => element.removeEventListener(eventName, handler)}
        },
        removeListener(listener) {
            listener?.remove()
        },
        clearListeners(instance, eventName) {
            const instanceListeners = listeners.get(instance) || []
            listeners.set(
                instance,
                instanceListeners.filter(listener => listener.eventName !== eventName),
            )
        },
        clearInstanceListeners(instance) {
            listeners.delete(instance)
        },
        trigger(instance, eventName, ...args) {
            for (const listener of [...listeners.get(instance) || []]) {
                if (listener.eventName === eventName) {
                    listener.handler.apply(instance, args)
                }
            }
        },
    }

    function LatLng(lat, lng) {
        if (typeof lat === "object") {
            lng = typeof lat.lng === "function" ? lat.lng() : lat.lng
            lat = typeof lat.lat === "function" ? lat.lat() : lat.lat
        }
        this._lat = Number(lat)
        this._lng = Number(lng)
    }
    LatLng.prototype.lat = function() {
        return this._lat
    }
    LatLng.prototype.lng = function() {
        return this._lng
    }
    LatLng.prototype.toJSON = function() {
        return {lat: this._lat, lng: this._lng}
    }
    LatLng.prototype.equals = function(other) {
        return Boolean(other) && other.lat() === this._lat && other.lng() === this._lng
    }

    function toLatLng(value) {
        return value && !(value instanceof LatLng) ? new LatLng(value) : value
    }

    function LatLngBounds(southWest, northEast) {
        this.points = []
        if (southWest) {
            this.extend(southWest)
        }
        if (northEast) {
            this.extend(northEast)
        }
    }
    LatLngBounds.prototype.extend = function(point) {
        this.points.push(toLatLng(point))
        return this
    }
    LatLngBounds.prototype.getCenter = function() {
        if (!this.points.length) {
            return new LatLng(0, 0)
        }
        const sum = this.points.reduce(
            (total, point) => ({lat: total.lat + point.lat(), lng: total.lng + point.lng()}),
            {lat: 0, lng: 0},
        )
        return new LatLng(sum.lat / this.points.length, sum.lng / this.points.length)
    }
    LatLngBounds.prototype.isEmpty = function() {
        return !this.points.length
    }

    // Gives instances getX()/setX() accessors for any property (eg setZoom(),
    // getTitle()) so whatever the app or @react-google-maps/api sets can be
    // read back. Setting a property triggers "<property>_changed" like the
    // real api.
    function MVCObject() {}
    MVCObject.prototype = new Proxy({}, {
        get(target, name, receiver) {
            if (name in target || typeof name !== "string") {
                return Reflect.get(target, name, receiver)
            }
            const match = name.match(/^(get|set)([A-Z].*)$/)
            if (!match) {
                return undefined
            }
            const property = match[2].charAt(0).toLowerCase() + match[2].slice(1)
            if (match[1] === "get") {
                return function() {
                    return (this.values || {})[property]
                }
            }
            return function(value) {
                this.set(property, value)
            }
        },
    })
    function defineOn(prototype, methods) {
        for (const [name, method] of Object.entries(methods)) {
            Object.defineProperty(prototype, name, {value: method, writable: true})
        }
    }
    defineOn(MVCObject.prototype, {
        get(property) {
            return (this.values || {})[property]
        },
        set(property, value) {
            this.values = this.values || {}
            this.values[property] = value
            event.trigger(this, `${property.toLowerCase()}_changed`)
        },
        setValues(values) {
            for (const [property, value] of Object.entries(values || {})) {
                this.set(property, value)
            }
        },
        setOptions(options) {
            this.setValues(options)
        },
        addListener(eventName, handler) {
            return event.addListener(this, eventName, handler)
        },
        bindTo() {},
        notify() {},
    })

    function Map(element, options) {
        this.values = {}
        this.element = element
        // The real api renders the map inside a .gm-style element
        const mapElement = document.createElement("div")
        mapElement.className = "gm-style"
        mapElement.style.cssText = "position: absolute; inset: 0; background: #e5e3df"
        if (element) {
            element.style.position = element.style.position || "relative"
            element.appendChild(mapElement)
        }
        this.setValues(options)
        setTimeout(() => event.trigger(this, "idle"))
    }
    Map.prototype = Object.create(MVCObject.prototype)
    Map.prototype.constructor = Map
    defineOn(Map.prototype, {
        getDiv() {
            return this.element
        },
        setCenter(center) {
            this.set("center", toLatLng(center))
        },
        fitBounds(bounds) {
            this.set("bounds", bounds)
            this.set("center", bounds.getCenter())
        },
        getBounds() {
            return this.get("bounds")
        },
        panTo(center) {
            this.setCenter(center)
        },
        panBy() {},
        panToBounds(bounds) {
            this.fitBounds(bounds)
        },
    })

    function Marker(options) {
        this.values = {}
        this.setValues(options)
    }
    Marker.prototype = Object.create(MVCObject.prototype)
    Marker.prototype.constructor = Marker
    defineOn(Marker.prototype, {
        setPosition(position) {
            this.set("position", toLatLng(position))
        },
    })
    Marker.MAX_ZINDEX = 1000000

    function Size(width, height) {
        this.width = width
        this.height = height
    }

    function Point(x, y) {
        this.x = x
        this.y = y
    }

    function OverlayView() {}
    OverlayView.prototype = Object.create(MVCObject.prototype)
    OverlayView.prototype.constructor = OverlayView
    defineOn(OverlayView.prototype, {
        getPanes() {
            return null
        },
        getProjection() {
            return null
        },
    })

    const REQUEST_DENIED = "REQUEST_DENIED"

    function DistanceMatrixService() {}
    DistanceMatrixService.prototype.getDistanceMatrix = function(request, callback) {
        setTimeout(() => callback(null, REQUEST_DENIED))
    }

    function Geocoder() {}
    Geocoder.prototype.geocode = function(request, callback) {
        setTimeout(() => callback(null, REQUEST_DENIED))
    }

    function AutocompleteService() {}
    AutocompleteService.prototype.getPlacePredictions = function(request, callback) {
        setTimeout(() => callback(null, REQUEST_DENIED))
    }

    window.google = window.google || {}
    window.google.maps = {
        version: "fake",
        event,
        LatLng,
        LatLngBounds,
        MVCObject,
        Map,
        Marker,
        Size,
        Point,
        OverlayView,
        DistanceMatrixService,
        Geocoder,
        TravelMode: {
            DRIVING: "DRIVING",
            WALKING: "WALKING",
            TRANSIT: "TRANSIT",
            BICYCLING: "BICYCLING",
        },
        UnitSystem: {METRIC: 0, IMPERIAL: 1},
        DirectionsStatus: {OK: "OK", REQUEST_DENIED, ZERO_RESULTS: "ZERO_RESULTS"},
        DistanceMatrixStatus: {OK: "OK", REQUEST_DENIED},
        DistanceMatrixElementStatus: {OK: "OK", ZERO_RESULTS: "ZERO_RESULTS"},
        GeocoderStatus: {OK: "OK", REQUEST_DENIED, ZERO_RESULTS: "ZERO_RESULTS"},
        places: {
            AutocompleteService,
            PlacesServiceStatus: {OK: "OK", REQUEST_DENIED, ZERO_RESULTS: "ZERO_RESULTS"},
        },
    }

    // The loader names the function to call once the api is ready in the
    // script url (eg ?callback=__googleMapsCallback)
    const callbackName = new URL(document.currentScript.src)
        .searchParams.get("callback")
    if (callbackName && typeof window[callbackName] === "function") {
        window[callbackName]()
    }
})()
