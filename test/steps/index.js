/*
 * Step definitions for BDD tests
 */

export default ((function() {
    // include libraries here
    return [
        import("./browser"),
        import("./branding"),
        import("./datetime"),
        import("./geolocation"),
        import("./maps"),
        import("./results"),
        import("./servicepage"),
        import("./questions"),
        import("./mocks"),
    ];
})());
