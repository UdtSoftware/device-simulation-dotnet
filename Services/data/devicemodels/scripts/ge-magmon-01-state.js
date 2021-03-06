// Copyright (c) Microsoft. All rights reserved.

/*global log*/
/*global updateState*/
/*global updateProperty*/
/*global sleep*/
/*jslint node: true*/

"use strict";

// Default state
var state = {
    online: true,
    heLevel: 75.0,
    heLevel_unit: "%",
    hePressure: 4.0,
    hePressure_unit: "PSI",
    humidity: 70.0,
    humidity_unit: "%",
    roomTemp: 80.0,
    roomTemp_unit: "F",
    waterTemp: 60.0,
    waterTemp_unit: "F",
    waterFlow: 3.0,
    waterFlow_unit: "GPM",
    compressorStatus: 1,
    fieldStatus: 1
};

// Default device properties
var properties = {};

/**
 * Restore the global state using data from the previous iteration.
 *
 * @param previousState device state from the previous iteration
 * @param previousProperties device properties from the previous iteration
 */
function restoreSimulation(previousState, previousProperties) {
    // If the previous state is null, force a default state
    if (previousState) {
        state = previousState;
    } else {
        log("Using default state");
    }

    if (previousProperties) {
        properties = previousProperties;
    } else {
        log("Using default properties");
    }
}

/**
 * Simple formula generating a random value around the average
 * in between min and max
 *
 * @returns random value with given parameters
 */
function vary(avg, percentage, min, max) {
    var value = avg * (1 + ((percentage / 100) * (2 * Math.random() - 1)));
    value = Math.max(value, min);
    value = Math.min(value, max);
    return value;
}

/**
 * Entry point function called by the simulation engine.
 * Returns updated simulation state.
 * Device property updates must call updateProperties() to persist.
 *
 * @param context             The context contains current time, device model and id
 * @param previousState       The device state since the last iteration
 * @param previousProperties  The device properties since the last iteration
 */
/*jslint unparam: true*/
function main(context, previousState, previousProperties) {

    // Restore the global device properties and the global state before
    // generating the new telemetry, so that the telemetry can apply changes
    // using the previous function state.
    restoreSimulation(previousState, previousProperties);

    // 75F +/- 5%,  Min 25F, Max 100F
    state.heLevel = vary(75, 5, 25, 100);
    state.humidity = vary(70, 5, 25, 100);
    state.roomTemp = vary(80, 5, 25, 100);
    state.waterTemp = vary(60, 5, 25, 100);
    state.waterFlow = vary(3, 5, 0, 10);

    log("Simulation state: " + state.simulation_state);
    if (state.simulation_state === "high_pressure") {
        state.pressure = vary(7, 25, 5, 9);
    } else {
        state.pressure = vary(3, 10, 1, 5);
    }

    updateState(state);
}
