import { calculateProductions, calculateProductionsPerResource } from "idle-game-creation-library"
import { walls } from "./data/walls"
import { setLastUpdate } from "./redux/appSlice"
import { AppDispatch, store } from "./redux/store"
import { decreaseResource, increaseResource } from "./redux/systemSlice"
import { increaseWall } from "./redux/systemAdditionsSlice"
import { objectKeys } from "./util"


const numberformat = require("swarm-numberformat")

export const update = (dispatch: AppDispatch) => {
    const state = store.getState()
    //Calculate passed time
    const currentTime = new Date().getTime()
    const oldTime = state.appReducer.lastUpdate
    const deltaTime = currentTime - oldTime
    dispatch(setLastUpdate(currentTime))

    const productionsFull = calculateProductions(state.systemReducer, deltaTime)
    const productions = calculateProductionsPerResource(state.systemReducer, productionsFull)

    dispatch(increaseResource(["damage", productions.damage]))
    dispatch(increaseResource(["money", productions.money]))
    dispatch(increaseResource(["bricks", productions.bricks]))
}

export const destroyWall = (dispatch: AppDispatch) => {
    const state = store.getState()
    const wallNum = state.systemAdditionsReducer.wall
    const damage = state.systemReducer.player.resources.damage

    const wall = walls[wallNum]

    if(damage <= wall.requirement) {
        return;
    }
    dispatch(decreaseResource(["damage", wall.requirement]))

    objectKeys(wall.reward)
        .forEach(reward => dispatch(increaseResource([reward, wall.reward[reward]])))

    dispatch(increaseWall())
}

export const prettify = (num: number): string => {
    if (num <= 100) {
        return (Math.round(num * 1000) / 1000).toString();
    }
    const format = store.getState().appReducer.format
    return numberformat.format(num, {format, sigfigs: 4, flavor: "short"});
}